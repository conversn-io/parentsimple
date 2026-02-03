import React, { useState } from 'react';

const MedicareCostCalculator: React.FC = () => {
  const [income, setIncome] = useState<number>(50000);
  const [filingStatus, setFilingStatus] = useState<string>('single');
  const [results, setResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateMedicareCosts = () => {
    // 2024 Medicare costs
    const partBBasePremium = 174.70; // Monthly Part B premium for most people
    const partDBasePremium = 34.70; // Average Part D premium
    
    // IRMAA thresholds for 2024
    const irmaaSingle = [
      { min: 0, max: 103000, partB: 0, partD: 0 },
      { min: 103001, max: 129000, partB: 69.90, partD: 12.90 },
      { min: 129001, max: 161000, partB: 174.90, partD: 33.30 },
      { min: 161001, max: 193000, partB: 279.90, partD: 53.80 },
      { min: 193001, max: 500000, partB: 384.90, partD: 74.20 },
      { min: 500001, max: Infinity, partB: 419.30, partD: 81.00 }
    ];
    
    const irmaaMarried = [
      { min: 0, max: 206000, partB: 0, partD: 0 },
      { min: 206001, max: 258000, partB: 69.90, partD: 12.90 },
      { min: 258001, max: 322000, partB: 174.90, partD: 33.30 },
      { min: 322001, max: 386000, partB: 279.90, partD: 53.80 },
      { min: 386001, max: 750000, partB: 384.90, partD: 74.20 },
      { min: 750001, max: Infinity, partB: 419.30, partD: 81.00 }
    ];
    
    const thresholds = filingStatus === 'married' ? irmaaMarried : irmaaSingle;
    const bracket = thresholds.find(t => income >= t.min && income <= t.max);
    
    const monthlyPartB = partBBasePremium + (bracket?.partB || 0);
    const monthlyPartD = partDBasePremium + (bracket?.partD || 0);
    const monthlyTotal = monthlyPartB + monthlyPartD;
    
    return {
      partB: {
        base: partBBasePremium,
        irmaa: bracket?.partB || 0,
        total: monthlyPartB
      },
      partD: {
        base: partDBasePremium,
        irmaa: bracket?.partD || 0,
        total: monthlyPartD
      },
      monthly: monthlyTotal,
      annual: monthlyTotal * 12
    };
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setResults(calculateMedicareCosts());
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#36596A] mb-4">
              Medicare Cost Calculator
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Calculate your Medicare Part B and Part D premiums based on your income and filing status.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-xl font-semibold text-[#36596A] mb-6">Enter Your Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modified Adjusted Gross Income (MAGI)
                  </label>
                  <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="50000"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Based on your tax return from 2 years ago
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filing Status
                  </label>
                  <select
                    value={filingStatus}
                    onChange={(e) => setFilingStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="single">Single</option>
                    <option value="married">Married Filing Jointly</option>
                  </select>
                </div>
                
                <button
                  onClick={handleCalculate}
                  disabled={isCalculating}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isCalculating ? 'Calculating...' : 'Calculate Medicare Costs'}
                </button>
              </div>
            </div>
            
            {/* Results Section */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-xl font-semibold text-[#36596A] mb-6">Your Medicare Costs</h2>
              
              {results ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      ${results.monthly.toFixed(2)}
                    </div>
                    <div className="text-gray-600">Total Monthly Premium</div>
                    <div className="text-sm text-gray-500">
                      ${results.annual.toFixed(2)} annually
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-3">Part B (Medical Insurance)</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-700">Base Premium:</span>
                          <span className="font-medium">${results.partB.base}</span>
                        </div>
                        {results.partB.irmaa > 0 && (
                          <div className="flex justify-between">
                            <span className="text-blue-700">IRMAA Surcharge:</span>
                            <span className="font-medium">+${results.partB.irmaa}</span>
                          </div>
                        )}
                        <div className="flex justify-between border-t pt-2">
                          <span className="text-blue-800 font-medium">Total Part B:</span>
                          <span className="font-bold">${results.partB.total}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-900 mb-3">Part D (Prescription Drugs)</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-green-700">Base Premium:</span>
                          <span className="font-medium">${results.partD.base}</span>
                        </div>
                        {results.partD.irmaa > 0 && (
                          <div className="flex justify-between">
                            <span className="text-green-700">IRMAA Surcharge:</span>
                            <span className="font-medium">+${results.partD.irmaa}</span>
                          </div>
                        )}
                        <div className="flex justify-between border-t pt-2">
                          <span className="text-green-800 font-medium">Total Part D:</span>
                          <span className="font-bold">${results.partD.total}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {(results.partB.irmaa > 0 || results.partD.irmaa > 0) && (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-yellow-900 mb-2">IRMAA Applies</h4>
                      <p className="text-yellow-800 text-sm">
                        You're subject to Income-Related Monthly Adjustment Amount (IRMAA) surcharges 
                        due to your higher income level.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">
                    Enter your information and click calculate to see your Medicare costs
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-8 bg-white rounded-lg shadow-md p-8">
            <h3 className="text-lg font-semibold text-[#36596A] mb-4">Important Notes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">About IRMAA</h4>
                <p>
                  IRMAA (Income-Related Monthly Adjustment Amount) is an additional premium you pay for Medicare 
                  Part B and Part D if your modified adjusted gross income is above certain thresholds.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Income Lookback</h4>
                <p>
                  Medicare uses your tax return from 2 years ago to determine your current year premiums. 
                  If your income has changed significantly, you may be able to appeal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicareCostCalculator;