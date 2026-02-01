'use client';

import React from 'react';
import WithdrawalPlannerCalculator from '@/components/calculators/WithdrawalPlannerCalculator';
import FullWidthCalculatorEmbed from '@/components/content/FullWidthCalculatorEmbed';

interface WithdrawalPlannerStrategyGuideProps {
  article: any;
}

const WithdrawalPlannerStrategyGuide: React.FC<WithdrawalPlannerStrategyGuideProps> = ({ article }) => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Article Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
        <p className="text-xl text-gray-600 mb-6">{article.excerpt}</p>
        {article.reading_time && (
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span>Reading time: {article.reading_time} minutes</span>
          </div>
        )}
      </div>

      {/* Table of Contents */}
      {article.table_of_contents && article.table_of_contents.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-800 mb-4">Table of Contents</h2>
          <ul className="space-y-2">
            {article.table_of_contents.map((item: any, index: number) => (
              <li key={index} className="text-blue-700">
                <a href={`#${typeof item === 'string' ? `section-${index + 1}` : item.id}`} className="hover:text-blue-900 underline">
                  {typeof item === 'string' ? item : item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Article Content */}
      <div 
        className="prose prose-lg max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Withdrawal Planner Calculator Embed */}
      <FullWidthCalculatorEmbed
        title="Retirement Withdrawal Planner Calculator"
        description="Plan your retirement withdrawals strategically to minimize taxes and maximize your retirement income. This calculator helps you optimize your withdrawal strategy across different account types."
        theme="green"
      >
        <WithdrawalPlannerCalculator />
      </FullWidthCalculatorEmbed>

      {/* Additional Resources */}
      <div className="mt-12 grid md:grid-cols-2 gap-8">
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="text-xl font-semibold text-gray-900 mb-4">
            Related Calculators
          </h4>
          <ul className="space-y-2">
            <li>
              <a href="/content/rmd-calculator" className="text-blue-600 hover:text-blue-800">
                RMD Calculator
              </a>
            </li>
            <li>
              <a href="/content/roth-conversion-calculator" className="text-blue-600 hover:text-blue-800">
                Roth Conversion Calculator
              </a>
            </li>
            <li>
              <a href="/content/tax-efficient-withdrawals-calculator" className="text-blue-600 hover:text-blue-800">
                Tax-Efficient Withdrawals Calculator
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
            Withdrawal Planning Resources
          </h4>
          <ul className="space-y-2">
            <li>
              <a href="/content/tax-efficient-withdrawals-strategy-guide" className="text-blue-600 hover:text-blue-800">
                Tax-Efficient Withdrawal Strategies
              </a>
            </li>
            <li>
              <a href="/content/rmd-planning-guide" className="text-blue-600 hover:text-blue-800">
                RMD Planning Guide
              </a>
            </li>
            <li>
              <a href="/content/roth-conversion-guide" className="text-blue-600 hover:text-blue-800">
                Roth Conversion Strategy Guide
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
  );
};

export default WithdrawalPlannerStrategyGuide;
