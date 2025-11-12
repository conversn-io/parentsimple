"use client"
import Link from "next/link"
import { Logo } from "../brand/Logo"
import { usePathname } from "next/navigation"

export function FunnelHeader() {
  const pathname = usePathname()
  return (
    <header className="bg-[#F9F6EF] border-b border-[#9DB89D] sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo variant="wordmark" size="md" />
          </div>
        </div>
      </div>
    </header>
  )
}






