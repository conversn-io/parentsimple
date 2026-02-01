import React from 'react';
import FullWidthCalculatorEmbed from './FullWidthCalculatorEmbed';
import TaxImpactCalculator from '../calculators/TaxImpactCalculator';

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  table_of_contents: any[];
  meta_title?: string;
  meta_description?: string;
}

interface TaxImpactStrategyGuideProps {
  article: Article;
}

export default function TaxImpactStrategyGuide({ article }: TaxImpactStrategyGuideProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
        <p className="text-xl text-gray-600 mb-6">{article.excerpt}</p>
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span>Reading time: 10 minutes</span>
        </div>
      </div>

      {/* Table of Contents */}
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

      {/* Content */}
      <div 
        className="prose prose-lg max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Full-Width Calculator Embed */}
      <FullWidthCalculatorEmbed 
        title="Tax Impact Calculator"
        description="Calculate the tax impact of different retirement income sources and optimize your tax strategy for retirement."
        theme="blue"
      >
        <TaxImpactCalculator />
      </FullWidthCalculatorEmbed>

      {/* Additional Resources */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Additional Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Related Calculators</h3>
            <ul className="space-y-2 text-blue-600">
              <li><a href="/content/roth-conversion-calculator" className="hover:text-blue-800 underline">Roth Conversion Calculator</a></li>
              <li><a href="/content/rmd-calculator" className="hover:text-blue-800 underline">RMD Calculator</a></li>
              <li><a href="/content/retirement-income-calculator" className="hover:text-blue-800 underline">Retirement Income Calculator</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Related Guides</h3>
            <ul className="space-y-2 text-blue-600">
              <li><a href="/content/retirement-tax-strategy-guide" className="hover:text-blue-800 underline">Retirement Tax Strategy Guide</a></li>
              <li><a href="/content/ira-withdrawal-strategy-guide" className="hover:text-blue-800 underline">IRA Withdrawal Strategy Guide</a></li>
              <li><a href="/content/social-security-optimization-strategy-guide" className="hover:text-blue-800 underline">Social Security Optimization Guide</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
