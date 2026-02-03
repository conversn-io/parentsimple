'use client';

import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, PieChart, AlertTriangle, CheckCircle } from 'lucide-react';

interface TaxResults {
  totalTax: number;
  effectiveRate: number;
  marginalRate: number;
  totalIncome: number;
  taxableIncome: number;
  standardDeduction: number;
  taxableSocialSecurity: number;
  adjustedGrossIncome: number;
  bracketBreakdown: Array<{
    rate: number;
    min: number;
    max: number | string;
    taxableAmount: number;
    tax: number;
  }>;
}

export default function TaxImpactCalculator() {
  const [formData, setFormData] = useState({
    filingStatus: 'marriedJoint',
    age: 65,
    socialSecurity: 0,
    pensionIncome: 0,
    traditionalWithdrawals: 0,
    rothWithdrawals: 0,
    investmentIncome: 0,
    otherIncome: 0
  });

  const [results, setResults] = useState<TaxResults | null>(null);

  const taxBrackets2024 = {
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
    ]
  };

  const standardDeductions2024 = {
    single: 13850,
    marriedJoint: 27700,
    marriedSeparate: 13850,
    headOfHousehold: 20800
  };

  const seniorAdditionalDeduction = {
    single: 1850,
    marriedJoint: 1500,
    marriedSeparate: 1500,
    headOfHousehold: 1850
  };

  const calculateTaxes = () => {
    const {
      filingStatus,
      age,
      socialSecurity,
      pensionIncome,
      traditionalWithdrawals,
      rothWithdrawals,
      investmentIncome,
      otherIncome
    } = formData;

    // Calculate taxable Social Security
    const taxableSocialSecurity = calculateTaxableSocialSecurity(socialSecurity, otherIncome);
    
    // Calculate total taxable income
    const totalTaxableIncome = pensionIncome + traditionalWithdrawals + investmentIncome + otherIncome + taxableSocialSecurity;
    
    // Calculate standard deduction
    let standardDeduction = standardDeductions2024[filingStatus as keyof typeof standardDeductions2024];
    if (age >= 65) {
      if (filingStatus === 'marriedJoint') {
        standardDeduction += seniorAdditionalDeduction[filingStatus as keyof typeof seniorAdditionalDeduction] * 2;
      } else {
        standardDeduction += seniorAdditionalDeduction[filingStatus as keyof typeof seniorAdditionalDeduction];
      }
    }

    // Calculate adjusted gross income and taxable income
    const adjustedGrossIncome = Math.max(0, totalTaxableIncome - standardDeduction);
    
    // Calculate federal tax
    const brackets = filingStatus === 'marriedJoint' ? taxBrackets2024.marriedJoint : taxBrackets2024.single;
    const { totalTax, bracketBreakdown } = calculateTaxWithBrackets(adjustedGrossIncome, brackets);
    
    // Calculate rates
    const effectiveRate = totalTaxableIncome > 0 ? (totalTax / totalTaxableIncome) * 100 : 0;
    const marginalRate = getMarginalRate(adjustedGrossIncome, brackets) * 100;

    setResults({
      totalTax,
      effectiveRate,
      marginalRate,
      totalIncome: socialSecurity + pensionIncome + traditionalWithdrawals + rothWithdrawals + investmentIncome + otherIncome,
      taxableIncome: totalTaxableIncome,
      standardDeduction,
      taxableSocialSecurity,
      bracketBreakdown,
      adjustedGrossIncome
    });
  };

  const calculateTaxableSocialSecurity = (socialSecurity: number, otherIncome: number) => {
    if (socialSecurity === 0) return 0;
    
    const combinedIncome = otherIncome + (socialSecurity * 0.5);
    const filingStatus = formData.filingStatus;
    
    let threshold1, threshold2;
    if (filingStatus === 'marriedJoint') {
      threshold1 = 32000;
      threshold2 = 44000;
    } else {
      threshold1 = 25000;
      threshold2 = 34000;
    }
    
    if (combinedIncome <= threshold1) {
      return 0;
    } else if (combinedIncome <= threshold2) {
      return Math.min(socialSecurity * 0.5, (combinedIncome - threshold1) * 0.5);
    } else {
      return Math.min(socialSecurity * 0.85, 
        (threshold2 - threshold1) * 0.5 + (combinedIncome - threshold2) * 0.85);
    }
  };

  const calculateTaxWithBrackets = (income: number, brackets: any[]) => {
    let totalTax = 0;
    let bracketBreakdown: any[] = [];
    
    for (let i = 0; i < brackets.length; i++) {
      const bracket = brackets[i];
      if (income <= bracket.min) break;
      
      const taxableInBracket = Math.min(income, bracket.max) - bracket.min;
      const taxForBracket = taxableInBracket * bracket.rate;
      totalTax += taxForBracket;
      
      if (taxableInBracket > 0) {
        bracketBreakdown.push({
          rate: bracket.rate,
          min: bracket.min,
          max: bracket.max === Infinity ? 'No limit' : bracket.max,
          taxableAmount: taxableInBracket,
          tax: taxForBracket
        });
      }
    }
    
    return { totalTax, bracketBreakdown };
  };

  const getMarginalRate = (income: number, brackets: any[]) => {
    for (let i = 0; i < brackets.length; i++) {
      if (income <= brackets[i].max) {
        return brackets[i].rate;
      }
    }
    return brackets[brackets.length - 1].rate;
  };

  useEffect(() => {
    calculateTaxes();
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
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
          <Calculator className="w-10 h-10 text-blue-600 mr-3" />
          Tax Impact Calculator
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Estimate how different retirement income sources affect your taxes and plan your withdrawals strategically
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Calculator className="w-6 h-6 text-green-600 mr-2" />
            Your Retirement Income
          </h2>

          <div className="space-y-6">
            {/* Filing Status */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Filing Status
              </label>
              <select
                value={formData.filingStatus}
                onChange={(e) => handleInputChange('filingStatus', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-lg"
              >
                <option value="single">Single</option>
                <option value="marriedJoint">Married Filing Jointly</option>
                <option value="marriedSeparate">Married Filing Separately</option>
                <option value="headOfHousehold">Head of Household</option>
              </select>
            </div>

            {/* Age */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Your Age
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                min="50"
                max="100"
                className="w-full p-3 border border-gray-300 rounded-lg text-lg"
              />
              <p className="text-sm text-gray-500 mt-1">Age affects standard deduction amounts</p>
            </div>

            {/* Social Security */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Social Security Benefits (Annual)
              </label>
              <div className="flex items-center">
                <span className="text-lg text-gray-600 mr-2">$</span>
                <input
                  type="number"
                  value={formData.socialSecurity}
                  onChange={(e) => handleInputChange('socialSecurity', e.target.value)}
                  min="0"
                  step="100"
                  className="flex-1 p-3 border border-gray-300 rounded-lg text-lg"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Up to 85% may be taxable depending on other income</p>
            </div>

            {/* Pension Income */}
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Pension Income (Annual)
              </label>
              <div className="flex items-center">
                <span className="text-lg text-gray-600 mr-2">$</span>
                <input
                  type="number"
                  value={formData.pensionIncome}
                  onChange={(e) => handleInputChange('pensionIncome', e.target.value)}
                  min="0"
                  step="100"
                  className="flex-1 p-3 border border-gray-300 rounded-lg text-lg"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Generally fully taxable as ordinary income</p>
            </div>

            {/* Traditional IRA/401(k) Withdrawals */}
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Traditional IRA/401(k) Withdrawals (Annual)
              </label>
              <div className="flex items-center">
                <span className="text-lg text-gray-600 mr-2">$</span>
                <input
                  type="number"
                  value={formData.traditionalWithdrawals}
                  onChange={(e) => handleInputChange('traditionalWithdrawals', e.target.value)}
                  min="0"
                  step="100"
                  className="flex-1 p-3 border border-gray-300 rounded-lg text-lg"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Fully taxable as ordinary income</p>
            </div>

            {/* Roth IRA Withdrawals */}
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Roth IRA Withdrawals (Annual)
              </label>
              <div className="flex items-center">
                <span className="text-lg text-gray-600 mr-2">$</span>
                <input
                  type="number"
                  value={formData.rothWithdrawals}
                  onChange={(e) => handleInputChange('rothWithdrawals', e.target.value)}
                  min="0"
                  step="100"
                  className="flex-1 p-3 border border-gray-300 rounded-lg text-lg"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Tax-free if rules are met (age 59½ + 5-year rule)</p>
            </div>

            {/* Investment Income */}
            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Investment Income (Annual)
              </label>
              <div className="flex items-center">
                <span className="text-lg text-gray-600 mr-2">$</span>
                <input
                  type="number"
                  value={formData.investmentIncome}
                  onChange={(e) => handleInputChange('investmentIncome', e.target.value)}
                  min="0"
                  step="100"
                  className="flex-1 p-3 border border-gray-300 rounded-lg text-lg"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Includes dividends, interest, and capital gains</p>
            </div>

            {/* Other Taxable Income */}
            <div className="bg-gray-50 border-l-4 border-gray-500 p-4 rounded-r-lg">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Other Taxable Income (Annual)
              </label>
              <div className="flex items-center">
                <span className="text-lg text-gray-600 mr-2">$</span>
                <input
                  type="number"
                  value={formData.otherIncome}
                  onChange={(e) => handleInputChange('otherIncome', e.target.value)}
                  min="0"
                  step="100"
                  className="flex-1 p-3 border border-gray-300 rounded-lg text-lg"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Part-time work, rental income, etc.</p>
            </div>
          </div>

          {/* Calculate Button */}
          <div className="mt-6 text-center">
            <button
              onClick={calculateTaxes}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto font-semibold shadow-lg hover:shadow-xl"
            >
              <Calculator className="h-5 w-5 mr-2" />
              {results ? 'Recalculate Tax Impact' : 'Calculate Tax Impact'}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 text-blue-600 mr-2" />
            Your Tax Results
          </h2>

          {results ? (
            <div className="space-y-6">
              {/* Total Tax Summary */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg text-center">
                <h3 className="text-xl font-semibold mb-2">Total Federal Tax</h3>
                <p className="text-3xl font-bold">{formatCurrency(results.totalTax)}</p>
                <p className="text-lg opacity-90 mt-2">
                  Effective Rate: {results.effectiveRate.toFixed(1)}% | 
                  Marginal Rate: {results.marginalRate.toFixed(1)}%
                </p>
              </div>

              {/* Income Breakdown */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Income Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Income:</span>
                    <span className="font-semibold">{formatCurrency(results.totalIncome)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxable Income:</span>
                    <span className="font-semibold">{formatCurrency(results.taxableIncome)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Standard Deduction:</span>
                    <span className="font-semibold text-green-600">-{formatCurrency(results.standardDeduction)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Adjusted Gross Income:</span>
                    <span className="font-semibold">{formatCurrency(results.adjustedGrossIncome)}</span>
                  </div>
                </div>
              </div>

              {/* Tax Bracket Breakdown */}
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800 mb-3">Tax Bracket Breakdown</h3>
                <div className="space-y-2">
                  {results.bracketBreakdown.map((bracket, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {(bracket.rate * 100).toFixed(0)}% on {formatCurrency(bracket.min)} - {bracket.max === 'No limit' ? '∞' : formatCurrency(bracket.max as number)}
                      </span>
                      <span className="font-semibold">{formatCurrency(bracket.tax)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Security Taxation */}
              {results.taxableSocialSecurity > 0 && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Social Security Taxation</h3>
                  <p className="text-sm text-blue-700">
                    {formatCurrency(results.taxableSocialSecurity)} of your Social Security benefits are taxable
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Calculator className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Enter your income information to see tax calculations</p>
            </div>
          )}
        </div>
      </div>

      {/* Tax Planning Tips */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <PieChart className="w-6 h-6 text-green-600 mr-2" />
          Tax Planning Tips
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              Tax-Efficient Strategies
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-green-600 mt-1 mr-2">✓</span>
                <span>Use Roth withdrawals to stay in lower tax brackets</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mt-1 mr-2">✓</span>
                <span>Time traditional IRA withdrawals strategically</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mt-1 mr-2">✓</span>
                <span>Consider Roth conversions in low-income years</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mt-1 mr-2">✓</span>
                <span>Plan Social Security timing to minimize taxation</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
              Things to Watch
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-orange-600 mt-1 mr-2">⚠</span>
                <span>High income can make Social Security taxable</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mt-1 mr-2">⚠</span>
                <span>Medicare premiums increase with higher income</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mt-1 mr-2">⚠</span>
                <span>RMDs start at age 73 and are fully taxable</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-600 mt-1 mr-2">⚠</span>
                <span>Capital gains rates may apply to investments</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}