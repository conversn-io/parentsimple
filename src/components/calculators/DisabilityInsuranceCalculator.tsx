'use client';

import React, { useState, useEffect } from 'react';
import { Calculator, Shield, DollarSign, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface DisabilityInsuranceCalculatorProps {
  className?: string;
}

interface CalculationResults {
  monthlyBenefit: number;
  annualBenefit: number;
  benefitPercentage: number;
  eliminationPeriod: number;
  benefitPeriod: number;
  monthlyPremium: number;
  annualPremium: number;
  coverageGap: number;
  recommendations: string[];
}

const DisabilityInsuranceCalculator: React.FC<DisabilityInsuranceCalculatorProps> = ({ className = '' }) => {
  const [formData, setFormData] = useState({
    age: 35,
    gender: 'male',
    occupation: 'professional',
    annualIncome: 75000,
    monthlyExpenses: 5000,
    existingCoverage: 0,
    healthStatus: 'excellent',
    eliminationPeriod: 90,
    benefitPeriod: 'to-65',
    coverageAmount: 60
  });

  const [results, setResults] = useState<CalculationResults | null>(null);
  const [showResults, setShowResults] = useState(false);

  const occupationRiskFactors = {
    'professional': 1.0,
    'managerial': 1.1,
    'sales': 1.2,
    'technical': 1.3,
    'manual': 1.5,
    'high-risk': 2.0
  };

  const healthMultipliers = {
    'excellent': 0.9,
    'good': 1.0,
    'fair': 1.2,
    'poor': 1.5
  };

  const eliminationPeriodMultipliers = {
    30: 1.3,
    60: 1.15,
    90: 1.0,
    180: 0.85,
    365: 0.7
  };

  const benefitPeriodMultipliers = {
    '2-years': 0.6,
    '5-years': 0.8,
    'to-65': 1.0,
    'lifetime': 1.3
  };

  const calculateDisabilityInsurance = () => {
    const { age, gender, occupation, annualIncome, monthlyExpenses, existingCoverage, healthStatus, eliminationPeriod, benefitPeriod, coverageAmount } = formData;

    // Calculate target monthly benefit
    const targetMonthlyBenefit = Math.min(
      (annualIncome * (coverageAmount / 100)) / 12,
      monthlyExpenses * 0.8 // Most policies limit to 60-80% of income
    );

    // Calculate base premium
    let basePremium = 0;
    if (age < 30) basePremium = 25;
    else if (age < 40) basePremium = 35;
    else if (age < 50) basePremium = 50;
    else if (age < 60) basePremium = 75;
    else basePremium = 100;

    // Apply multipliers
    const occupationMultiplier = occupationRiskFactors[occupation as keyof typeof occupationRiskFactors] || 1.0;
    const healthMultiplier = healthMultipliers[healthStatus as keyof typeof healthMultipliers] || 1.0;
    const eliminationMultiplier = eliminationPeriodMultipliers[eliminationPeriod as keyof typeof eliminationPeriodMultipliers] || 1.0;
    const benefitMultiplier = benefitPeriodMultipliers[benefitPeriod as keyof typeof benefitPeriodMultipliers] || 1.0;

    // Gender adjustment (females typically pay more)
    const genderMultiplier = gender === 'female' ? 1.2 : 1.0;

    // Calculate monthly premium
    const monthlyPremium = basePremium * occupationMultiplier * healthMultiplier * eliminationMultiplier * benefitMultiplier * genderMultiplier * (targetMonthlyBenefit / 1000);

    // Calculate coverage gap
    const coverageGap = Math.max(0, targetMonthlyBenefit - existingCoverage);

    // Generate recommendations
    const recommendations = [];
    
    if (coverageGap > 0) {
      recommendations.push(`You have a coverage gap of $${coverageGap.toLocaleString()} per month. Consider additional disability insurance.`);
    }
    
    if (eliminationPeriod > 90) {
      recommendations.push('Consider a shorter elimination period if you have limited emergency savings.');
    }
    
    if (age > 50) {
      recommendations.push('Premiums increase significantly with age. Consider purchasing coverage now if you don\'t have adequate protection.');
    }
    
    if (occupation === 'high-risk') {
      recommendations.push('Your occupation has higher risk factors. Consider occupational disability insurance.');
    }

    const calculationResults: CalculationResults = {
      monthlyBenefit: targetMonthlyBenefit,
      annualBenefit: targetMonthlyBenefit * 12,
      benefitPercentage: coverageAmount,
      eliminationPeriod,
      benefitPeriod: benefitPeriod === 'to-65' ? 65 - age : benefitPeriod === 'lifetime' ? 100 : parseInt(benefitPeriod),
      monthlyPremium: monthlyPremium,
      annualPremium: monthlyPremium * 12,
      coverageGap,
      recommendations
    };

    setResults(calculationResults);
    setShowResults(true);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className={`p-6 ${className}`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Disability Insurance Calculator</h2>
          </div>
          <p className="text-lg text-gray-600">
            Calculate your disability insurance needs and get personalized recommendations
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
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

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                <select
                  value={formData.occupation}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="professional">Professional (Office)</option>
                  <option value="managerial">Managerial</option>
                  <option value="sales">Sales</option>
                  <option value="technical">Technical</option>
                  <option value="manual">Manual Labor</option>
                  <option value="high-risk">High Risk</option>
                </select>
              </div>

              <div className="mt-4">
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

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                Financial Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Annual Income</label>
                  <input
                    type="number"
                    value={formData.annualIncome}
                    onChange={(e) => handleInputChange('annualIncome', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Expenses</label>
                  <input
                    type="number"
                    value={formData.monthlyExpenses}
                    onChange={(e) => handleInputChange('monthlyExpenses', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Existing Disability Coverage (Monthly)</label>
                  <input
                    type="number"
                    value={formData.existingCoverage}
                    onChange={(e) => handleInputChange('existingCoverage', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Clock className="h-5 w-5 text-purple-600 mr-2" />
                Coverage Options
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Coverage Amount (% of Income)</label>
                  <input
                    type="range"
                    min="40"
                    max="80"
                    value={formData.coverageAmount}
                    onChange={(e) => handleInputChange('coverageAmount', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>40%</span>
                    <span className="font-medium">{formData.coverageAmount}%</span>
                    <span>80%</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Elimination Period</label>
                  <select
                    value={formData.eliminationPeriod}
                    onChange={(e) => handleInputChange('eliminationPeriod', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={30}>30 days</option>
                    <option value={60}>60 days</option>
                    <option value={90}>90 days</option>
                    <option value={180}>180 days</option>
                    <option value={365}>1 year</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Benefit Period</label>
                  <select
                    value={formData.benefitPeriod}
                    onChange={(e) => handleInputChange('benefitPeriod', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="2-years">2 years</option>
                    <option value="5-years">5 years</option>
                    <option value="to-65">To age 65</option>
                    <option value="lifetime">Lifetime</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={calculateDisabilityInsurance}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
            >
              <Calculator className="h-5 w-5 mr-2" />
              Calculate Disability Insurance Needs
            </button>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {showResults && results && (
              <>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    Your Disability Insurance Analysis
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-blue-600 font-medium">Recommended Monthly Benefit</p>
                        <p className="text-2xl font-bold text-blue-800">${results.monthlyBenefit.toLocaleString()}</p>
                        <p className="text-sm text-blue-600">({results.benefitPercentage}% of income)</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-green-600 font-medium">Estimated Monthly Premium</p>
                        <p className="text-2xl font-bold text-green-800">${results.monthlyPremium.toFixed(0)}</p>
                        <p className="text-sm text-green-600">${results.annualPremium.toFixed(0)} annually</p>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-purple-600 font-medium">Coverage Gap</p>
                        <p className="text-2xl font-bold text-purple-800">
                          {results.coverageGap > 0 ? `$${results.coverageGap.toLocaleString()}` : 'None'}
                        </p>
                        <p className="text-sm text-purple-600">Additional coverage needed</p>
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

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4">Coverage Details</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Elimination Period:</span>
                      <span className="font-medium">{results.eliminationPeriod} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Benefit Period:</span>
                      <span className="font-medium">
                        {results.benefitPeriod === 100 ? 'Lifetime' : 
                         results.benefitPeriod === 65 - formData.age ? 'To age 65' :
                         `${results.benefitPeriod} years`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Annual Benefit:</span>
                      <span className="font-medium">${results.annualBenefit.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {!showResults && (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Click "Calculate" to see your disability insurance analysis</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Important Notes</h3>
          <ul className="text-sm text-blue-700 space-y-2">
            <li>• Disability insurance premiums vary by insurer, health, and occupation</li>
            <li>• Most policies limit coverage to 60-80% of your income</li>
            <li>• Consider both short-term and long-term disability coverage</li>
            <li>• Review your employer's disability benefits before purchasing individual coverage</li>
            <li>• Premiums are generally not tax-deductible for individual policies</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DisabilityInsuranceCalculator;


