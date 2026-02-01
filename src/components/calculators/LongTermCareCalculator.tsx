'use client';
// VERSION: 2025-09-13-FIXED-TYPESCRIPT-ERRORS

import React, { useState, useEffect } from 'react';
import { Calculator, Shield, DollarSign, Clock, AlertTriangle, CheckCircle, Home, Building } from 'lucide-react';

interface LongTermCareCalculatorProps {
  className?: string;
}

interface CalculationResults {
  dailyCareCost: number;
  annualCareCost: number;
  totalCareCost: number;
  recommendedDailyBenefit: number;
  monthlyPremium: number;
  annualPremium: number;
  totalPremiums: number;
  potentialSavings: number;
  selfInsuranceCost: number;
  recommendations: string[];
}

const LongTermCareCalculator: React.FC<LongTermCareCalculatorProps> = ({ className = '' }) => {
  const [formData, setFormData] = useState({
    age: 55,
    gender: 'male',
    state: 'national',
    healthStatus: 'excellent',
    careSetting: 'home',
    careDuration: 3,
    dailyBenefit: 200,
    eliminationPeriod: 90,
    inflationProtection: 'compound',
    benefitPeriod: 3 as number | string
  });

  const [results, setResults] = useState<CalculationResults | null>(null);
  const [showResults, setShowResults] = useState(false);

  const stateCostMultipliers = {
    'national': 1.0,
    'california': 1.45,
    'florida': 0.95,
    'texas': 0.88,
    'new-york': 1.38,
    'pennsylvania': 1.05,
    'illinois': 1.12,
    'ohio': 0.92,
    'georgia': 0.87,
    'north-carolina': 0.89,
    'michigan': 0.98
  };

  const baseCosts = {
    'home': 280,
    'assisted': 350,
    'nursing': 400,
    'mixed': 340
  };

  const healthMultipliers = {
    'excellent': 0.9,
    'good': 1.0,
    'fair': 1.2,
    'poor': 1.5
  };

  const eliminationMultipliers = {
    0: 1.25,
    30: 1.15,
    60: 1.10,
    90: 1.05,
    180: 1.0
  };

  const inflationMultipliers = {
    'none': 1.0,
    'simple': 1.15,
    'compound': 1.35,
    'cpi': 1.25
  };

  const benefitPeriodMultipliers = {
    2: 0.7,
    3: 0.85,
    4: 1.0,
    5: 1.15,
    10: 1.4,
    'lifetime': 1.8
  };

  const calculateLongTermCare = () => {
    const { age, gender, state, healthStatus, careSetting, careDuration, dailyBenefit, eliminationPeriod, inflationProtection, benefitPeriod } = formData;

    // Calculate regional cost adjustment
    const costMultiplier = stateCostMultipliers[state as keyof typeof stateCostMultipliers] || 1.0;
    const baseDailyCost = baseCosts[careSetting as keyof typeof baseCosts] * costMultiplier;
    
    // Calculate annual premium
    let basePremium = calculateBasePremium(age, gender, healthStatus, dailyBenefit, benefitPeriod);
    
    // Apply multipliers
    const eliminationMultiplier = eliminationMultipliers[eliminationPeriod as keyof typeof eliminationMultipliers] || 1.0;
    const inflationMultiplier = inflationMultipliers[inflationProtection as keyof typeof inflationMultipliers] || 1.0;
    
    basePremium *= eliminationMultiplier * inflationMultiplier;

    // Calculate total costs
    const yearsToRetirement = Math.max(0, 65 - age);
    const premiumPaymentYears = yearsToRetirement + 15; // Pay premiums for 15 years into retirement
    const totalPremiums = basePremium * premiumPaymentYears;
    
    // Calculate self-insurance cost
    // CACHE BUST: Fixed TypeScript error - benefitPeriod can be number or 'lifetime' string
    const benefitYears = benefitPeriod === 'lifetime' ? 5 : (typeof benefitPeriod === 'number' ? benefitPeriod : parseInt(benefitPeriod));
    const selfInsuranceCost = baseDailyCost * 365 * benefitYears;
    
    // Calculate potential savings
    const potentialSavings = Math.max(0, selfInsuranceCost - totalPremiums);

    // Generate recommendations
    const recommendations = [];
    
    if (age < 55) {
      recommendations.push('Consider waiting until age 55-60 to purchase LTC insurance for better value.');
    }
    
    if (healthStatus === 'excellent' || healthStatus === 'good') {
      recommendations.push('Your good health qualifies you for preferred rates. Consider applying soon.');
    }
    
    if (basePremium > 15000) {
      recommendations.push('High premiums suggest exploring hybrid life insurance with LTC benefits.');
    }
    
    if (potentialSavings > 100000) {
      recommendations.push('Insurance shows significant cost savings compared to self-insurance.');
    }
    
    if (careSetting === 'home') {
      recommendations.push('Look for policies with strong home care benefits and care coordination.');
    }

    const calculationResults: CalculationResults = {
      dailyCareCost: baseDailyCost,
      annualCareCost: baseDailyCost * 365,
      totalCareCost: baseDailyCost * 365 * benefitYears,
      recommendedDailyBenefit: Math.min(dailyBenefit, baseDailyCost),
      monthlyPremium: basePremium / 12,
      annualPremium: basePremium,
      totalPremiums,
      potentialSavings,
      selfInsuranceCost,
      recommendations
    };

    setResults(calculationResults);
    setShowResults(true);
  };

  const calculateBasePremium = (age: number, gender: string, health: string, dailyBenefit: number, benefitPeriod: number | string) => {
    let basePremium = 2000; // Base premium
    
    // Age adjustment
    basePremium *= Math.pow(1.08, Math.max(0, age - 50));
    
    // Gender adjustment (females typically pay more)
    if (gender === 'female') {
      basePremium *= 1.15;
    }
    
    // Health adjustment
    const healthMultiplier = healthMultipliers[health as keyof typeof healthMultipliers] || 1.0;
    basePremium *= healthMultiplier;
    
    // Benefit amount adjustment
    basePremium *= (dailyBenefit / 250);
    
    // Benefit period adjustment
    const benefitMultiplier = benefitPeriodMultipliers[benefitPeriod as keyof typeof benefitPeriodMultipliers] || 1.0;
    basePremium *= benefitMultiplier;
    
    return Math.round(basePremium);
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
            <h2 className="text-3xl font-bold text-gray-900">Long-Term Care Insurance Calculator</h2>
          </div>
          <p className="text-lg text-gray-600">
            Estimate your long-term care insurance needs and costs based on your location and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-2 space-y-6">
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
                    min="40"
                    max="85"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <select
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="national">National Average</option>
                    <option value="california">California</option>
                    <option value="florida">Florida</option>
                    <option value="texas">Texas</option>
                    <option value="new-york">New York</option>
                    <option value="pennsylvania">Pennsylvania</option>
                    <option value="illinois">Illinois</option>
                    <option value="ohio">Ohio</option>
                    <option value="georgia">Georgia</option>
                    <option value="north-carolina">North Carolina</option>
                    <option value="michigan">Michigan</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Health Status</label>
                  <select
                    value={formData.healthStatus}
                    onChange={(e) => handleInputChange('healthStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Home className="h-5 w-5 text-green-600 mr-2" />
                Care Preferences
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Care Setting</label>
                  <select
                    value={formData.careSetting}
                    onChange={(e) => handleInputChange('careSetting', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="home">Home Care</option>
                    <option value="assisted">Assisted Living</option>
                    <option value="nursing">Nursing Home</option>
                    <option value="mixed">Mixed Care</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expected Care Duration</label>
                  <select
                    value={formData.careDuration}
                    onChange={(e) => handleInputChange('careDuration', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={2}>2 Years</option>
                    <option value={3}>3 Years</option>
                    <option value={4}>4 Years</option>
                    <option value={5}>5 Years</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <DollarSign className="h-5 w-5 text-purple-600 mr-2" />
                Coverage Options
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Daily Benefit Amount</label>
                  <select
                    value={formData.dailyBenefit}
                    onChange={(e) => handleInputChange('dailyBenefit', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={150}>$150/day</option>
                    <option value={200}>$200/day</option>
                    <option value={250}>$250/day</option>
                    <option value={300}>$300/day</option>
                    <option value={400}>$400/day</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Elimination Period</label>
                  <select
                    value={formData.eliminationPeriod}
                    onChange={(e) => handleInputChange('eliminationPeriod', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>0 days</option>
                    <option value={30}>30 days</option>
                    <option value={60}>60 days</option>
                    <option value={90}>90 days</option>
                    <option value={180}>180 days</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Inflation Protection</label>
                  <select
                    value={formData.inflationProtection}
                    onChange={(e) => handleInputChange('inflationProtection', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="none">No Inflation Protection</option>
                    <option value="simple">Simple Inflation (3%)</option>
                    <option value="compound">Compound Inflation (3%)</option>
                    <option value="cpi">CPI-linked</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Benefit Period</label>
                  <select
                    value={formData.benefitPeriod}
                    onChange={(e) => handleInputChange('benefitPeriod', e.target.value === 'lifetime' ? 'lifetime' : parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={2}>2 Years</option>
                    <option value={3}>3 Years</option>
                    <option value={4}>4 Years</option>
                    <option value={5}>5 Years</option>
                    <option value={10}>10 Years</option>
                    <option value="lifetime">Lifetime</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={calculateLongTermCare}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
            >
              <Calculator className="h-5 w-5 mr-2" />
              Calculate LTC Insurance Needs
            </button>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-1">
            {showResults && results && (
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                  Your LTC Insurance Analysis
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                    <div className="text-center">
                      <p className="text-sm opacity-90">Estimated Annual Premium</p>
                      <p className="text-2xl font-bold">${results.annualPremium.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
                    <div className="text-center">
                      <p className="text-sm opacity-90">Daily Care Cost</p>
                      <p className="text-2xl font-bold">${Math.round(results.dailyCareCost)}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                    <div className="text-center">
                      <p className="text-sm opacity-90">Monthly Premium</p>
                      <p className="text-2xl font-bold">${Math.round(results.monthlyPremium).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white">
                    <div className="text-center">
                      <p className="text-sm opacity-90">Potential Savings</p>
                      <p className="text-2xl font-bold">${results.potentialSavings.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <AlertTriangle className="h-4 w-4 inline mr-2" />
                    Estimates based on current market rates and actuarial data
                  </p>
                </div>
              </div>
            )}

            {!showResults && (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Click "Calculate" to see your personalized long-term care insurance recommendations</p>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Results Section */}
        {showResults && results && (
          <div className="mt-8 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                Personalized Recommendations
              </h3>
              
              <div className="space-y-4">
                {results.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start p-4 rounded-lg bg-blue-50 border-l-4 border-blue-400">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-blue-800">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Cost Comparison</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                  <h4 className="font-semibold text-blue-800 mb-2">Self-Insurance Cost</h4>
                  <p className="text-2xl font-bold text-blue-600">${results.selfInsuranceCost.toLocaleString()}</p>
                  <p className="text-sm text-blue-700 mt-2">Total out-of-pocket if no insurance</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                  <h4 className="font-semibold text-green-800 mb-2">Insurance Premium</h4>
                  <p className="text-2xl font-bold text-green-600">${results.totalPremiums.toLocaleString()}</p>
                  <p className="text-sm text-green-700 mt-2">Total premiums paid over time</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                  <h4 className="font-semibold text-purple-800 mb-2">Potential Savings</h4>
                  <p className="text-2xl font-bold text-purple-600">${results.potentialSavings.toLocaleString()}</p>
                  <p className="text-sm text-purple-700 mt-2">Insurance vs. self-insurance</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Understanding Long-Term Care Insurance</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Key Benefits</h4>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Protects your assets from long-term care costs</li>
                <li>• Provides choice in care settings and providers</li>
                <li>• Reduces burden on family members</li>
                <li>• Tax-qualified policies offer tax benefits</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Important Considerations</h4>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Premiums can increase over time</li>
                <li>• Coverage may not cover all care costs</li>
                <li>• Elimination periods create out-of-pocket exposure</li>
                <li>• Health requirements for approval</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LongTermCareCalculator;
