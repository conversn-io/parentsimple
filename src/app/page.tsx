import type { Metadata } from 'next'
import Link from 'next/link'
import { ParentSimpleHero } from '@/components/hero/ParentSimpleHero'
import { Card, CardImage, CardContent, CardTitle, CardDescription, CardMeta } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  GraduationCap, 
  DollarSign, 
  Shield, 
  BookOpen,
  Calculator,
  Users,
  Sparkles,
  TrendingUp,
  Heart,
  School,
  Target,
  ArrowRight,
  CheckCircle,
} from 'lucide-react'

export const metadata: Metadata = {
  title: "ParentSimple - Parenting with Purpose. Planning with Power.",
  description: "Expert guidance for parents on college planning, education savings, financial security, and family financial planning. Tools, calculators, and resources to help you prepare for your children's future.",
  keywords: ["college planning", "529 plans", "education savings", "college admissions", "financial planning for parents", "life insurance for parents", "estate planning", "education funding", "college prep", "parenting finances"],
  openGraph: {
    title: "ParentSimple - Parenting with Purpose. Planning with Power.",
    description: "Expert guidance for parents on college planning, education savings, financial security, and family financial planning.",
    type: 'website',
    url: 'https://parentsimple.org',
    siteName: 'ParentSimple',
    images: [
      {
        url: '/images/hero/parents-visit-campus-lawn.jpeg',
        width: 1200,
        height: 630,
        alt: 'Parents visiting college campus with their child',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "ParentSimple - Parenting with Purpose. Planning with Power.",
    description: "Expert guidance for parents on college planning, education savings, financial security, and family financial planning.",
    images: ['/images/hero/parents-visit-campus-lawn.jpeg'],
  },
  alternates: {
    canonical: 'https://parentsimple.org',
  },
}

export default function HomePage() {
  const contentPillars = [
    {
      title: "Early Years",
      description: "Building the foundation (Ages 0-10)",
      href: "/early-years",
      image: "/images/topics/family-reads-by-fire.jpeg",
      icon: Sparkles,
      color: "from-accent-100 to-accent-200",
    },
    {
      title: "Middle School",
      description: "Building momentum (Ages 11-14)",
      href: "/middle-school",
      image: "/images/topics/parents-school-visit-fall-foliage.jpeg",
      icon: School,
      color: "from-accent-300 to-accent-400",
    },
    {
      title: "High School",
      description: "College readiness (Ages 15-17)",
      href: "/high-school",
      image: "/images/topics/parents-meet-college-counselor.jpeg",
      icon: GraduationCap,
      color: "from-accent-500 to-accent-600",
    },
    {
      title: "College Planning",
      description: "Your path to college success",
      href: "/college-planning",
      image: "/images/topics/mom-daughter-college-library.jpeg",
      icon: Target,
      color: "from-primary-500 to-primary-600",
    },
    {
      title: "Financial Planning",
      description: "Secure your family's future",
      href: "/financial-planning",
      image: "/images/topics/financial-planning-session.jpeg",
      icon: DollarSign,
      color: "from-primary-400 to-primary-500",
    },
    {
      title: "Resources",
      description: "Tools and guides for parents",
      href: "/resources",
      image: "/images/topics/libary-study-session-diverse-students.jpeg",
      icon: BookOpen,
      color: "from-accent-400 to-accent-500",
    },
  ]

  const features = [
    {
      icon: Shield,
      title: "Expert Guidance",
      description: "Trusted advice from college admissions consultants and financial advisors",
    },
    {
      icon: Calculator,
      title: "Powerful Tools",
      description: "Interactive calculators for college costs, 529 plans, and financial planning",
    },
    {
      icon: BookOpen,
      title: "Comprehensive Resources",
      description: "Guides, checklists, and articles to support your parenting journey",
    },
  ]

  return (
    <div className="min-h-screen bg-[#F9F6EF]">
      {/* Hero Section */}
      <ParentSimpleHero
        headline="Parenting with Purpose. Planning with Power."
        subheadline="Expert guidance for parents navigating college planning, education savings, and family financial security. Tools, calculators, and resources to help you prepare for your children's future."
        primaryCTA={{
          text: "Get Free College Guide",
          href: "/college-planning",
        }}
        secondaryCTA={{
          text: "Find a Consultant",
          href: "/consultation",
        }}
        trustIndicator="Trusted by 10,000+ families"
      />

      {/* Content Pillars Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1A2B49] mb-4">
              Your Parenting Journey, Supported
            </h2>
            <div className="w-24 h-1 bg-[#9DB89D] mx-auto mb-6"></div>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              From early childhood through college admissions, we provide expert guidance at every stage
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contentPillars.map((pillar, index) => {
              const IconComponent = pillar.icon
              return (
                <Link key={index} href={pillar.href}>
                  <Card hover>
                    <CardImage src={pillar.image} alt={pillar.description} />
                    <CardContent>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${pillar.color} flex items-center justify-center text-white`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle as="h3">{pillar.title}</CardTitle>
                          <CardDescription className="text-xs mt-1">
                            {pillar.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F9F6EF]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1A2B49] mb-4">
              Why Choose ParentSimple?
            </h2>
            <div className="w-24 h-1 bg-[#9DB89D] mx-auto mb-6"></div>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Everything you need to navigate your child's educational and financial future
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-[#9DB89D] rounded-lg flex items-center justify-center text-[#1A2B49] mb-6">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[#1A2B49] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1A2B49] to-[#152238] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Ready to Plan Your Child's Future?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Get your free college planning guide and connect with expert consultants
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" href="/college-planning">
              Get Free Guide
            </Button>
            <Button variant="outline" size="lg" href="/consultation" className="bg-transparent border-white text-white hover:bg-white hover:text-[#1A2B49]">
              Find a Consultant
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
