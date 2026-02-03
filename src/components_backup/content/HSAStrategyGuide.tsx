'use client';

import React from 'react';
import { Shield, CheckCircle, AlertTriangle, DollarSign, TrendingUp, Users, FileText, Calculator, Target, Calendar } from 'lucide-react';
import FullWidthCalculatorEmbed from './FullWidthCalculatorEmbed';
import HSAStrategyCalculator from '../calculators/HSAStrategyCalculator';

interface HSAStrategyGuideProps {
  article: {
    title: string;
    content: string;
    meta_description?: string;
    featured_image_url?: string;
    reading_time?: number;
    table_of_contents?: string[];
  };
}

const HSAStrategyGuide: React.FC<HSAStrategyGuideProps> = ({ article }) => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <Shield className="h-12 w-12 text-blue-600 mr-4" />
          <h1 className="text-4xl font-bold text-gray-900">{article.title}</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Maximize your Health Savings Account benefits for retirement healthcare planning
        </p>
        <div className="flex justify-center items-center space-x-6 mt-6 text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
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
        title="HSA Strategy Calculator"
        description="Maximize your Health Savings Account benefits for retirement healthcare planning"
        theme="purple"
      >
        <HSAStrategyCalculator />
      </FullWidthCalculatorEmbed>

      {/* HSA Benefits */}
      <div className="mt-12 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Shield className="h-6 w-6 text-blue-600 mr-3" />
          HSA Triple Tax Advantage
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-center mb-4">
              <DollarSign className="h-8 w-8 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold text-green-800">Tax Deductible</h3>
            </div>
            <p className="text-green-700">Contributions reduce your current taxable income, providing immediate tax savings.</p>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-blue-800">Tax-Free Growth</h3>
            </div>
            <p className="text-blue-700">Earnings and interest grow without taxation, maximizing your investment returns.</p>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <div className="flex items-center mb-4">
              <Shield className="h-8 w-8 text-purple-600 mr-3" />
              <h3 className="text-lg font-semibold text-purple-800">Tax-Free Withdrawals</h3>
            </div>
            <p className="text-purple-700">No taxes on qualified medical expenses, providing maximum value for healthcare costs.</p>
          </div>
        </div>
      </div>

      {/* Contribution Limits */}
      <div className="mt-8 bg-white border border-gray-200 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Target className="h-6 w-6 text-green-600 mr-3" />
          2024 HSA Contribution Limits
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Limits</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b">
                <span className="font-medium">Self-Only Coverage</span>
                <span className="text-xl font-bold text-green-600">$4,150</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="font-medium">Family Coverage</span>
                <span className="text-xl font-bold text-green-600">$8,300</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="font-medium">Catch-Up (Age 55+)</span>
                <span className="text-xl font-bold text-blue-600">+$1,000</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Strategic Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</div>
                <div>
                  <h4 className="font-medium text-gray-800">Working Years</h4>
                  <p className="text-sm text-gray-600">Maximize contributions and invest for growth</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</div>
                <div>
                  <h4 className="font-medium text-gray-800">Age 55+</h4>
                  <p className="text-sm text-gray-600">Add catch-up contributions for extra savings</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</div>
                <div>
                  <h4 className="font-medium text-gray-800">Retirement</h4>
                  <p className="text-sm text-gray-600">Use for healthcare expenses and Medicare premiums</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Strategy */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">HSA Investment Strategy by Age</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
              Ages 20-45: Aggressive Growth
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Stocks/Equity Funds</span>
                <span className="font-bold text-green-600">80-90%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bonds</span>
                <span className="font-bold text-green-600">10-20%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cash</span>
                <span className="font-bold text-green-600">0-5%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Target className="h-5 w-5 text-blue-600 mr-2" />
              Ages 45-60: Balanced Growth
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Stocks/Equity Funds</span>
                <span className="font-bold text-blue-600">60-70%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bonds</span>
                <span className="font-bold text-blue-600">25-35%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cash</span>
                <span className="font-bold text-blue-600">5-10%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Shield className="h-5 w-5 text-purple-600 mr-2" />
              Ages 60+: Conservative
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Stocks/Equity Funds</span>
                <span className="font-bold text-purple-600">40-50%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bonds</span>
                <span className="font-bold text-purple-600">40-50%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cash</span>
                <span className="font-bold text-purple-600">10-20%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Steps */}
      <div className="mt-8 bg-white border border-gray-200 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your HSA Action Plan</h2>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0 mt-1">1</div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Assess Your Eligibility</h3>
              <p className="text-gray-600">Review your current health plan to ensure it qualifies as a high-deductible health plan (HDHP).</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0 mt-1">2</div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Calculate Your Strategy</h3>
              <p className="text-gray-600">Use the calculator above to determine your optimal contribution amount and investment strategy.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0 mt-1">3</div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Maximize Contributions</h3>
              <p className="text-gray-600">Contribute the maximum allowed amount, including catch-up contributions if you're 55 or older.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0 mt-1">4</div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Invest for Growth</h3>
              <p className="text-gray-600">Choose appropriate investment options based on your age and risk tolerance to maximize long-term growth.</p>
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
              This guide provides general information about Health Savings Accounts and should not be considered personalized financial advice. 
              HSA rules and contribution limits change annually. Consult with a qualified tax professional or financial advisor before making HSA decisions. 
              Individual circumstances vary, and this information may not apply to your specific situation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HSAStrategyGuide;
