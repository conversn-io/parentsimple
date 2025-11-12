import React, { useState } from 'react';

const HomeModificationPlanner: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const modificationData = [
    {
      id: 1,
      category: 'Bathroom',
      title: 'Install Grab Bars',
      description: 'Add grab bars in shower and near toilet for safety',
      priority: 'high',
      cost: '$50-200'
    },
    {
      id: 2,
      category: 'Kitchen',
      title: 'Lower Countertops',
      description: 'Adjust counter height for wheelchair accessibility',
      priority: 'medium',
      cost: '$2,000-5,000'
    },
    {
      id: 3,
      category: 'Entrance',
      title: 'Install Ramps',
      description: 'Add ramps to eliminate steps at entrances',
      priority: 'high',
      cost: '$1,000-3,000'
    }
  ];

  const categories = ['all', 'Bathroom', 'Kitchen', 'Entrance', 'Bedroom'];

  const filteredModifications = selectedCategory === 'all' 
    ? modificationData 
    : modificationData.filter(mod => mod.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#36596A] mb-4">
              Home Modification Planner
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Plan and prioritize home modifications to support aging in place safely and independently.
            </p>
          </div>
          
          {/* Category Filter */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold text-[#36596A] mb-4">Filter by Room</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category === 'all' ? 'All Rooms' : category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Modifications List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModifications.map((modification) => (
              <div key={modification.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {modification.category}
                  </span>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    modification.priority === 'high' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {modification.priority} priority
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {modification.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {modification.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-green-600">
                    {modification.cost}
                  </span>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredModifications.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No modifications found for the selected category.</p>
            </div>
          )}
          
          <div className="mt-12 bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-lg font-semibold text-[#36596A] mb-4">
              Need Help Planning Your Modifications?
            </h3>
            <p className="text-gray-600 mb-6">
              Get a personalized home assessment and modification plan from our experts.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
              Schedule Home Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeModificationPlanner;