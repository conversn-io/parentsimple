'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, AlertCircle, TrendingUp, Target } from 'lucide-react'
import { EmpowerlyCTASection } from '@/components/empowerly/EmpowerlyCTASection'
import Link from 'next/link'

interface EliteUniversityReadinessResultsVideoProps {
  score: number;
  category: string;
}

export function EliteUniversityReadinessResultsVideo({
  score,
  category,
}: EliteUniversityReadinessResultsVideoProps) {
  const router = useRouter()
  const [hasQuizData, setHasQuizData] = useState(true)

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
      <div className="bg-green-50 border-b border-green-200 py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
          <p className="text-green-800 font-semibold text-lg">
            Your full PDF assessment is on its way to your inbox!
          </p>
        </div>
      </div>

      {/* Pre-Header (for users who didn't take quiz) */}
      {!hasQuizData && (
        <div className="bg-blue-50 border-b border-blue-200 py-4 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-blue-800">
              Didn't take the quiz yet?{' '}
              <Link href="/quiz/elite-university-readiness" className="font-semibold underline hover:text-blue-900">
                Take the Elite University Readiness Assessment
              </Link>
            </p>
          </div>
        </div>
      )}

      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1A2B49] mb-4">
              Your Elite University Readiness Results
            </h1>
          </div>

          {/* Score & Category Display */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full text-white mb-6 ${scoreVisuals.circleBg}`}>
                <span className="text-5xl font-bold">{score}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div 
                  className={`h-4 rounded-full transition-all duration-500 ${scoreVisuals.barBg}`}
                  style={{ width: `${Math.min(score, 100)}%` }}
                />
              </div>
              <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 ${badge.bg} ${badge.text} ${badge.border}`}>
                <IconComponent className="w-5 h-5" />
                <span className="font-bold text-lg">{category}</span>
              </div>
            </div>
          </div>

          {/* Video Headline */}
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1A2B49]">
              Here's What That Means...
            </h2>
          </div>

          {/* Video Embed */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
              <iframe
                src="https://player.vimeo.com/video/1152285178?title=0&byline=0&portrait=0&autoplay=0"
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="Elite University Readiness Results Analysis"
              />
            </div>
          </div>

          {/* CTA Section Below Video */}
          <EmpowerlyCTASection 
            title="What to expect on the call with a college counselor?"
            showLogo={true}
            logoPosition="above-title"
          />
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

