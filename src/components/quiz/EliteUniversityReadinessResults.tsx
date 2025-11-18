'use client'

import { Button } from '@/components/ui/Button'
import { CheckCircle, AlertCircle, TrendingUp, Target, ArrowRight, BookOpen, Users, Award } from 'lucide-react'

interface EliteUniversityReadinessResultsProps {
  score: number;
  category: string;
  breakdown: {
    academics: number;
    testScores: number;
    extracurriculars: number;
    achievements: number;
    essays: number;
    recommendations: number;
    strategy: number;
    research: number;
    diversity: number;
  };
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  graduationYear?: string;
}

export function EliteUniversityReadinessResults({
  score,
  category,
  breakdown,
  strengths,
  improvements,
  recommendations,
  graduationYear
}: EliteUniversityReadinessResultsProps) {
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

  // Get Empowerly CTA based on score
  const getEmpowerlyCTA = () => {
    if (score >= 85) {
      return {
        title: "You're Elite-Ready!",
        message: "Maximize your acceptance odds with Empowerly's strategic application support. Our counselors have admissions office experience at top universities.",
        cta: "Schedule Free Strategy Consultation",
        href: "https://empowerly.com/consultation"
      };
    } else if (score >= 70) {
      return {
        title: "You're Competitive!",
        message: "Strengthen key areas to boost your profile. Get personalized guidance from Empowerly's expert college counselors.",
        cta: "Get Free Assessment Review",
        href: "https://empowerly.com/consultation"
      };
    } else if (score >= 55) {
      return {
        title: "You Have Potential!",
        message: "Create a roadmap to elite readiness. Empowerly's counselors can help you develop a comprehensive improvement plan.",
        cta: "Schedule Free Consultation",
        href: "https://empowerly.com/consultation"
      };
    } else {
      return {
        title: "Build Your Foundation",
        message: "Let's build a strong foundation for college success. Access Empowerly's educational resources and expert guidance.",
        cta: "Access Free Resources",
        href: "https://empowerly.com/resources"
      };
    }
  };

  const empowerlyCTA = getEmpowerlyCTA();

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

  // Calculate percentage for each category
  const getCategoryPercentage = (value: number, max: number) => {
    return Math.round((value / max) * 100);
  };

  return (
    <div className="min-h-screen bg-[#F9F6EF] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1A2B49] mb-4">
            Your Elite University Readiness Assessment
          </h1>
          <p className="text-lg md:text-xl text-gray-700">
            Based on 2025 admissions trends and data from top publications
          </p>
        </div>

        {/* Score Display */}
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

          {/* Top Empowerly CTA */}
          <div className="bg-gradient-to-r from-[#1A2B49] to-[#152238] rounded-2xl shadow-xl p-6 sm:p-8 text-white">
            <div className="text-center mb-6">
              <h2
                className="text-3xl font-serif font-bold drop-shadow mb-4"
                style={{ color: '#ffffff' }}
              >
                {empowerlyCTA.title}
              </h2>
              <p className="text-lg text-gray-100 leading-relaxed max-w-2xl mx-auto">
                {empowerlyCTA.message}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                variant="primary"
                size="lg"
                href={empowerlyCTA.href}
                className="bg-white text-[#1A2B49] hover:bg-gray-100 min-w-[250px]"
              >
                {empowerlyCTA.cta}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                href="https://empowerly.com/resources"
                className="border-white text-white hover:bg-white/10 min-w-[250px]"
              >
                Access Resource Library
              </Button>
            </div>
            <p className="text-center text-sm text-gray-300 mt-6">
              Empowerly's counselors have admissions office experience at top universities including Harvard, Yale, MIT, and more.
            </p>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-serif font-bold text-[#1A2B49] mb-6">Category Breakdown</h2>
          <div className="space-y-6">
            {[
              { label: 'Academic Performance', value: breakdown.academics, max: 25, icon: BookOpen },
              { label: 'Standardized Test Scores', value: breakdown.testScores, max: 20, icon: Award },
              { label: 'Extracurricular Involvement', value: breakdown.extracurriculars, max: 20, icon: Users },
              { label: 'Unique Achievements', value: breakdown.achievements, max: 10, icon: Award },
              { label: 'Essays & Application', value: breakdown.essays, max: 10, icon: BookOpen },
              { label: 'Recommendations', value: breakdown.recommendations, max: 5, icon: Users },
              { label: 'Application Strategy', value: breakdown.strategy, max: 5, icon: Target },
              { label: 'Research & Internships', value: breakdown.research, max: 3, icon: TrendingUp },
              { label: 'Diversity Factors', value: breakdown.diversity, max: 2, icon: Users },
            ].map((category, index) => {
              const Icon = category.icon;
              const percentage = getCategoryPercentage(category.value, category.max);
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-[#9DB89D]" />
                      <span className="font-semibold text-gray-800">{category.label}</span>
                    </div>
                    <span className="font-bold text-[#1A2B49]">{category.value}/{category.max}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-[#9DB89D] h-3 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Strengths */}
        {strengths.length > 0 && (
          <div className="bg-green-50 rounded-2xl shadow-xl p-8 mb-8 border-2 border-green-200">
            <h2 className="text-2xl font-serif font-bold text-green-800 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6" />
              Strengths
            </h2>
            <ul className="space-y-3">
              {strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-3 text-green-700">
                  <span className="text-green-500 font-bold mt-1">✓</span>
                  <span className="text-lg">{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Areas for Improvement */}
        {improvements.length > 0 && (
          <div className="bg-yellow-50 rounded-2xl shadow-xl p-8 mb-8 border-2 border-yellow-200">
            <h2 className="text-2xl font-serif font-bold text-yellow-800 mb-4 flex items-center gap-2">
              <Target className="w-6 h-6" />
              Areas for Improvement
            </h2>
            <ul className="space-y-3">
              {improvements.map((improvement, index) => (
                <li key={index} className="flex items-start gap-3 text-yellow-700">
                  <span className="text-yellow-500 font-bold mt-1">→</span>
                  <span className="text-lg">{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Personalized Recommendations */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-serif font-bold text-[#1A2B49] mb-6">Personalized Recommendations</h2>
          <div className="space-y-4">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-[#F9F6EF] rounded-lg">
                <ArrowRight className="w-5 h-5 text-[#9DB89D] mt-1 flex-shrink-0" />
                <p className="text-gray-700 text-lg leading-relaxed">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Empowerly CTA */}
        <div className="bg-gradient-to-r from-[#1A2B49] to-[#152238] rounded-2xl shadow-xl p-8 text-white">
          <div className="text-center mb-6">
            <h2
              className="text-3xl font-serif font-bold drop-shadow mb-4"
              style={{ color: '#ffffff' }}
            >
              {empowerlyCTA.title}
            </h2>
            <p className="text-lg text-gray-100 leading-relaxed max-w-2xl mx-auto">
              {empowerlyCTA.message}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              variant="primary"
              size="lg"
              href={empowerlyCTA.href}
              className="bg-white text-[#1A2B49] hover:bg-gray-100 min-w-[250px]"
            >
              {empowerlyCTA.cta}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              href="https://empowerly.com/resources"
              className="border-white text-white hover:bg-white/10 min-w-[250px]"
            >
              Access Resource Library
            </Button>
          </div>
          <p className="text-center text-sm text-gray-300 mt-6">
            Empowerly's counselors have admissions office experience at top universities including Harvard, Yale, MIT, and more.
          </p>
        </div>

        {/* Additional Resources */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Want to learn more about elite university admissions?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="outline"
              href="/college-planning"
              className="border-[#1A2B49] text-[#1A2B49] hover:bg-[#1A2B49] hover:text-white"
            >
              College Planning Resources
            </Button>
            <Button
              variant="outline"
              href="/financial-planning"
              className="border-[#1A2B49] text-[#1A2B49] hover:bg-[#1A2B49] hover:text-white"
            >
              Financial Planning Guide
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

