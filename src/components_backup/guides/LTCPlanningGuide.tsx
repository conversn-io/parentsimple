import React, { useState } from 'react';

const LTCPlanningGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#36596A] mb-4">
              Long-Term Care Planning Guide
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive guide to planning for long-term care needs and protecting your assets.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Navigation Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'costs', label: 'Costs & Funding' },
                  { id: 'insurance', label: 'Insurance Options' },
                  { id: 'planning', label: 'Planning Steps' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id)}
                    className={`px-6 py-4 text-sm font-medium transition-colors ${
                      activeSection === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Content */}
            <div className="p-8">
              {activeSection === 'overview' && (
                <div>
                  <h2 className="text-2xl font-semibold text-[#36596A] mb-6">Understanding Long-Term Care</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">What is Long-Term Care?</h3>
                      <p className="text-gray-700 mb-4">
                        Long-term care refers to a variety of services designed to meet health or personal care needs 
                        during a short or long period of time. These services help people live as independently and 
                        safely as possible when they can no longer perform everyday activities on their own.
                      </p>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">Types of Care Include:</h4>
                        <ul className="space-y-1 text-blue-800 text-sm">
                          <li>• Personal care (bathing, dressing, eating)</li>
                          <li>• Homemaker services (shopping, cooking, cleaning)</li>
                          <li>• Transportation</li>
                          <li>• Adult day care programs</li>
                          <li>• Assisted living facilities</li>
                          <li>• Nursing home care</li>
                        </ul>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Who Needs Long-Term Care?</h3>
                      <div className="space-y-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-green-600 mb-1">70%</div>
                          <div className="text-sm text-green-700">
                            of people over 65 will need some form of long-term care
                          </div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600 mb-1">3 years</div>
                          <div className="text-sm text-purple-700">
                            Average length of care needed
                          </div>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600 mb-1">20%</div>
                          <div className="text-sm text-orange-700">
                            will need care for more than 5 years
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeSection === 'costs' && (
                <div>
                  <h2 className="text-2xl font-semibold text-[#36596A] mb-6">Costs and Funding Options</h2>
                  <div className="space-y-6">
                    <div className="bg-red-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-red-900 mb-4">Average Annual Costs (2024)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-red-800">Home Health Aide:</span>
                            <span className="font-medium text-red-900">$61,776</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-red-800">Adult Day Care:</span>
                            <span className="font-medium text-red-900">$21,060</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-red-800">Assisted Living:</span>
                            <span className="font-medium text-red-900">$54,000</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-red-800">Nursing Home:</span>
                            <span className="font-medium text-red-900">$108,405</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-4">Funding Sources</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-blue-900 mb-2">Private Pay</h4>
                          <p className="text-blue-800 text-sm">
                            Personal savings, investments, and family resources
                          </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-green-900 mb-2">Insurance</h4>
                          <p className="text-green-800 text-sm">
                            Long-term care insurance, life insurance, annuities
                          </p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-purple-900 mb-2">Government</h4>
                          <p className="text-purple-800 text-sm">
                            Medicaid, Veterans benefits, limited Medicare coverage
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeSection === 'insurance' && (
                <div>
                  <h2 className="text-2xl font-semibold text-[#36596A] mb-6">Insurance Options</h2>
                  <div className="space-y-6">
                    <div className="bg-yellow-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-yellow-900 mb-4">Traditional LTC Insurance</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-yellow-800 mb-2">Advantages:</h4>
                          <ul className="text-yellow-700 text-sm space-y-1">
                            <li>• Comprehensive coverage</li>
                            <li>• Inflation protection available</li>
                            <li>• Tax-qualified policies offer deductions</li>
                            <li>• Covers all types of care settings</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-yellow-800 mb-2">Considerations:</h4>
                          <ul className="text-yellow-700 text-sm space-y-1">
                            <li>• Premium increases possible</li>
                            <li>• "Use it or lose it" nature</li>
                            <li>• Health underwriting required</li>
                            <li>• Limited benefit periods</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-green-900 mb-4">Hybrid Life/LTC Policies</h3>
                      <p className="text-green-800 mb-3">
                        Combines life insurance with long-term care benefits, offering more flexibility and guaranteed premiums.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-green-800 mb-2">Benefits:</h4>
                          <ul className="text-green-700 text-sm space-y-1">
                            <li>• Guaranteed level premiums</li>
                            <li>• Death benefit if care not needed</li>
                            <li>• Return of premium options</li>
                            <li>• Simplified underwriting</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-green-800 mb-2">Limitations:</h4>
                          <ul className="text-green-700 text-sm space-y-1">
                            <li>• Higher initial premium</li>
                            <li>• Limited benefit multipliers</li>
                            <li>• Less comprehensive than traditional LTC</li>
                            <li>• Shorter benefit periods</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeSection === 'planning' && (
                <div>
                  <h2 className="text-2xl font-semibold text-[#36596A] mb-6">Planning Steps</h2>
                  <div className="space-y-6">
                    {[
                      {
                        step: 1,
                        title: "Assess Your Risk",
                        description: "Consider your family history, current health, and lifestyle factors that may affect your long-term care needs."
                      },
                      {
                        step: 2,
                        title: "Calculate Potential Costs",
                        description: "Research costs in your area and estimate how much care might cost based on your preferences and needs."
                      },
                      {
                        step: 3,
                        title: "Evaluate Your Resources",
                        description: "Review your current assets, income, and existing insurance coverage to determine funding gaps."
                      },
                      {
                        step: 4,
                        title: "Explore Insurance Options",
                        description: "Compare traditional LTC insurance, hybrid policies, and other insurance solutions that fit your situation."
                      },
                      {
                        step: 5,
                        title: "Create a Care Plan",
                        description: "Document your preferences for care settings, providers, and decision-makers in case you cannot communicate them later."
                      },
                      {
                        step: 6,
                        title: "Review and Update",
                        description: "Regularly review your plan as your health, finances, and family situation change over time."
                      }
                    ].map((item) => (
                      <div key={item.step} className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {item.step}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                          <p className="text-gray-600 text-sm">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-8 bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-lg font-semibold text-[#36596A] mb-4">
              Ready to Start Your Long-Term Care Plan?
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

export default LTCPlanningGuide;