'use client';

import React from 'react';
import { Calculator, DollarSign, TrendingUp, AlertTriangle, CheckCircle, PieChart, Target, Calendar, Shield } from 'lucide-react';
import FullWidthCalculatorEmbed from './FullWidthCalculatorEmbed';
import TaxEfficientWithdrawalsCalculator from '../calculators/TaxEfficientWithdrawalsCalculator';

interface TaxEfficientWithdrawalsStrategyGuideProps {
  article: {
    title: string;
    content: string;
    meta_description?: string;
    featured_image_url?: string;
    reading_time?: number;
    table_of_contents?: string[];
  };
}

const TaxEfficientWithdrawalsStrategyGuide: React.FC<TaxEfficientWithdrawalsStrategyGuideProps> = ({ article }) => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <Calculator className="h-12 w-12 text-blue-600 mr-4" />
          <h1 className="text-4xl font-bold text-gray-900">{article.title}</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Master advanced strategies to minimize taxes on retirement account withdrawals and maximize your retirement income
        </p>
        <div className="flex justify-center items-center space-x-6 mt-6 text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{article.reading_time || 16} min read</span>
          </div>
          <div className="flex items-center">
            <Target className="h-4 w-4 mr-2" />
            <span>Advanced Level</span>
          </div>
          <div className="flex items-center">
            <PieChart className="h-4 w-4 mr-2" />
            <span>Tax Planning</span>
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
        title="Tax-Efficient Withdrawals Calculator"
        description="Optimize your retirement account withdrawals to minimize taxes and maximize income"
        theme="orange"
      >
        <TaxEfficientWithdrawalsCalculator />
      </FullWidthCalculatorEmbed>

      {/* Account Types */}
      <div className="mt-12 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Shield className="h-6 w-6 text-blue-600 mr-3" />
          Understanding Your Account Types
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-red-800">Tax-Deferred Accounts</h3>
            </div>
            <p className="text-gray-700 mb-4">401(k), Traditional IRA, 403(b)</p>
            <ul className="text-sm space-y-2 text-gray-600">
              <li>• Withdrawals taxed as ordinary income</li>
              <li>• Required minimum distributions (RMDs)</li>
              <li>• Highest tax impact</li>
            </ul>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-center mb-4">
              <Shield className="h-8 w-8 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold text-green-800">Tax-Free Accounts</h3>
            </div>
            <p className="text-gray-700 mb-4">Roth IRA, Roth 401(k)</p>
            <ul className="text-sm space-y-2 text-gray-600">
              <li>• Tax-free withdrawals in retirement</li>
              <li>• No required distributions</li>
              <li>• Lowest tax impact</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-blue-800">Taxable Accounts</h3>
            </div>
            <p className="text-gray-700 mb-4">Brokerage, Savings, CDs</p>
            <ul className="text-sm space-y-2 text-gray-600">
              <li>• Capital gains tax rates</li>
              <li>• Step-up basis at death</li>
              <li>• Moderate tax impact</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Withdrawal Strategies */}
      <div className="mt-8 bg-white border border-gray-200 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <PieChart className="h-6 w-6 text-purple-600 mr-3" />
          Core Withdrawal Strategies
        </h2>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">1</div>
              <h3 className="text-xl font-semibold text-gray-800">Tax Bracket Management</h3>
            </div>
            <p className="text-gray-700 mb-4">
              The cornerstone of tax-efficient withdrawals is staying within your target tax bracket. By carefully managing your annual income, you can avoid jumping into higher tax brackets.
            </p>
            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <h4 className="font-semibold text-gray-800 mb-2">Example Strategy:</h4>
              <p className="text-sm text-gray-600">
                If you're in the 12% tax bracket, withdraw enough from tax-deferred accounts to fill up that bracket before moving to Roth or taxable accounts.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">2</div>
              <h3 className="text-xl font-semibold text-gray-800">The Bucket Strategy</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Organize your retirement accounts into three "buckets" based on tax treatment, then withdraw strategically from each bucket based on your annual tax situation.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white rounded-lg p-3 border border-blue-100 text-center">
                <div className="text-blue-600 text-lg mb-1">📦</div>
                <div className="text-sm font-medium">Bucket 1</div>
                <div className="text-xs text-gray-600">Tax-Deferred</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-100 text-center">
                <div className="text-blue-600 text-lg mb-1">📦</div>
                <div className="text-sm font-medium">Bucket 2</div>
                <div className="text-xs text-gray-600">Taxable</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-100 text-center">
                <div className="text-blue-600 text-lg mb-1">📦</div>
                <div className="text-sm font-medium">Bucket 3</div>
                <div className="text-xs text-gray-600">Tax-Free</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">3</div>
              <h3 className="text-xl font-semibold text-gray-800">Roth Conversion Ladder</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Convert traditional IRA funds to Roth IRA during low-income years to pay taxes at lower rates and create tax-free income for later years.
            </p>
            <div className="bg-white rounded-lg p-4 border border-green-100">
              <h4 className="font-semibold text-gray-800 mb-2">Optimal Timing:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Early retirement (before Social Security)</li>
                <li>• Market downturns (lower account values)</li>
                <li>• Years with lower ordinary income</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Timing Your Withdrawals */}
      <div className="mt-8 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Calendar className="h-6 w-6 text-orange-600 mr-3" />
          Optimal Withdrawal Timeline
        </h2>
        
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold text-orange-600 mr-4 flex-shrink-0">
              59½
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Early Retirement Phase</h4>
              <p className="text-gray-600">Access penalty-free withdrawals from retirement accounts. Consider Roth conversions during low-income years.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold text-orange-600 mr-4 flex-shrink-0">
              62
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Social Security Decision</h4>
              <p className="text-gray-600">Evaluate whether to claim early or delay. Consider tax implications of Social Security benefits.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold text-orange-600 mr-4 flex-shrink-0">
              65
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Medicare Enrollment</h4>
              <p className="text-gray-600">Higher income triggers Medicare surcharges. Plan withdrawals to minimize IRMAA penalties.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold text-orange-600 mr-4 flex-shrink-0">
              73
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Required Minimum Distributions</h4>
              <p className="text-gray-600">Mandatory withdrawals begin. Plan earlier conversions to minimize RMD impact.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Steps */}
      <div className="mt-8 bg-white border border-gray-200 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Tax-Efficient Withdrawal Action Plan</h2>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0 mt-1">1</div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Inventory Your Accounts</h3>
              <p className="text-gray-600">List all retirement accounts by type and current balance. Calculate your expected RMDs starting at age 73.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0 mt-1">2</div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Project Your Tax Brackets</h3>
              <p className="text-gray-600">Estimate your annual income needs and determine target tax brackets for each year of retirement.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0 mt-1">3</div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Create Your Withdrawal Sequence</h3>
              <p className="text-gray-600">Develop a year-by-year plan for which accounts to withdraw from first, considering tax implications.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0 mt-1">4</div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Consider Professional Help</h3>
              <p className="text-gray-600">Complex tax planning often requires professional guidance. Consider consulting with a tax-aware financial advisor.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start">
          <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">Important Disclaimers</h3>
            <p className="text-sm text-yellow-700">
              This guide provides general information about tax-efficient withdrawal strategies and should not be considered personalized financial advice. 
              Tax laws change frequently - verify current rules. Individual situations vary significantly. 
              Consider consulting a tax professional. This is educational content, not personalized advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxEfficientWithdrawalsStrategyGuide;
