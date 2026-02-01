'use client'

import React, { useState, useEffect } from 'react'
import { Calculator } from 'lucide-react'

interface LifeInsuranceResult {
  totalNeeds: number
  incomeReplacement: number
  debtCoverage: number
  educationFund: number
  finalExpenses: number
  existingCoverage: number
  recommendedCoverage: number
  coverageGap: number
}

const LifeInsuranceCalculator: React.FC = () => {
  const [inputs, setInputs] = useState({
    age: 35,
    dependents: 2,
    income: 75000,
    years: 20,
    mortgage: 250000,
    debts: 25000,
    education: 100000,
    finalExpenses: 15000,
    existingCoverage: 0,
    inflationRate: 3
  })

  const [results, setResults] = useState<LifeInsuranceResult>({
    totalNeeds: 0,
    incomeReplacement: 0,
    debtCoverage: 0,
    educationFund: 0,
    finalExpenses: 0,
    existingCoverage: 0,
    recommendedCoverage: 0,
    coverageGap: 0
  })

  const calculateNeeds = () => {
    const {
      income,
      years,
      mortgage,
      debts,
      education,
      finalExpenses,
      existingCoverage,
      inflationRate
    } = inputs

    // Calculate income replacement (simplified - doesn't account for inflation adjustments)
    const incomeReplacement = income * years

    // Calculate debt coverage
    const debtCoverage = mortgage + debts

    // Calculate education fund (simplified)
    const educationFund = education

    // Calculate final expenses
    const finalExpensesAmount = finalExpenses

    // Calculate total needs
    const totalNeeds = incomeReplacement + debtCoverage + educationFund + finalExpensesAmount

    // Calculate recommended coverage (total needs minus existing coverage)
    const recommendedCoverage = Math.max(0, totalNeeds - existingCoverage)

    // Calculate coverage gap
    const coverageGap = Math.max(0, totalNeeds - existingCoverage)

    setResults({
      totalNeeds,
      incomeReplacement,
      debtCoverage,
      educationFund,
      finalExpenses: finalExpensesAmount,
      existingCoverage,
      recommendedCoverage,
      coverageGap
    })
  }

  useEffect(() => {
    calculateNeeds()
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

  const getCoverageRecommendation = () => {
    if (results.coverageGap === 0) {
      return { text: 'You have adequate coverage', color: 'text-green-600' }
    } else if (results.coverageGap < 100000) {
      return { text: 'Consider additional coverage', color: 'text-yellow-600' }
    } else {
      return { text: 'Significant coverage gap - action needed', color: 'text-red-600' }
    }
  }

  const recommendation = getCoverageRecommendation()

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield w-8 h-8 text-blue-600" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Life Insurance Needs Calculator</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Calculate the right amount of coverage for your family's financial security</p>
        </div>

        {/* Introduction Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield text-indigo-600 w-6 h-6 mr-3" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <h2 className="text-2xl font-bold text-gray-900">Why Life Insurance Matters</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart text-red-500 mx-auto mb-2" aria-hidden="true">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"></path>
              </svg>
              <h3 className="font-semibold text-gray-900">Protect Your Family</h3>
              <p className="text-gray-600 text-sm">Ensure your loved ones can maintain their lifestyle</p>
            </div>
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home text-blue-500 mx-auto mb-2" aria-hidden="true">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9,22 9,12 15,12 15,22"></polyline>
              </svg>
              <h3 className="font-semibold text-gray-900">Cover Major Expenses</h3>
              <p className="text-gray-600 text-sm">Pay off mortgage, debts, and final expenses</p>
            </div>
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap text-green-500 mx-auto mb-2" aria-hidden="true">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
              </svg>
              <h3 className="font-semibold text-gray-900">Fund Future Goals</h3>
              <p className="text-gray-600 text-sm">Secure education and retirement savings</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Input Form */}
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user mr-2" aria-hidden="true">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Your Current Age
                </label>
                <input 
                  type="number" 
                  value={inputs.age} 
                  onChange={(e) => handleInputChange('age', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="35" 
                  min="18" 
                  max="85" 
                />
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users mr-2" aria-hidden="true">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                  </svg>
                  Number of Dependents
                </label>
                <input 
                  type="number" 
                  value={inputs.dependents} 
                  onChange={(e) => handleInputChange('dependents', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="2" 
                  min="0" 
                  max="10" 
                />
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dollar-sign mr-2" aria-hidden="true">
                    <line x1="12" x2="12" y1="2" y2="22"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                  Annual Income
                </label>
                <input 
                  type="number" 
                  value={inputs.income} 
                  onChange={(e) => handleInputChange('income', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="75000" 
                  min="0" 
                />
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar mr-2" aria-hidden="true">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                    <line x1="16" x2="16" y1="2" y2="6"></line>
                    <line x1="8" x2="8" y1="2" y2="6"></line>
                    <line x1="3" x2="21" y1="10" y2="10"></line>
                  </svg>
                  Years of Income Replacement
                </label>
                <input 
                  type="number" 
                  value={inputs.years} 
                  onChange={(e) => handleInputChange('years', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="20" 
                  min="1" 
                  max="50" 
                />
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-6">Financial Obligations</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home mr-2" aria-hidden="true">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9,22 9,12 15,12 15,22"></polyline>
                  </svg>
                  Outstanding Mortgage Balance
                </label>
                <input 
                  type="number" 
                  value={inputs.mortgage} 
                  onChange={(e) => handleInputChange('mortgage', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="250000" 
                  min="0" 
                />
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card mr-2" aria-hidden="true">
                    <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                    <line x1="2" x2="22" y1="10" y2="10"></line>
                  </svg>
                  Other Debts (Credit Cards, Loans)
                </label>
                <input 
                  type="number" 
                  value={inputs.debts} 
                  onChange={(e) => handleInputChange('debts', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="25000" 
                  min="0" 
                />
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap mr-2" aria-hidden="true">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                  </svg>
                  Future Education Costs
                </label>
                <input 
                  type="number" 
                  value={inputs.education} 
                  onChange={(e) => handleInputChange('education', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="100000" 
                  min="0" 
                />
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-coffin mr-2" aria-hidden="true">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                  Final Expenses
                </label>
                <input 
                  type="number" 
                  value={inputs.finalExpenses} 
                  onChange={(e) => handleInputChange('finalExpenses', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="15000" 
                  min="0" 
                />
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check mr-2" aria-hidden="true">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                  Existing Life Insurance Coverage
                </label>
                <input 
                  type="number" 
                  value={inputs.existingCoverage} 
                  onChange={(e) => handleInputChange('existingCoverage', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="0" 
                  min="0" 
                />
              </div>
            </div>

            {/* Calculate Button */}
            <div className="mt-8 text-center">
              <button
                onClick={calculateNeeds}
                className="bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center mx-auto font-semibold text-lg shadow-lg hover:shadow-xl"
              >
                <Calculator className="h-5 w-5 mr-2" />
                {results.totalNeeds > 0 ? 'Recalculate Life Insurance Needs' : 'Calculate Life Insurance Needs'}
              </button>
            </div>
          </div>
          
          {/* Results Section */}
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Your Life Insurance Needs</h3>
            
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Income Replacement</h4>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(results.incomeReplacement)}</p>
                <p className="text-sm text-blue-500">${inputs.income.toLocaleString()} × {inputs.years} years</p>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Debt Coverage</h4>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(results.debtCoverage)}</p>
                <p className="text-sm text-green-500">Mortgage + Other Debts</p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">Education Fund</h4>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(results.educationFund)}</p>
                <p className="text-sm text-purple-500">Future education costs</p>
              </div>
              
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-800 mb-2">Final Expenses</h4>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(results.finalExpenses)}</p>
                <p className="text-sm text-orange-500">Funeral and related costs</p>
              </div>
              
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-2">Existing Coverage</h4>
                <p className="text-2xl font-bold text-gray-600">{formatCurrency(results.existingCoverage)}</p>
                <p className="text-sm text-gray-500">Current life insurance</p>
              </div>
              
              <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 rounded-lg border-2 border-indigo-200">
                <h4 className="font-semibold text-indigo-800 mb-2">Total Insurance Needs</h4>
                <p className="text-3xl font-bold text-indigo-600">{formatCurrency(results.totalNeeds)}</p>
              </div>
              
              <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-lg border-2 border-red-200">
                <h4 className="font-semibold text-red-800 mb-2">Recommended Coverage</h4>
                <p className="text-3xl font-bold text-red-600">{formatCurrency(results.recommendedCoverage)}</p>
                <p className={`text-lg font-semibold mt-2 ${recommendation.color}`}>{recommendation.text}</p>
              </div>
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
                This calculator provides estimates based on simplified calculations and assumptions. Actual insurance needs may vary based on your specific situation, lifestyle, and financial goals. This tool does not account for inflation, investment returns, or other factors that may affect your family's financial needs. Consult with a licensed insurance professional and financial advisor for personalized advice and accurate coverage recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LifeInsuranceCalculator


