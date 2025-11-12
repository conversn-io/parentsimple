import React, { useState } from 'react';

const LTCInsuranceCalculator: React.FC = () => {
  const [age, setAge] = useState<number>(55);
  const [gender, setGender] = useState<string>('female');
  const [healthStatus, setHealthStatus] = useState<string>('good');
  
  const calculatePremium = () => {
    // Simplified premium calculation
    let basePremium = 2000; // Base annual premium
    
    // Age adjustment
    if (age < 50) basePremium *= 0.7;
    else if (age > 65) basePremium *= 1.5;
    
    // Gender adjustment (females typically pay more due to longer life expectancy)
    if (gender === 'female') basePremium *= 1.2;
    
    // Health adjustment
    if (healthStatus === 'excellent') basePremium *= 0.8;
    else if (healthStatus === 'poor') basePremium *= 1.4;
    
    return Math.round(basePremium);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#36596A] mb-4">
              Long-Term Care Insurance Calculator
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get an estimate of long-term care insurance premiums based on your age, gender, and health status.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-xl font-semibold text-[#36596A] mb-6">Enter Your Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="40"
                    max="75"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Most insurers accept applications between ages 40-75
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Health Status
                  </label>
                  <select
                    value={healthStatus}
                    onChange={(e) => setHealthStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Results Section */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-xl font-semibold text-[#36596A] mb-6">Estimated Premium</h2>
              
              <div className="text-center mb-8">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  ${calculatePremium().toLocaleString()}
                </div>
                <div className="text-gray-600">
                  Estimated Annual Premium
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  ${Math.round(calculatePremium() / 12).toLocaleString()} per month
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Typical Coverage Includes:</h3>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• $150-300 daily benefit amount</li>
                    <li>• 3-5 year benefit period</li>
                    <li>• 90-day elimination period</li>
                    <li>• 3% compound inflation protection</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">Factors Affecting Premium:</h3>
                  <ul className="text-green-800 text-sm space-y-1">
                    <li>• Age at application</li>
                    <li>• Health status and medical history</li>
                    <li>• Gender (women typically pay more)</li>
                    <li>• Benefit amount and period</li>
                    <li>• Elimination period length</li>
                    <li>• Inflation protection options</li>
                  </ul>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 bg-yellow-50 p-4 rounded-lg">
                <p className="mb-2">
                  <strong>Important Note:</strong> This is a simplified estimate for illustration purposes only.
                </p>
                <p>
                  Actual premiums vary significantly based on the insurance company, specific policy features, 
                  detailed health underwriting, and current market conditions.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-lg font-semibold text-[#36596A] mb-4">
              Ready to Get Accurate Quotes?
            </h3>
            <p className="text-gray-600 mb-6">
              Get personalized long-term care insurance quotes from multiple top-rated insurers.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
              Get LTC Insurance Quotes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LTCInsuranceCalculator;