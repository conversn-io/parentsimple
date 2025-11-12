"use client"

import Link from "next/link"
import Image from "next/image"
import { MegaMenu } from "./MegaMenu"
import { MobileMenu } from "./MobileMenu"
import { Button } from "../ui/Button"
import { useState, useEffect } from "react"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`bg-[#F9F6EF] border-b border-[#9DB89D] sticky top-0 z-50 transition-shadow duration-300 ${
        isScrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo - Header logo image */}
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

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-1">
            <MegaMenu />
          </nav>

          {/* CTA Button & Mobile Menu */}
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              href="/college-planning"
              className="hidden sm:inline-flex whitespace-nowrap"
            >
              Get Free Guide
            </Button>
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
