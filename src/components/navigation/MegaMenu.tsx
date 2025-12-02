"use client"

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
  Shield,
  Users,
  TrendingUp,
  PiggyBank,
  Target,
  Building,
  School,
  Heart,
  FileText,
  Sparkles,
} from "lucide-react"

const articlesLink = (categorySlug?: string, query?: string) => {
  const params = new URLSearchParams()
  if (categorySlug) params.set('category', categorySlug)
  if (query) params.set('query', query)
  const search = params.toString()
  return search ? `/articles?${search}` : '/articles'
}

// ParentSimple content pillar menu structure
const menuItems = [
  {
    title: "Early Years",
    href: articlesLink('early-years'),
    description: "Building the foundation (Ages 0-10)",
    sections: [
      {
        title: "Early Childhood (0-5)",
        items: [
          {
            name: "Development Milestones",
            href: articlesLink('early-years', 'development milestones'),
            icon: Sparkles,
            description: "Track your child's growth"
          },
          {
            name: "Learning Through Play",
            href: articlesLink('early-years', 'learning through play'),
            icon: Heart,
            description: "Educational play strategies"
          },
          {
            name: "Preschool Selection",
            href: articlesLink('early-years', 'preschool'),
            icon: School,
            description: "Choose the right preschool"
          },
        ],
      },
      {
        title: "Elementary School (6-10)",
        items: [
          {
            name: "Academic Foundations",
            href: articlesLink('early-years', 'academic foundations'),
            icon: BookOpen,
            description: "Build strong academic skills"
          },
          {
            name: "Character Development",
            href: articlesLink('early-years', 'character development'),
            icon: Shield,
            description: "Values and character building"
          },
          {
            name: "529 Plan Calculator",
            href: articlesLink('financial-planning', '529 plan'),
            icon: Calculator,
            description: "Start saving for college"
          },
        ],
      },
    ],
  },
  {
    title: "Middle School",
    href: articlesLink('middle-school'),
    description: "Building momentum (Ages 11-14)",
    sections: [
      {
        title: "Academic Preparation",
        items: [
          {
            name: "Course Selection Guide",
            href: articlesLink('middle-school', 'course selection'),
            icon: BookOpen,
            description: "Choose the right courses"
          },
          {
            name: "Study Skills & Time Management",
            href: articlesLink('middle-school', 'study skills'),
            icon: Target,
            description: "Build effective study habits"
          },
          {
            name: "Enrichment Opportunities",
            href: articlesLink('middle-school', 'enrichment'),
            icon: Sparkles,
            description: "STEM, arts, and athletics"
          },
        ],
      },
      {
        title: "Social & Emotional",
        items: [
          {
            name: "Navigating Adolescence",
            href: articlesLink('middle-school', 'adolescence'),
            icon: Users,
            description: "Support your teen's development"
          },
          {
            name: "Parent-Teen Communication",
            href: articlesLink('middle-school', 'parent communication'),
            icon: Heart,
            description: "Build strong relationships"
          },
          {
            name: "Summer Program Guide",
            href: articlesLink('middle-school', 'summer program'),
            icon: GraduationCap,
            description: "Find the right programs"
          },
        ],
      },
    ],
  },
  {
    title: "High School",
    href: articlesLink('high-school'),
    description: "College readiness (Ages 15-17)",
    sections: [
      {
        title: "Academic Planning",
        items: [
          {
            name: "GPA Optimization Strategies",
            href: articlesLink('high-school', 'gpa'),
            icon: TrendingUp,
            description: "Maximize your GPA"
          },
          {
            name: "Standardized Test Prep",
            href: articlesLink('high-school', 'test prep'),
            icon: Target,
            description: "SAT/ACT preparation"
          },
          {
            name: "Extracurricular Strategy",
            href: articlesLink('high-school', 'extracurricular'),
            icon: Sparkles,
            description: "Build a strong profile"
          },
        ],
      },
      {
        title: "College Preparation",
        items: [
          {
            name: "College List Building",
            href: articlesLink('college-planning', 'college list'),
            icon: School,
            description: "Find the right fit"
          },
          {
            name: "Teacher Recommendations",
            href: articlesLink('high-school', 'recommendations'),
            icon: Users,
            description: "Get strong recommendations"
          },
          {
            name: "Free College Timeline",
            href: articlesLink('college-planning', 'timeline'),
            icon: FileText,
            description: "Download our free guide"
          },
        ],
      },
    ],
  },
  {
    title: "College Planning",
    href: "/college-planning",
    description: "Your path to college success (PRIMARY)",
    sections: [
      {
        title: "Admissions Strategy",
        items: [
          {
            name: "College Search & Fit",
            href: articlesLink('college-planning', 'college search'),
            icon: School,
            description: "Find your perfect match"
          },
          {
            name: "Application Timeline",
            href: articlesLink('college-planning', 'application timeline'),
            icon: FileText,
            description: "Stay on track"
          },
          {
            name: "Essay Writing Guide",
            href: articlesLink('college-planning', 'essay'),
            icon: BookOpen,
            description: "Write winning essays"
          },
          {
            name: "Interview Preparation",
            href: articlesLink('college-planning', 'interview'),
            icon: Users,
            description: "Ace your interviews"
          },
        ],
      },
      {
        title: "Get Expert Help",
        items: [
          {
            name: "Find College Consultant",
            href: "/consultation",
            icon: GraduationCap,
            description: "Match with an expert (Primary CTA)"
          },
          {
            name: "Ivy League Strategies",
            href: articlesLink('college-planning', 'ivy league'),
            icon: Target,
            description: "Competitive admissions guide"
          },
          {
            name: "Early Decision Guide",
            href: articlesLink('college-planning', 'early decision'),
            icon: Shield,
            description: "ED/EA strategies"
          },
        ],
      },
    ],
  },
  {
    title: "Financial Planning",
    href: articlesLink('financial-planning'),
    description: "Secure your family's future",
    sections: [
      {
        title: "College Funding",
        items: [
          {
            name: "529 Plans Explained",
            href: articlesLink('financial-planning', '529 plan'),
            icon: PiggyBank,
            description: "Maximize tax advantages"
          },
          {
            name: "Financial Aid Strategies",
            href: articlesLink('college-planning', 'financial aid'),
            icon: DollarSign,
            description: "Maximize aid eligibility"
          },
          {
            name: "Scholarship Guide",
            href: articlesLink('college-planning', 'scholarship'),
            icon: GraduationCap,
            description: "Find and win scholarships"
          },
          {
            name: "College Cost Calculator",
            href: articlesLink('financial-planning', 'college cost'),
            icon: Calculator,
            description: "Calculate total costs"
          },
        ],
      },
      {
        title: "Family Protection",
        items: [
          {
            name: "Life Insurance for Parents",
            href: articlesLink('financial-planning', 'life insurance'),
            icon: Shield,
            description: "Protect your family"
          },
          {
            name: "Estate Planning Essentials",
            href: articlesLink('financial-planning', 'estate planning'),
            icon: FileText,
            description: "Secure your legacy"
          },
          {
            name: "Life Insurance Calculator",
            href: "/calculators/life-insurance",
            icon: Calculator,
            description: "Calculate your needs"
          },
        ],
      },
    ],
  },
  {
    title: "Resources",
    href: articlesLink('resources'),
    description: "Tools and guides for parents",
    sections: [
      {
        title: "Downloadable Guides",
        items: [
          {
            name: "College Planning Checklists",
            href: articlesLink('resources', 'checklist'),
            icon: FileText,
            description: "Stay organized"
          },
          {
            name: "Financial Planning Templates",
            href: articlesLink('financial-planning', 'template'),
            icon: DollarSign,
            description: "Plan your finances"
          },
          {
            name: "Academic Milestone Guides",
            href: articlesLink('early-years', 'milestone'),
            icon: BookOpen,
            description: "Track progress"
          },
        ],
      },
      {
        title: "Tools & Programs",
        items: [
          {
            name: "Summer Programs Database",
            href: articlesLink('middle-school', 'summer program'),
            icon: GraduationCap,
            description: "Find programs"
          },
          {
            name: "Educational Tools & Apps",
            href: articlesLink('resources', 'educational tools'),
            icon: Sparkles,
            description: "Recommended resources"
          },
          {
            name: "Expert Directory",
            href: "/consultation",
            icon: Users,
            description: "Find professionals"
          },
        ],
      },
    ],
  },
]

export function MegaMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {menuItems.map((item) => (
          <NavigationMenuItem key={item.title}>
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
                    <p className="text-gray-600 mt-1 text-sm">{item.description}</p>
                  </div>

                  {/* Content Grid */}
                  <div className="grid grid-cols-2 gap-8">
                    {item.sections.map((section) => (
                      <div key={section.title}>
                        <h3 className="font-semibold text-[#1A2B49] mb-4 text-sm uppercase tracking-wide">
                          {section.title}
                        </h3>
                        <ul className="space-y-3">
                          {section.items.map((menuItem) => {
                            const IconComponent = menuItem.icon
                            return (
                              <li key={menuItem.name}>
                                <Link
                                  href={menuItem.href}
                                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-[#F9F6EF] transition-colors group border border-transparent hover:border-[#9DB89D]/30"
                                >
                                  <IconComponent className="h-5 w-5 text-[#9DB89D] mt-0.5 flex-shrink-0 group-hover:text-[#8BA68B]" />
                                  <div className="flex-1 min-w-0">
                                    <span className="text-sm font-semibold text-[#1A2B49] group-hover:text-[#152238] block">
                                      {menuItem.name}
                                    </span>
                                    {menuItem.description && (
                                      <span className="text-xs text-gray-600 mt-1 block">
                                        {menuItem.description}
                                      </span>
                                    )}
                                  </div>
                                </Link>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
