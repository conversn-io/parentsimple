'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Calendar, Target, BarChart3 } from 'lucide-react';

interface InvestmentGrowthCalculatorProps {
  className?: string;
}

interface GrowthProjection {
  year: number;
  value: number;
  contribution: number;
  growth: number;
}

export default function InvestmentGrowthCalculator({ className = '' }: InvestmentGrowthCalculatorProps) {
  const [initialInvestment, setInitialInvestment] = useState<number>(10000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
  const [annualReturn, setAnnualReturn] = useState<number>(7);
  const [years, setYears] = useState<number>(20);
  const [projections, setProjections] = useState<GrowthProjection[]>([]);

  const calculateGrowth = () => {
    const monthlyRate = annualReturn / 100 / 12;
    const totalMonths = years * 12;
    const newProjections: GrowthProjection[] = [];
    
    let currentValue = initialInvestment;
    let totalContributions = initialInvestment;
    
    for (let year = 1; year <= years; year++) {
      // Calculate monthly contributions for this year
      for (let month = 1; month <= 12; month++) {
        currentValue = (currentValue + monthlyContribution) * (1 + monthlyRate);
        totalContributions += monthlyContribution;
      }
      
      const growth = currentValue - totalContributions;
      
      newProjections.push({
        year,
        value: currentValue,
        contribution: totalContributions,
        growth
      });
    }
    
    setProjections(newProjections);
  };

  useEffect(() => {
    calculateGrowth();
  }, [initialInvestment, monthlyContribution, annualReturn, years]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const finalValue = projections.length > 0 ? projections[projections.length - 1]?.value || 0 : 0;
  const totalContributions = projections.length > 0 ? projections[projections.length - 1]?.contribution || 0 : 0;
  const totalGrowth = finalValue - totalContributions;

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Investment Parameters</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Initial Investment
            </label>
            <input
              type="number"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#36596A] focus:border-[#36596A]"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Contribution
            </label>
            <input
              type="number"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
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
              value={annualReturn}
              onChange={(e) => setAnnualReturn(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#36596A] focus:border-[#36596A]"
              min="0"
              max="20"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Investment Period (Years)
            </label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#36596A] focus:border-[#36596A]"
              min="1"
              max="50"
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Growth Projection</h3>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                <h4 className="font-semibold text-green-600">Final Value</h4>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(finalValue)}
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <DollarSign className="w-5 h-5 text-[#36596A] mr-2" />
                <h4 className="font-semibold text-[#36596A]">Total Contributions</h4>
              </div>
              <p className="text-xl font-bold text-[#36596A]">
                {formatCurrency(totalContributions)}
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Target className="w-5 h-5 text-purple-600 mr-2" />
                <h4 className="font-semibold text-purple-600">Total Growth</h4>
              </div>
              <p className="text-xl font-bold text-purple-600">
                {formatCurrency(totalGrowth)}
              </p>
            </div>
          </div>

          {/* Year-by-Year Breakdown */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Year-by-Year Growth
            </h4>
            <div className="max-h-64 overflow-y-auto">
              <div className="space-y-2">
                {projections.slice(0, 10).map((projection) => (
                  <div key={projection.year} className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">
                      Year {projection.year}
                    </span>
                    <span className="text-sm font-bold text-[#36596A]">
                      {formatCurrency(projection.value)}
                    </span>
                  </div>
                ))}
                {projections.length > 10 && (
                  <div className="text-sm text-gray-500 text-center py-2">
                    ... and {projections.length - 10} more years
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Key Insights */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">💡 Key Insights</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Your money will grow by {((totalGrowth / totalContributions) * 100).toFixed(1)}%</li>
              <li>• Compound interest accounts for {((totalGrowth / finalValue) * 100).toFixed(1)}% of your final value</li>
              <li>• Starting early has a huge impact on your final wealth</li>
              <li>• Consistent monthly contributions are key to building wealth</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
