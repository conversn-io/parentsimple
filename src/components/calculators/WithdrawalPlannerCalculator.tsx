'use client';

import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, PieChart, Target, AlertTriangle, CheckCircle, Lightbulb, Calendar, FileText, User, Building } from 'lucide-react';

interface WithdrawalPlannerCalculatorProps {
  className?: string;
}

interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

interface WithdrawalStrategy {
  year: number;
  age: number;
  traditionalWithdrawal: number;
  rothWithdrawal: number;
  taxableWithdrawal: number;
  totalIncome: number;
  taxOwed: number;
  afterTaxIncome: number;
  traditionalBalance: number;
  rothBalance: number;
  taxableBalance: number;
}

interface CalculationResults {
  strategy: WithdrawalStrategy[];
  totalTaxes: number;
  totalAfterTaxIncome: number;
  recommendations: string[];
  taxSavings: number;
}

const WithdrawalPlannerCalculator: React.FC<WithdrawalPlannerCalculatorProps> = ({ className = '' }) => {
  const [formData, setFormData] = useState({
    currentAge: 65,
    filingStatus: 'marriedJoint',
    annualIncome: 60000,
    traditionalBalance: 400000,
    rothBalance: 150000,
    taxableBalance: 200000
  });

  const [results, setResults] = useState<CalculationResults | null>(null);
  const [showResults, setShowResults] = useState(false);

  const taxBrackets = {
    single: [
      { min: 0, max: 11000, rate: 0.10 },
      { min: 11000, max: 44725, rate: 0.12 },
      { min: 44725, max: 95375, rate: 0.22 },
      { min: 95375, max: 182050, rate: 0.24 },
      { min: 182050, max: 231250, rate: 0.32 },
      { min: 231250, max: 578125, rate: 0.35 },
      { min: 578125, max: Infinity, rate: 0.37 }
    ],
    marriedJoint: [
      { min: 0, max: 22000, rate: 0.10 },
      { min: 22000, max: 89450, rate: 0.12 },
      { min: 89450, max: 190750, rate: 0.22 },
      { min: 190750, max: 364200, rate: 0.24 },
      { min: 364200, max: 462500, rate: 0.32 },
      { min: 462500, max: 693750, rate: 0.35 },
      { min: 693750, max: Infinity, rate: 0.37 }
    ],
    marriedSeparate: [
      { min: 0, max: 11000, rate: 0.10 },
      { min: 11000, max: 44725, rate: 0.12 },
      { min: 44725, max: 95375, rate: 0.22 },
      { min: 95375, max: 182100, rate: 0.24 },
      { min: 182100, max: 231250, rate: 0.32 },
      { min: 231250, max: 346875, rate: 0.35 },
      { min: 346875, max: Infinity, rate: 0.37 }
    ]
  };

  const standardDeductions = {
    single: 13850,
    marriedJoint: 27700,
    marriedSeparate: 13850
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTax = (income: number, filingStatus: string): number => {
    const brackets = taxBrackets[filingStatus as keyof typeof taxBrackets];
    const deduction = standardDeductions[filingStatus as keyof typeof standardDeductions];
    const taxableIncome = Math.max(0, income - deduction);
    
    let tax = 0;
    let remainingIncome = taxableIncome;
    
    for (const bracket of brackets) {
      if (remainingIncome <= 0) break;
      
      const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min);
      tax += taxableInBracket * bracket.rate;
      remainingIncome -= taxableInBracket;
    }
    
    return tax;
  };

  const calculateRMD = (balance: number, age: number): number => {
    if (age < 73) return 0;
    
    const lifeExpectancy = 27.4 - (age - 73) * 0.5;
    return balance / lifeExpectancy;
  };

  const optimizeWithdrawalStrategy = (): CalculationResults => {
    const { currentAge, filingStatus, annualIncome, traditionalBalance, rothBalance, taxableBalance } = formData;
    
    const strategy: WithdrawalStrategy[] = [];
    let traditionalBal = traditionalBalance;
    let rothBal = rothBalance;
    let taxableBal = taxableBalance;
    let totalTaxes = 0;
    let totalAfterTaxIncome = 0;
    
    // Plan for 30 years of retirement
    for (let year = 1; year <= 30; year++) {
      const age = currentAge + year - 1;
      
      // Calculate RMD if applicable
      const rmd = calculateRMD(traditionalBal, age);
      
      // Determine withdrawal strategy
      let traditionalWithdrawal = 0;
      let rothWithdrawal = 0;
      let taxableWithdrawal = 0;
      
      if (age < 73) {
        // Before RMDs - optimize for tax efficiency
        if (taxableBal > 0) {
          // Use taxable accounts first
          taxableWithdrawal = Math.min(annualIncome, taxableBal);
          const remainingNeed = annualIncome - taxableWithdrawal;
          
          if (remainingNeed > 0 && traditionalBal > 0) {
            traditionalWithdrawal = Math.min(remainingNeed, traditionalBal);
            const stillNeed = remainingNeed - traditionalWithdrawal;
            
            if (stillNeed > 0 && rothBal > 0) {
              rothWithdrawal = Math.min(stillNeed, rothBal);
            }
          }
        } else if (traditionalBal > 0) {
          traditionalWithdrawal = Math.min(annualIncome, traditionalBal);
          const remainingNeed = annualIncome - traditionalWithdrawal;
          
          if (remainingNeed > 0 && rothBal > 0) {
            rothWithdrawal = Math.min(remainingNeed, rothBal);
          }
        } else if (rothBal > 0) {
          rothWithdrawal = Math.min(annualIncome, rothBal);
        }
      } else {
        // After RMDs - must take RMD first
        traditionalWithdrawal = Math.max(rmd, Math.min(annualIncome, traditionalBal));
        const remainingNeed = annualIncome - traditionalWithdrawal;
        
        if (remainingNeed > 0 && taxableBal > 0) {
          taxableWithdrawal = Math.min(remainingNeed, taxableBal);
          const stillNeed = remainingNeed - taxableWithdrawal;
          
          if (stillNeed > 0 && rothBal > 0) {
            rothWithdrawal = Math.min(stillNeed, rothBal);
          }
        } else if (remainingNeed > 0 && rothBal > 0) {
          rothWithdrawal = Math.min(remainingNeed, rothBal);
        }
      }
      
      // Calculate tax on traditional withdrawals
      const totalIncome = traditionalWithdrawal + (taxableWithdrawal * 0.15); // Assume 15% capital gains
      const taxOwed = calculateTax(totalIncome, filingStatus);
      const afterTaxIncome = traditionalWithdrawal + rothWithdrawal + taxableWithdrawal - taxOwed;
      
      // Update balances
      traditionalBal = Math.max(0, traditionalBal - traditionalWithdrawal);
      rothBal = Math.max(0, rothBal - rothWithdrawal);
      taxableBal = Math.max(0, taxableBal - taxableWithdrawal);
      
      totalTaxes += taxOwed;
      totalAfterTaxIncome += afterTaxIncome;
      
      strategy.push({
        year,
        age,
        traditionalWithdrawal,
        rothWithdrawal,
        taxableWithdrawal,
        totalIncome,
        taxOwed,
        afterTaxIncome,
        traditionalBalance: traditionalBal,
        rothBalance: rothBal,
        taxableBalance: taxableBal
      });
      
      // Stop if all accounts are depleted
      if (traditionalBal === 0 && rothBal === 0 && taxableBal === 0) {
        break;
      }
    }
    
    // Generate recommendations
    const recommendations = [];
    
    if (formData.traditionalBalance > 0 && formData.currentAge < 70) {
      recommendations.push("Consider Roth conversions before age 70 to reduce future RMDs");
    }
    
    if (formData.taxableBalance > 0) {
      recommendations.push("Use taxable accounts first to take advantage of capital gains rates");
    }
    
    if (formData.currentAge < 73) {
      recommendations.push("Plan for RMDs starting at age 73 - consider Roth conversions now");
    }
    
    recommendations.push("Review strategy annually as tax laws and your situation change");
    
    return {
      strategy,
      totalTaxes,
      totalAfterTaxIncome,
      recommendations,
      taxSavings: 0 // Could calculate vs. naive strategy
    };
  };

  const calculateWithdrawalStrategy = () => {
    const results = optimizeWithdrawalStrategy();
    setResults(results);
    setShowResults(true);
  };

  const getFilingStatusLabel = (status: string) => {
    switch (status) {
      case 'single': return 'Single';
      case 'marriedJoint': return 'Married Filing Jointly';
      case 'marriedSeparate': return 'Married Filing Separately';
      default: return status;
    }
  };

  return (
    <div className={`p-6 ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Calculator className="h-12 w-12 text-blue-600 mr-4" />
          <h1 className="text-3xl font-bold text-gray-800">Tax-Efficient Withdrawal Planner</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          The order and timing of your retirement account withdrawals can significantly impact your lifetime tax bill. 
          This tool helps you create a tax-efficient withdrawal strategy based on your unique situation.
        </p>
      </div>

      {/* Strategy Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
        <div className="flex items-center mb-4">
          <Lightbulb className="h-8 w-8 text-yellow-500 mr-3" />
          <h2 className="text-2xl font-semibold">Strategic Withdrawal Planning</h2>
        </div>
        <p className="text-gray-600 mb-4">
          The order and timing of your retirement account withdrawals can significantly impact your lifetime tax bill. 
          This tool helps you create a tax-efficient withdrawal strategy based on your unique situation.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <Calculator className="h-6 w-6 text-blue-600 mb-2" />
            <h3 className="font-semibold text-blue-800">Calculate Impact</h3>
            <p className="text-sm text-blue-700">See how different withdrawal strategies affect your taxes</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <TrendingUp className="h-6 w-6 text-green-600 mb-2" />
            <h3 className="font-semibold text-green-800">Optimize Strategy</h3>
            <p className="text-sm text-green-700">Find the most tax-efficient withdrawal sequence</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <DollarSign className="h-6 w-6 text-purple-600 mb-2" />
            <h3 className="font-semibold text-purple-800">Maximize Savings</h3>
            <p className="text-sm text-purple-700">Keep more of your hard-earned retirement money</p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <FileText className="h-6 w-6 text-blue-600 mr-3" />
          Your Financial Information
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Personal Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Age</label>
                <input
                  type="number"
                  value={formData.currentAge}
                  onChange={(e) => handleInputChange('currentAge', parseInt(e.target.value) || 0)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="50"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filing Status</label>
                <select
                  value={formData.filingStatus}
                  onChange={(e) => handleInputChange('filingStatus', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="single">Single</option>
                  <option value="marriedJoint">Married Filing Jointly</option>
                  <option value="marriedSeparate">Married Filing Separately</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Annual Income Needed (Today's Dollars)</label>
                <input
                  type="number"
                  value={formData.annualIncome}
                  onChange={(e) => handleInputChange('annualIncome', parseInt(e.target.value) || 0)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="1000"
                />
              </div>
            </div>
          </div>
          
          {/* Account Balances */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Account Balances</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Traditional IRA/401(k) Balance
                  <span className="text-gray-500 text-xs ml-1">(Pre-tax accounts with RMDs at age 73)</span>
                </label>
                <input
                  type="number"
                  value={formData.traditionalBalance}
                  onChange={(e) => handleInputChange('traditionalBalance', parseInt(e.target.value) || 0)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="1000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Roth IRA Balance
                  <span className="text-gray-500 text-xs ml-1">(Tax-free growth and withdrawals, no RMDs)</span>
                </label>
                <input
                  type="number"
                  value={formData.rothBalance}
                  onChange={(e) => handleInputChange('rothBalance', parseInt(e.target.value) || 0)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="1000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Taxable Investment Accounts
                  <span className="text-gray-500 text-xs ml-1">(Capital gains tax treatment)</span>
                </label>
                <input
                  type="number"
                  value={formData.taxableBalance}
                  onChange={(e) => handleInputChange('taxableBalance', parseInt(e.target.value) || 0)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="1000"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <button
            onClick={calculateWithdrawalStrategy}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
          >
            <Calculator className="h-5 w-5 mr-2" />
            Calculate Optimal Strategy
          </button>
        </div>
      </div>

      {/* Results Section */}
      {showResults && results && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Target className="h-6 w-6 text-green-600 mr-3" />
            Your Optimal Withdrawal Strategy
          </h2>
          
          {/* Summary */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-800">
                ${results.totalAfterTaxIncome.toLocaleString()}
              </div>
              <div className="text-gray-600">Total After-Tax Income</div>
            </div>
            <div className="bg-red-50 p-6 rounded-lg text-center">
              <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-800">
                ${results.totalTaxes.toLocaleString()}
              </div>
              <div className="text-gray-600">Total Taxes Paid</div>
            </div>
            <div className="bg-green-50 p-6 rounded-lg text-center">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-800">
                {((results.totalAfterTaxIncome / (results.totalAfterTaxIncome + results.totalTaxes)) * 100).toFixed(1)}%
              </div>
              <div className="text-gray-600">Tax Efficiency</div>
            </div>
          </div>

          {/* Strategy Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">Year</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Age</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Traditional</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Roth</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Taxable</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Tax Owed</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">After-Tax Income</th>
                </tr>
              </thead>
              <tbody>
                {results.strategy.slice(0, 10).map((year) => (
                  <tr key={year.year} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{year.year}</td>
                    <td className="border border-gray-300 px-4 py-2">{year.age}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      ${year.traditionalWithdrawal.toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      ${year.rothWithdrawal.toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      ${year.taxableWithdrawal.toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      ${year.taxOwed.toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      ${year.afterTaxIncome.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {results.strategy.length > 10 && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                Showing first 10 years. Total strategy covers {results.strategy.length} years.
              </p>
            )}
          </div>

          {/* Recommendations */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              Recommendations
            </h3>
            <div className="space-y-2">
              {results.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-green-100 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold text-green-800 mr-3 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Steps */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <Calendar className="h-6 w-6 text-indigo-600 mr-3" />
          Next Steps
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="font-semibold mb-2">Consult a Professional</h3>
            <p className="text-sm text-gray-600">Work with a tax advisor or financial planner to implement your strategy.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Annual Review</h3>
            <p className="text-sm text-gray-600">Review and adjust your strategy annually as circumstances change.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Document Your Plan</h3>
            <p className="text-sm text-gray-600">Keep detailed records of your withdrawal strategy and tax planning decisions.</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
        <div className="flex items-start">
          <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">Important Disclaimers</h3>
            <p className="text-sm text-yellow-700">
              This tool provides educational information only. Please consult with a qualified tax professional or financial advisor for personalized advice. 
              Tax laws change frequently and individual situations vary significantly. This is not personalized financial advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalPlannerCalculator;


