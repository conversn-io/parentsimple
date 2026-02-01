'use client'

import React from 'react'
import DownsizingCalculator from '@/components/calculators/DownsizingCalculator'
import FullWidthCalculatorEmbed from '@/components/content/FullWidthCalculatorEmbed'

interface DownsizingStrategyGuideProps {
  article: {
    title: string;
    excerpt: string;
    content: string; // This will now be pre-processed HTML
  };
}

const DownsizingStrategyGuide: React.FC<DownsizingStrategyGuideProps> = ({ article }) => {
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
        title="Downsizing Calculator"
        description="Use our interactive calculator to analyze the financial impact of downsizing your home in retirement. Calculate potential savings, costs, and long-term benefits."
        theme="orange"
      >
        <DownsizingCalculator />
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

export default DownsizingStrategyGuide


