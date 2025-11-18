import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";

interface ParentSimpleHeroProps {
  imageSrc?: string;
  imageAlt?: string;
  headline?: string;
  subheadline?: string;
  primaryCTA?: {
    text: string;
    href: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
  };
  trustIndicator?: string;
}

export function ParentSimpleHero({
  imageSrc = "/images/hero/parents-visit-campus-lawn.jpeg",
  imageAlt = "Parents visiting college campus with their child",
  headline = "Parenting with Purpose. Planning with Power.",
  subheadline = "Expert guidance for parents navigating college planning, education savings, and family financial security.",
  primaryCTA = {
    text: "Take the Elite University Readiness Quiz",
    href: "/quiz/elite-university-readiness",
  },
  secondaryCTA = {
    text: "Explore College Planning Resources",
    href: "/college-planning",
  },
  trustIndicator = "Trusted by 10,000+ families",
}: ParentSimpleHeroProps) {
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] lg:min-h-[800px] flex items-center bg-[#F9F6EF] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 lg:py-32 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content Side - Left */}
          <div className="order-2 lg:order-1 space-y-6 md:space-y-8 w-full">
            {/* Logo - Full version for homepage */}
            <div className="mb-6">
              <Logo variant="full" size="lg" />
            </div>
            
            <h1 className="font-serif font-bold text-[#1A2B49] text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight text-balance mb-6">
              {headline}
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed text-balance mb-8">
              {subheadline}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              {primaryCTA && (
                <Button
                  variant="primary"
                  size="lg"
                  href={primaryCTA.href}
                  className="w-full sm:w-auto min-w-[200px]"
                >
                  {primaryCTA.text}
                </Button>
              )}
              {secondaryCTA && (
                <Button
                  variant="outline"
                  size="lg"
                  href={secondaryCTA.href}
                  className="w-full sm:w-auto min-w-[200px]"
                >
                  {secondaryCTA.text}
                </Button>
              )}
            </div>
            
            {/* Trust Indicator */}
            {trustIndicator && (
              <div className="pt-6">
                <p className="text-sm md:text-base text-gray-600 flex items-center gap-2">
                  <span className="text-[#9DB89D] font-semibold text-lg">✓</span>
                  {trustIndicator}
                </p>
              </div>
            )}
          </div>
          
          {/* Image Side - Right */}
          <div className="order-1 lg:order-2 relative h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] rounded-2xl overflow-hidden shadow-2xl w-full">
            {/* Gradient Overlay for better text readability if needed */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#1A2B49]/10 z-10 pointer-events-none" />
            
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F9F6EF] to-transparent pointer-events-none" />
    </section>
  );
}

