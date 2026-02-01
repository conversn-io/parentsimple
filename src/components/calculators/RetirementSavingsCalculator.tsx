'use client';

import { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, Target, AlertCircle } from 'lucide-react';

interface RetirementSavingsCalculatorProps {
  className?: string;
}

interface CalculationResults {
  monthlyContribution: number;
  totalContribution: number;
  totalGrowth: number;
  finalAmount: number;
  shortfall: number;
  isOnTrack: boolean;
}

export default function RetirementSavingsCalculator({ className = '' }: RetirementSavingsCalculatorProps) {
  const [currentAge, setCurrentAge] = useState<number>(55);
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [currentSavings, setCurrentSavings] = useState<number>(100000);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(5000);
  const [desiredIncome, setDesiredIncome] = useState<number>(4000);
  const [expectedReturn, setExpectedReturn] = useState<number>(6);
  const [inflationRate, setInflationRate] = useState<number>(3);
  const [results, setResults] = useState<CalculationResults | null>(null);

  const calculateRetirementSavings = () => {
    const yearsToRetirement = retirementAge - currentAge;
    const monthsToRetirement = yearsToRetirement * 12;
    
    // Calculate required retirement savings
    const annualDesiredIncome = desiredIncome * 12;
    const requiredSavings = annualDesiredIncome * 25; // 4% withdrawal rule
    
    // Calculate future value of current savings
    const futureValueCurrentSavings = currentSavings * Math.pow(1 + expectedReturn / 100, yearsToRetirement);
    
    // Calculate required monthly contribution
    const shortfall = requiredSavings - futureValueCurrentSavings;
    const monthlyContribution = shortfall > 0 
      ? (shortfall * (expectedReturn / 100 / 12)) / (Math.pow(1 + expectedReturn / 100 / 12, monthsToRetirement) - 1)
      : 0;
    
    const totalContribution = monthlyContribution * monthsToRetirement;
    const totalGrowth = futureValueCurrentSavings + (monthlyContribution * monthsToRetirement) - currentSavings - totalContribution;
    const finalAmount = futureValueCurrentSavings + (monthlyContribution * monthsToRetirement);
    
    setResults({
      monthlyContribution: Math.max(0, monthlyContribution),
      totalContribution,
      totalGrowth,
      finalAmount,
      shortfall: Math.max(0, requiredSavings - finalAmount),
      isOnTrack: monthlyContribution <= monthlyIncome * 0.2 // 20% of income rule
    });
  };

  useEffect(() => {
    calculateRetirementSavings();
  }, [currentAge, retirementAge, currentSavings, monthlyIncome, desiredIncome, expectedReturn, inflationRate]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Age
            </label>
            <input
              type="number"
              value={currentAge}
              onChange={(e) => setCurrentAge(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#36596A] focus:border-[#36596A]"
              min="18"
              max="80"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Planned Retirement Age
            </label>
            <input
              type="number"
              value={retirementAge}
              onChange={(e) => setRetirementAge(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#36596A] focus:border-[#36596A]"
              min="55"
              max="80"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Retirement Savings
            </label>
            <input
              type="number"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#36596A] focus:border-[#36596A]"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Monthly Income
            </label>
            <input
              type="number"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#36596A] focus:border-[#36596A]"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Desired Monthly Retirement Income
            </label>
            <input
              type="number"
              value={desiredIncome}
              onChange={(e) => setDesiredIncome(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#36596A] focus:border-[#36596A]"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Annual Return (%)
            </label>
            <input
              type="number"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#36596A] focus:border-[#36596A]"
              min="0"
              max="20"
              step="0.1"
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Retirement Plan</h3>
          
          {results && (
            <div className="space-y-4">
              {/* Monthly Contribution */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <DollarSign className="w-5 h-5 text-[#36596A] mr-2" />
                  <h4 className="font-semibold text-[#36596A]">Monthly Contribution Needed</h4>
                </div>
                <p className="text-2xl font-bold text-[#36596A]">
                  {formatCurrency(results.monthlyContribution)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {results.isOnTrack ? '✅ Within recommended 20% of income' : '⚠️ Exceeds 20% of income'}
                </p>
              </div>

              {/* Total Contributions */}
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Target className="w-5 h-5 text-green-600 mr-2" />
                  <h4 className="font-semibold text-green-600">Total Contributions</h4>
                </div>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(results.totalContribution)}
                </p>
              </div>

              {/* Projected Growth */}
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
                  <h4 className="font-semibold text-purple-600">Projected Growth</h4>
                </div>
                <p className="text-xl font-bold text-purple-600">
                  {formatCurrency(results.totalGrowth)}
                </p>
              </div>

              {/* Final Amount */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Calculator className="w-5 h-5 text-gray-600 mr-2" />
                  <h4 className="font-semibold text-gray-600">Projected Retirement Savings</h4>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(results.finalAmount)}
                </p>
              </div>

              {/* Shortfall Warning */}
              {results.shortfall > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <h4 className="font-semibold text-red-600">Shortfall</h4>
                  </div>
                  <p className="text-lg font-bold text-red-600">
                    {formatCurrency(results.shortfall)}
                  </p>
                  <p className="text-sm text-red-600 mt-1">
                    Consider increasing your monthly contribution or adjusting your retirement goals.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Recommendations */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">💡 Recommendations</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Aim to save 15-20% of your income for retirement</li>
              <li>• Consider maximizing employer 401(k) matching</li>
              <li>• Review and adjust your plan annually</li>
              <li>• Consider working with a financial advisor</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
