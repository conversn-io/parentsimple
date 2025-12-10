"use client"
import Link from "next/link"
import Image from "next/image"

export function FunnelHeader() {
  return (
    <header className="bg-[#F9F6EF] border-b border-[#9DB89D] sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo Only - No CTA, No Navigation */}
          <div className="flex-shrink-0">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/images/logos/ParentSimple-header-logo.png"
                alt="ParentSimple"
                width={180}
                height={32}
                className="h-8 md:h-10 w-auto"
                priority
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}






