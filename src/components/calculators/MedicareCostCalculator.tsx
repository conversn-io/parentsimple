'use client';

import React, { useState, useEffect } from 'react';
import { Calculator, Heart, DollarSign, MapPin, AlertTriangle, CheckCircle, Shield } from 'lucide-react';

interface MedicareResults {
  partAPremium: number;
  partBPremium: number;
  partDPremium: number;
  medigapPremium: number;
  outOfPocket: number;
  monthlyPremiums: number;
  annualPremiums: number;
  totalAnnualCost: number;
}

export default function MedicareCostCalculator() {
  const [formData, setFormData] = useState({
    age: 65,
    income: 50000,
    state: 'average',
    healthStatus: 'good',
    prescriptions: 2
  });

  const [results, setResults] = useState<MedicareResults | null>(null);

  const calculateCosts = () => {
    const { age, income, state, healthStatus, prescriptions } = formData;

    // Base Medicare costs (2024)
    let partAPremium = 0; // Most people get Part A premium-free
    let partBPremium = 174.70; // Standard premium
    let partDPremium = 48; // Average premium
    let medigapPremium = 150; // Average Medigap premium
    
    // IRMAA adjustments based on income
    if (income > 103000) {
      partBPremium += 69.90;
      partDPremium += 12.90;
    }
    if (income > 129000) {
      partBPremium += 174.70;
      partDPremium += 33.30;
    }
    if (income > 161000) {
      partBPremium += 279.20;
      partDPremium += 53.80;
    }
    if (income > 193000) {
      partBPremium += 383.70;
      partDPremium += 74.20;
    }
    if (income > 500000) {
      partBPremium += 454.20;
      partDPremium += 81.00;
    }
    
    // State adjustments
    const stateMultipliers: { [key: string]: number } = {
      'alabama': 0.85,
      'alaska': 1.3,
      'arizona': 0.95,
      'california': 1.15,
      'florida': 0.9,
      'georgia': 0.88,
      'illinois': 1.05,
      'michigan': 0.92,
      'newyork': 1.25,
      'ohio': 0.87,
      'pennsylvania': 0.95,
      'texas': 0.9,
      'virginia': 0.98,
      'average': 1.0
    };
    
    const stateMultiplier = stateMultipliers[state] || 1.0;
    medigapPremium *= stateMultiplier;
    
    // Health status adjustments
    const healthMultipliers: { [key: string]: number } = {
      'excellent': 0.8,
      'good': 1.0,
      'fair': 1.3,
      'poor': 1.6
    };
    
    const healthMultiplier = healthMultipliers[healthStatus];
    
    // Calculate out-of-pocket costs
    let outOfPocket = 2000 * healthMultiplier; // Base out-of-pocket
    outOfPocket += prescriptions * 200; // Prescription costs
    
    // Calculate totals
    const monthlyPremiums = partAPremium + partBPremium + partDPremium + medigapPremium;
    const annualPremiums = monthlyPremiums * 12;
    const totalAnnualCost = annualPremiums + outOfPocket;

    setResults({
      partAPremium,
      partBPremium,
      partDPremium,
      medigapPremium,
      outOfPocket,
      monthlyPremiums,
      annualPremiums,
      totalAnnualCost
    });
  };

  useEffect(() => {
    calculateCosts();
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
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
          <Calculator className="w-10 h-10 mr-3" />
          Medicare Cost Calculator
        </h1>
        <p className="text-xl text-white opacity-90">
          Estimate your Medicare costs and compare plan options
        </p>
      </div>

      {/* Main Calculator Card */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <Calculator className="w-6 h-6 text-blue-600 mr-2" />
              Your Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  min="65"
                  max="100"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Income</label>
                <input
                  type="number"
                  value={formData.income}
                  onChange={(e) => handleInputChange('income', e.target.value)}
                  min="0"
                  step="1000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">Affects IRMAA surcharges for higher earners</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <select
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="average">Average Cost State</option>
                  <option value="alabama">Alabama</option>
                  <option value="alaska">Alaska</option>
                  <option value="arizona">Arizona</option>
                  <option value="california">California</option>
                  <option value="florida">Florida</option>
                  <option value="georgia">Georgia</option>
                  <option value="illinois">Illinois</option>
                  <option value="michigan">Michigan</option>
                  <option value="newyork">New York</option>
                  <option value="ohio">Ohio</option>
                  <option value="pennsylvania">Pennsylvania</option>
                  <option value="texas">Texas</option>
                  <option value="virginia">Virginia</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Health Status</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Prescriptions</label>
                <input
                  type="number"
                  value={formData.prescriptions}
                  onChange={(e) => handleInputChange('prescriptions', e.target.value)}
                  min="0"
                  max="20"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Calculate Button */}
            <div className="mt-6 text-center">
              <button
                onClick={calculateCosts}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto font-semibold shadow-lg hover:shadow-xl"
              >
                <Calculator className="h-5 w-5 mr-2" />
                {results ? 'Recalculate Medicare Costs' : 'Calculate Medicare Costs'}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <DollarSign className="w-6 h-6 text-green-600 mr-2" />
              Your Medicare Costs
            </h2>
            
            {results ? (
              <div className="space-y-6">
                {/* Total Cost */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg text-center">
                  <h3 className="text-xl font-semibold mb-2">Total Annual Cost</h3>
                  <p className="text-4xl font-bold">{formatCurrency(results.totalAnnualCost)}</p>
                  <p className="text-lg opacity-90 mt-2">This includes all Medicare parts and estimated out-of-pocket expenses</p>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Monthly Premiums</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span>Part A:</span>
                      <span className="font-semibold">{formatCurrency(results.partAPremium)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Part B:</span>
                      <span className="font-semibold">{formatCurrency(results.partBPremium)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Part D:</span>
                      <span className="font-semibold">{formatCurrency(results.partDPremium)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Medigap:</span>
                      <span className="font-semibold">{formatCurrency(results.medigapPremium)}</span>
                    </div>
                    <div className="flex justify-between col-span-2 border-t pt-2">
                      <span className="font-semibold">Total Monthly:</span>
                      <span className="font-bold text-blue-600">{formatCurrency(results.monthlyPremiums)}</span>
                    </div>
                  </div>
                </div>

                {/* Out-of-Pocket */}
                <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-orange-800 mb-2">Annual Out-of-Pocket</h3>
                  <p className="text-2xl font-bold text-orange-600">{formatCurrency(results.outOfPocket)}</p>
                  <p className="text-sm text-orange-700 mt-1">Includes deductibles, copays, and prescription costs</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Calculator className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Enter your information to see Medicare cost estimates</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Plan Comparison Section */}
      {results && (
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
            <Shield className="w-8 h-8 text-purple-600 mr-2" />
            Medicare Plan Comparison
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 transition-all">
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                <Heart className="w-6 h-6 text-blue-600 mr-2" />
                Original Medicare + Medigap
              </h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {formatCurrency(results.totalAnnualCost)}
              </div>
              <p className="text-sm text-gray-600 mb-4">Your current estimate</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-600 mt-1 mr-2">✓</span>
                  <span>Wide provider network</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mt-1 mr-2">✓</span>
                  <span>No referrals needed</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mt-1 mr-2">✓</span>
                  <span>Predictable costs</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-green-500 transition-all">
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                <Shield className="w-6 h-6 text-green-600 mr-2" />
                Medicare Advantage
              </h3>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {formatCurrency(results.totalAnnualCost * 0.85)}
              </div>
              <p className="text-sm text-gray-600 mb-4">Typically 15% less</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-600 mt-1 mr-2">✓</span>
                  <span>Lower premiums</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mt-1 mr-2">✓</span>
                  <span>Additional benefits</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mt-1 mr-2">⚠</span>
                  <span>Network restrictions</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white border-2 border-green-500 rounded-lg p-6 hover:border-green-600 transition-all bg-gradient-to-br from-green-50 to-green-100">
              <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full inline-block mb-2">
                RECOMMENDED
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                Medicare Advantage + Supplement
              </h3>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {formatCurrency(results.totalAnnualCost * 0.75)}
              </div>
              <p className="text-sm text-gray-600 mb-4">Best value option</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-600 mt-1 mr-2">✓</span>
                  <span>Lowest total cost</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mt-1 mr-2">✓</span>
                  <span>Comprehensive coverage</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mt-1 mr-2">✓</span>
                  <span>Extra benefits included</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Important Medicare Facts */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
          <AlertTriangle className="w-8 h-8 text-yellow-600 mr-2" />
          Important Medicare Facts
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
              <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
              Enrollment Periods
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li><strong>Initial Enrollment:</strong> 3 months before to 3 months after your 65th birthday</li>
              <li><strong>General Enrollment:</strong> January 1 - March 31 (coverage starts July 1)</li>
              <li><strong>Open Enrollment:</strong> October 15 - December 7 (coverage starts January 1)</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
              <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
              Late Enrollment Penalties
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li><strong>Part B:</strong> 10% penalty for each 12-month period you delay enrollment</li>
              <li><strong>Part D:</strong> 1% penalty for each month you delay enrollment</li>
              <li><strong>Lifetime penalties:</strong> These penalties continue as long as you have Medicare</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}