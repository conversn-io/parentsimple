'use client'

import { useEffect, useMemo, useRef } from 'react'
import { cn } from '@/lib/utils'

interface EmpowerlyConsultationEmbedProps {
  embedUrl: string
  leadData?: Record<string, unknown> | null
  minHeight?: number
  className?: string
}

export function EmpowerlyConsultationEmbed({
  embedUrl,
  leadData,
  minHeight = 900,
  className,
}: EmpowerlyConsultationEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const embedOrigin = useMemo(() => {
    try {
      const url = new URL(embedUrl)
      return url.origin
    } catch (error) {
      console.warn('Invalid Empowerly embed URL provided:', error)
      return null
    }
  }, [embedUrl])

  useEffect(() => {
    if (!embedOrigin) {
      return
    }

    const handleMessage = (event: MessageEvent) => {
      if (embedOrigin && event.origin !== embedOrigin) {
        return
      }

      if (!event.data || typeof event.data !== 'object') {
        return
      }

      const { type, payload } = event.data as { type?: string; payload?: Record<string, unknown> }

      if (!type) {
        return
      }

      if (type === 'EmpowerlyLeadCaptured' || type === 'EmpowerlyConsultScheduled') {
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
          window.gtag('event', type, {
            event_category: 'empowerly_embed',
            event_label: 'parentsimple_variant_b',
            ...payload,
          })
        }
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [embedOrigin])

  useEffect(() => {
    if (!embedOrigin) {
      return
    }

    if (!leadData) {
      console.warn('⚠️ No lead data provided to Empowerly embed; iframe will load without prefilling.')
      return
    }

    const iframe = iframeRef.current
    if (!iframe) {
      return
    }

    const postLeadContext = () => {
      try {
        console.log('📤 Posting lead context to Empowerly iframe:', {
          hasParent: Boolean((leadData as Record<string, unknown>).parent),
          hasStudent: Boolean((leadData as Record<string, unknown>).student),
        })
        iframe.contentWindow?.postMessage(
          {
            type: 'ParentSimpleLeadContext',
            payload: leadData,
          },
          embedOrigin ?? '*'
        )
      } catch (error) {
        console.error('Failed to post lead context to Empowerly embed:', error)
      }
    }

    if (iframe.dataset.empowerlyLoaded === 'true') {
      postLeadContext()
    } else {
      const handleLoad = () => {
        iframe.dataset.empowerlyLoaded = 'true'
        postLeadContext()
      }

      iframe.addEventListener('load', handleLoad, { once: true })
      return () => iframe.removeEventListener('load', handleLoad)
    }
  }, [leadData, embedOrigin])

  if (!embedUrl) {
    return (
      <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6 text-yellow-800">
        <p className="font-semibold mb-2">Empowerly embed URL missing</p>
        <p className="text-sm text-yellow-800/80">
          Set <code className="font-mono text-xs">NEXT_PUBLIC_EMPOWERLY_EMBED_URL</code> to the consultation experience that Empowerly provided to render the embed.
        </p>
      </div>
    )
  }

  return (
    <div className={cn('w-full rounded-2xl border border-[#D9D4C5] shadow-2xl overflow-hidden bg-white', className)}>
      <iframe
        ref={iframeRef}
        src={embedUrl}
        title="Empowerly Consultation Scheduler"
        className="w-full border-0"
        style={{ minHeight }}
        loading="lazy"
        allow="camera *; microphone *; autoplay; payment"
      />
    </div>
  )
}


