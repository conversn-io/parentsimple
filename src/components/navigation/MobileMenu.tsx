"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "../ui/Button"

const categoryHref = (categorySlug: string) => `/category/${categorySlug}`

interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  display_order?: number | null
}

const defaultMenuItems = [
  {
    title: "Early Years",
    slug: "early-years",
    href: categoryHref('early-years'),
  },
  {
    title: "Middle School",
    slug: "middle-school",
    href: categoryHref('middle-school'),
  },
  {
    title: "High School",
    slug: "high-school",
    href: categoryHref('high-school'),
  },
  {
    title: "College Planning",
    slug: "college-planning",
    href: "/college-planning",
  },
  {
    title: "Financial Planning",
    slug: "financial-planning",
    href: categoryHref('financial-planning'),
  },
  {
    title: "Resources",
    slug: "resources",
    href: categoryHref('resources'),
  },
]

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data.categories || [])
        }
      } catch (error) {
        console.error('Error loading categories:', error)
      }
    }

    loadCategories()
  }, [])

  // Use CMS categories if available, otherwise fallback to defaults
  const menuItems = categories.length > 0
    ? categories
        .sort((a, b) => (a.display_order ?? 999) - (b.display_order ?? 999))
        .map(cat => ({
          title: cat.name,
          slug: cat.slug,
          href: cat.slug === 'college-planning' ? '/college-planning' : categoryHref(cat.slug),
        }))
    : defaultMenuItems

  return (
    <div className="lg:hidden">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-[#1A2B49] hover:text-[#152238] transition-colors"
        aria-label="Toggle mobile menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsOpen(false)}>
          <div className="fixed inset-y-0 right-0 w-80 bg-[#F9F6EF] shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#9DB89D]">
                <h2 className="text-lg font-serif font-bold text-[#1A2B49]">Menu</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-[#1A2B49] hover:text-[#152238] transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Menu items */}
              <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <div key={item.slug} className="px-4">
                      <Link
                        href={item.href}
                        className="block py-3 text-base font-semibold text-[#1A2B49] hover:text-[#152238] transition-colors border-b border-[#9DB89D]/20"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.title}
                      </Link>
                    </div>
                  ))}
                </nav>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-[#9DB89D] bg-white">
                <div className="space-y-2">
                  <Button
                    variant="primary"
                    size="md"
                    href="/college-planning"
                    className="w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Free Guide
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    href="/consultation"
                    className="w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    Find Consultant
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
