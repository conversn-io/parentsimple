'use client'

import { CheckCircle, AlertCircle, TrendingUp, Target } from 'lucide-react'
import { EmpowerlyCTASection } from '@/components/empowerly/EmpowerlyCTASection'

interface EliteUniversityReadinessResultsSimplifiedProps {
  score: number;
  category: string;
}

export function EliteUniversityReadinessResultsSimplified({
  score,
  category,
}: EliteUniversityReadinessResultsSimplifiedProps) {
  // Determine category badge styling
  const getCategoryBadge = () => {
    switch (category) {
      case 'Elite Ready':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-300',
          icon: CheckCircle,
          message: 'Your child is well-positioned for elite university admissions!'
        };
      case 'Competitive':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          border: 'border-blue-300',
          icon: TrendingUp,
          message: 'Your child has a strong foundation for elite admissions.'
        };
      case 'Developing':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          border: 'border-yellow-300',
          icon: Target,
          message: 'Your child shows promise but needs focused development.'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-300',
          icon: AlertCircle,
          message: 'Build a comprehensive improvement plan for college success.'
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
      {/* Announcement Bar */}
      <div className="bg-green-50 border-b border-green-200 py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
          <p className="text-green-800 font-semibold text-lg">
            Your full PDF assessment is on its way to your inbox!
          </p>
        </div>
      </div>

      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
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
              <p className={`mt-4 text-lg ${scoreVisuals.text}`}>{badge.message}</p>
            </div>
          </div>

          {/* Transition Subheadline */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1A2B49]">
              Get Expert Guidance for Your College Journey
            </h2>
          </div>

          {/* Empowerly Section */}
          <EmpowerlyCTASection 
            title="Schedule Your Free Consultation with Empowerly"
            showLogo={true}
            logoPosition="top"
          />
        </div>
      </div>
    </div>
  );
}

