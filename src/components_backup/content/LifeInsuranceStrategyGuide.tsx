'use client'

import React from 'react'
import LifeInsuranceCalculator from '@/components/calculators/LifeInsuranceCalculator'
import FullWidthCalculatorEmbed from '@/components/content/FullWidthCalculatorEmbed'

interface LifeInsuranceStrategyGuideProps {
  article: {
    title: string;
    excerpt: string;
    content: string; // This will now be pre-processed HTML
  };
}

const LifeInsuranceStrategyGuide: React.FC<LifeInsuranceStrategyGuideProps> = ({ article }) => {
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
        title="Life Insurance Needs Calculator"
        description="Use our interactive calculator to determine the right amount of life insurance coverage for your family's financial security. Get personalized recommendations based on your specific situation."
        theme="blue"
      >
        <LifeInsuranceCalculator />
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

export default LifeInsuranceStrategyGuide


