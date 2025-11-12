import React, { useState } from 'react';

const SeniorHousingOptions: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState('');

  const housingOptions = [
    {
      id: 'age-in-place',
      title: 'Age in Place',
      description: 'Stay in your current home with modifications and support services',
      avgCost: '$2,000 - $4,000/month',
      pros: ['Familiar environment', 'Independence', 'Cost-effective initially'],
      cons: ['May need modifications', 'Limited social interaction', 'Emergency response concerns'],
      bestFor: 'Healthy seniors who want to maintain independence'
    },
    {
      id: 'downsize',
      title: 'Downsize to Smaller Home',
      description: 'Move to a smaller, more manageable home or condo',
      avgCost: '$1,500 - $3,000/month',
      pros: ['Lower maintenance', 'Reduced costs', 'Still independent'],
      cons: ['Moving stress', 'Smaller space', 'May still need future care'],
      bestFor: 'Active seniors wanting to reduce maintenance responsibilities'
    },
    {
      id: 'active-adult',
      title: 'Active Adult Community',
      description: '55+ communities with amenities and activities',
      avgCost: '$2,500 - $5,000/month',
      pros: ['Social activities', 'Maintenance-free', 'Age-appropriate amenities'],
      cons: ['HOA fees', 'Age restrictions', 'Limited care services'],
      bestFor: 'Social seniors who want an active lifestyle'
    },
    {
      id: 'assisted-living',
      title: 'Assisted Living',
      description: 'Residential care with assistance for daily activities',
      avgCost: '$4,000 - $6,000/month',
      pros: ['Personal care assistance', '24/7 support', 'Social environment'],
      cons: ['Higher cost', 'Less independence', 'Shared living spaces'],
      bestFor: 'Seniors needing help with daily activities'
    },
    {
      id: 'memory-care',
      title: 'Memory Care',
      description: 'Specialized care for dementia and Alzheimer\'s',
      avgCost: '$5,000 - $8,000/month',
      pros: ['Specialized staff', 'Secure environment', 'Structured activities'],
      cons: ['Very expensive', 'Limited independence', 'Emotional adjustment'],
      bestFor: 'Seniors with memory-related conditions'
    },
    {
      id: 'skilled-nursing',
      title: 'Skilled Nursing Facility',
      description: '24-hour medical care and supervision',
      avgCost: '$8,000 - $12,000/month',
      pros: ['Medical care on-site', '24/7 nursing', 'Rehabilitation services'],
      cons: ['Institutional setting', 'Very expensive', 'Limited privacy'],
      bestFor: 'Seniors with significant medical needs'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#36596A] mb-4">
              Senior Housing Options
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore different housing options for seniors and find the right fit for your needs and budget.
            </p>
          </div>
          
          {/* Housing Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {housingOptions.map((option) => (
              <div key={option.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#36596A] mb-2">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {option.description}
                  </p>
                  
                  <div className="mb-4">
                    <div className="text-lg font-bold text-green-600 mb-2">
                      {option.avgCost}
                    </div>
                    <div className="text-xs text-gray-500">Average monthly cost</div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-green-800 mb-2">Pros:</h4>
                      <ul className="text-green-700 text-sm space-y-1">
                        {option.pros.map((pro, index) => (
                          <li key={index}>• {pro}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-red-800 mb-2">Cons:</h4>
                      <ul className="text-red-700 text-sm space-y-1">
                        {option.cons.map((con, index) => (
                          <li key={index}>• {con}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-1 text-sm">Best For:</h4>
                      <p className="text-blue-800 text-sm">{option.bestFor}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Decision Factors */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold text-[#36596A] mb-6">Key Decision Factors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Budget</h3>
                <p className="text-gray-600 text-sm">
                  Consider both current costs and future care needs
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🏥</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Health Status</h3>
                <p className="text-gray-600 text-sm">
                  Current health and anticipated care needs
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Social Needs</h3>
                <p className="text-gray-600 text-sm">
                  Desire for social interaction and community
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">📍</span>
                </div>
                                        <h3 className="font-semibold text-gray-800 mb-2">Location</h3>
                <p className="text-gray-600 text-sm">
                  Proximity to family, healthcare, and amenities
                </p>
              </div>
            </div>
          </div>
          
          {/* Planning Timeline */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-[#36596A] mb-6">Planning Timeline</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Assess Current Situation (Ages 55-65)</h3>
                  <p className="text-gray-600 text-sm">
                    Evaluate your current home, health status, and financial resources. Begin researching options.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                                          <h3 className="font-semibold text-gray-800 mb-2">Plan and Prepare (Ages 65-70)</h3>
                  <p className="text-gray-600 text-sm">
                    Make home modifications, research communities, and create a long-term care plan.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                                          <h3 className="font-semibold text-gray-800 mb-2">Make the Transition (Ages 70+)</h3>
                  <p className="text-gray-600 text-sm">
                    Execute your housing plan based on your health, social needs, and financial situation.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-lg font-semibold text-[#36596A] mb-4">
              Need Help Choosing the Right Housing Option?
            </h3>
            <p className="text-gray-600 mb-6">
              Get personalized guidance on senior housing options and financial planning.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
              Schedule a Housing Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeniorHousingOptions;