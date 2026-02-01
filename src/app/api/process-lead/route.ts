import { NextRequest } from 'next/server'
import { createCorsResponse, handleCorsOptions } from '@/lib/cors-headers'

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

    return createCorsResponse(data)
  } catch (error: any) {
    return createCorsResponse({
      error: 'internal_error',
      message: error?.message || String(error)
    }, 500)
  }
}


