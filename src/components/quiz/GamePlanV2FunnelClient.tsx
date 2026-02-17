'use client'

import { useSearchParams } from 'next/navigation'
import { useNoHeaderLayout } from '@/hooks/useFunnelFooter'
import { GamePlanLanding } from './GamePlanLanding'
import { GamePlanV2Quiz } from './GamePlanV2Quiz'

/**
 * /gameplan v2 funnel:
 * ?start=1 -> launch branched qualification quiz.
 * default -> marketing landing page.
 */
export function GamePlanV2FunnelClient() {
  const searchParams = useSearchParams()
  const start = searchParams.get('start') === '1'

  useNoHeaderLayout()

  if (start) {
    return (
      <div className="min-h-screen bg-[#F9F6EF]">
        <GamePlanV2Quiz />
      </div>
    )
  }

  return <GamePlanLanding />
}
