'use client'

import { useSearchParams } from 'next/navigation'
import { GamePlanLanding } from './GamePlanLanding'
import { EliteUniversityReadinessQuiz } from './EliteUniversityReadinessQuiz'
import { useNoHeaderLayout } from '@/hooks/useFunnelFooter'

/**
 * -c variant: Game Plan landing + form page (no OTP).
 * ?start=1 → show quiz with skipOTP and gameplan form layout; otherwise show landing.
 */
export function GamePlanFunnelClient() {
  const searchParams = useSearchParams()
  const start = searchParams.get('start') === '1'
  
  // Hide the main site header since GamePlanLanding has its own header
  useNoHeaderLayout()

  if (start) {
    return (
      <div className="min-h-screen bg-[#F9F6EF]">
        <EliteUniversityReadinessQuiz skipOTP={true} formVariant="gameplan" />
      </div>
    )
  }

  return <GamePlanLanding />
}
