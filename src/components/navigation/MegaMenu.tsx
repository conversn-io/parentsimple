"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu"
import {
  Calculator,
  BookOpen,
  GraduationCap,
  DollarSign,
  School,
  Heart,
  FileText,
} from "lucide-react"

const categoryHref = (categorySlug: string, hasArticles: boolean = true) => {
  // If category has no articles, link to articles page with category filter to prevent 404
  if (!hasArticles) {
    return `/articles?category=${categorySlug}`
  }
  return `/category/${categorySlug}`
}

// Icon mapping for categories
const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'college-planning': GraduationCap,
  'financial-planning': DollarSign,
  'high-school': School,
  'middle-school': BookOpen,
  'early-years': Heart,
  'resources': FileText,
}

// Default menu structure (fallback if categories not loaded)
const defaultMenuItems = [
  {
    title: "Early Years",
    slug: "early-years",
    description: "Building the foundation (Ages 0-10)",
    href: categoryHref('early-years'),
  },
  {
    title: "Middle School",
    slug: "middle-school",
    description: "Building momentum (Ages 11-14)",
    href: categoryHref('middle-school'),
  },
  {
    title: "High School",
    slug: "high-school",
    description: "College readiness (Ages 15-17)",
    href: categoryHref('high-school'),
  },
  {
    title: "College Planning",
    slug: "college-planning",
    description: "Your path to college success (PRIMARY)",
    href: "/college-planning",
  },
  {
    title: "Financial Planning",
    slug: "financial-planning",
    description: "Secure your family's future",
    href: categoryHref('financial-planning'),
  },
  {
    title: "Resources",
    slug: "resources",
    description: "Tools and guides for parents",
    href: categoryHref('resources'),
  },
]

interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  display_order?: number | null
  article_count?: number
  has_articles?: boolean
}

export function MegaMenu() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (!response.ok) {
          console.warn('Failed to load categories, using defaults')
          setCategories([])
          return
        }
        const data = await response.json()
        setCategories(data.categories || [])
      } catch (error) {
        console.error('Error loading categories:', error)
        setCategories([])
      } finally {
        setIsLoading(false)
      }
    }

    loadCategories()
  }, [])

  // Use CMS categories if available, otherwise fallback to defaults
  const menuCategories = categories.length > 0 
    ? categories
        .sort((a, b) => (a.display_order ?? 999) - (b.display_order ?? 999))
        .map(cat => ({
          title: cat.name,
          slug: cat.slug,
          description: cat.description || '',
          hasArticles: cat.has_articles ?? false,
          articleCount: cat.article_count ?? 0,
          href: cat.slug === 'college-planning' 
            ? '/college-planning' 
            : categoryHref(cat.slug, cat.has_articles ?? false),
        }))
    : defaultMenuItems.map(item => ({
        ...item,
        hasArticles: true, // Defaults assume content exists
        articleCount: 0,
      }))

  if (isLoading) {
    return (
      <NavigationMenu>
        <NavigationMenuList>
          {defaultMenuItems.map((item) => (
            <NavigationMenuItem key={item.slug}>
              <NavigationMenuTrigger className="h-8 px-4 py-2 text-sm font-semibold text-[#1A2B49]">
                {item.title}
              </NavigationMenuTrigger>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    )
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {menuCategories.map((item) => {
          const IconComponent = categoryIcons[item.slug] || FileText
          return (
            <NavigationMenuItem key={item.slug}>
              <NavigationMenuTrigger className="h-8 px-4 py-2 text-sm font-semibold text-[#1A2B49] hover:text-[#152238] transition-colors data-[state=open]:text-[#152238] data-[state=open]:underline decoration-[#9DB89D] decoration-2 underline-offset-4">
                {item.title}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[900px] p-6 bg-white rounded-lg shadow-xl border border-gray-100 z-50" style={{ backgroundColor: '#ffffff' }}>
                  {/* Header Section */}
                  <div className="mb-6 pb-4 border-b border-[#9DB89D]">
                    <Link
                      href={item.href}
                      className="text-xl font-serif font-bold text-[#1A2B49] hover:text-[#152238] transition-colors"
                    >
                      {item.title}
                    </Link>
                    {item.description && (
                      <p className="text-gray-600 mt-1 text-sm">{item.description}</p>
                    )}
                  </div>

                  {/* Content Grid - Show featured articles from this category */}
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold text-[#1A2B49] mb-4 text-sm uppercase tracking-wide">
                        Featured Articles
                      </h3>
                      <ul className="space-y-3">
                        <li>
                          <Link
                            href={item.href}
                            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-[#F9F6EF] transition-colors group border border-transparent hover:border-[#9DB89D]/30"
                          >
                            <IconComponent className="h-5 w-5 text-[#9DB89D] mt-0.5 flex-shrink-0 group-hover:text-[#8BA68B]" />
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-semibold text-[#1A2B49] group-hover:text-[#152238] block">
                                View All {item.title} Articles
                              </span>
                              <span className="text-xs text-gray-600 mt-1 block">
                                Explore our complete {item.title.toLowerCase()} library
                              </span>
                            </div>
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A2B49] mb-4 text-sm uppercase tracking-wide">
                        Quick Links
                      </h3>
                      <ul className="space-y-3">
                        {item.slug === 'college-planning' && (
                          <li>
                            <Link
                              href="/consultation"
                              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-[#F9F6EF] transition-colors group border border-transparent hover:border-[#9DB89D]/30"
                            >
                              <GraduationCap className="h-5 w-5 text-[#9DB89D] mt-0.5 flex-shrink-0 group-hover:text-[#8BA68B]" />
                              <div className="flex-1 min-w-0">
                                <span className="text-sm font-semibold text-[#1A2B49] group-hover:text-[#152238] block">
                                  Find College Consultant
                                </span>
                                <span className="text-xs text-gray-600 mt-1 block">
                                  Match with an expert (Primary CTA)
                                </span>
                              </div>
                            </Link>
                          </li>
                        )}
                        {item.slug === 'financial-planning' && (
                          <li>
                            <Link
                              href="/calculators/life-insurance"
                              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-[#F9F6EF] transition-colors group border border-transparent hover:border-[#9DB89D]/30"
                            >
                              <Calculator className="h-5 w-5 text-[#9DB89D] mt-0.5 flex-shrink-0 group-hover:text-[#8BA68B]" />
                              <div className="flex-1 min-w-0">
                                <span className="text-sm font-semibold text-[#1A2B49] group-hover:text-[#152238] block">
                                  Life Insurance Calculator
                                </span>
                                <span className="text-xs text-gray-600 mt-1 block">
                                  Calculate your needs
                                </span>
                              </div>
                            </Link>
                          </li>
                        )}
                        <li>
                          <Link
                            href={item.href}
                            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-[#F9F6EF] transition-colors group border border-transparent hover:border-[#9DB89D]/30"
                          >
                            <FileText className="h-5 w-5 text-[#9DB89D] mt-0.5 flex-shrink-0 group-hover:text-[#8BA68B]" />
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-semibold text-[#1A2B49] group-hover:text-[#152238] block">
                                Browse All Articles
                              </span>
                              <span className="text-xs text-gray-600 mt-1 block">
                                See complete {item.title.toLowerCase()} content
                              </span>
                            </div>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
