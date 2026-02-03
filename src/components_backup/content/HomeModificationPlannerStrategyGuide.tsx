'use client';

import React from 'react';
import HomeModificationPlannerCalculator from '@/components/calculators/HomeModificationPlannerCalculator';
import FullWidthCalculatorEmbed from '@/components/content/FullWidthCalculatorEmbed';

interface HomeModificationPlannerStrategyGuideProps {
  article: any;
}

const HomeModificationPlannerStrategyGuide: React.FC<HomeModificationPlannerStrategyGuideProps> = ({ article }) => {
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

      {/* Home Modification Planner Calculator Embed */}
      <FullWidthCalculatorEmbed
        title="Home Modification Planner Calculator"
        description="Plan and budget for home modifications to age in place safely and comfortably. This calculator helps you estimate costs and prioritize modifications based on your needs and budget."
        theme="orange"
      >
        <HomeModificationPlannerCalculator />
      </FullWidthCalculatorEmbed>

      {/* Additional Resources */}
      <div className="mt-12 grid md:grid-cols-2 gap-8">
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="text-xl font-semibold text-gray-900 mb-4">
            Related Calculators
          </h4>
          <ul className="space-y-2">
            <li>
              <a href="/content/reverse-mortgage-calculator" className="text-blue-600 hover:text-blue-800">
                Reverse Mortgage Calculator
              </a>
            </li>
            <li>
              <a href="/content/home-equity-calculator" className="text-blue-600 hover:text-blue-800">
                Home Equity Calculator
              </a>
            </li>
            <li>
              <a href="/content/downsizing-calculator" className="text-blue-600 hover:text-blue-800">
                Downsizing Calculator
              </a>
            </li>
            <li>
              <a href="/content/long-term-care-calculator" className="text-blue-600 hover:text-blue-800">
                Long-Term Care Calculator
              </a>
            </li>
          </ul>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="text-xl font-semibold text-gray-900 mb-4">
            Aging in Place Resources
          </h4>
          <ul className="space-y-2">
            <li>
              <a href="/content/reverse-mortgage-strategy-guide" className="text-blue-600 hover:text-blue-800">
                Reverse Mortgage Strategy Guide
              </a>
            </li>
            <li>
              <a href="/content/home-equity-strategy-guide" className="text-blue-600 hover:text-blue-800">
                Home Equity Strategy Guide
              </a>
            </li>
            <li>
              <a href="/content/downsizing-strategy-guide" className="text-blue-600 hover:text-blue-800">
                Downsizing Strategy Guide
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
  );
};

export default HomeModificationPlannerStrategyGuide;
