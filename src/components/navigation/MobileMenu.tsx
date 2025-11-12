"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "../ui/Button"

const mobileMenuItems = [
  {
    title: "Early Years",
    href: "/early-years",
    items: [
      { name: "Development Milestones", href: "/early-years/development-milestones" },
      { name: "Learning Through Play", href: "/early-years/learning-through-play" },
      { name: "529 Plan Calculator", href: "/calculators/college-savings" },
    ]
  },
  {
    title: "Middle School",
    href: "/middle-school",
    items: [
      { name: "Course Selection Guide", href: "/middle-school/course-selection" },
      { name: "Study Skills & Time Management", href: "/middle-school/study-skills" },
      { name: "Summer Program Guide", href: "/resources/summer-programs" },
    ]
  },
  {
    title: "High School",
    href: "/high-school",
    items: [
      { name: "GPA Optimization Strategies", href: "/high-school/gpa-optimization" },
      { name: "Standardized Test Prep", href: "/high-school/test-prep" },
      { name: "Free College Timeline", href: "/college-planning/timeline" },
    ]
  },
  {
    title: "College Planning",
    href: "/college-planning",
    items: [
      { name: "Find College Consultant", href: "/consultation" },
      { name: "Application Timeline", href: "/college-planning/application-timeline" },
      { name: "Essay Writing Guide", href: "/college-planning/essay-guide" },
    ]
  },
  {
    title: "Financial Planning",
    href: "/financial-planning",
    items: [
      { name: "529 Plans Explained", href: "/financial-planning/529-plans" },
      { name: "Life Insurance for Parents", href: "/financial-planning/life-insurance" },
      { name: "College Cost Calculator", href: "/calculators/college-cost" },
    ]
  },
  {
    title: "Resources",
    href: "/resources",
    items: [
      { name: "College Planning Checklists", href: "/resources/college-planning-checklist" },
      { name: "Summer Programs Database", href: "/resources/summer-programs" },
      { name: "Educational Tools & Apps", href: "/resources/educational-tools" },
    ]
  },
]

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

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
                  {mobileMenuItems.map((item) => (
                    <div key={item.title} className="px-4">
                      <Link
                        href={item.href}
                        className="block py-3 text-base font-semibold text-[#1A2B49] hover:text-[#152238] transition-colors border-b border-[#9DB89D]/20"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.title}
                      </Link>
                      <div className="ml-4 space-y-1 mt-2">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="block py-2 text-sm text-gray-700 hover:text-[#1A2B49] transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
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
