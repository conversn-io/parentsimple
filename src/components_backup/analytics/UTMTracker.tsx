'use client'

import { useEffect } from 'react'
import { extractUTMParameters, getStoredUTMParameters, storeUTMParameters, hasUTMParameters } from '@/utils/utm-utils'
import { trackUTMParameters } from '@/utils/utm-tracker'

/**
 * UTM Tracker Component
 * 
 * Automatically extracts and tracks UTM parameters on page load.
 * Stores UTM parameters in sessionStorage for persistence across page navigations.
 * Sends UTM data to Supabase analytics_events via track-utm Edge Function.
 * 
 * Usage: Add to root layout or specific pages that need UTM tracking
 */
export function UTMTracker() {
  useEffect(() => {
    // Skip if already tracked in this session
    if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
      return
    }

    const utmTracked = sessionStorage.getItem('utm_tracked')
    if (utmTracked === 'true') {
      console.log('📊 UTM Already Tracked for This Session')
      return
    }

    // Extract UTM parameters from URL
    const utmData = extractUTMParameters()
    
    if (hasUTMParameters(utmData)) {
      console.log('📊 UTM Parameters Found:', utmData)
      
      // Store in sessionStorage for persistence
      storeUTMParameters(utmData)
      
      // Generate session ID if not exists
      let sessionId = sessionStorage.getItem('session_id')
      if (!sessionId) {
        sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        sessionStorage.setItem('session_id', sessionId)
      }
      
      // Track UTM parameters to Supabase
      trackUTMParameters(sessionId, utmData)
        .then((success) => {
          if (success) {
            sessionStorage.setItem('utm_tracked', 'true')
            console.log('✅ UTM Parameters Tracked Successfully')
          } else {
            console.error('❌ UTM Tracking Failed')
          }
        })
        .catch((error) => {
          console.error('❌ UTM Tracking Exception:', error)
        })
    } else {
      console.log('📊 No UTM Parameters Found in URL')
      
      // Check for stored UTM parameters from previous page
      const storedUtm = getStoredUTMParameters()
      if (storedUtm) {
        console.log('📊 Using Stored UTM Parameters:', storedUtm)
      }
    }
  }, [])

  return null // This component doesn't render anything
}





