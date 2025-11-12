'use client';

import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, PiggyBank, Clock, Heart } from 'lucide-react';

interface ConversionResults {
  taxCost: number;
  netBenefit: number;
  rothValue: number;
  traditionalValue: number;
  breakEvenTime: number;
  recommendation: string;
}

export default function RothConversionCalculator() {
  const [formData, setFormData] = useState({
    currentAge: 55,
    iraBalance: 500000,
    conversionAmount: 100000,
    currentTaxBracket: 22,
    retirementTaxBracket: 22,
    returnRate: 7,
    yearsUntilRetirement: 10
  });

  const [results, setResults] = useState<ConversionResults>({
    taxCost: 0,
    netBenefit: 0,
    rothValue: 0,
    traditionalValue: 0,
    breakEvenTime: 0,
    recommendation: 'Calculate to see'
  });

  const calculateConversion = () => {
    const {
      conversionAmount,
      currentTaxBracket,
      retirementTaxBracket,
      returnRate,
      yearsUntilRetirement
    } = formData;

    // Calculate tax cost of conversion
    const taxCost = conversionAmount * (currentTaxBracket / 100);
    
    // Calculate future value of converted amount (Roth)
    const rothFutureValue = conversionAmount * Math.pow(1 + returnRate / 100, yearsUntilRetirement);
    
    // Calculate future value if not converted (Traditional)
    const traditionalFutureValue = (conversionAmount * Math.pow(1 + returnRate / 100, yearsUntilRetirement)) * (1 - retirementTaxBracket / 100);
    
    // Calculate net benefit
    const netBenefit = rothFutureValue - traditionalFutureValue - taxCost;
    
    // Calculate break-even time
    let breakEvenTime = 0;
    for (let year = 1; year <= yearsUntilRetirement; year++) {
      const rothValue = conversionAmount * Math.pow(1 + returnRate / 100, year);
      const traditionalValue = (conversionAmount * Math.pow(1 + returnRate / 100, year)) * (1 - retirementTaxBracket / 100);
      if (rothValue - traditionalValue >= taxCost) {
        breakEvenTime = year;
        break;
      }
    }
    
    // Recommendation
    let recommendation = '';
    if (netBenefit > 0) {
      recommendation = 'Favorable';
    } else if (netBenefit < 0) {
      recommendation = 'Not Favorable';
    } else {
      recommendation = 'Neutral';
    }

    setResults({
      taxCost,
      netBenefit,
      rothValue: rothFutureValue,
      traditionalValue: traditionalFutureValue,
      breakEvenTime,
      recommendation
    });
  };

  useEffect(() => {
    calculateConversion();
  }, [formData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-8 mb-8">
        <div className="text-center">
          <Calculator className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Roth Conversion Calculator</h1>
          <p className="text-xl opacity-90">Analyze the benefits of converting traditional IRA funds to Roth IRA</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Input Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Calculator className="w-6 h-6 text-blue-600 mr-2" />
              Calculator Inputs
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Age</label>
                <input
                  type="number"
                  value={formData.currentAge}
                  onChange={(e) => handleInputChange('currentAge', e.target.value)}
                  min="18"
                  max="100"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Traditional IRA Balance</label>
                <input
                  type="number"
                  value={formData.iraBalance}
                  onChange={(e) => handleInputChange('iraBalance', e.target.value)}
                  min="0"
                  step="1000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Convert</label>
                <input
                  type="number"
                  value={formData.conversionAmount}
                  onChange={(e) => handleInputChange('conversionAmount', e.target.value)}
                  min="0"
                  step="1000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Tax Bracket (%)</label>
                <select
                  value={formData.currentTaxBracket}
                  onChange={(e) => handleInputChange('currentTaxBracket', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={10}>10%</option>
                  <option value={12}>12%</option>
                  <option value={22}>22%</option>
                  <option value={24}>24%</option>
                  <option value={32}>32%</option>
                  <option value={35}>35%</option>
                  <option value={37}>37%</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expected Retirement Tax Bracket (%)</label>
                <select
                  value={formData.retirementTaxBracket}
                  onChange={(e) => handleInputChange('retirementTaxBracket', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={10}>10%</option>
                  <option value={12}>12%</option>
                  <option value={22}>22%</option>
                  <option value={24}>24%</option>
                  <option value={32}>32%</option>
                  <option value={35}>35%</option>
                  <option value={37}>37%</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expected Annual Return (%)</label>
                <input
                  type="number"
                  value={formData.returnRate}
                  onChange={(e) => handleInputChange('returnRate', e.target.value)}
                  min="0"
                  max="20"
                  step="0.1"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Years Until Retirement</label>
                <input
                  type="number"
                  value={formData.yearsUntilRetirement}
                  onChange={(e) => handleInputChange('yearsUntilRetirement', e.target.value)}
                  min="1"
                  max="50"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Calculate Button */}
            <div className="mt-6 text-center">
              <button
                onClick={calculateConversion}
                className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center mx-auto font-semibold shadow-lg hover:shadow-xl"
              >
                <Calculator className="h-5 w-5 mr-2" />
                {results.recommendation !== 'Calculate to see' ? 'Recalculate Conversion' : 'Calculate Roth Conversion'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Results Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 text-green-600 mr-2" />
              Conversion Analysis Results
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                  <h3 className="text-lg font-semibold text-red-800 mb-2 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Tax Cost of Conversion
                  </h3>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(results.taxCost)}</p>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center">
                    <PiggyBank className="w-5 h-5 mr-2" />
                    Net Benefit
                  </h3>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(results.netBenefit)}</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">Future Value Comparison</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-blue-700">With Roth Conversion</h4>
                    <p className="text-lg font-bold text-blue-600">{formatCurrency(results.rothValue)}</p>
                    <p className="text-sm text-blue-500">Tax-free withdrawals</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-700">Without Conversion</h4>
                    <p className="text-lg font-bold text-blue-600">{formatCurrency(results.traditionalValue)}</p>
                    <p className="text-sm text-blue-500">After-tax value</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                <h3 className="text-xl font-semibold text-purple-800 mb-4">Break-Even Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-purple-700">Break-Even Time</h4>
                    <p className="text-lg font-bold text-purple-600">
                      {results.breakEvenTime > 0 ? `${results.breakEvenTime} years` : 'Never'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-700">Conversion Recommendation</h4>
                    <p className="text-lg font-bold text-purple-600">{results.recommendation}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Key Benefits Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Heart className="w-6 h-6 text-yellow-600 mr-2" />
          Key Benefits of Roth Conversion
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
            <DollarSign className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Tax-Free Growth</h3>
            <p className="text-sm text-blue-600">All future growth and withdrawals are completely tax-free</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
            <Clock className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">No RMDs</h3>
            <p className="text-sm text-green-600">No required minimum distributions during your lifetime</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
            <Heart className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="text-lg font-semibold text-purple-800 mb-2">Legacy Benefits</h3>
            <p className="text-sm text-purple-600">Tax-free inheritance for your beneficiaries</p>
          </div>
        </div>
      </div>
      
      {/* Considerations Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <TrendingUp className="w-6 h-6 text-orange-600 mr-2" />
          Important Considerations
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">When Roth Conversion Makes Sense</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-green-600 mt-1 mr-2">✓</span>
                <span>You expect to be in a higher tax bracket in retirement</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mt-1 mr-2">✓</span>
                <span>You have cash outside of retirement accounts to pay taxes</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mt-1 mr-2">✓</span>
                <span>You want to leave tax-free money to heirs</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mt-1 mr-2">✓</span>
                <span>You're in a low-income year</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Potential Drawbacks</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-red-600 mt-1 mr-2">✗</span>
                <span>Immediate tax bill on converted amount</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mt-1 mr-2">✗</span>
                <span>Could push you into higher tax bracket</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mt-1 mr-2">✗</span>
                <span>May affect Medicare premiums</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mt-1 mr-2">✗</span>
                <span>5-year rule for penalty-free withdrawals</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Optimize Your Retirement Tax Strategy?</h2>
        <p className="text-lg mb-6">Speak with a qualified financial advisor to determine if Roth conversion is right for your situation.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200">
            Schedule Consultation
          </button>
          <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-200">
            Download Results
          </button>
        </div>
      </div>
    </div>
  );
}