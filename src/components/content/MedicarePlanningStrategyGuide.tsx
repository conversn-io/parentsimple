'use client'

import React from 'react'
import MedicareCostCalculator from '@/components/calculators/MedicareCostCalculator'
import FullWidthCalculatorEmbed from '@/components/content/FullWidthCalculatorEmbed'

interface MedicarePlanningStrategyGuideProps {
  article: any
}

const MedicarePlanningStrategyGuide: React.FC<MedicarePlanningStrategyGuideProps> = ({ article }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Article Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {article.title}
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          {article.excerpt}
        </p>
      </header>

      {/* Article Content - First Part */}
      <div className="prose prose-lg max-w-none mb-12">
        <div 
          className="prose-content"
          dangerouslySetInnerHTML={{ 
            __html: article.content.split('[EMBEDDED CALCULATOR WILL APPEAR HERE]')[0]
          }} 
        />
      </div>

      {/* Full-Width Calculator Section */}
      <FullWidthCalculatorEmbed
        title="Medicare Cost Calculator"
        description="Use our interactive calculator to estimate your Medicare costs and plan for healthcare expenses in retirement. Get personalized estimates based on your income, location, and coverage choices."
      >
        <MedicareCostCalculator />
      </FullWidthCalculatorEmbed>

      {/* Article Content - Second Part */}
      <div className="prose prose-lg max-w-none mb-12">
        <div 
          className="prose-content"
          dangerouslySetInnerHTML={{ 
            __html: article.content.split('[EMBEDDED CALCULATOR WILL APPEAR HERE]')[1]
          }} 
        />
      </div>

      {/* Call-to-Action Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white text-center">
        <h3 className="text-2xl font-bold mb-4">
          Ready to Plan Your Medicare Strategy?
        </h3>
        <p className="text-lg mb-6 opacity-90">
          Get personalized guidance from our Medicare planning experts. 
          We'll help you navigate the complexities of Medicare and create a comprehensive healthcare strategy.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Schedule Free Consultation
          </button>
          <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
            Download Medicare Guide
          </button>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="mt-12 grid md:grid-cols-2 gap-8">
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="text-xl font-semibold text-gray-900 mb-4">
            Related Calculators
          </h4>
          <ul className="space-y-2">
            <li>
              <a href="/content/social-security-optimization-calculator" className="text-blue-600 hover:text-blue-800">
                Social Security Optimization Calculator
              </a>
            </li>
            <li>
              <a href="/content/tax-impact-calculator" className="text-blue-600 hover:text-blue-800">
                Tax Impact Calculator
              </a>
            </li>
            <li>
              <a href="/content/rmd-calculator" className="text-blue-600 hover:text-blue-800">
                RMD Calculator
              </a>
            </li>
          </ul>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="text-xl font-semibold text-gray-900 mb-4">
            Additional Resources
          </h4>
          <ul className="space-y-2">
            <li>
              <a href="/content/retirement-planning-guide" className="text-blue-600 hover:text-blue-800">
                Complete Retirement Planning Guide
              </a>
            </li>
            <li>
              <a href="/content/healthcare-cost-planning-guide" className="text-blue-600 hover:text-blue-800">
                Healthcare Cost Planning Guide
              </a>
            </li>
            <li>
              <a href="/content/long-term-care-planning-guide" className="text-blue-600 hover:text-blue-800">
                Long-Term Care Planning Guide
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default MedicarePlanningStrategyGuide


