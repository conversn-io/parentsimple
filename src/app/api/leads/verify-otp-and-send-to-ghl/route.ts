import { NextRequest, NextResponse } from 'next/server';
import { callreadyQuizDb } from '@/lib/callready-quiz-db';
import { createCorsResponse, handleCorsOptions } from '@/lib/cors-headers';
import { formatPhoneForGHL, formatE164 } from '@/utils/phone-utils';
import * as crypto from 'crypto';
import { sendLeadEvent } from '@/lib/meta-capi-service';
import {
  sendLeadToWebhooks,
  logWebhookDelivery,
  buildWebhookPayload
} from '@/lib/webhook-delivery';

const GHL_WEBHOOK_URL = process.env.PARENT_SIMPLE_GHL_WEBHOOK || process.env.PARENTSIMPLE_GHL_WEBHOOK || "";

export async function OPTIONS() {
  return handleCorsOptions();
}

// Helper function to hash phone number
function phoneHash(phone: string | null): string | null {
  if (!phone) return null;
  return crypto.createHash('sha256').update(phone).digest('hex');
}

// Helper function to upsert contact
async function upsertContact(email: string, firstName: string | null, lastName: string | null, phone: string | null) {
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

// Helper function to find or create lead
async function upsertLead(
  contactId: string,
  sessionId: string | null,
  funnelType: string,
  zipCode: string | null,
  state: string | null,
  stateName: string | null,
  quizAnswers: any,
  calculatedResults: any,
  licensingInfo: any,
  utmParams: any,
  isVerified: boolean = false
) {
  const verifiedAt = isVerified ? new Date().toISOString() : null;
  
  // Try to find existing lead by contact_id and session_id
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
  
  // Get referrer and landing page from analytics_events (since request may not be available)
  let referrer = null;
  let landingPage = null;
  if (sessionId) {
    const { data: sessionEvent } = await callreadyQuizDb
      .from('analytics_events')
      .select('referrer, page_url, user_id')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (sessionEvent) {
      referrer = sessionEvent.referrer || null;
      landingPage = sessionEvent.page_url || null;
    }
  }
  
  // Get user_id from analytics_events if available
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
    userId = sessionEvent?.user_id || null;
  }
  
  // Get contact data for contact JSONB field
  const { data: contact } = await callreadyQuizDb
    .from('contacts')
    .select('email, phone, first_name, last_name, zip_code')
    .eq('id', contactId)
    .maybeSingle();
  
  const contactData = contact ? {
    email: contact.email,
      phone: contact.phone || null,
    first_name: contact.first_name,
    last_name: contact.last_name,
    zip_code: contact.zip_code || zipCode || null
  } : null;

  // NOTE: Do NOT include optional columns (form_type, attributed_ad_account, profit_center) 
  // as they don't exist in the current schema and will cause PGRST204 errors
  const leadData: any = {
    contact_id: contactId,
    session_id: sessionId,
    site_key: 'parentsimple.org',
    funnel_type: funnelType || 'college_consulting',
    status: isVerified ? 'verified' : 'email_captured',
    is_verified: isVerified,
    verified_at: verifiedAt,
    zip_code: zipCode,
    state: state,
    state_name: stateName,
    referrer: referrer, // Populate from analytics_events
    landing_page: landingPage, // Populate from analytics_events
    user_id: userId, // Populate from analytics_events
    contact: contactData, // Populate contact JSONB
    quiz_answers: {
      ...quizAnswers,
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
  
  if (existingLead?.id) {
    // Update existing lead
    const { data: updated, error } = await callreadyQuizDb
      .from('leads')
      .update({
        ...leadData,
        id: existingLead.id, // Preserve existing ID
      })
      .eq('id', existingLead.id)
      .select('*')
      .single();
    
    if (error) {
      const errorCode = error.code || '';
      const errorMessage = String(error.message || error.details || '').toLowerCase();
      const isPGRST204 = errorCode === 'PGRST204';
      const mentionsColumn = errorMessage.includes('column') || errorMessage.includes('could not find');
      
      // If it's a schema/column error, we've already removed optional columns, so this is a real error
      if (isPGRST204 || mentionsColumn) {
        console.error('❌ Schema error persisted even after removing optional columns:', error);
      }
      throw error;
    }
    return updated || existingLead;
  } else {
    // Create new lead
    const { data: newLead, error } = await callreadyQuizDb
      .from('leads')
      .insert(leadData)
      .select('*')
      .single();
    
    if (error) {
      const errorCode = error.code || '';
      const errorMessage = String(error.message || error.details || '').toLowerCase();
      const isPGRST204 = errorCode === 'PGRST204';
      const mentionsColumn = errorMessage.includes('column') || errorMessage.includes('could not find');
      
      // If it's a schema/column error, we've already removed optional columns, so this is a real error
      if (isPGRST204 || mentionsColumn) {
        console.error('❌ Schema error persisted even after removing optional columns:', error);
      }
      throw error;
    }
    return newLead;
  }
}

export async function POST(request: NextRequest) {
  console.log('🔐 OTP Verification & GHL Webhook API Called');
  console.log('🔗 GHL Webhook URL:', GHL_WEBHOOK_URL);
  console.log('🌍 Environment:', process.env.NODE_ENV);
  console.log('⏰ Timestamp:', new Date().toISOString());

  try {
    const body = await request.json();
    console.log('📥 Request Body:', JSON.stringify(body, null, 2));
    
    const { 
      phoneNumber, 
      email, 
      firstName, 
      lastName, 
      quizAnswers, 
      sessionId, 
      funnelType,
      zipCode,
      state,
      stateName,
      licensingInfo,
      calculatedResults,
      utmParams,
      metaCookies
    } = body;

    console.log('📊 Extracted Data:', {
      phoneNumber,
      email,
      firstName,
      lastName,
      sessionId,
      funnelType
    });

    if (!email || !phoneNumber) {
      return createCorsResponse({ error: 'Email and phone number are required' }, 400);
    }

    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      null;
    const userAgent = request.headers.get('user-agent') || null;

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

    // Find existing lead by session_id (should already exist from capture-email)
    console.log('🔍 Finding existing lead...');
    let lead = null;
    if (sessionId) {
      // First, find contact by email to get contact_id
      const { data: contactByEmail } = await callreadyQuizDb
        .from('contacts')
        .select('id')
        .eq('email', email.toLowerCase())
        .maybeSingle();
      
      if (contactByEmail?.id) {
        const { data: existingLead } = await callreadyQuizDb
          .from('leads')
          .select('*')
          .eq('contact_id', contactByEmail.id)
          .eq('session_id', sessionId)
          .maybeSingle();
        lead = existingLead;
      }
    }

    if (!lead) {
      // Lead doesn't exist yet, create it (shouldn't happen but handle gracefully)
      console.log('⚠️ Lead not found, creating new lead...');
      const contact = await upsertContact(email, firstName, lastName, phoneNumber);
      lead = await upsertLead(
        contact.id,
        sessionId,
        funnelType || 'insurance',
        zipCode,
        state,
        stateName,
        quizAnswers,
        calculatedResults,
        licensingInfo,
        utmParams,
        true // is_verified = true
      );
    } else {
      // Update existing lead to verified status WITH ALL NEW DATA
      console.log('✅ Lead found, updating to verified status with full data...');
      
      // First, update contact phone if not already set
      if (phoneNumber && lead.contact_id) {
        const { data: contact } = await callreadyQuizDb
          .from('contacts')
          .select('*')
          .eq('id', lead.contact_id)
          .single();
        
        if (contact && !contact.phone) {
          const normalizedPhone = formatE164(phoneNumber);
          await callreadyQuizDb
            .from('contacts')
            .update({
              phone: normalizedPhone,
              phone_hash: phoneHash(normalizedPhone),
            })
            .eq('id', lead.contact_id);
        }
      }

      // Build comprehensive update data with all fields
      const existingQuizAnswers = lead.quiz_answers || {};
      const updatedQuizAnswers = {
        ...existingQuizAnswers,
        ...(quizAnswers || {}),
        calculated_results: calculatedResults || existingQuizAnswers.calculated_results,
        licensing_info: licensingInfo || existingQuizAnswers.licensing_info,
        locationInfo: (zipCode || state || stateName) ? {
          zipCode: zipCode || existingQuizAnswers.locationInfo?.zipCode,
          state: state || existingQuizAnswers.locationInfo?.state,
          stateName: stateName || existingQuizAnswers.locationInfo?.stateName,
          licensing: licensingInfo || existingQuizAnswers.locationInfo?.licensing,
        } : existingQuizAnswers.locationInfo,
        phone: phoneNumber || existingQuizAnswers.phone,
        utm_parameters: utmParams || existingQuizAnswers.utm_parameters || {},
      };

      const updateData: any = {
        is_verified: true,
        verified_at: new Date().toISOString(),
        status: 'verified',
        // Update location fields if provided
        zip_code: zipCode || lead.zip_code,
        state: state || lead.state,
        state_name: stateName || lead.state_name,
        // Update quiz_answers with all new data
        quiz_answers: updatedQuizAnswers,
      };

      const { data: updatedLead, error: updateError } = await callreadyQuizDb
        .from('leads')
        .update(updateData)
        .eq('id', lead.id)
        .select('*')
        .single();

      if (updateError) {
        const errorCode = updateError.code || '';
        const errorMessage = String(updateError.message || updateError.details || '').toLowerCase();
        const isPGRST204 = errorCode === 'PGRST204';
        const mentionsColumn = errorMessage.includes('column') || errorMessage.includes('could not find');
        
        console.error('⚠️ Error updating lead:', {
          error: updateError.message || updateError,
          code: errorCode,
          details: updateError.details,
          isPGRST204,
          mentionsColumn
        });
        
        // updateData doesn't include optional columns, so if we get a schema error here,
        // it's a different issue - log it but don't fail completely
        if (isPGRST204 || mentionsColumn) {
          console.error('❌ Schema error in update - this should not happen as optional columns are removed');
        }
        
        // Use existing lead data if update fails
        lead = updatedLead || lead;
        console.log('⚠️ Lead verification updated but with potential data loss:', lead.id);
      } else {
        lead = updatedLead || lead;
        console.log('✅ Lead updated to verified with full data:', lead.id);
      }
    }

    if (lead?.id) {
      try {
        // #region agent log
        const resolvedFunnelType = funnelType || lead.funnel_type || 'life_insurance_ca';
        console.log('[DEBUG-API] Preparing to send Meta CAPI event:', {
          leadId: lead.id,
          funnelType: resolvedFunnelType,
          email: email ? 'SET' : 'MISSING',
          metaCookies: {
            fbp: metaCookies?.fbp ? 'SET' : 'MISSING',
            fbc: metaCookies?.fbc ? 'SET' : 'MISSING'
          }
        });
        // #endregion
        
        const capiResult = await sendLeadEvent({
          leadId: lead.id,
          email,
          phone: phoneNumber,
          firstName,
          lastName,
          fbp: metaCookies?.fbp || null,
          fbc: metaCookies?.fbc || null,
          fbLoginId: metaCookies?.fbLoginId || null,
          ipAddress,
          userAgent,
          value: 0,
          currency: 'USD',
          funnelType: resolvedFunnelType, // NEW: Pass funnel type to select correct pixel
          customData: {
            funnel_type: funnelType || 'insurance',
            lead_score: calculatedResults?.totalScore || calculatedResults?.readiness_score || 0,
            state,
            zip_code: zipCode,
          },
          eventSourceUrl: request.headers.get('referer') || request.url,
        });

        // #region agent log
        console.log('[DEBUG-API] Meta CAPI result:', {
          success: capiResult.success,
          eventId: capiResult.eventId,
          error: capiResult.error || 'none'
        });
        // #endregion

        if (!capiResult.success) {
          console.error('[Meta CAPI] Lead event failed:', capiResult.error);
        } else {
          console.log('[Meta CAPI] Lead event sent:', capiResult.eventId);
        }
      } catch (capiError) {
        console.error('[Meta CAPI] Error:', capiError);
      }
    }

    // Get contact info for webhook payload
    const { data: contact } = await callreadyQuizDb
      .from('contacts')
      .select('*')
      .eq('id', lead.contact_id)
      .single();
    
    if (!contact) {
      return createCorsResponse({ error: 'Contact not found' }, 404);
    }

    // Build unified webhook payload (sends to both GHL and Zapier)
    const householdIncome = quizAnswers?.household_income || lead.quiz_answers?.household_income || null;
    const webhookPayload = buildWebhookPayload({
      firstName: firstName || contact.first_name,
      lastName: lastName || contact.last_name,
      email: email,
      phone: formatPhoneForGHL(phoneNumber),
      zipCode: zipCode || lead.zip_code,
      state: state || lead.state,
      stateName: stateName || lead.state_name,
      householdIncome,
      funnelType: funnelType || lead.funnel_type || 'life_insurance_ca',
      quizAnswers: {
        ...(lead.quiz_answers || quizAnswers),
        household_income: householdIncome,
      },
      calculatedResults,
      licensingInfo,
      leadScore: calculatedResults?.totalScore || calculatedResults?.readiness_score || 0,
      utmParams: utmParams || lead.quiz_answers?.utm_parameters || {},
      sessionId,
      ipAddress: ipAddress || undefined,
      userAgent: userAgent || undefined
    });

    console.log('📤 Sending to unified webhooks (GHL + Zapier)...');
    
    // Send to both GHL and Zapier webhooks in parallel
    const deliveryResult = await sendLeadToWebhooks(webhookPayload, true);
    
    // Log webhook delivery to analytics_events
    await logWebhookDelivery(
      lead.id,
      contact.id,
      sessionId,
      deliveryResult,
      webhookPayload,
      utmParams
    );

    // Check if at least one webhook succeeded
    const hasSuccess = deliveryResult.ghl?.success || deliveryResult.zapier?.success;
    
    if (hasSuccess) {
      console.log('✅ Lead sent to webhooks:', {
        leadId: lead.id,
        ghl: deliveryResult.ghl?.success ? 'success' : 'failed',
        zapier: deliveryResult.zapier?.success ? 'success' : 'failed'
      });
      return createCorsResponse({
        success: true,
        leadId: lead.id,
        contactId: contact.id,
        webhookResults: deliveryResult
      });
    } else {
      console.error('❌ All webhooks failed:', deliveryResult);
      return createCorsResponse({
        error: 'All webhooks failed',
        leadId: lead.id,
        contactId: contact.id,
        webhookResults: deliveryResult
      }, 500);
    }

  } catch (error) {
    console.error('💥 OTP Verification Exception:', error);
    return createCorsResponse({ error: 'Internal server error' }, 500);
  }
}