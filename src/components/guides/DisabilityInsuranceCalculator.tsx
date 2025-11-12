import React, { useState } from 'react';

const DisabilityInsuranceCalculator: React.FC = () => {
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [coverage, setCoverage] = useState<number>(60);
  
  const calculateBenefit = () => {
    return (monthlyIncome * coverage) / 100;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#36596A] mb-4">
              Disability Insurance Calculator
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Calculate your potential disability insurance benefits and understand how much coverage you may need.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold text-[#36596A] mb-6">Calculate Your Coverage</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Income
                    </label>
                    <input
                      type="number"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your monthly income"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Coverage Percentage: {coverage}%
                    </label>
                    <input
                      type="range"
                      min="40"
                      max="80"
                      value={coverage}
                      onChange={(e) => setCoverage(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>40%</span>
                      <span>80%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-[#36596A] mb-6">Your Results</h2>
                
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      ${calculateBenefit().toLocaleString()}
                    </div>
                    <div className="text-sm text-blue-700">
                      Estimated Monthly Benefit
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Coverage Percentage:</span>
                      <span className="font-medium">{coverage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Annual Benefit:</span>
                      <span className="font-medium">${(calculateBenefit() * 12).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Key Considerations</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Most policies cover 60-80% of income</li>
                    <li>• Benefits are typically tax-free if you pay premiums</li>
                    <li>• Consider both short and long-term coverage</li>
                    <li>• Review your employer's coverage options</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <h3 className="text-lg font-semibold text-[#36596A] mb-4">
                Ready to Protect Your Income?
              </h3>
              <p className="text-gray-600 mb-6">
                Get personalized disability insurance recommendations from our experts.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                Get Insurance Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisabilityInsuranceCalculator;