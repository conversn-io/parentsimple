'use client'

import { Button } from '@/components/ui/Button'
import { EmpowerlyLogo } from './EmpowerlyLogo'
import { CheckCircle, ArrowRight } from 'lucide-react'

// Helper function to add UTM parameters to Empowerly URLs
const addEmpowerlyUTM = (url: string): string => {
  const utmParams = new URLSearchParams({
    utm_campaign: 'parent-simple',
    utm_source: 'leadgen',
    utm_medium: 'referral',
    utm_content: 'social',
    utm_term: 'results'
  });
  const separator = url.includes('?') ? '&' : '?';
  const finalUrl = `${url}${separator}${utmParams.toString()}`;
  return finalUrl;
};

interface EmpowerlyCTASectionProps {
  title?: string
  showLogo?: boolean
  logoPosition?: 'top' | 'above-title'
  className?: string
}

export function EmpowerlyCTASection({ 
  title = "Schedule Your Free Consultation with Empowerly",
  showLogo = true,
  logoPosition = 'top',
  className = ''
}: EmpowerlyCTASectionProps) {
  const bulletPoints = [
    "Personalized Assessment: an admissions advisor will learn about the academic background, extracurriculars, and college goals.",
    "Gap Analysis & Clarity: families will receive honest feedback on where the student currently stands and what areas need improvement",
    "Customized Planning: the admissions advisor will outline a step-by-step plan designed to close the gap towards building a competitive profile."
  ];

  return (
    <div className={`bg-white rounded-2xl shadow-xl p-8 ${className}`}>
      {showLogo && logoPosition === 'top' && (
        <div className="mb-6">
          <EmpowerlyLogo width={200} height={40} />
        </div>
      )}
      
      {title && (
        <div className="text-center mb-6">
          {showLogo && logoPosition === 'above-title' && (
            <div className="mb-4">
              <EmpowerlyLogo width={200} height={40} />
            </div>
          )}
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1A2B49] mb-4">
            {title}
          </h2>
        </div>
      )}

      <div className="space-y-4 mb-8">
        {bulletPoints.map((point, index) => (
          <div key={index} className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-[#9DB89D] mt-1 flex-shrink-0" />
            <p className="text-gray-700 text-lg leading-relaxed">{point}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button
          variant="primary"
          size="lg"
          href={addEmpowerlyUTM("https://empowerly.com/consult")}
          className="bg-[#1A2B49] text-white hover:bg-[#152238] min-w-[300px]"
        >
          Request a call from Empowerly
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
        <Button
          variant="outline"
          size="lg"
          href={addEmpowerlyUTM("https://empowerly.com/consult")}
          className="border-2 border-[#1A2B49] text-[#1A2B49] hover:bg-[#1A2B49] hover:text-white min-w-[200px]"
        >
          Book a call
        </Button>
      </div>
    </div>
  )
}


