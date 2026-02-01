import React, { useState } from 'react';

interface AgingInPlaceGuideProps {
  // Add props as needed
}

const AgingInPlaceGuide: React.FC<AgingInPlaceGuideProps> = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#36596A] mb-4">
          Aging in Place Guide
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          A comprehensive guide to help you prepare your home and finances for aging in place safely and comfortably.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-[#36596A] mb-4">Key Considerations</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Home modifications and accessibility improvements
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Healthcare and support services planning
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Financial planning for long-term care costs
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Safety and emergency preparedness
              </li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-[#36596A] mb-4">Resources</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Home Assessment Checklist</h3>
                <p className="text-sm text-blue-700">
                  Download our comprehensive checklist to evaluate your home's readiness for aging in place.
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">Cost Calculator</h3>
                <p className="text-sm text-green-700">
                  Estimate the costs of home modifications and ongoing care services.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-[#36596A] mb-4">
              Ready to Start Planning?
            </h3>
            <p className="text-gray-600 mb-6">
              Get personalized guidance on aging in place strategies and financial planning.
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

export default AgingInPlaceGuide;