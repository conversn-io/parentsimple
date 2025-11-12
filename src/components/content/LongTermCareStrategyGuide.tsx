'use client';

import React from 'react';
import { Shield, CheckCircle, AlertTriangle, DollarSign, Clock, Users, FileText, Calculator, Home, Building } from 'lucide-react';
import FullWidthCalculatorEmbed from './FullWidthCalculatorEmbed';
import LongTermCareCalculator from '../calculators/LongTermCareCalculator';

interface LongTermCareStrategyGuideProps {
  article: {
    title: string;
    content: string;
    meta_description?: string;
    featured_image_url?: string;
    reading_time?: number;
    table_of_contents?: string[];
  };
}

const LongTermCareStrategyGuide: React.FC<LongTermCareStrategyGuideProps> = ({ article }) => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <Shield className="h-12 w-12 text-blue-600 mr-4" />
          <h1 className="text-4xl font-bold text-gray-900">{article.title}</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive guide to long-term care planning and insurance for retirement security
        </p>
        <div className="flex justify-center items-center space-x-6 mt-6 text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <span>{article.reading_time || 18} min read</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            <span>All Levels</span>
          </div>
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            <span>Strategy Guide</span>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      {article.table_of_contents && article.table_of_contents.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-800 mb-4">Table of Contents</h2>
          <ul className="space-y-2">
            {article.table_of_contents.map((item: any, index) => (
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

      {/* Calculator Embed */}
      <FullWidthCalculatorEmbed
        title="Long-Term Care Insurance Calculator"
        description="Estimate your long-term care insurance needs and costs based on your location and preferences"
        theme="green"
      >
        <LongTermCareCalculator />
      </FullWidthCalculatorEmbed>

      {/* Care Options */}
      <div className="mt-12 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Home className="h-6 w-6 text-green-600 mr-3" />
          Long-Term Care Options
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center mb-4">
              <Home className="h-8 w-8 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Home Care</h3>
            </div>
            <p className="text-gray-600 mb-4">Care provided in your own home by professional caregivers.</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Most cost-effective option</li>
              <li>• Maintains independence</li>
              <li>• Family involvement</li>
              <li>• Average cost: $280/day</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center mb-4">
              <Building className="h-8 w-8 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Assisted Living</h3>
            </div>
            <p className="text-gray-600 mb-4">Residential care with assistance for daily activities.</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Social environment</li>
              <li>• Professional care</li>
              <li>• Limited independence</li>
              <li>• Average cost: $350/day</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center mb-4">
              <Shield className="h-8 w-8 text-purple-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">Nursing Home</h3>
            </div>
            <p className="text-gray-600 mb-4">24/7 skilled nursing care for complex medical needs.</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Highest level of care</li>
              <li>• Medical supervision</li>
              <li>• Limited privacy</li>
              <li>• Average cost: $400/day</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Cost Factors */}
      <div className="mt-8 bg-white border border-gray-200 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <DollarSign className="h-6 w-6 text-green-600 mr-3" />
          Factors Affecting Long-Term Care Costs
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Geographic Location</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Urban areas typically cost more than rural areas</li>
              <li>• State regulations affect pricing</li>
              <li>• Cost of living impacts care costs</li>
              <li>• Availability of providers affects competition</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Care Level Required</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Basic assistance vs. skilled nursing</li>
              <li>• Memory care for dementia</li>
              <li>• Specialized medical needs</li>
              <li>• Duration of care needed</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Insurance Benefits */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Long-Term Care Insurance Benefits</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              Key Advantages
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Protects retirement savings from care costs</li>
              <li>• Provides choice in care settings</li>
              <li>• Reduces burden on family members</li>
              <li>• Tax-qualified policies offer tax benefits</li>
              <li>• Peace of mind for the future</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
              Important Considerations
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Premiums can increase over time</li>
              <li>• Coverage may not cover all costs</li>
              <li>• Elimination periods create out-of-pocket exposure</li>
              <li>• Health requirements for approval</li>
              <li>• Limited number of insurers offering coverage</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Steps */}
      <div className="mt-8 bg-white border border-gray-200 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Long-Term Care Planning Action Plan</h2>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0 mt-1">1</div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Assess Your Risk</h3>
              <p className="text-gray-600">Consider your family history, health status, and lifestyle factors that affect long-term care risk.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0 mt-1">2</div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Calculate Your Needs</h3>
              <p className="text-gray-600">Use the calculator above to estimate your potential long-term care costs and insurance needs.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0 mt-1">3</div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Explore Options</h3>
              <p className="text-gray-600">Research traditional LTC insurance, hybrid policies, and self-insurance strategies.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0 mt-1">4</div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Get Professional Guidance</h3>
              <p className="text-gray-600">Consult with a qualified insurance professional to review your options and make informed decisions.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start">
          <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">Important Disclaimer</h3>
            <p className="text-sm text-yellow-700">
              This guide provides general information about long-term care planning and should not be considered personalized financial advice. 
              Long-term care needs and costs vary greatly based on individual circumstances, location, and health status. 
              Consult with a qualified insurance professional before making any long-term care decisions. 
              Policy terms, coverage options, and premiums vary by insurer and are subject to underwriting approval.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LongTermCareStrategyGuide;
