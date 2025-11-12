'use client';

import React, { useState, useEffect } from 'react';
import { Calculator, Heart, DollarSign, Calendar, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface HealthcareResults {
  totalYears: number;
  annualCostToday: number;
  annualCostRetirement: number;
  totalEstimatedCost: number;
  ltcExpectedCost: number;
  yearlyData: Array<{
    age: number;
    cost: number;
  }>;
}

export default function HealthcareCostCalculator() {
  const [formData, setFormData] = useState({
    currentAge: 65,
    retirementAge: 67,
    lifeExpectancy: 85,
    healthStatus: 'good',
    location: 'medium',
    medicareB: 174,
    medicareD: 45,
    medigap: 125,
    outOfPocket: 2500,
    prescriptions: 150,
    dentalVision: 1200,
    inflationRate: 6.5,
    ltcProbability: 70,
    ltcCost: 55000
  });

  const [results, setResults] = useState<HealthcareResults | null>(null);

  const calculateHealthcareCosts = () => {
    const {
      currentAge,
      retirementAge,
      lifeExpectancy,
      healthStatus,
      location,
      medicareB,
      medicareD,
      medigap,
      outOfPocket,
      prescriptions,
      dentalVision,
      inflationRate,
      ltcProbability,
      ltcCost
    } = formData;

    // Health status multipliers
    const healthMultipliers = {
      'excellent': 0.8,
      'good': 1.0,
      'fair': 1.3,
      'poor': 1.6
    } as const;
    const healthMultiplier = healthMultipliers[healthStatus as keyof typeof healthMultipliers];
    
    // Location multipliers
    const locationMultipliers = {
      'low': 0.8,
      'medium': 1.0,
      'high': 1.3
    } as const;
    const locationMultiplier = locationMultipliers[location as keyof typeof locationMultipliers];
    
    // Calculate annual costs
    const monthlyPremiums = (medicareB + medicareD + medigap) * healthMultiplier * locationMultiplier;
    const monthlyPrescriptions = prescriptions * healthMultiplier * locationMultiplier;
    const annualOutOfPocket = outOfPocket * healthMultiplier * locationMultiplier;
    const annualDentalVision = dentalVision * healthMultiplier * locationMultiplier;
    
    const annualCostToday = (monthlyPremiums + monthlyPrescriptions) * 12 + annualOutOfPocket + annualDentalVision;
    
    // Calculate years in retirement
    const yearsToRetirement = retirementAge - currentAge;
    const yearsInRetirement = lifeExpectancy - retirementAge;
    
    // Calculate inflated costs
    const annualCostAtRetirement = annualCostToday * Math.pow(1 + inflationRate / 100, yearsToRetirement);
    
    // Calculate total cost over retirement
    let totalCost = 0;
    const yearlyData = [];
    
    for (let year = 0; year < yearsInRetirement; year++) {
      const age = retirementAge + year;
      const inflatedCost = annualCostAtRetirement * Math.pow(1 + inflationRate / 100, year);
      totalCost += inflatedCost;
      yearlyData.push({
        age: age,
        cost: inflatedCost
      });
    }
    
    // Add potential long-term care costs
    const ltcExpectedCost = ltcCost * (ltcProbability / 100) * 3; // Average 3 years of care
    totalCost += ltcExpectedCost;

    setResults({
      totalYears: yearsInRetirement,
      annualCostToday,
      annualCostRetirement: annualCostAtRetirement,
      totalEstimatedCost: totalCost,
      ltcExpectedCost,
      yearlyData
    });
  };

  useEffect(() => {
    calculateHealthcareCosts();
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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-8">
        <div className="text-center">
          <Heart className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Healthcare Cost Calculator</h1>
          <p className="text-xl opacity-90">Plan for Your Retirement Healthcare Expenses</p>
          <p className="text-sm mt-2 opacity-80">Estimate costs, compare scenarios, and secure your health in retirement</p>
        </div>
      </div>

      {/* Input Section */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Calculator className="w-6 h-6 text-blue-600 mr-2" />
            Personal Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Age</label>
              <input
                type="number"
                value={formData.currentAge}
                onChange={(e) => handleInputChange('currentAge', e.target.value)}
                min="50"
                max="90"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Retirement Age</label>
              <input
                type="number"
                value={formData.retirementAge}
                onChange={(e) => handleInputChange('retirementAge', e.target.value)}
                min="60"
                max="75"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Life Expectancy</label>
              <input
                type="number"
                value={formData.lifeExpectancy}
                onChange={(e) => handleInputChange('lifeExpectancy', e.target.value)}
                min="70"
                max="100"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Health Status</label>
              <select
                value={formData.healthStatus}
                onChange={(e) => handleInputChange('healthStatus', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Geographic Location</label>
              <select
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Low Cost Area</option>
                <option value="medium">Medium Cost Area</option>
                <option value="high">High Cost Area</option>
              </select>
            </div>
          </div>
        </div>

        {/* Healthcare Expenses */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <DollarSign className="w-6 h-6 text-green-600 mr-2" />
            Healthcare Expenses
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Medicare Part B Premium (Monthly)</label>
              <input
                type="number"
                value={formData.medicareB}
                onChange={(e) => handleInputChange('medicareB', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Medicare Part D Premium (Monthly)</label>
              <input
                type="number"
                value={formData.medicareD}
                onChange={(e) => handleInputChange('medicareD', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Medigap Insurance (Monthly)</label>
              <input
                type="number"
                value={formData.medigap}
                onChange={(e) => handleInputChange('medigap', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Out-of-Pocket Medical (Annual)</label>
              <input
                type="number"
                value={formData.outOfPocket}
                onChange={(e) => handleInputChange('outOfPocket', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prescription Drugs (Monthly)</label>
              <input
                type="number"
                value={formData.prescriptions}
                onChange={(e) => handleInputChange('prescriptions', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dental & Vision (Annual)</label>
              <input
                type="number"
                value={formData.dentalVision}
                onChange={(e) => handleInputChange('dentalVision', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Options */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <TrendingUp className="w-6 h-6 text-purple-600 mr-2" />
          Advanced Options
        </h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Healthcare Inflation Rate (%)</label>
            <input
              type="number"
              value={formData.inflationRate}
              onChange={(e) => handleInputChange('inflationRate', e.target.value)}
              step="0.1"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Long-Term Care Probability (%)</label>
            <input
              type="number"
              value={formData.ltcProbability}
              onChange={(e) => handleInputChange('ltcProbability', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">LTC Annual Cost</label>
            <input
              type="number"
              value={formData.ltcCost}
              onChange={(e) => handleInputChange('ltcCost', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Calculate Button */}
        <div className="mt-6 text-center">
          <button
            onClick={calculateHealthcareCosts}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto font-semibold shadow-lg hover:shadow-xl"
          >
            <Calculator className="h-5 w-5 mr-2" />
            {results ? 'Recalculate Healthcare Costs' : 'Calculate Healthcare Costs'}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {results && (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg p-6 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Years in Retirement</h3>
              <p className="text-2xl font-bold">{results.totalYears}</p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg p-6 text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Annual Cost Today</h3>
              <p className="text-2xl font-bold">{formatCurrency(results.annualCostToday)}</p>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg p-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Annual Cost at Retirement</h3>
              <p className="text-2xl font-bold">{formatCurrency(results.annualCostRetirement)}</p>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-6 text-center">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Total Estimated Cost</h3>
              <p className="text-2xl font-bold">{formatCurrency(results.totalEstimatedCost)}</p>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Cost Breakdown</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Annual Costs</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Current Annual Cost:</span>
                    <span className="font-semibold">{formatCurrency(results.annualCostToday)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost at Retirement:</span>
                    <span className="font-semibold">{formatCurrency(results.annualCostRetirement)}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Long-Term Care</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Expected LTC Cost:</span>
                    <span className="font-semibold">{formatCurrency(results.ltcExpectedCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Healthcare Cost:</span>
                    <span className="font-semibold text-red-600">{formatCurrency(results.totalEstimatedCost)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Planning Recommendations */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
              Planning Recommendations
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Immediate Actions</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-600 mt-1 mr-2">✓</span>
                    <span>Set aside {formatCurrency(results.annualCostToday * 2)} for emergency healthcare fund</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mt-1 mr-2">✓</span>
                    <span>Consider HSA contributions if eligible</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mt-1 mr-2">✓</span>
                    <span>Review Medicare supplement options</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mt-1 mr-2">✓</span>
                    <span>Explore long-term care insurance</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Long-Term Planning</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-600 mt-1 mr-2">•</span>
                    <span>Plan for {formatCurrency(results.totalEstimatedCost)} total healthcare costs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mt-1 mr-2">•</span>
                    <span>Consider healthcare inflation in retirement planning</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mt-1 mr-2">•</span>
                    <span>Factor in potential long-term care needs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mt-1 mr-2">•</span>
                    <span>Review and update plan annually</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Secure Your Healthcare Future?</h2>
        <p className="text-lg mb-6">Speak with a healthcare planning specialist to create a comprehensive strategy for your retirement health needs.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200">
            Schedule Consultation
          </button>
          <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-200">
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
}
