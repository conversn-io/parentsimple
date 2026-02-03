'use client';

import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, TrendingUp, AlertTriangle, CheckCircle, PieChart, Target, Calendar } from 'lucide-react';

interface TaxEfficientWithdrawalsCalculatorProps {
  className?: string;
}

interface AccountBalance {
  traditional401k: number;
  roth401k: number;
  traditionalIRA: number;
  rothIRA: number;
  taxable: number;
  hsa: number;
}

interface CalculationResults {
  annualIncomeNeed: number;
  optimalWithdrawalStrategy: {
    traditional: number;
    roth: number;
    taxable: number;
    hsa: number;
  };
  taxImpact: {
    totalTaxes: number;
    effectiveTaxRate: number;
    marginalTaxRate: number;
  };
  projectedBalances: {
    year1: AccountBalance;
    year5: AccountBalance;
    year10: AccountBalance;
  };
  recommendations: string[];
  taxSavings: number;
}

const TaxEfficientWithdrawalsCalculator: React.FC<TaxEfficientWithdrawalsCalculatorProps> = ({ className = '' }) => {
  const [formData, setFormData] = useState({
    age: 65,
    annualIncomeNeed: 80000,
    socialSecurity: 30000,
    pension: 0,
    currentTaxBracket: 22,
    retirementTaxBracket: 12,
    accounts: {
      traditional401k: 500000,
      roth401k: 100000,
      traditionalIRA: 200000,
      rothIRA: 50000,
      taxable: 300000,
      hsa: 50000
    },
    expectedReturn: 6,
    inflation: 3
  });

  const [results, setResults] = useState<CalculationResults | null>(null);
  const [showResults, setShowResults] = useState(false);

  const taxBrackets = {
    10: { min: 0, max: 11000 },
    12: { min: 11000, max: 44725 },
    22: { min: 44725, max: 95375 },
    24: { min: 95375, max: 182050 },
    32: { min: 182050, max: 231250 },
    35: { min: 231250, max: 578125 },
    37: { min: 578125, max: Infinity }
  };

  const calculateTaxEfficientWithdrawals = () => {
    const { age, annualIncomeNeed, socialSecurity, pension, currentTaxBracket, retirementTaxBracket, accounts, expectedReturn, inflation } = formData;

    // Calculate income gap
    const otherIncome = socialSecurity + pension;
    const incomeGap = Math.max(0, annualIncomeNeed - otherIncome);

    // Calculate optimal withdrawal strategy
    const optimalStrategy = calculateOptimalWithdrawalStrategy(incomeGap, accounts, retirementTaxBracket);

    // Calculate tax impact
    const taxImpact = calculateTaxImpact(optimalStrategy, socialSecurity, retirementTaxBracket);

    // Calculate projected balances
    const projectedBalances = calculateProjectedBalances(accounts, optimalStrategy, expectedReturn, inflation);

    // Generate recommendations
    const recommendations = generateRecommendations(optimalStrategy, taxImpact, accounts, age);

    // Calculate tax savings vs. naive strategy
    const naiveStrategy = { traditional: incomeGap, roth: 0, taxable: 0, hsa: 0 };
    const naiveTaxImpact = calculateTaxImpact(naiveStrategy, socialSecurity, retirementTaxBracket);
    const taxSavings = naiveTaxImpact.totalTaxes - taxImpact.totalTaxes;

    const calculationResults: CalculationResults = {
      annualIncomeNeed,
      optimalWithdrawalStrategy: optimalStrategy,
      taxImpact,
      projectedBalances,
      recommendations,
      taxSavings
    };

    setResults(calculationResults);
    setShowResults(true);
  };

  const calculateOptimalWithdrawalStrategy = (incomeGap: number, accounts: AccountBalance, taxBracket: number) => {
    const strategy = { traditional: 0, roth: 0, taxable: 0, hsa: 0 };
    
    // Strategy: Fill lower tax brackets with traditional withdrawals first
    const standardDeduction = 13850; // 2023 standard deduction for 65+
    const bracket12Max = 44725;
    const bracket22Max = 95375;
    
    let remainingNeed = incomeGap;
    let taxableIncome = 0;

    // 1. Use HSA for medical expenses (assume 20% of income for healthcare)
    const healthcareExpenses = incomeGap * 0.2;
    strategy.hsa = Math.min(healthcareExpenses, accounts.hsa);
    remainingNeed -= strategy.hsa;

    // 2. Fill standard deduction and 12% bracket with traditional withdrawals
    const traditionalForLowBrackets = Math.min(
      remainingNeed,
      standardDeduction + bracket12Max - taxableIncome,
      accounts.traditional401k + accounts.traditionalIRA
    );
    strategy.traditional = traditionalForLowBrackets;
    remainingNeed -= traditionalForLowBrackets;
    taxableIncome += traditionalForLowBrackets;

    // 3. Use taxable account for capital gains (lower tax rate)
    if (remainingNeed > 0) {
      const taxableWithdrawal = Math.min(remainingNeed, accounts.taxable);
      strategy.taxable = taxableWithdrawal;
      remainingNeed -= taxableWithdrawal;
    }

    // 4. Use Roth for remaining needs
    if (remainingNeed > 0) {
      strategy.roth = Math.min(remainingNeed, accounts.roth401k + accounts.rothIRA);
    }

    return strategy;
  };

  const calculateTaxImpact = (strategy: any, socialSecurity: number, taxBracket: number) => {
    // Calculate taxable income
    let taxableIncome = strategy.traditional;
    
    // Add portion of Social Security that's taxable
    const provisionalIncome = strategy.traditional + strategy.taxable + socialSecurity * 0.5;
    let taxableSS = 0;
    
    if (provisionalIncome > 44000) {
      taxableSS = Math.min(socialSecurity * 0.85, socialSecurity);
    } else if (provisionalIncome > 32000) {
      taxableSS = Math.min((provisionalIncome - 32000) * 0.5, socialSecurity * 0.5);
    }
    
    taxableIncome += taxableSS;

    // Calculate capital gains tax on taxable account
    const capitalGainsTax = strategy.taxable * 0.15; // Assume 15% capital gains rate

    // Calculate income tax
    const incomeTax = calculateIncomeTax(taxableIncome);

    const totalTaxes = incomeTax + capitalGainsTax;
    const effectiveTaxRate = (totalTaxes / (strategy.traditional + strategy.taxable + strategy.roth + strategy.hsa)) * 100;

    return {
      totalTaxes,
      effectiveTaxRate,
      marginalTaxRate: taxBracket
    };
  };

  const calculateIncomeTax = (taxableIncome: number) => {
    let tax = 0;
    let remainingIncome = taxableIncome;

    for (const [rate, bracket] of Object.entries(taxBrackets)) {
      if (remainingIncome <= 0) break;
      
      const bracketIncome = Math.min(remainingIncome, bracket.max - bracket.min);
      tax += bracketIncome * (parseInt(rate) / 100);
      remainingIncome -= bracketIncome;
    }

    return tax;
  };

  const calculateProjectedBalances = (accounts: AccountBalance, strategy: any, returnRate: number, inflation: number) => {
    const realReturn = (returnRate - inflation) / 100;
    
    const year1 = {
      traditional401k: Math.max(0, accounts.traditional401k - strategy.traditional * 0.7) * (1 + realReturn),
      roth401k: Math.max(0, accounts.roth401k - strategy.roth * 0.7) * (1 + realReturn),
      traditionalIRA: Math.max(0, accounts.traditionalIRA - strategy.traditional * 0.3) * (1 + realReturn),
      rothIRA: Math.max(0, accounts.rothIRA - strategy.roth * 0.3) * (1 + realReturn),
      taxable: Math.max(0, accounts.taxable - strategy.taxable) * (1 + realReturn),
      hsa: Math.max(0, accounts.hsa - strategy.hsa) * (1 + realReturn)
    };

    const year5 = {
      traditional401k: year1.traditional401k * Math.pow(1 + realReturn, 4),
      roth401k: year1.roth401k * Math.pow(1 + realReturn, 4),
      traditionalIRA: year1.traditionalIRA * Math.pow(1 + realReturn, 4),
      rothIRA: year1.rothIRA * Math.pow(1 + realReturn, 4),
      taxable: year1.taxable * Math.pow(1 + realReturn, 4),
      hsa: year1.hsa * Math.pow(1 + realReturn, 4)
    };

    const year10 = {
      traditional401k: year5.traditional401k * Math.pow(1 + realReturn, 5),
      roth401k: year5.roth401k * Math.pow(1 + realReturn, 5),
      traditionalIRA: year5.traditionalIRA * Math.pow(1 + realReturn, 5),
      rothIRA: year5.rothIRA * Math.pow(1 + realReturn, 5),
      taxable: year5.taxable * Math.pow(1 + realReturn, 5),
      hsa: year5.hsa * Math.pow(1 + realReturn, 5)
    };

    return { year1, year5, year10 };
  };

  const generateRecommendations = (strategy: any, taxImpact: any, accounts: AccountBalance, age: number) => {
    const recommendations = [];

    if (strategy.traditional > 0) {
      recommendations.push('Consider Roth conversions during low-income years to reduce future RMDs.');
    }

    if (strategy.roth > 0) {
      recommendations.push('Roth withdrawals are tax-free. Consider using these strategically to manage tax brackets.');
    }

    if (strategy.taxable > 0) {
      recommendations.push('Taxable account withdrawals are taxed at capital gains rates, which are typically lower than ordinary income rates.');
    }

    if (strategy.hsa > 0) {
      recommendations.push('HSA withdrawals for qualified medical expenses are tax-free. This is the most tax-efficient source.');
    }

    if (age < 73) {
      recommendations.push('Consider Roth conversions before RMDs begin at age 73 to reduce future tax burden.');
    }

    if (taxImpact.effectiveTaxRate > 15) {
      recommendations.push('Your effective tax rate is relatively high. Consider more aggressive Roth conversion strategies.');
    }

    return recommendations;
  };

  const handleInputChange = (field: string, value: string | number) => {
    if (field.startsWith('accounts.')) {
      const accountType = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        accounts: {
          ...prev.accounts,
          [accountType]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  return (
    <div className={`p-6 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Tax-Efficient Withdrawals Calculator</h2>
          </div>
          <p className="text-lg text-gray-600">
            Optimize your retirement account withdrawals to minimize taxes and maximize income
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Target className="h-5 w-5 text-blue-600 mr-2" />
                Retirement Income Needs
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Annual Income Need</label>
                  <input
                    type="number"
                    value={formData.annualIncomeNeed}
                    onChange={(e) => handleInputChange('annualIncomeNeed', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Social Security (Annual)</label>
                    <input
                      type="number"
                      value={formData.socialSecurity}
                      onChange={(e) => handleInputChange('socialSecurity', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pension (Annual)</label>
                    <input
                      type="number"
                      value={formData.pension}
                      onChange={(e) => handleInputChange('pension', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                Account Balances
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Traditional 401(k)</label>
                    <input
                      type="number"
                      value={formData.accounts.traditional401k}
                      onChange={(e) => handleInputChange('accounts.traditional401k', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Roth 401(k)</label>
                    <input
                      type="number"
                      value={formData.accounts.roth401k}
                      onChange={(e) => handleInputChange('accounts.roth401k', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Traditional IRA</label>
                    <input
                      type="number"
                      value={formData.accounts.traditionalIRA}
                      onChange={(e) => handleInputChange('accounts.traditionalIRA', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Roth IRA</label>
                    <input
                      type="number"
                      value={formData.accounts.rothIRA}
                      onChange={(e) => handleInputChange('accounts.rothIRA', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Taxable Account</label>
                    <input
                      type="number"
                      value={formData.accounts.taxable}
                      onChange={(e) => handleInputChange('accounts.taxable', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">HSA</label>
                    <input
                      type="number"
                      value={formData.accounts.hsa}
                      onChange={(e) => handleInputChange('accounts.hsa', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 text-purple-600 mr-2" />
                Assumptions
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="50"
                    max="85"
                  />
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

            <button
              onClick={calculateTaxEfficientWithdrawals}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
            >
              <Calculator className="h-5 w-5 mr-2" />
              Calculate Optimal Withdrawal Strategy
            </button>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {showResults && results && (
              <>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    Optimal Withdrawal Strategy
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <div className="text-center">
                        <p className="text-sm text-red-600 font-medium">Traditional Accounts</p>
                        <p className="text-2xl font-bold text-red-800">${results.optimalWithdrawalStrategy.traditional.toLocaleString()}</p>
                        <p className="text-sm text-red-600">Taxed as ordinary income</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="text-center">
                        <p className="text-sm text-green-600 font-medium">Roth Accounts</p>
                        <p className="text-2xl font-bold text-green-800">${results.optimalWithdrawalStrategy.roth.toLocaleString()}</p>
                        <p className="text-sm text-green-600">Tax-free withdrawals</p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="text-center">
                        <p className="text-sm text-blue-600 font-medium">Taxable Account</p>
                        <p className="text-2xl font-bold text-blue-800">${results.optimalWithdrawalStrategy.taxable.toLocaleString()}</p>
                        <p className="text-sm text-blue-600">Capital gains tax</p>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <div className="text-center">
                        <p className="text-sm text-purple-600 font-medium">HSA</p>
                        <p className="text-2xl font-bold text-purple-800">${results.optimalWithdrawalStrategy.hsa.toLocaleString()}</p>
                        <p className="text-sm text-purple-600">Tax-free for medical</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <DollarSign className="h-5 w-5 text-orange-600 mr-2" />
                    Tax Impact Analysis
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-orange-600 font-medium">Total Annual Taxes</p>
                        <p className="text-2xl font-bold text-orange-800">${results.taxImpact.totalTaxes.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-blue-600 font-medium">Effective Tax Rate</p>
                        <p className="text-2xl font-bold text-blue-800">{results.taxImpact.effectiveTaxRate.toFixed(1)}%</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-green-600 font-medium">Tax Savings vs. Naive Strategy</p>
                        <p className="text-2xl font-bold text-green-800">${results.taxSavings.toLocaleString()}</p>
                      </div>
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
                <p className="text-gray-600">Click "Calculate" to see your optimal withdrawal strategy</p>
              </div>
            )}
          </div>
        </div>

        {/* Strategy Explanation */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <PieChart className="h-5 w-5 text-blue-600 mr-2" />
            Withdrawal Strategy Principles
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Optimal Withdrawal Order</h4>
              <ol className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
                  <span>HSA for qualified medical expenses (tax-free)</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-red-100 text-red-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
                  <span>Traditional accounts to fill lower tax brackets</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
                  <span>Taxable accounts for capital gains treatment</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">4</span>
                  <span>Roth accounts for remaining needs (tax-free)</span>
                </li>
              </ol>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Key Benefits</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Minimizes lifetime tax burden</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Preserves tax-free growth in Roth accounts</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Reduces future RMD tax impact</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Optimizes Medicare premium costs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Important Considerations</h3>
          <ul className="text-sm text-blue-700 space-y-2">
            <li>• This calculator provides general guidance and should not replace professional tax advice</li>
            <li>• Tax laws and brackets change frequently - verify current rates</li>
            <li>• Consider your specific state tax situation</li>
            <li>• Medicare premiums are based on modified adjusted gross income (MAGI)</li>
            <li>• Required minimum distributions (RMDs) begin at age 73 for most retirement accounts</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TaxEfficientWithdrawalsCalculator;


