'use client'

import React from 'react'
import MedicareCostCalculator from '@/components/calculators/MedicareCostCalculator' // Using Medicare calculator as placeholder for LTC planning
import FullWidthCalculatorEmbed from '@/components/content/FullWidthCalculatorEmbed'

interface LongTermCarePlanningStrategyGuideProps {
  article: any
}

const LongTermCarePlanningStrategyGuide: React.FC<LongTermCarePlanningStrategyGuideProps> = ({ article }) => {
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
        title="Long-Term Care Cost Planning Calculator"
        description="Use our interactive calculator to estimate your long-term care costs, including in-home care, assisted living, and nursing home expenses. Plan for your future care needs and explore funding options."
        theme="purple"
      >
        <MedicareCostCalculator /> {/* Placeholder for dedicated LTC calculator */}
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
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-8 text-white text-center">
        <h3 className="text-2xl font-bold mb-4">
          Ready to Plan Your Long-Term Care?
        </h3>
        <p className="text-lg mb-6 opacity-90">
          Get personalized long-term care planning guidance from our retirement planning experts. 
          We'll help you understand your options, estimate costs, and create a comprehensive care plan for your future.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Schedule LTC Planning Consultation
          </button>
          <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors">
            Download LTC Planning Guide
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
              <a href="/content/healthcare-cost-planning-guide" className="text-blue-600 hover:text-blue-800">
                Healthcare Cost Planning Calculator
              </a>
            </li>
            <li>
              <a href="/content/medicare-cost-calculator" className="text-blue-600 hover:text-blue-800">
                Medicare Cost Calculator
              </a>
            </li>
            <li>
              <a href="/content/social-security-optimization-calculator" className="text-blue-600 hover:text-blue-800">
                Social Security Optimization Calculator
              </a>
            </li>
          </ul>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="text-xl font-semibold text-gray-900 mb-4">
            Long-Term Care Resources
          </h4>
          <ul className="space-y-2">
            <li>
              <a href="/content/healthcare-cost-planning-guide" className="text-blue-600 hover:text-blue-800">
                Healthcare Cost Planning Guide
              </a>
            </li>
            <li>
              <a href="/content/medicare-planning-guide" className="text-blue-600 hover:text-blue-800">
                Medicare Planning Strategy Guide
              </a>
            </li>
            <li>
              <a href="/content/estate-planning-guide" className="text-blue-600 hover:text-blue-800">
                Estate Planning Guide
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default LongTermCarePlanningStrategyGuide


