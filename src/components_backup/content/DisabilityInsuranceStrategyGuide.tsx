'use client';

import React from 'react';
import { Shield, CheckCircle, AlertTriangle, DollarSign, Clock, Users, FileText, Calculator } from 'lucide-react';
import FullWidthCalculatorEmbed from './FullWidthCalculatorEmbed';
import DisabilityInsuranceCalculator from '../calculators/DisabilityInsuranceCalculator';

interface DisabilityInsuranceStrategyGuideProps {
  article: {
    title: string;
    content: string;
    meta_description?: string;
    featured_image_url?: string;
    reading_time?: number;
    table_of_contents?: string[];
  };
}

const DisabilityInsuranceStrategyGuide: React.FC<DisabilityInsuranceStrategyGuideProps> = ({ article }) => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <Shield className="h-12 w-12 text-blue-600 mr-4" />
          <h1 className="text-4xl font-bold text-gray-900">{article.title}</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive guide to disability insurance planning for retirement security
        </p>
        <div className="flex justify-center items-center space-x-6 mt-6 text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <span>{article.reading_time || 15} min read</span>
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
        title="Disability Insurance Calculator"
        description="Calculate your disability insurance needs and get personalized recommendations"
        theme="blue"
      >
        <DisabilityInsuranceCalculator />
      </FullWidthCalculatorEmbed>

      {/* Additional Resources */}
      <div className="mt-12 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Calculator className="h-6 w-6 text-blue-600 mr-3" />
          Key Disability Insurance Considerations
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              When You Need Coverage
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>• You have dependents who rely on your income</li>
              <li>• You have significant debt obligations</li>
              <li>• Your employer doesn't provide adequate coverage</li>
              <li>• You're self-employed or a business owner</li>
              <li>• You have a high-risk occupation</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
              Coverage Options
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Short-term disability (3-6 months)</li>
              <li>• Long-term disability (2+ years)</li>
              <li>• Own-occupation vs. any-occupation coverage</li>
              <li>• Elimination periods (30-365 days)</li>
              <li>• Benefit periods (2 years to age 65)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Cost Factors */}
      <div className="mt-8 bg-white border border-gray-200 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <DollarSign className="h-6 w-6 text-green-600 mr-3" />
          Factors Affecting Premium Costs
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-3">Personal Factors</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Age and gender</li>
              <li>• Health status</li>
              <li>• Occupation risk level</li>
              <li>• Income level</li>
            </ul>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-3">Coverage Features</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Benefit amount</li>
              <li>• Elimination period</li>
              <li>• Benefit period</li>
              <li>• Inflation protection</li>
            </ul>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="font-semibold text-purple-800 mb-3">Policy Features</h3>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Own-occupation definition</li>
              <li>• Partial disability benefits</li>
              <li>• Future increase options</li>
              <li>• Non-cancelable guarantees</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Steps */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Disability Insurance Action Plan</h2>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0 mt-1">1</div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Assess Your Current Coverage</h3>
              <p className="text-gray-600">Review employer-provided disability benefits and identify coverage gaps.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0 mt-1">2</div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Calculate Your Needs</h3>
              <p className="text-gray-600">Use the calculator above to determine your optimal coverage amount and features.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0 mt-1">3</div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Compare Policies</h3>
              <p className="text-gray-600">Get quotes from multiple insurers and compare coverage features and costs.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0 mt-1">4</div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Review Regularly</h3>
              <p className="text-gray-600">Reassess your coverage needs annually or when your circumstances change.</p>
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
              This guide provides general information about disability insurance and should not be considered personalized financial advice. 
              Disability insurance needs vary greatly based on individual circumstances, occupation, and financial situation. 
              Consult with a qualified insurance professional before making any insurance decisions. 
              Policy terms, coverage options, and premiums vary by insurer and are subject to underwriting approval.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisabilityInsuranceStrategyGuide;