"use client";

import { CheckCircle, TrendingUp, Shield, DollarSign } from 'lucide-react';

interface QuizResultsProps {
  answers: Record<string, any>;
  onRestart: () => void;
}

export const QuizResults = ({ answers, onRestart }: QuizResultsProps) => {
  // Simple results display - in a real app, this would be more sophisticated
  const hasAssets = answers.investableAssets === 'Yes, I have $100,000 or more';
  const retirementSavings = answers.retirementSavings;
  const retirementTimeline = answers.retirementTimeline;

  const getRecommendation = () => {
    if (hasAssets) {
      if (retirementTimeline === 'Already retired' || retirementTimeline === 'Within 1-2 years') {
        return {
          title: 'Immediate Annuity Strategy',
          description: 'Perfect for those ready to start receiving guaranteed income immediately.',
          icon: DollarSign,
          benefits: ['Immediate Income', 'Guaranteed Payments', 'Longevity Protection', 'Tax Advantages']
        };
      } else if (retirementTimeline === '3-5 years') {
        return {
          title: 'Fixed Index Annuity',
          description: 'Ideal for conservative investors seeking principal protection with growth potential.',
          icon: Shield,
          benefits: ['Principal Protection', 'Growth Potential', 'Tax Deferral', 'Income Riders']
        };
      } else {
        return {
          title: 'Variable Annuity Strategy',
          description: 'Great for investors wanting market participation with downside protection.',
          icon: TrendingUp,
          benefits: ['Market Participation', 'Downside Protection', 'Income Options', 'Tax Deferral']
        };
      }
    } else {
      return {
        title: 'Growth-Focused Strategy',
        description: 'Focus on building your assets first with a diversified investment approach.',
        icon: TrendingUp,
        benefits: ['Asset Building', 'Diversification', 'Growth Focus', 'Lower Fees']
      };
    }
  };

  const recommendation = getRecommendation();
  const IconComponent = recommendation.icon;

  // Calculate projected income based on savings
  const getProjectedIncome = () => {
    switch (retirementSavings) {
      case '$1,000,000+':
        return { min: 4000, max: 6000 };
      case '$750,000 - $999,999':
        return { min: 3000, max: 4500 };
      case '$500,000 - $749,999':
        return { min: 2000, max: 3500 };
      case '$250,000 - $499,999':
        return { min: 1000, max: 2500 };
      case '$100,000 - $249,999':
        return { min: 500, max: 1500 };
      default:
        return { min: 300, max: 800 };
    }
  };

  const projectedIncome = getProjectedIncome();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-[#36596A] mb-2">Your Personalized Retirement Strategy</h1>
        <p className="text-gray-600 text-lg">Based on your answers, here's what we recommend for your retirement planning.</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <IconComponent className="w-12 h-12 text-[#36596A]" />
          </div>
          <h2 className="text-2xl font-bold text-[#36596A] mb-2">{recommendation.title}</h2>
          <p className="text-gray-600 text-lg">{recommendation.description}</p>
        </div>
        
        <div className="space-y-4 mb-8">
          <h3 className="font-semibold text-gray-900 text-lg">Key Benefits:</h3>
          {recommendation.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">{benefit}</span>
            </div>
          ))}
        </div>

        {hasAssets && (
          <div className="bg-[#F5F5F0] rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-[#36596A] text-lg mb-2">Projected Monthly Income</h3>
            <p className="text-2xl font-bold text-[#36596A]">
              ${projectedIncome.min.toLocaleString()} - ${projectedIncome.max.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-1">Based on your current retirement savings</p>
          </div>
        )}
      </div>

      <div className="text-center space-y-6">
        <p className="text-gray-600 text-lg">
          Ready to learn more about your personalized retirement strategy?
        </p>
        
        <div className="space-y-4">
          <button className="w-full bg-[#36596A] text-white py-4 px-8 rounded-lg font-medium text-lg hover:bg-[#2a4a5a] transition-colors">
            Get Your Free Consultation
          </button>
          
          <button 
            onClick={onRestart} 
            className="w-full border-2 border-[#36596A] text-[#36596A] py-3 px-6 rounded-lg font-medium hover:bg-[#36596A] hover:text-white transition-colors"
          >
            Retake Quiz
          </button>
        </div>

        <div className="text-sm text-gray-500 max-w-2xl mx-auto">
          <p>
            This analysis is for educational purposes only and should not be considered as financial advice. 
            Please consult with a qualified financial advisor before making any investment decisions.
          </p>
        </div>
      </div>
    </div>
  );
};






