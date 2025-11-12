import React, { useState } from 'react';

const LifeInsuranceCalculator: React.FC = () => {
  const [age, setAge] = useState<number>(35);
  const [income, setIncome] = useState<number>(75000);
  const [dependents, setDependents] = useState<number>(2);
  const [debt, setDebt] = useState<number>(200000);
  
  const calculateCoverage = () => {
    // Basic calculation: 10x income + debt + education costs
    const educationCosts = dependents * 100000; // $100k per child for education
    const incomeReplacement = income * 10;
    return incomeReplacement + debt + educationCosts;
  };

  const estimatePremium = () => {
    // Very simplified premium calculation
    const coverage = calculateCoverage();
    const basePremium = (coverage / 100000) * 12; // $12 per $100k coverage
    const ageMultiplier = 1 + ((age - 25) * 0.02); // 2% increase per year over 25
    return Math.round(basePremium * ageMultiplier);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#36596A] mb-4">
              Life Insurance Calculator
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Calculate how much life insurance coverage you may need to protect your family's financial future.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-xl font-semibold text-[#36596A] mb-6">Enter Your Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Age
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="18"
                    max="80"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Income
                  </label>
                  <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="75000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Dependents
                  </label>
                  <input
                    type="number"
                    value={dependents}
                    onChange={(e) => setDependents(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Debt (Mortgage, etc.)
                  </label>
                  <input
                    type="number"
                    value={debt}
                    onChange={(e) => setDebt(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="200000"
                  />
                </div>
              </div>
            </div>
            
            {/* Results Section */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-xl font-semibold text-[#36596A] mb-6">Recommended Coverage</h2>
              
              <div className="text-center mb-8">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  ${calculateCoverage().toLocaleString()}
                </div>
                <div className="text-gray-600">
                  Estimated Coverage Needed
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Income Replacement (10x):</span>
                  <span className="font-medium">${(income * 10).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Debt Coverage:</span>
                  <span className="font-medium">${debt.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Education Costs:</span>
                  <span className="font-medium">${(dependents * 100000).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-green-800 mb-2">Estimated Monthly Premium</h3>
                <div className="text-2xl font-bold text-green-600">
                  ${estimatePremium().toLocaleString()}/month
                </div>
                <p className="text-sm text-green-700 mt-1">
                  For a healthy {age}-year-old (term life insurance estimate)
                </p>
              </div>
              
              <div className="text-sm text-gray-600">
                <p className="mb-2">
                  <strong>Note:</strong> This is a simplified calculation for estimation purposes only.
                </p>
                <p>
                  Actual coverage needs and premiums vary based on health, lifestyle, and specific circumstances.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-lg font-semibold text-[#36596A] mb-4">
              Ready to Protect Your Family?
            </h3>
            <p className="text-gray-600 mb-6">
              Get personalized life insurance quotes from top-rated insurers.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
              Get Life Insurance Quotes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifeInsuranceCalculator;