'use client';

import React, { useState, useEffect } from 'react';
import { Calculator, Shield, DollarSign, TrendingUp, AlertTriangle, CheckCircle, Calendar, Target } from 'lucide-react';

interface HSAStrategyCalculatorProps {
  className?: string;
}

interface CalculationResults {
  currentYearContribution: number;
  catchUpContribution: number;
  totalAnnualContribution: number;
  projectedBalance: {
    year5: number;
    year10: number;
    year15: number;
    year20: number;
    retirement: number;
  };
  taxSavings: {
    currentYear: number;
    lifetime: number;
  };
  retirementHealthcareFund: number;
  recommendations: string[];
}

const HSAStrategyCalculator: React.FC<HSAStrategyCalculatorProps> = ({ className = '' }) => {
  const [formData, setFormData] = useState({
    age: 35,
    currentHSA: 0,
    annualContribution: 4150,
    coverageType: 'self',
    retirementAge: 65,
    expectedReturn: 7,
    currentTaxBracket: 22,
    retirementTaxBracket: 12,
    healthcareExpenses: 5000
  });

  const [results, setResults] = useState<CalculationResults | null>(null);
  const [showResults, setShowResults] = useState(false);

  const contributionLimits = {
    'self': 4150,
    'family': 8300
  };

  const catchUpContribution = 1000;

  const calculateHSAStrategy = () => {
    const { age, currentHSA, annualContribution, coverageType, retirementAge, expectedReturn, currentTaxBracket, retirementTaxBracket, healthcareExpenses } = formData;

    // Calculate contribution limits
    const baseLimit = contributionLimits[coverageType as keyof typeof contributionLimits];
    const catchUp = age >= 55 ? catchUpContribution : 0;
    const maxContribution = Math.min(annualContribution, baseLimit + catchUp);

    // Calculate projected balances
    const yearsToRetirement = retirementAge - age;
    const projectedBalance = {
      year5: calculateProjectedBalance(currentHSA, maxContribution, expectedReturn, 5),
      year10: calculateProjectedBalance(currentHSA, maxContribution, expectedReturn, 10),
      year15: calculateProjectedBalance(currentHSA, maxContribution, expectedReturn, 15),
      year20: calculateProjectedBalance(currentHSA, maxContribution, expectedReturn, 20),
      retirement: calculateProjectedBalance(currentHSA, maxContribution, expectedReturn, yearsToRetirement)
    };

    // Calculate tax savings
    const currentYearTaxSavings = maxContribution * (currentTaxBracket / 100);
    const lifetimeTaxSavings = currentYearTaxSavings * yearsToRetirement;

    // Calculate retirement healthcare fund
    const retirementHealthcareFund = projectedBalance.retirement;

    // Generate recommendations
    const recommendations = [];
    
    if (age < 55 && maxContribution < baseLimit) {
      recommendations.push('Consider maximizing your HSA contributions to take advantage of the triple tax benefit.');
    }
    
    if (age >= 55 && catchUp === 0) {
      recommendations.push('You\'re eligible for catch-up contributions. Consider adding $1,000 annually.');
    }
    
    if (currentHSA === 0) {
      recommendations.push('Start contributing to an HSA immediately to maximize long-term growth potential.');
    }
    
    if (expectedReturn < 6) {
      recommendations.push('Consider investing your HSA funds in growth-oriented investments for better long-term returns.');
    }
    
    if (healthcareExpenses > 0) {
      recommendations.push('Consider paying current medical expenses out-of-pocket to maximize HSA growth.');
    }
    
    if (retirementTaxBracket > currentTaxBracket) {
      recommendations.push('Your tax bracket will be lower in retirement, making HSA contributions even more valuable.');
    }

    const calculationResults: CalculationResults = {
      currentYearContribution: maxContribution,
      catchUpContribution: catchUp,
      totalAnnualContribution: maxContribution,
      projectedBalance,
      taxSavings: {
        currentYear: currentYearTaxSavings,
        lifetime: lifetimeTaxSavings
      },
      retirementHealthcareFund,
      recommendations
    };

    setResults(calculationResults);
    setShowResults(true);
  };

  const calculateProjectedBalance = (current: number, annualContribution: number, returnRate: number, years: number) => {
    let balance = current;
    const monthlyReturn = returnRate / 100 / 12;
    const monthlyContribution = annualContribution / 12;
    
    for (let month = 0; month < years * 12; month++) {
      balance = balance * (1 + monthlyReturn) + monthlyContribution;
    }
    
    return Math.round(balance);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className={`p-6 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">HSA Strategy Calculator</h2>
          </div>
          <p className="text-lg text-gray-600">
            Maximize your Health Savings Account benefits for retirement healthcare planning
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Calculator className="h-5 w-5 text-blue-600 mr-2" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="18"
                    max="65"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Retirement Age</label>
                  <input
                    type="number"
                    value={formData.retirementAge}
                    onChange={(e) => handleInputChange('retirementAge', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="55"
                    max="75"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Coverage Type</label>
                <select
                  value={formData.coverageType}
                  onChange={(e) => handleInputChange('coverageType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="self">Self-Only Coverage</option>
                  <option value="family">Family Coverage</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                HSA Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current HSA Balance</label>
                  <input
                    type="number"
                    value={formData.currentHSA}
                    onChange={(e) => handleInputChange('currentHSA', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Annual Contribution</label>
                  <input
                    type="number"
                    value={formData.annualContribution}
                    onChange={(e) => handleInputChange('annualContribution', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max={contributionLimits[formData.coverageType as keyof typeof contributionLimits] + (formData.age >= 55 ? catchUpContribution : 0)}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Max: ${contributionLimits[formData.coverageType as keyof typeof contributionLimits] + (formData.age >= 55 ? catchUpContribution : 0)}
                    {formData.age >= 55 && ' (includes $1,000 catch-up)'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 text-purple-600 mr-2" />
                Investment & Tax Assumptions
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expected Annual Return (%)</label>
                  <input
                    type="number"
                    value={formData.expectedReturn}
                    onChange={(e) => handleInputChange('expectedReturn', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="15"
                    step="0.1"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Tax Bracket (%)</label>
                    <select
                      value={formData.currentTaxBracket}
                      onChange={(e) => handleInputChange('currentTaxBracket', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Retirement Tax Bracket (%)</label>
                    <select
                      value={formData.retirementTaxBracket}
                      onChange={(e) => handleInputChange('retirementTaxBracket', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Target className="h-5 w-5 text-orange-600 mr-2" />
                Healthcare Planning
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Healthcare Expenses (Current)</label>
                <input
                  type="number"
                  value={formData.healthcareExpenses}
                  onChange={(e) => handleInputChange('healthcareExpenses', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Consider paying these out-of-pocket to maximize HSA growth
                </p>
              </div>
            </div>

            <button
              onClick={calculateHSAStrategy}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
            >
              <Calculator className="h-5 w-5 mr-2" />
              Calculate HSA Strategy
            </button>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {showResults && results && (
              <>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    Your HSA Strategy Analysis
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-blue-600 font-medium">Annual Contribution</p>
                        <p className="text-2xl font-bold text-blue-800">${results.currentYearContribution.toLocaleString()}</p>
                        {results.catchUpContribution > 0 && (
                          <p className="text-sm text-blue-600">(includes ${results.catchUpContribution} catch-up)</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-green-600 font-medium">Current Year Tax Savings</p>
                        <p className="text-2xl font-bold text-green-800">${results.taxSavings.currentYear.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-purple-600 font-medium">Retirement Healthcare Fund</p>
                        <p className="text-2xl font-bold text-purple-800">${results.retirementHealthcareFund.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                    Projected HSA Growth
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">5 Years:</span>
                      <span className="font-medium">${results.projectedBalance.year5.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">10 Years:</span>
                      <span className="font-medium">${results.projectedBalance.year10.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">15 Years:</span>
                      <span className="font-medium">${results.projectedBalance.year15.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">20 Years:</span>
                      <span className="font-medium">${results.projectedBalance.year20.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-800 font-medium">Retirement:</span>
                      <span className="font-bold text-blue-600">${results.projectedBalance.retirement.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                    Recommendations
                  </h3>
                  
                  <div className="space-y-3">
                    {results.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {!showResults && (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Click "Calculate" to see your HSA strategy analysis</p>
              </div>
            )}
          </div>
        </div>

        {/* HSA Benefits Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Shield className="h-5 w-5 text-blue-600 mr-2" />
            HSA Triple Tax Advantage
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Tax Deductible</h4>
              <p className="text-green-700 text-sm">Contributions reduce your current taxable income</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Tax-Free Growth</h4>
              <p className="text-blue-700 text-sm">Earnings and interest grow without taxation</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2">Tax-Free Withdrawals</h4>
              <p className="text-purple-700 text-sm">No taxes on qualified medical expenses</p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Important HSA Rules</h3>
          <ul className="text-sm text-blue-700 space-y-2">
            <li>• Must be enrolled in a qualifying high-deductible health plan (HDHP)</li>
            <li>• 2024 contribution limits: $4,150 (self) / $8,300 (family) + $1,000 catch-up (age 55+)</li>
            <li>• No required minimum distributions (RMDs) unlike traditional IRAs</li>
            <li>• After age 65, can withdraw for any purpose (taxed as income if not for medical expenses)</li>
            <li>• HSA funds are portable and can be invested for long-term growth</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HSAStrategyCalculator;


