'use client'

import React, { useState, useEffect } from 'react'

interface DownsizingResult {
  currentEquity: number
  newHomeCost: number
  netProceeds: number
  annualSavings: number
  monthlySavings: number
  totalSavings: number
  breakEvenYears: number
  roi: number
}

const DownsizingCalculator: React.FC = () => {
  const [inputs, setInputs] = useState({
    currentHomeValue: 450000,
    mortgageBalance: 125000,
    sellingCosts: 7,
    currentTaxes: 6500,
    currentInsurance: 2400,
    currentMaintenance: 4500,
    currentUtilities: 3200,
    currentHOA: 0,
    newHomeValue: 300000,
    newHomeDownPayment: 0,
    newHomeMortgage: 0,
    newHomeTaxes: 4000,
    newHomeInsurance: 1500,
    newHomeMaintenance: 2500,
    newHomeUtilities: 2000,
    newHomeHOA: 0,
    movingCosts: 5000,
    yearsToCalculate: 10
  })

  const [results, setResults] = useState<DownsizingResult>({
    currentEquity: 0,
    newHomeCost: 0,
    netProceeds: 0,
    annualSavings: 0,
    monthlySavings: 0,
    totalSavings: 0,
    breakEvenYears: 0,
    roi: 0
  })

  const calculateDownsizing = () => {
    const {
      currentHomeValue,
      mortgageBalance,
      sellingCosts,
      currentTaxes,
      currentInsurance,
      currentMaintenance,
      currentUtilities,
      currentHOA,
      newHomeValue,
      newHomeDownPayment,
      newHomeMortgage,
      newHomeTaxes,
      newHomeInsurance,
      newHomeMaintenance,
      newHomeUtilities,
      newHomeHOA,
      movingCosts,
      yearsToCalculate
    } = inputs

    // Calculate current equity
    const currentEquity = currentHomeValue - mortgageBalance
    
    // Calculate selling costs
    const sellingCostsAmount = currentHomeValue * (sellingCosts / 100)
    
    // Calculate net proceeds from sale
    const netProceeds = currentEquity - sellingCostsAmount
    
    // Calculate new home cost
    const newHomeCost = newHomeValue + movingCosts
    
    // Calculate annual cost differences
    const currentAnnualCosts = currentTaxes + currentInsurance + currentMaintenance + currentUtilities + currentHOA
    const newAnnualCosts = newHomeTaxes + newHomeInsurance + newHomeMaintenance + newHomeUtilities + newHomeHOA
    
    // Calculate annual savings
    const annualSavings = currentAnnualCosts - newAnnualCosts
    const monthlySavings = annualSavings / 12
    
    // Calculate total savings over time
    const totalSavings = annualSavings * yearsToCalculate
    
    // Calculate break-even years (simplified)
    const breakEvenYears = movingCosts > 0 ? movingCosts / annualSavings : 0
    
    // Calculate ROI (simplified)
    const roi = totalSavings > 0 ? (totalSavings / movingCosts) * 100 : 0

    setResults({
      currentEquity,
      newHomeCost,
      netProceeds,
      annualSavings,
      monthlySavings,
      totalSavings,
      breakEvenYears,
      roi
    })
  }

  useEffect(() => {
    calculateDownsizing()
  }, [inputs])

  const handleInputChange = (field: string, value: number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getDownsizingRecommendation = () => {
    if (results.annualSavings > 5000) {
      return { text: 'Strong downsizing opportunity', color: 'text-green-600', bgColor: 'bg-green-50' }
    } else if (results.annualSavings > 0) {
      return { text: 'Moderate downsizing benefits', color: 'text-yellow-600', bgColor: 'bg-yellow-50' }
    } else {
      return { text: 'Limited downsizing benefits', color: 'text-red-600', bgColor: 'bg-red-50' }
    }
  }

  const recommendation = getDownsizingRecommendation()

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home w-8 h-8 text-blue-600" aria-hidden="true">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9,22 9,12 15,12 15,22"></polyline>
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Downsizing Calculator</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Calculate the financial impact of downsizing your home in retirement</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Home Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home text-green-600 mr-2" aria-hidden="true">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9,22 9,12 15,12 15,22"></polyline>
                </svg>
                Current Home Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Home Value</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input 
                      type="number" 
                      value={inputs.currentHomeValue} 
                      onChange={(e) => handleInputChange('currentHomeValue', Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      placeholder="450,000" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Remaining Mortgage Balance</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input 
                      type="number" 
                      value={inputs.mortgageBalance} 
                      onChange={(e) => handleInputChange('mortgageBalance', Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      placeholder="125,000" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Selling Costs (%)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={inputs.sellingCosts} 
                      onChange={(e) => handleInputChange('sellingCosts', Number(e.target.value))}
                      className="w-full pr-8 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      placeholder="7" 
                      step="0.1" 
                    />
                    <span className="absolute right-3 top-3 text-gray-500">%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Annual Property Taxes</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input 
                      type="number" 
                      value={inputs.currentTaxes} 
                      onChange={(e) => handleInputChange('currentTaxes', Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      placeholder="6,500" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Annual Insurance</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input 
                      type="number" 
                      value={inputs.currentInsurance} 
                      onChange={(e) => handleInputChange('currentInsurance', Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      placeholder="2,400" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Annual Maintenance</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input 
                      type="number" 
                      value={inputs.currentMaintenance} 
                      onChange={(e) => handleInputChange('currentMaintenance', Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      placeholder="4,500" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Annual Utilities</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input 
                      type="number" 
                      value={inputs.currentUtilities} 
                      onChange={(e) => handleInputChange('currentUtilities', Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      placeholder="3,200" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">HOA Fees (Annual)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input 
                      type="number" 
                      value={inputs.currentHOA} 
                      onChange={(e) => handleInputChange('currentHOA', Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      placeholder="0" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* New Home Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home text-blue-600 mr-2" aria-hidden="true">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9,22 9,12 15,12 15,22"></polyline>
                </svg>
                New Home Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Home Value</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input 
                      type="number" 
                      value={inputs.newHomeValue} 
                      onChange={(e) => handleInputChange('newHomeValue', Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      placeholder="300,000" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Moving Costs</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input 
                      type="number" 
                      value={inputs.movingCosts} 
                      onChange={(e) => handleInputChange('movingCosts', Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      placeholder="5,000" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Home Taxes</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input 
                      type="number" 
                      value={inputs.newHomeTaxes} 
                      onChange={(e) => handleInputChange('newHomeTaxes', Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      placeholder="4,000" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Home Insurance</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input 
                      type="number" 
                      value={inputs.newHomeInsurance} 
                      onChange={(e) => handleInputChange('newHomeInsurance', Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      placeholder="1,500" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Home Maintenance</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input 
                      type="number" 
                      value={inputs.newHomeMaintenance} 
                      onChange={(e) => handleInputChange('newHomeMaintenance', Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      placeholder="2,500" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Home Utilities</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input 
                      type="number" 
                      value={inputs.newHomeUtilities} 
                      onChange={(e) => handleInputChange('newHomeUtilities', Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      placeholder="2,000" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Home HOA</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input 
                      type="number" 
                      value={inputs.newHomeHOA} 
                      onChange={(e) => handleInputChange('newHomeHOA', Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      placeholder="0" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Years to Calculate</label>
                  <input 
                    type="number" 
                    value={inputs.yearsToCalculate} 
                    onChange={(e) => handleInputChange('yearsToCalculate', Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    placeholder="10" 
                    min="1" 
                    max="30" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Downsizing Analysis</h3>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Current Home Equity</h4>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(results.currentEquity)}</p>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Net Proceeds from Sale</h4>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(results.netProceeds)}</p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">Annual Savings</h4>
                  <p className="text-2xl font-bold text-purple-600">{formatCurrency(results.annualSavings)}</p>
                  <p className="text-sm text-purple-500">{formatCurrency(results.monthlySavings)} per month</p>
                </div>
                
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-2">Total Savings</h4>
                  <p className="text-2xl font-bold text-orange-600">{formatCurrency(results.totalSavings)}</p>
                  <p className="text-sm text-orange-500">Over {inputs.yearsToCalculate} years</p>
                </div>
                
                <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-lg border border-indigo-200">
                  <h4 className="font-semibold text-indigo-800 mb-2">Break-Even Time</h4>
                  <p className="text-2xl font-bold text-indigo-600">{results.breakEvenYears.toFixed(1)} years</p>
                  <p className="text-sm text-indigo-500">To recover moving costs</p>
                </div>
                
                <div className={`${recommendation.bgColor} p-4 rounded-lg border`}>
                  <h4 className="font-semibold text-gray-800 mb-2">Recommendation</h4>
                  <p className={`text-lg font-bold ${recommendation.color}`}>{recommendation.text}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Downsizing Benefits</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dollar-sign text-green-600" aria-hidden="true">
                  <line x1="12" x2="12" y1="2" y2="22"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Financial Benefits</h4>
              <p className="text-gray-600 text-sm">Lower taxes, insurance, maintenance, and utility costs</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart text-blue-600" aria-hidden="true">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"></path>
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Lifestyle Benefits</h4>
              <p className="text-gray-600 text-sm">Less maintenance, easier to manage, more time for activities</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield text-purple-600" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Security Benefits</h4>
              <p className="text-gray-600 text-sm">Access to equity, reduced financial stress, better cash flow</p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-alert w-6 h-6 text-yellow-600 mr-3 mt-0.5" aria-hidden="true">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" x2="12" y1="8" y2="12"></line>
              <line x1="12" x2="12.01" y1="16" y2="16"></line>
            </svg>
            <div className="text-gray-700">
              <h3 className="font-semibold mb-2">Important Disclaimer</h3>
              <p className="text-sm leading-relaxed">
                This calculator provides estimates based on simplified calculations and assumptions. Actual downsizing costs and savings may vary based on your specific situation, local market conditions, and other factors. This tool does not account for all possible costs, taxes, or factors that may affect your downsizing decision. Consult with a real estate professional and financial advisor for personalized advice and accurate calculations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DownsizingCalculator


