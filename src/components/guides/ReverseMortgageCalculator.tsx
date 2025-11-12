import React, { useState } from 'react';

const ReverseMortgageCalculator: React.FC = () => {
  const [homeValue, setHomeValue] = useState<number>(400000);
  const [borrowerAge, setBorrowerAge] = useState<number>(65);
  const [spouseAge, setSpouseAge] = useState<number>(0);
  const [mortgageBalance, setMortgageBalance] = useState<number>(0);
  
  const calculateReverseMortgage = () => {
    // Simplified calculation - actual rates vary by lender and market conditions
    const youngestAge = spouseAge > 0 ? Math.min(borrowerAge, spouseAge) : borrowerAge;
    
    // Principal Limit Factor (PLF) - simplified based on age
    let plf = 0;
    if (youngestAge >= 62 && youngestAge < 65) plf = 0.52;
    else if (youngestAge >= 65 && youngestAge < 70) plf = 0.56;
    else if (youngestAge >= 70 && youngestAge < 75) plf = 0.60;
    else if (youngestAge >= 75 && youngestAge < 80) plf = 0.64;
    else if (youngestAge >= 80) plf = 0.68;
    
    const principalLimit = homeValue * plf;
    const availableProceeds = Math.max(0, principalLimit - mortgageBalance);
    const closingCosts = homeValue * 0.05; // Estimate 5% for closing costs
    const netProceeds = Math.max(0, availableProceeds - closingCosts);
    
    return {
      principalLimit,
      availableProceeds,
      closingCosts,
      netProceeds,
      monthlyPayment: netProceeds / 120 // If taken as monthly payments over 10 years
    };
  };

  const results = calculateReverseMortgage();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#36596A] mb-4">
              Reverse Mortgage Calculator
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Estimate how much you might be able to borrow with a reverse mortgage (HECM).
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-xl font-semibold text-[#36596A] mb-6">Enter Your Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Home Value
                  </label>
                  <input
                    type="number"
                    value={homeValue}
                    onChange={(e) => setHomeValue(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="400000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Age
                  </label>
                  <input
                    type="number"
                    value={borrowerAge}
                    onChange={(e) => setBorrowerAge(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="62"
                    max="100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Must be 62 or older to qualify
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spouse Age (if applicable)
                  </label>
                  <input
                    type="number"
                    value={spouseAge}
                    onChange={(e) => setSpouseAge(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="100"
                    placeholder="Leave blank if no spouse"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Calculation based on younger spouse's age
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Mortgage Balance
                  </label>
                  <input
                    type="number"
                    value={mortgageBalance}
                    onChange={(e) => setMortgageBalance(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Must be paid off with reverse mortgage proceeds
                  </p>
                </div>
              </div>
            </div>
            
            {/* Results Section */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-xl font-semibold text-[#36596A] mb-6">Estimated Results</h2>
              
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    ${results.netProceeds.toLocaleString()}
                  </div>
                  <div className="text-gray-600">
                    Estimated Net Proceeds
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Principal Limit:</span>
                    <span className="font-medium">${results.principalLimit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Mortgage Payoff:</span>
                    <span className="font-medium">-${mortgageBalance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Estimated Closing Costs:</span>
                    <span className="font-medium">-${results.closingCosts.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t-2 border-gray-300">
                    <span className="text-gray-800 font-semibold">Available to You:</span>
                    <span className="font-bold text-green-600">${results.netProceeds.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Payment Options</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Lump Sum:</span>
                      <span className="font-medium">${results.netProceeds.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Monthly for 10 years:</span>
                      <span className="font-medium">${Math.round(results.monthlyPayment).toLocaleString()}/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Line of Credit:</span>
                      <span className="font-medium">Available as needed</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">Important Notes</h4>
                  <ul className="text-yellow-800 text-sm space-y-1">
                    <li>• This is a simplified estimate for illustration only</li>
                    <li>• Actual amounts depend on current interest rates</li>
                    <li>• You must continue paying property taxes and insurance</li>
                    <li>• The home must be your primary residence</li>
                    <li>• Loan becomes due when you sell, move, or pass away</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-lg font-semibold text-[#36596A] mb-4">
              Considering a Reverse Mortgage?
            </h3>
            <p className="text-gray-600 mb-6">
              Get personalized guidance and accurate quotes from licensed reverse mortgage specialists.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
              Get Reverse Mortgage Information
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReverseMortgageCalculator;