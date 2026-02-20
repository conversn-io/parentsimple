'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, AlertCircle, TrendingUp, Target, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

interface EliteUniversityReadinessResultsVideoProps {
  score: number;
  category: string;
}

export function EliteUniversityReadinessResultsVideo({
  score,
  category,
}: EliteUniversityReadinessResultsVideoProps) {
  const [hasQuizData, setHasQuizData] = useState(true)
  const nextStepHref = '/quiz/elite-university-readiness/results-embed'

  useEffect(() => {
    // Check if user has quiz data in sessionStorage
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('elite_university_readiness_results')
      setHasQuizData(!!stored)
    }
  }, [])

  // Determine category badge styling
  const getCategoryBadge = () => {
    switch (category) {
      case 'Elite Ready':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-300',
          icon: CheckCircle,
        };
      case 'Competitive':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          border: 'border-blue-300',
          icon: TrendingUp,
        };
      case 'Developing':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          border: 'border-yellow-300',
          icon: Target,
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-300',
          icon: AlertCircle,
        };
    }
  };

  const badge = getCategoryBadge();
  const IconComponent = badge.icon;

  const getScoreVisuals = (value: number) => {
    if (value >= 85) {
      return {
        circleBg: 'bg-green-600',
        barBg: 'bg-green-500',
        text: 'text-green-700',
      };
    }
    if (value >= 70) {
      return {
        circleBg: 'bg-orange-500',
        barBg: 'bg-orange-400',
        text: 'text-orange-600',
      };
    }
    if (value >= 55) {
      return {
        circleBg: 'bg-yellow-500',
        barBg: 'bg-yellow-400',
        text: 'text-yellow-600',
      };
    }
    return {
      circleBg: 'bg-red-600',
      barBg: 'bg-red-500',
      text: 'text-red-600',
    };
  };

  const scoreVisuals = getScoreVisuals(score);

  return (
    <div className="min-h-screen bg-[#F9F6EF]">
      {/* Announcement Bar - Directly under header nav */}
      <div className="bg-green-50 border-b border-green-200 py-2.5 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-green-800 font-semibold text-sm sm:text-base text-center">
            Your full PDF assessment is on its way to your inbox!
          </p>
        </div>
      </div>

      {/* Pre-Header (for users who didn't take quiz) */}
      {!hasQuizData && (
        <div className="bg-blue-50 border-b border-blue-200 py-3 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-blue-800 text-sm sm:text-base">
              Didn't take the quiz yet?{' '}
              <Link href="/quiz/elite-university-readiness" className="font-semibold underline hover:text-blue-900">
                Take the Elite University Readiness Assessment
              </Link>
            </p>
          </div>
        </div>
      )}

      <div className="py-6 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Compact Header + Score Card */}
          <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 mb-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div className="min-w-0">
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A2B49] leading-tight">
                  Your Elite University Readiness Results
                </h1>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">
                  Quick summary first, then watch your 2-minute breakdown and continue to your next step.
                </p>
              </div>
              <div className="flex items-center gap-4 md:flex-shrink-0">
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-white ${scoreVisuals.circleBg}`}>
                  <span className="text-4xl font-bold">{score}</span>
                </div>
                <div className="min-w-0">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 ${badge.bg} ${badge.text} ${badge.border}`}>
                    <IconComponent className="w-4 h-4" />
                    <span className="font-bold">{category}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${scoreVisuals.barBg}`}
                  style={{ width: `${Math.min(score, 100)}%` }}
                />
            </div>
          </div>

          {/* Video Headline */}
          <div className="text-center mb-3">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#1A2B49]">
              Here's What That Means...
            </h2>
          </div>

          {/* Video Embed */}
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-5 mb-5">
            <div className="rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
              <iframe
                src="https://player.vimeo.com/video/1166775697?title=0&byline=0&portrait=0&autoplay=0"
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="Elite University Readiness Results Analysis"
              />
            </div>
          </div>

          {/* Priority CTA for next page */}
          <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 text-center">
            <p className="text-sm uppercase tracking-wide text-[#36596A] font-semibold mb-2">
              Next Step
            </p>
            <h3 className="text-2xl font-serif font-bold text-[#1A2B49] mb-2">
              Continue to Your Consultation Page
            </h3>
            <p className="text-gray-600 mb-5">
              Move to the next page to book your admissions strategy call.
            </p>
            <Button
              variant="secondary"
              size="lg"
              href={nextStepHref}
              className="w-full sm:w-auto min-w-[280px]"
            >
              Continue to Next Step
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Footer Elements */}
      <footer className="bg-white border-t border-gray-200 py-8 px-4 mt-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4">
            {/* Copyright Notice */}
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} ParentSimple. All rights reserved.
            </p>

            {/* Compliance and Contact Links */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/privacy-policy" className="text-[#1A2B49] hover:underline">
                Privacy Policy
              </Link>
              <span className="text-gray-400">|</span>
              <Link href="/terms-of-service" className="text-[#1A2B49] hover:underline">
                Terms of Use
              </Link>
              <span className="text-gray-400">|</span>
              <Link href="/contact" className="text-[#1A2B49] hover:underline">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
