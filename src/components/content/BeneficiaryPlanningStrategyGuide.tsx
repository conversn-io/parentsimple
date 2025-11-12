'use client';

import React from 'react';
import { Calculator, Users, Shield, AlertTriangle, CheckCircle, FileText, Building, Heart, Calendar, Target, DollarSign, Gavel } from 'lucide-react';
import FullWidthCalculatorEmbed from './FullWidthCalculatorEmbed';
import BeneficiaryPlanningCalculator from '../calculators/BeneficiaryPlanningCalculator';

interface BeneficiaryPlanningStrategyGuideProps {
  article: {
    title: string;
    content: string;
    meta_description?: string;
    featured_image_url?: string;
    reading_time?: number;
    table_of_contents?: string[];
  };
}

const BeneficiaryPlanningStrategyGuide: React.FC<BeneficiaryPlanningStrategyGuideProps> = ({ article }) => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <Users className="h-12 w-12 text-blue-600 mr-4" />
          <h1 className="text-4xl font-bold text-gray-900">{article.title}</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive guide to beneficiary planning and designation management for retirement security and legacy protection
        </p>
        <div className="flex justify-center items-center space-x-6 mt-6 text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{article.reading_time || 12} min read</span>
          </div>
          <div className="flex items-center">
            <Target className="h-4 w-4 mr-2" />
            <span>Intermediate Level</span>
          </div>
          <div className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            <span>Estate Planning</span>
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
        title="Beneficiary Planning Tool"
        description="Organize and track all your beneficiary designations across accounts, insurance policies, and retirement plans"
        theme="blue"
      >
        <BeneficiaryPlanningCalculator />
      </FullWidthCalculatorEmbed>

      {/* Account Types */}
      <div className="mt-12 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Building className="h-6 w-6 text-blue-600 mr-3" />
          Understanding Account Types
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center mb-4">
              <Building className="h-8 w-8 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-blue-800">Financial Accounts</h3>
            </div>
            <p className="text-gray-700 mb-4">Bank accounts, investment accounts, retirement accounts</p>
            <ul className="text-sm space-y-2 text-gray-600">
              <li>• Beneficiary designations override wills</li>
              <li>• Can name primary and contingent beneficiaries</li>
              <li>• Easy to update with financial institution</li>
            </ul>
          </div>
          
          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <div className="flex items-center mb-4">
              <Shield className="h-8 w-8 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-red-800">Insurance Policies</h3>
            </div>
            <p className="text-gray-700 mb-4">Life insurance, annuities, disability insurance</p>
            <ul className="text-sm space-y-2 text-gray-600">
              <li>• Direct payment to beneficiaries</li>
              <li>• Bypasses probate process</li>
              <li>• Tax-free death benefits</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Common Mistakes */}
      <div className="mt-8 bg-white border border-gray-200 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
          Common Beneficiary Planning Mistakes
        </h2>
        
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">1</div>
              <h3 className="text-xl font-semibold text-gray-800">Outdated Information</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Failing to update beneficiary designations after major life events like marriage, divorce, or death of a beneficiary.
            </p>
            <div className="bg-white rounded-lg p-4 border border-red-100">
              <h4 className="font-semibold text-gray-800 mb-2">Solution:</h4>
              <p className="text-sm text-gray-600">
                Review and update beneficiary designations annually or after any major life change.
              </p>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <div className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">2</div>
              <h3 className="text-xl font-semibold text-gray-800">Naming Minors as Beneficiaries</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Directly naming minor children as beneficiaries can create complications and require court-appointed guardians.
            </p>
            <div className="bg-white rounded-lg p-4 border border-orange-100">
              <h4 className="font-semibold text-gray-800 mb-2">Solution:</h4>
              <p className="text-sm text-gray-600">
                Consider naming a trust or adult custodian for minor children's inheritance.
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <div className="bg-yellow-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">3</div>
              <h3 className="text-xl font-semibold text-gray-800">Inconsistent Designations</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Having different beneficiaries on different accounts without a clear strategy can lead to unintended consequences.
            </p>
            <div className="bg-white rounded-lg p-4 border border-yellow-100">
              <h4 className="font-semibold text-gray-800 mb-2">Solution:</h4>
              <p className="text-sm text-gray-600">
                Develop a consistent beneficiary strategy that aligns with your overall estate plan.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
          Beneficiary Planning Best Practices
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-800">Name Contingent Beneficiaries</h4>
                <p className="text-sm text-gray-600">Always name backup beneficiaries in case primary beneficiaries predecease you.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-800">Use Specific Names</h4>
                <p className="text-sm text-gray-600">Use full legal names and include relationship to avoid confusion.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-800">Consider Tax Implications</h4>
                <p className="text-sm text-gray-600">Understand how different beneficiaries affect tax treatment of assets.</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-800">Coordinate with Estate Plan</h4>
                <p className="text-sm text-gray-600">Ensure beneficiary designations align with your will and trust documents.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-800">Keep Records Updated</h4>
                <p className="text-sm text-gray-600">Maintain current contact information for all beneficiaries.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-800">Review Regularly</h4>
                <p className="text-sm text-gray-600">Set annual reminders to review and update beneficiary information.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Special Considerations */}
      <div className="mt-8 bg-white border border-gray-200 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Heart className="h-6 w-6 text-purple-600 mr-3" />
          Special Considerations
        </h2>
        
        <div className="space-y-6">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-800 mb-3">Blended Families</h3>
            <p className="text-gray-700 mb-3">
              When you have children from previous relationships, careful beneficiary planning is essential to ensure fair treatment.
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Consider naming children as equal beneficiaries</li>
              <li>• Use specific percentages rather than "per stirpes"</li>
              <li>• Consider life insurance to provide for current spouse</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Charitable Giving</h3>
            <p className="text-gray-700 mb-3">
              Naming charities as beneficiaries can provide tax benefits and support causes you care about.
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Charities receive assets tax-free</li>
              <li>• Can reduce estate tax burden</li>
              <li>• Consider donor-advised funds for flexibility</li>
            </ul>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-3">Special Needs Beneficiaries</h3>
            <p className="text-gray-700 mb-3">
              When naming beneficiaries with special needs, consider the impact on government benefits.
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Direct inheritance may disqualify from benefits</li>
              <li>• Consider special needs trusts</li>
              <li>• Consult with special needs planning attorney</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Steps */}
      <div className="mt-8 bg-white border border-gray-200 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Beneficiary Planning Action Plan</h2>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0 mt-1">1</div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Inventory All Accounts</h3>
              <p className="text-gray-600">List all accounts, policies, and assets that allow beneficiary designations.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0 mt-1">2</div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Review Current Designations</h3>
              <p className="text-gray-600">Check with each institution to verify current beneficiary information.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0 mt-1">3</div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Update as Needed</h3>
              <p className="text-gray-600">Complete new beneficiary designation forms where changes are needed.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0 mt-1">4</div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Coordinate with Estate Plan</h3>
              <p className="text-gray-600">Ensure beneficiary designations align with your will and trust documents.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0 mt-1">5</div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Set Annual Reminders</h3>
              <p className="text-gray-600">Schedule regular reviews to keep beneficiary information current.</p>
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
              This guide provides general information about beneficiary planning and should not be considered personalized legal or financial advice. 
              Beneficiary designation laws vary by state and change frequently. Individual situations vary significantly. 
              Consider consulting a qualified attorney or financial advisor. This is educational content, not personalized advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryPlanningStrategyGuide;
