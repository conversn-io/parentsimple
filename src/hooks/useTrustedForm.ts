'use client'

import { useEffect, useRef, useCallback } from 'react'

/**
 * CRITICAL: TrustedForm Integration Hook
 *
 * TrustedForm requires:
 * 1. An UNCONTROLLED hidden input with name="xxTrustedFormCertUrl" (NO value attribute!)
 * 2. The input must exist in DOM BEFORE the script loads
 * 3. The script must be loaded AFTER the form is rendered
 */
export function useTrustedForm({ enabled = true }: { enabled?: boolean } = {}) {
  const scriptLoadedRef = useRef(false)
  const cleanupRef = useRef<(() => void) | null>(null)

  const loadScript = useCallback(() => {
    if (scriptLoadedRef.current) return

    const formField = document.querySelector('input[name="xxTrustedFormCertUrl"]') as HTMLInputElement
    if (!formField) {
      console.error('❌ TrustedForm: Form field not found - add <input type="hidden" name="xxTrustedFormCertUrl" id="xxTrustedFormCertUrl" />')
      return
    }

    if (formField.value && formField.value.startsWith('https://cert.trustedform.com/')) {
      scriptLoadedRef.current = true
      return
    }

    const existingScripts = document.querySelectorAll('script[src*="trustedform.com"]')
    existingScripts.forEach(script => script.remove())

    const tf = document.createElement('script')
    tf.type = 'text/javascript'
    tf.async = true
    tf.src = 'https://api.trustedform.com/trustedform.js?field=xxTrustedFormCertUrl&use_tagged_consent=true&l=' +
      Date.now() + Math.random()

    tf.onload = () => {
      scriptLoadedRef.current = true
      setTimeout(() => {
        const updatedField = document.querySelector('input[name="xxTrustedFormCertUrl"]') as HTMLInputElement
        if (updatedField?.value?.startsWith('https://cert.trustedform.com/')) {
          console.log('✅ TrustedForm: Certificate URL populated')
        }
      }, 500)
    }

    tf.onerror = () => console.error('❌ TrustedForm: Script failed to load')
    document.body.appendChild(tf)
  }, [])

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    let attempts = 0
    const maxAttempts = 50

    const checkAndLoad = () => {
      attempts++
      const formField = document.querySelector('input[name="xxTrustedFormCertUrl"]')
      if (formField) {
        setTimeout(loadScript, 100)
        return true
      }
      if (attempts >= maxAttempts) return true
      return false
    }

    if (checkAndLoad()) return
    const intervalId = setInterval(() => { if (checkAndLoad()) clearInterval(intervalId) }, 100)
    cleanupRef.current = () => clearInterval(intervalId)
    return () => { cleanupRef.current?.() }
  }, [enabled, loadScript])

  return { isLoaded: scriptLoadedRef.current }
}

export function getTrustedFormCertUrl(): string | null {
  if (typeof window === 'undefined') return null
  const field = document.querySelector('input[name="xxTrustedFormCertUrl"]') as HTMLInputElement
  const value = field?.value || null
  if (value && value.startsWith('https://cert.trustedform.com/')) return value
  return null
}

export function getLeadIdToken(): string | null {
  if (typeof window === 'undefined') return null
  const sources = [
    (document.getElementById('leadid_token') as HTMLInputElement)?.value,
    (document.querySelector('input[name="universal_leadid"]') as HTMLInputElement)?.value,
    (window as any).LeadiD?.token,
    (window as any).leadid_token,
    (window as any).jornayaLeadId,
    (window as any).jornaya_lead_id,
  ]
  for (const source of sources) {
    if (source && typeof source === 'string' && source.length > 10) return source
  }
  return null
}
