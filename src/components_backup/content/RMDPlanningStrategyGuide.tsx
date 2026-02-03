'use client'

import React from 'react'
import RMDCalculator from '@/components/calculators/RMDCalculator'
import FullWidthCalculatorEmbed from '@/components/content/FullWidthCalculatorEmbed'

interface RMDPlanningStrategyGuideProps {
  article: any
}

const RMDPlanningStrategyGuide: React.FC<RMDPlanningStrategyGuideProps> = ({ article }) => {
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
        title="RMD Calculator"
        description="Use our interactive calculator to determine your Required Minimum Distributions and plan your withdrawal strategy. Get personalized RMD amounts and explore tax optimization strategies."
      >
        <RMDCalculator />
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
          Ready to Optimize Your RMD Strategy?
        </h3>
        <p className="text-lg mb-6 opacity-90">
          Get personalized RMD planning guidance from our retirement planning experts. 
          We'll help you minimize taxes and maximize your retirement income through strategic RMD planning.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Schedule RMD Consultation
          </button>
          <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors">
            Download RMD Guide
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
              <a href="/content/medicare-cost-calculator" className="text-blue-600 hover:text-blue-800">
                Medicare Cost Calculator
              </a>
            </li>
            <li>
              <a href="/content/tax-impact-calculator" className="text-blue-600 hover:text-blue-800">
                Tax Impact Calculator
              </a>
            </li>
          </ul>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="text-xl font-semibold text-gray-900 mb-4">
            RMD Planning Resources
          </h4>
          <ul className="space-y-2">
            <li>
              <a href="/content/roth-conversion-guide" className="text-blue-600 hover:text-blue-800">
                Roth Conversion Strategy Guide
              </a>
            </li>
            <li>
              <a href="/content/tax-efficient-withdrawals-guide" className="text-blue-600 hover:text-blue-800">
                Tax-Efficient Withdrawal Strategies
              </a>
            </li>
            <li>
              <a href="/content/retirement-income-planning-guide" className="text-blue-600 hover:text-blue-800">
                Retirement Income Planning Guide
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default RMDPlanningStrategyGuide


