'use client';

import React, { useState } from 'react';

interface IndexedAnnuitiesGuideProps {
  // Add your props here
}

const IndexedAnnuitiesGuide: React.FC<IndexedAnnuitiesGuideProps> = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#36596A] mb-4">
              Indexed Annuities Guide
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Learn how indexed annuities can provide market growth potential with principal protection for your retirement.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'benefits', label: 'Benefits' },
                  { id: 'risks', label: 'Considerations' },
                  { id: 'comparison', label: 'Comparison' }
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
                  <h2 className="text-2xl font-semibold text-[#36596A] mb-6">What are Indexed Annuities?</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <p className="text-gray-700 mb-4">
                        Indexed annuities are insurance products that offer the potential for growth based on the performance 
                        of a market index (like the S&P 500) while providing protection against market downturns.
                      </p>
                      <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          Principal protection guarantee
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          Market-linked growth potential
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          Tax-deferred growth
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          Optional guaranteed income riders
                        </li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-4">How It Works</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-700">Market Up:</span>
                          <span className="font-medium text-blue-900">You participate in gains (up to a cap)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Market Down:</span>
                          <span className="font-medium text-blue-900">Your principal is protected</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Minimum:</span>
                          <span className="font-medium text-blue-900">Often 0% annual return</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'benefits' && (
                <div>
                  <h2 className="text-2xl font-semibold text-[#36596A] mb-6">Benefits of Indexed Annuities</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-800 mb-2">Principal Protection</h3>
                      <p className="text-green-700 text-sm">
                        Your initial investment is protected from market losses, providing peace of mind.
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-800 mb-2">Growth Potential</h3>
                      <p className="text-blue-700 text-sm">
                        Participate in market gains when the index performs well, up to the product's cap rate.
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-800 mb-2">Tax Advantages</h3>
                      <p className="text-purple-700 text-sm">
                        Earnings grow tax-deferred until withdrawal, potentially reducing your current tax burden.
                      </p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-orange-800 mb-2">Income Options</h3>
                      <p className="text-orange-700 text-sm">
                        Optional riders can provide guaranteed lifetime income streams for retirement.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'risks' && (
                <div>
                  <h2 className="text-2xl font-semibold text-[#36596A] mb-6">Important Considerations</h2>
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                      <h3 className="font-semibold text-yellow-800 mb-2">Caps and Participation Rates</h3>
                      <p className="text-yellow-700 text-sm">
                        Your gains may be limited by caps (maximum return) or participation rates (percentage of index gains you receive).
                      </p>
                    </div>
                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                      <h3 className="font-semibold text-red-800 mb-2">Surrender Charges</h3>
                      <p className="text-red-700 text-sm">
                        Early withdrawals may result in surrender charges, typically for 7-10 years after purchase.
                      </p>
                    </div>
                    <div className="bg-gray-50 border-l-4 border-gray-400 p-4">
                      <h3 className="font-semibold text-gray-800 mb-2">Complexity</h3>
                      <p className="text-gray-700 text-sm">
                        These products can be complex with various crediting methods, fees, and features to understand.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'comparison' && (
                <div>
                  <h2 className="text-2xl font-semibold text-[#36596A] mb-6">Indexed Annuities vs. Other Options</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Feature</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Indexed Annuity</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fixed Annuity</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variable Annuity</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">Principal Protection</td>
                          <td className="px-4 py-3 text-sm text-green-600">✓ Yes</td>
                          <td className="px-4 py-3 text-sm text-green-600">✓ Yes</td>
                          <td className="px-4 py-3 text-sm text-red-600">✗ No</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">Growth Potential</td>
                          <td className="px-4 py-3 text-sm text-yellow-600">Limited</td>
                          <td className="px-4 py-3 text-sm text-red-600">Low</td>
                          <td className="px-4 py-3 text-sm text-green-600">High</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">Complexity</td>
                          <td className="px-4 py-3 text-sm text-yellow-600">Medium</td>
                          <td className="px-4 py-3 text-sm text-green-600">Low</td>
                          <td className="px-4 py-3 text-sm text-red-600">High</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">Fees</td>
                          <td className="px-4 py-3 text-sm text-yellow-600">Medium</td>
                          <td className="px-4 py-3 text-sm text-green-600">Low</td>
                          <td className="px-4 py-3 text-sm text-red-600">High</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-8 bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-lg font-semibold text-[#36596A] mb-4">
              Considering an Indexed Annuity?
            </h3>
            <p className="text-gray-600 mb-6">
              Get personalized guidance to determine if an indexed annuity fits your retirement strategy.
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

export default IndexedAnnuitiesGuide;