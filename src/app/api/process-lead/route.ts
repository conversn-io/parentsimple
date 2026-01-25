import { NextRequest } from 'next/server'
import { createCorsResponse, handleCorsOptions } from '@/lib/cors-headers'
import { sendLeadEvent } from '@/lib/meta-capi-service'

const SUPABASE_URL = process.env.SUPABASE_QUIZ_URL || 'https://jqjftrlnyysqcwbbigpw.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_QUIZ_SERVICE_ROLE_KEY || ''

export async function OPTIONS() {
  return handleCorsOptions()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const fnUrl = `${SUPABASE_URL}/functions/v1/process-lead`

    const response = await fetch(fnUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY
      },
      body: JSON.stringify(body)
    })

    const text = await response.text()
    let data: any
    try {
      data = text ? JSON.parse(text) : {}
    } catch {
      data = { raw: text }
    }

    if (!response.ok) {
      return createCorsResponse({
        error: 'process_lead_failed',
        status: response.status,
        data
      }, response.status)
    }

    const leadId = data?.lead_id || data?.leadId || null
    if (leadId) {
      try {
        const ipAddress =
          request.headers.get('x-forwarded-for')?.split(',')[0] ||
          request.headers.get('x-real-ip') ||
          null
        const userAgent = request.headers.get('user-agent') || null

        const capiResult = await sendLeadEvent({
          leadId,
          email: body?.contact?.email || body?.email || null,
          phone: body?.contact?.phone || body?.phone || null,
          firstName: body?.contact?.first_name || body?.contact?.firstName || body?.firstName || null,
          lastName: body?.contact?.last_name || body?.contact?.lastName || body?.lastName || null,
          fbp: body?.metaCookies?.fbp || null,
          fbc: body?.metaCookies?.fbc || null,
          fbLoginId: body?.metaCookies?.fbLoginId || null,
          ipAddress,
          userAgent,
          value: 0,
          currency: 'USD',
          customData: {
            funnel_type: body?.funnel_type,
            zip_code: body?.zip_code,
          },
          eventSourceUrl: request.headers.get('referer') || request.url,
        })

        if (!capiResult.success) {
          console.error('[Meta CAPI] Lead event failed:', capiResult.error)
        } else {
          console.log('[Meta CAPI] Lead event sent:', capiResult.eventId)
        }
      } catch (capiError) {
        console.error('[Meta CAPI] Error:', capiError)
      }
    }

    return createCorsResponse(data)
  } catch (error: any) {
    return createCorsResponse({
      error: 'internal_error',
      message: error?.message || String(error)
    }, 500)
  }
}


