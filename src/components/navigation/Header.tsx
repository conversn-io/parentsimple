"use client"

import Link from "next/link"
import { Logo } from "../brand/Logo"
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
          {/* Logo - Wordmark only for header */}
          <div className="flex-shrink-0">
            <Logo variant="wordmark" size="md" />
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-1">
            <MegaMenu />
          </nav>

          {/* CTA Button & Mobile Menu */}
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              href="/college-planning"
              className="hidden sm:inline-flex"
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
