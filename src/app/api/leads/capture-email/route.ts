import { NextRequest, NextResponse } from 'next/server';
import { callreadyQuizDb } from '@/lib/callready-quiz-db';
import { createCorsResponse, handleCorsOptions } from '@/lib/cors-headers';
import { formatE164 } from '@/utils/phone-utils';
import * as crypto from 'crypto';
import { sendLeadEvent } from '@/lib/meta-capi-service';

export async function OPTIONS() {
  return handleCorsOptions();
}

// Helper function to hash phone number
function phoneHash(phone: string | null): string | null {
  if (!phone) return null;
  return crypto.createHash('sha256').update(phone).digest('hex');
}

// Helper function to upsert contact
async function upsertContact(email: string, firstName: string | null, lastName: string | null, phone: string | null = null) {
  const emailLower = email?.toLowerCase();
  const normalizedPhone = phone ? formatE164(phone) : null;
  
  // Try to find existing contact by email or phone
  const { data: existingByEmail } = await callreadyQuizDb
    .from('contacts')
    .select('*')
    .eq('email', emailLower)
    .maybeSingle();
  
  // If phone provided, also check by phone_hash
  let existingByPhone = null;
  if (normalizedPhone) {
    const phoneHashVal = phoneHash(normalizedPhone);
    const { data: phoneMatch } = await callreadyQuizDb
      .from('contacts')
      .select('*')
      .eq('phone_hash', phoneHashVal)
      .maybeSingle();
    existingByPhone = phoneMatch;
  }
  
  const existing = existingByEmail || existingByPhone;
  
  if (existing?.id) {
    // Update existing contact with new info
    const updateData: any = {};
    if (firstName && !existing.first_name) updateData.first_name = firstName;
    if (lastName && !existing.last_name) updateData.last_name = lastName;
    if (normalizedPhone && !existing.phone) {
      updateData.phone = normalizedPhone;
      updateData.phone_hash = phoneHash(normalizedPhone);
    }
    if (emailLower && !existing.email) updateData.email = emailLower;
    
    if (Object.keys(updateData).length > 0) {
      const { data: updated } = await callreadyQuizDb
        .from('contacts')
        .update(updateData)
        .eq('id', existing.id)
        .select('*')
        .single();
      return updated || existing;
    }
    return existing;
  }
  
  // Create new contact
  const contactData: any = {
    email: emailLower,
    first_name: firstName,
    last_name: lastName,
    source: 'parentsimple_quiz',
  };
  
  if (normalizedPhone) {
    contactData.phone = normalizedPhone;
    contactData.phone_hash = phoneHash(normalizedPhone);
  }
  
  const { data: newContact, error } = await callreadyQuizDb
    .from('contacts')
    .insert(contactData)
    .select('*')
    .single();
  
  if (error) {
    // Try without optional columns if they don't exist
    if (error.message?.includes('phone_hash') || error.message?.includes('source')) {
      const fallbackData: any = {
        email: emailLower,
        first_name: firstName,
        last_name: lastName,
      };
      if (normalizedPhone) fallbackData.phone = normalizedPhone;
      
      const { data: fallbackContact } = await callreadyQuizDb
        .from('contacts')
        .insert(fallbackData)
        .select('*')
        .single();
      
      if (fallbackContact) return fallbackContact;
    }
    throw error;
  }
  
  return newContact;
}

export async function POST(request: NextRequest) {
  console.log('📧 Lead Capture (All Contact Data):', {
    timestamp: new Date().toISOString()
  });

  try {
    const body = await request.json();
    const { 
      email, 
      firstName, 
      lastName,
      studentFirstName,
      phoneNumber, // Now accepts phone number
      quizAnswers, 
      sessionId, 
      funnelType = 'insurance', // Default for SeniorSimple
      zipCode,
      state,
      stateName,
      licensingInfo,
      calculatedResults,
      utmParams,
      metaCookies
    } = body;

    if (!email) {
      return createCorsResponse({ error: 'Email is required' }, 400);
    }

    // Upsert contact (with phone if provided)
    const contact = await upsertContact(email, firstName, lastName, phoneNumber || null);
    const contactId = contact.id || contact;
    console.log('✅ Contact upserted:', contactId);

    // Extract UTM parameters - use null instead of defaults to clearly indicate missing UTM data
    const utmSource = utmParams?.utm_source || null;
    const utmMedium = utmParams?.utm_medium || null;
    const utmCampaign = utmParams?.utm_campaign || null;
    const utmTerm = utmParams?.utm_term || null;
    const utmContent = utmParams?.utm_content || null;
    const utmId = utmParams?.utm_id || null;
    const gclid = utmParams?.gclid || null;
    const fbclid = utmParams?.fbclid || null;
    const msclkid = utmParams?.msclkid || null;

    // Check if lead already exists for this contact and session
    let existingLead = null;
    if (sessionId) {
      const { data: existing } = await callreadyQuizDb
        .from('leads')
        .select('*')
        .eq('contact_id', contactId)
        .eq('session_id', sessionId)
        .maybeSingle();
      existingLead = existing;
    }

    // Get referrer and landing page from request headers
    const referrer = request.headers.get('referer') || request.headers.get('referrer') || null;
    const landingPage = request.headers.get('x-forwarded-url') || request.url || referrer || null;
    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      null;
    const userAgent = request.headers.get('user-agent') || null;
    
    // Get user_id from analytics_events if available (for this session)
    let userId = null;
    if (sessionId) {
      const { data: sessionEvent } = await callreadyQuizDb
        .from('analytics_events')
        .select('user_id')
        .eq('session_id', sessionId)
        .not('user_id', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      userId = sessionEvent?.user_id || email; // Fallback to email if no user_id found
    } else {
      userId = email; // Use email as user_id if no session
    }
    
    // Get contact data for contact JSONB field
    const contactData = {
      email: email,
      phone: phoneNumber || null,
      first_name: firstName,
      last_name: lastName,
      student_first_name: studentFirstName || null,
      zip_code: zipCode || null
    };

    // Insert or update lead (not verified yet - OTP verification comes later)
    // NOTE: Do NOT include optional columns (form_type, attributed_ad_account, profit_center) 
    // as they don't exist in the current schema and will cause PGRST204 errors
    const leadData: any = {
      contact_id: contactId,
      session_id: sessionId,
      site_key: 'parentsimple.org',
      funnel_type: funnelType || 'college_consulting',
      status: phoneNumber ? 'phone_captured' : 'email_captured',
      is_verified: false, // Will be set to true when OTP is verified
      zip_code: zipCode,
      state: state,
      state_name: stateName,
      referrer: referrer, // Populate from request headers
      landing_page: landingPage, // Populate from request headers
      user_id: userId, // Populate from analytics_events or email
      contact: contactData, // Populate contact JSONB from contact data
      quiz_answers: {
        ...quizAnswers,
        student_first_name: studentFirstName || null,
        household_income: quizAnswers?.household_income || null,
        calculated_results: calculatedResults,
        licensing_info: licensingInfo,
        utm_parameters: utmParams || {}, // Ensure UTM is stored even if empty object
      },
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_term: utmTerm,
      utm_content: utmContent,
      // Note: utm_id, gclid, fbclid, msclkid are stored in quiz_answers.utm_parameters JSONB
      // They are not top-level columns in the leads table schema
      // Optional columns removed - they don't exist in schema:
      // form_type: 'quiz',
      // attributed_ad_account: 'CallReady - Insurance',
      // profit_center: 'SeniorSimple.org',
    };

    let lead;
    if (existingLead?.id) {
      // Update existing lead with all new data
      const { data: updated, error: updateError } = await callreadyQuizDb
        .from('leads')
        .update({
          ...leadData,
          id: existingLead.id, // Preserve existing ID
        })
        .eq('id', existingLead.id)
        .select('*')
        .single();

      if (updateError) {
        const errorCode = updateError.code || '';
        const errorMessage = String(updateError.message || updateError.details || '').toLowerCase();
        const isPGRST204 = errorCode === 'PGRST204';
        const mentionsColumn = errorMessage.includes('column') || errorMessage.includes('could not find');
        
        console.log('⚠️ Lead update error, attempting retry without optional columns:', {
          error: updateError.message || updateError,
          code: errorCode,
          details: updateError.details,
          isPGRST204,
          mentionsColumn
        });
        
        // If it's a schema/column error (PGRST204 or mentions column), remove ALL optional columns and retry
        if (isPGRST204 || mentionsColumn) {
          // Remove all optional columns
          delete leadData.form_type;
          delete leadData.attributed_ad_account;
          delete leadData.profit_center;
          
          console.log('🔄 Retrying update without optional columns (form_type, attributed_ad_account, profit_center)');
          
          const { data: fallbackUpdated, error: fallbackError } = await callreadyQuizDb
            .from('leads')
            .update(leadData)
            .eq('id', existingLead.id)
            .select('*')
            .single();
          
          if (fallbackUpdated) {
            lead = fallbackUpdated;
            console.log('✅ Lead updated (without optional columns):', lead.id);
          } else {
            console.error('❌ Fallback lead update also failed:', fallbackError);
            throw updateError;
          }
        } else {
          throw updateError;
        }
      } else {
        lead = updated || existingLead;
        console.log('✅ Lead updated:', lead.id);
      }
    } else {
      // Create new lead
      const { data: newLead, error: leadError } = await callreadyQuizDb
        .from('leads')
        .insert(leadData)
        .select('*')
        .single();

      if (leadError) {
        const errorCode = leadError.code || '';
        const errorMessage = String(leadError.message || leadError.details || '').toLowerCase();
        const isPGRST204 = errorCode === 'PGRST204';
        const mentionsColumn = errorMessage.includes('column') || errorMessage.includes('could not find');
        
        console.log('⚠️ Lead creation error, attempting retry without optional columns:', {
          error: leadError.message || leadError,
          code: errorCode,
          details: leadError.details,
          isPGRST204,
          mentionsColumn
        });
        
        // If it's a schema/column error (PGRST204 or mentions column), remove ALL optional columns and retry
        if (isPGRST204 || mentionsColumn) {
          // Remove all optional columns
          delete leadData.form_type;
          delete leadData.attributed_ad_account;
          delete leadData.profit_center;
          
          console.log('🔄 Retrying without optional columns (form_type, attributed_ad_account, profit_center)');
          
          const { data: fallbackLead, error: fallbackError } = await callreadyQuizDb
            .from('leads')
            .insert(leadData)
            .select('*')
            .single();
          
          if (fallbackLead) {
            lead = fallbackLead;
            console.log('✅ Lead created (without optional columns):', lead.id);
          } else {
            console.error('❌ Fallback lead creation also failed:', fallbackError);
            throw leadError; // Throw original error
          }
        } else {
          // Not a column error, throw it
          throw leadError;
        }
      } else {
        lead = newLead;
        console.log('✅ Lead created:', lead.id);
      }
    }

    // Send Meta CAPI Lead event with funnel-specific pixel
    if (lead?.id) {
      try {
        const isLifeInsurance = funnelType === 'life_insurance_ca';
        const isCollege = funnelType === 'elite_university_readiness' || funnelType === 'college_consulting';
        
        // Determine which pixel to use
        const pixelId = isLifeInsurance
          ? process.env.META_PIXEL_ID_LIFE_INSURANCE
          : isCollege
          ? process.env.META_PIXEL_ID_COLLEGE
          : undefined;
        
        const accessToken = isLifeInsurance
          ? process.env.META_CAPI_TOKEN_LIFE_INSURANCE
          : isCollege
          ? process.env.META_CAPI_TOKEN_COLLEGE
          : undefined;
        
        const testEventCode = isLifeInsurance
          ? process.env.META_TEST_EVENT_CODE_LIFE_INSURANCE
          : isCollege
          ? process.env.META_TEST_EVENT_CODE_COLLEGE
          : undefined;

        console.log(`[Meta CAPI] Sending Lead event for funnel: ${funnelType}`, {
          leadId: lead.id,
          pixelId: pixelId ? `${pixelId.slice(0, 4)}...` : 'not configured',
          hasAccessToken: !!accessToken,
        });

        const capiResult = await sendLeadEvent({
          leadId: lead.id.toString(),
          email,
          phone: phoneNumber || null,
          firstName,
          lastName,
          fbp: metaCookies?.fbp || null,
          fbc: metaCookies?.fbc || null,
          fbLoginId: metaCookies?.fbLoginId || null,
          ipAddress,
          userAgent,
          value: 0,
          currency: isLifeInsurance ? 'CAD' : 'USD',
          customData: {
            content_name: isLifeInsurance ? 'Life Insurance Lead' : 'College Readiness Lead',
            content_category: isLifeInsurance ? 'life_insurance' : 'education',
            funnel_type: funnelType || 'college_consulting',
            lead_status: phoneNumber ? 'phone_captured' : 'email_captured',
            state,
            zip_code: zipCode,
          },
          eventSourceUrl: landingPage || `https://parentsimple.org/quiz/${funnelType}`,
          options: {
            pixelId,
            accessToken,
            testEventCode,
          },
        });

        if (!capiResult.success) {
          console.error('[Meta CAPI] Lead event failed:', capiResult.error);
        } else {
          console.log('[Meta CAPI] Lead event sent successfully:', capiResult.eventId);
        }
      } catch (capiError) {
        console.error('[Meta CAPI] Error:', capiError);
      }
    }

    // Save to analytics_events for retargeting
    const eventName = phoneNumber ? 'lead_captured' : 'email_captured';
    const { data: event, error } = await callreadyQuizDb
      .from('analytics_events')
      .insert({
        event_name: eventName,
        event_category: 'lead_generation',
        event_label: 'parentsimple_quiz',
        user_id: email,
        session_id: sessionId,
        page_url: request.headers.get('referer'),
        user_agent: request.headers.get('user-agent'),
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        // Store UTM parameters in top-level fields for easy querying (only columns that exist in schema)
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        utm_term: utmTerm,
        utm_content: utmContent,
        // Note: utm_id, gclid, fbclid, msclkid are stored in properties.utm_parameters JSONB
        // They are not top-level columns in the analytics_events table schema
        properties: {
          site_key: 'parentsimple.org',
          email,
          first_name: firstName,
          last_name: lastName,
          phone: phoneNumber || null,
          quiz_answers: quizAnswers,
          calculated_results: calculatedResults,
          funnel_type: funnelType || 'college_consulting',
          zip_code: zipCode,
          state: state,
          state_name: stateName,
          licensing_info: licensingInfo,
          status: phoneNumber ? 'lead_captured' : 'email_captured_for_retargeting',
          is_verified: false,
          utm_parameters: utmParams || {} // Store full UTM object in properties
        }
      })
      .select()
      .single();

    if (error) {
      console.error('⚠️ Analytics event save failed (non-critical):', error);
    } else {
      console.log('✅ Analytics event saved:', event.id);
    }

    return createCorsResponse({ 
      success: true, 
      eventId: event?.id,
      contactId,
      leadId: lead?.id,
      isVerified: false // Will be true after OTP verification
    });

  } catch (error: any) {
    console.error('💥 Email Capture Exception:', {
      error: error.message || error,
      stack: error.stack,
      details: error.details || error.hint || 'No additional details',
      code: error.code,
      timestamp: new Date().toISOString()
    });
    return createCorsResponse({ 
      error: 'Internal server error', 
      details: error.message || 'Unknown error',
      code: error.code 
    }, 500);
  }
}


