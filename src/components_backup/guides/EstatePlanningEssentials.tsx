'use client';

import React, { useState } from 'react';

interface EstatePlanningEssentialsProps {
  // Add your props here
}

const EstatePlanningEssentials: React.FC<EstatePlanningEssentialsProps> = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#36596A] mb-4">
              Estate Planning Essentials
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Learn the fundamental components of estate planning and protect your legacy for future generations.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'documents', label: 'Key Documents' },
                  { id: 'strategies', label: 'Strategies' },
                  { id: 'checklist', label: 'Checklist' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Tab Content */}
            <div className="p-8">
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-semibold text-[#36596A] mb-6">Estate Planning Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Why Estate Planning Matters</h3>
                      <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          Ensures your wishes are carried out
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          Minimizes taxes and legal complications
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          Protects your family's financial future
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          Provides peace of mind
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">When to Start</h3>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-blue-800 font-medium mb-2">The best time to start is now!</p>
                        <p className="text-blue-700 text-sm">
                          Estate planning isn't just for the wealthy. Anyone with assets, dependents, or specific wishes should have a basic estate plan in place.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'documents' && (
                <div>
                  <h2 className="text-2xl font-semibold text-[#36596A] mb-6">Essential Documents</h2>
                  <div className="space-y-6">
                    {[
                      {
                        title: 'Last Will and Testament',
                        description: 'Specifies how your assets will be distributed and who will care for minor children.'
                      },
                      {
                        title: 'Living Trust',
                        description: 'Allows assets to pass to beneficiaries without probate and provides privacy.'
                      },
                      {
                        title: 'Power of Attorney',
                        description: 'Designates someone to make financial decisions if you become incapacitated.'
                      },
                      {
                        title: 'Healthcare Directive',
                        description: 'Outlines your medical wishes and designates a healthcare proxy.'
                      }
                    ].map((doc, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-800 mb-2">{doc.title}</h3>
                        <p className="text-gray-600 text-sm">{doc.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === 'strategies' && (
                <div>
                  <h2 className="text-2xl font-semibold text-[#36596A] mb-6">Tax-Saving Strategies</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-800 mb-2">Gift Tax Exclusion</h3>
                      <p className="text-green-700 text-sm">
                        Give up to $17,000 per person per year (2023 limit) without triggering gift tax.
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-800 mb-2">Charitable Giving</h3>
                      <p className="text-purple-700 text-sm">
                        Reduce estate taxes while supporting causes you care about.
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-800 mb-2">Life Insurance Trust</h3>
                      <p className="text-blue-700 text-sm">
                        Remove life insurance proceeds from your taxable estate.
                      </p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-orange-800 mb-2">Family Limited Partnership</h3>
                      <p className="text-orange-700 text-sm">
                        Transfer assets to family members at reduced gift tax values.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'checklist' && (
                <div>
                  <h2 className="text-2xl font-semibold text-[#36596A] mb-6">Estate Planning Checklist</h2>
                  <div className="space-y-4">
                    {[
                      'Create or update your will',
                      'Establish power of attorney documents',
                      'Complete healthcare directives',
                      'Review and update beneficiaries on all accounts',
                      'Consider establishing a trust',
                      'Organize important documents',
                      'Discuss plans with family members',
                      'Review and update regularly'
                    ].map((item, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-3 text-gray-700">{item}</label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-8 bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-lg font-semibold text-[#36596A] mb-4">
              Ready to Start Your Estate Plan?
            </h3>
            <p className="text-gray-600 mb-6">
              Get personalized guidance from our estate planning experts.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
              Schedule a Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstatePlanningEssentials;