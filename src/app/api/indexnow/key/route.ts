import { NextRequest, NextResponse } from 'next/server'
import { getIndexNowKey } from '@/lib/indexnow'

/**
 * IndexNow Key File Route
 * 
 * Serves the IndexNow key file for ownership verification
 * Accessible at: /api/indexnow/key
 * 
 * Search engines will also check: https://parentsimple.org/{key}.txt
 * This route serves the key content for verification
 * 
 * Documentation: https://www.indexnow.org/documentation
 */
export async function GET(request: NextRequest) {
  const key = getIndexNowKey()
  
  return new NextResponse(key, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

