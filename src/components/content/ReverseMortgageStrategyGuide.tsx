'use client'

import React from 'react'
import ReverseMortgageCalculator from '@/components/calculators/ReverseMortgageCalculator'
import FullWidthCalculatorEmbed from '@/components/content/FullWidthCalculatorEmbed'

interface ReverseMortgageStrategyGuideProps {
  article: {
    title: string;
    excerpt: string;
    content: string; // This will now be pre-processed HTML
  };
}

const ReverseMortgageStrategyGuide: React.FC<ReverseMortgageStrategyGuideProps> = ({ article }) => {
  // Split the content at the placeholder to insert the React component
  const contentParts = article.content.split('<div id="calculator-embed-point"></div>');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
        <p className="text-xl text-gray-600 leading-relaxed">{article.excerpt}</p>
      </header>

      {/* Article Content - First Part */}
      <div className="prose prose-lg max-w-none mb-12">
        <div
          className="prose-content"
          dangerouslySetInnerHTML={{ __html: contentParts[0] }}
        />
      </div>

      {/* Embedded Calculator Section - Rendered by React */}
      <FullWidthCalculatorEmbed
        title="Reverse Mortgage Calculator"
        description="Use our interactive calculator to discover how much you could receive from a reverse mortgage based on your age, home value, and current market rates."
        theme="purple"
      >
        <ReverseMortgageCalculator />
      </FullWidthCalculatorEmbed>

      {/* Article Content - Second Part */}
      {contentParts[1] && (
        <div className="prose prose-lg max-w-none mt-12">
          <div
            className="prose-content"
            dangerouslySetInnerHTML={{ __html: contentParts[1] }}
          />
        </div>
      )}
    </div>
  )
}

export default ReverseMortgageStrategyGuide


