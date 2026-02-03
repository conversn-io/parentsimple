'use client'

import Image from 'next/image'

interface EmpowerlyLogoProps {
  width?: number
  height?: number
  className?: string
}

export function EmpowerlyLogo({ width = 200, height = 40, className = '' }: EmpowerlyLogoProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Image
        src="/images/logos/empowerly-logo.png"
        alt="Empowerly - Expert College Counseling"
        width={width}
        height={height}
        className="h-auto w-auto"
        priority
      />
    </div>
  )
}


