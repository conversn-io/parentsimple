import React, { useState } from 'react';

const LongTermCarePlanningGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#36596A] mb-4">
              Long-Term Care Planning Guide
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Plan ahead for potential long-term care needs and protect your retirement savings.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'options', label: 'Care Options' },
                  { id: 'costs', label: 'Costs' },
                  { id: 'insurance', label: 'Insurance' }
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
                  <h2 className="text-2xl font-semibold text-[#36596A] mb-6">Why Plan for Long-Term Care?</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">The Statistics</h3>
                      <div className="space-y-3">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">70%</div>
                          <div className="text-sm text-blue-700">
                            of people over 65 will need some form of long-term care
                          </div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">3 years</div>
                          <div className="text-sm text-green-700">
                            Average length of care needed
                          </div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">$50k+</div>
                          <div className="text-sm text-purple-700">
                            Average annual cost of care
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Planning Benefits</h3>
                      <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          Protect retirement savings from being depleted
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          Maintain independence and quality of life
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          Reduce burden on family members
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          Have more control over care decisions
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'options' && (
                <div>
                  <h2 className="text-2xl font-semibold text-[#36596A] mb-6">Types of Long-Term Care</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-3">Home Care</h3>
                      <p className="text-blue-800 text-sm mb-3">
                        Receive care in the comfort of your own home from professional caregivers.
                      </p>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Personal care assistance</li>
                        <li>• Meal preparation</li>
                        <li>• Light housekeeping</li>
                        <li>• Medication management</li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-green-900 mb-3">Adult Day Care</h3>
                      <p className="text-green-800 text-sm mb-3">
                        Daytime care and activities while living at home.
                      </p>
                      <ul className="text-green-700 text-sm space-y-1">
                        <li>• Social activities</li>
                        <li>• Health monitoring</li>
                        <li>• Meals and snacks</li>
                        <li>• Transportation</li>
                      </ul>
                    </div>
                    
                    <div className="bg-purple-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-purple-900 mb-3">Assisted Living</h3>
                      <p className="text-purple-800 text-sm mb-3">
                        Independent living with assistance as needed.
                      </p>
                      <ul className="text-purple-700 text-sm space-y-1">
                        <li>• Private or shared apartments</li>
                        <li>• 24-hour assistance available</li>
                        <li>• Meals and activities</li>
                        <li>• Housekeeping services</li>
                      </ul>
                    </div>
                    
                    <div className="bg-orange-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-orange-900 mb-3">Nursing Home</h3>
                      <p className="text-orange-800 text-sm mb-3">
                        24-hour skilled nursing care for complex medical needs.
                      </p>
                      <ul className="text-orange-700 text-sm space-y-1">
                        <li>• Skilled nursing care</li>
                        <li>• Physical therapy</li>
                        <li>• Medical management</li>
                        <li>• Specialized dementia care</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'costs' && (
                <div>
                  <h2 className="text-2xl font-semibold text-[#36596A] mb-6">Cost of Care (National Averages)</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type of Care</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monthly Cost</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Annual Cost</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">Home Care (44 hrs/week)</td>
                          <td className="px-4 py-3 text-sm text-gray-600">$4,500</td>
                          <td className="px-4 py-3 text-sm text-gray-600">$54,000</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">Adult Day Care</td>
                          <td className="px-4 py-3 text-sm text-gray-600">$1,500</td>
                          <td className="px-4 py-3 text-sm text-gray-600">$18,000</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">Assisted Living</td>
                          <td className="px-4 py-3 text-sm text-gray-600">$4,000</td>
                          <td className="px-4 py-3 text-sm text-gray-600">$48,000</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">Nursing Home (Private Room)</td>
                          <td className="px-4 py-3 text-sm text-gray-600">$8,500</td>
                          <td className="px-4 py-3 text-sm text-gray-600">$102,000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                    <p className="text-yellow-800 text-sm">
                      <strong>Note:</strong> Costs vary significantly by location and level of care needed. 
                      These are national averages and your local costs may be higher or lower.
                    </p>
                  </div>
                </div>
              )}
              
              {activeTab === 'insurance' && (
                <div>
                  <h2 className="text-2xl font-semibold text-[#36596A] mb-6">Long-Term Care Insurance Options</h2>
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-3">Traditional LTC Insurance</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-blue-800 mb-2">Pros:</h4>
                          <ul className="text-blue-700 text-sm space-y-1">
                            <li>• Comprehensive coverage</li>
                            <li>• Inflation protection options</li>
                            <li>• Covers all types of care</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-blue-800 mb-2">Cons:</h4>
                          <ul className="text-blue-700 text-sm space-y-1">
                            <li>• Premium increases possible</li>
                            <li>• Use it or lose it</li>
                            <li>• Underwriting requirements</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-green-900 mb-3">Hybrid Life/LTC Insurance</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-green-800 mb-2">Pros:</h4>
                          <ul className="text-green-700 text-sm space-y-1">
                            <li>• Guaranteed premiums</li>
                            <li>• Death benefit if not used</li>
                            <li>• Return of premium options</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-green-800 mb-2">Cons:</h4>
                          <ul className="text-green-700 text-sm space-y-1">
                            <li>• Higher upfront cost</li>
                            <li>• Limited benefit periods</li>
                            <li>• Less comprehensive coverage</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-8 bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-lg font-semibold text-[#36596A] mb-4">
              Ready to Plan for Long-Term Care?
            </h3>
            <p className="text-gray-600 mb-6">
              Get personalized guidance on long-term care planning and insurance options.
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

export default LongTermCarePlanningGuide;