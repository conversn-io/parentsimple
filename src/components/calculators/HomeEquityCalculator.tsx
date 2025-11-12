'use client'

import React, { useState, useEffect } from 'react'
import { Calculator } from 'lucide-react'

interface HomeEquityResult {
  currentEquity: number
  equityPercentage: number
  loanToValue: number
  availableEquity: number
  futureEquity: number
  monthlyPayment: number
  totalInterest: number
  payoffDate: string
}

const HomeEquityCalculator: React.FC = () => {
  const [inputs, setInputs] = useState({
    homeValue: 400000,
    mortgageBalance: 250000,
    interestRate: 6.5,
    loanTerm: 30,
    yearsRemaining: 20,
    annualAppreciation: 3,
    yearsProjection: 5
  })

  const [results, setResults] = useState<HomeEquityResult>({
    currentEquity: 0,
    equityPercentage: 0,
    loanToValue: 0,
    availableEquity: 0,
    futureEquity: 0,
    monthlyPayment: 0,
    totalInterest: 0,
    payoffDate: ''
  })

  const calculateHomeEquity = () => {
    const {
      homeValue,
      mortgageBalance,
      interestRate,
      loanTerm,
      yearsRemaining,
      annualAppreciation,
      yearsProjection
    } = inputs

    // Calculate current equity
    const currentEquity = homeValue - mortgageBalance
    
    // Calculate equity percentage
    const equityPercentage = (currentEquity / homeValue) * 100
    
    // Calculate loan-to-value ratio
    const loanToValue = (mortgageBalance / homeValue) * 100
    
    // Calculate available equity (typically 80-85% of home value minus mortgage)
    const availableEquity = Math.max(0, (homeValue * 0.8) - mortgageBalance)
    
    // Calculate future home value
    const futureHomeValue = homeValue * Math.pow(1 + annualAppreciation / 100, yearsProjection)
    
    // Calculate future mortgage balance (simplified)
    const monthlyRate = interestRate / 100 / 12
    const totalMonths = yearsRemaining * 12
    const monthlyPayment = mortgageBalance * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
    
    // Calculate remaining balance after projection years
    const projectionMonths = yearsProjection * 12
    const futureMortgageBalance = mortgageBalance * Math.pow(1 + monthlyRate, projectionMonths) - monthlyPayment * ((Math.pow(1 + monthlyRate, projectionMonths) - 1) / monthlyRate)
    
    // Calculate future equity
    const futureEquity = Math.max(0, futureHomeValue - futureMortgageBalance)
    
    // Calculate total interest
    const totalInterest = (monthlyPayment * totalMonths) - mortgageBalance
    
    // Calculate payoff date
    const payoffDate = new Date()
    payoffDate.setFullYear(payoffDate.getFullYear() + yearsRemaining)

    setResults({
      currentEquity,
      equityPercentage,
      loanToValue,
      availableEquity,
      futureEquity,
      monthlyPayment,
      totalInterest,
      payoffDate: payoffDate.toLocaleDateString()
    })
  }

  useEffect(() => {
    calculateHomeEquity()
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

  const getEquityStatus = () => {
    if (results.equityPercentage >= 20) {
      return { text: 'Excellent equity position', color: 'text-green-600', bgColor: 'bg-green-50' }
    } else if (results.equityPercentage >= 10) {
      return { text: 'Good equity position', color: 'text-yellow-600', bgColor: 'bg-yellow-50' }
    } else {
      return { text: 'Limited equity position', color: 'text-red-600', bgColor: 'bg-red-50' }
    }
  }

  const equityStatus = getEquityStatus()

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home w-8 h-8 text-blue-600" aria-hidden="true">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9,22 9,12 15,12 15,22"></polyline>
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Home Equity Calculator</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Calculate your current home equity and project future growth potential for retirement planning</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calculator w-6 h-6 mr-3 text-blue-600" aria-hidden="true">
                <rect width="16" height="20" x="4" y="2" rx="2"></rect>
                <line x1="8" x2="16" y1="6" y2="6"></line>
                <line x1="16" x2="16" y1="14" y2="18"></line>
                <path d="M16 10h.01"></path>
                <path d="M12 10h.01"></path>
                <path d="M8 10h.01"></path>
                <path d="M12 14h.01"></path>
                <path d="M8 14h.01"></path>
                <path d="M12 18h.01"></path>
                <path d="M8 18h.01"></path>
              </svg>
              Home Information
            </h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home mr-2" aria-hidden="true">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9,22 9,12 15,12 15,22"></polyline>
                  </svg>
                  Current Home Value
                </label>
                <input 
                  type="number" 
                  value={inputs.homeValue} 
                  onChange={(e) => handleInputChange('homeValue', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="400000" 
                  min="0" 
                />
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dollar-sign mr-2" aria-hidden="true">
                    <line x1="12" x2="12" y1="2" y2="22"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                  Current Mortgage Balance
                </label>
                <input 
                  type="number" 
                  value={inputs.mortgageBalance} 
                  onChange={(e) => handleInputChange('mortgageBalance', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="250000" 
                  min="0" 
                />
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-percent mr-2" aria-hidden="true">
                    <line x1="19" x2="5" y1="5" y2="19"></line>
                    <line x1="6.5" x2="17.5" y1="6.5" y2="17.5"></line>
                  </svg>
                  Interest Rate (%)
                </label>
                <input 
                  type="number" 
                  value={inputs.interestRate} 
                  onChange={(e) => handleInputChange('interestRate', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="6.5" 
                  min="0" 
                  max="20" 
                  step="0.1" 
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
                  Years Remaining on Loan
                </label>
                <input 
                  type="number" 
                  value={inputs.yearsRemaining} 
                  onChange={(e) => handleInputChange('yearsRemaining', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="20" 
                  min="1" 
                  max="50" 
                />
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up mr-2" aria-hidden="true">
                    <polyline points="22,7 13.5,15.5 8.5,10.5 2,17"></polyline>
                    <polyline points="16,7 22,7 22,13"></polyline>
                  </svg>
                  Annual Appreciation Rate (%)
                </label>
                <input 
                  type="number" 
                  value={inputs.annualAppreciation} 
                  onChange={(e) => handleInputChange('annualAppreciation', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="3" 
                  min="0" 
                  max="10" 
                  step="0.1" 
                />
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock mr-2" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12,6 12,12 16,14"></polyline>
                  </svg>
                  Years for Projection
                </label>
                <input 
                  type="number" 
                  value={inputs.yearsProjection} 
                  onChange={(e) => handleInputChange('yearsProjection', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="5" 
                  min="1" 
                  max="30" 
                />
              </div>
            </div>

            {/* Calculate Button */}
            <div className="mt-8 text-center">
              <button
                onClick={calculateHomeEquity}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto font-semibold text-lg shadow-lg hover:shadow-xl"
              >
                <Calculator className="h-5 w-5 mr-2" />
                {results.currentEquity > 0 ? 'Recalculate Home Equity' : 'Calculate Home Equity'}
              </button>
            </div>
          </div>
          
          {/* Results Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Current Equity Analysis</h3>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Current Home Equity</h4>
                  <p className="text-3xl font-bold text-green-600">{formatCurrency(results.currentEquity)}</p>
                  <p className="text-sm text-green-500">{results.equityPercentage.toFixed(1)}% of home value</p>
                </div>
                
                <div className={`${equityStatus.bgColor} p-4 rounded-lg border`}>
                  <h4 className="font-semibold text-gray-800 mb-2">Equity Status</h4>
                  <p className={`text-lg font-bold ${equityStatus.color}`}>{equityStatus.text}</p>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Loan-to-Value Ratio</h4>
                  <p className="text-2xl font-bold text-blue-600">{results.loanToValue.toFixed(1)}%</p>
                  <p className="text-sm text-blue-500">Lower is better for borrowing</p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">Available Equity</h4>
                  <p className="text-2xl font-bold text-purple-600">{formatCurrency(results.availableEquity)}</p>
                  <p className="text-sm text-purple-500">Typically 80% of home value</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Future Projections</h3>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-2">Projected Future Equity</h4>
                  <p className="text-2xl font-bold text-orange-600">{formatCurrency(results.futureEquity)}</p>
                  <p className="text-sm text-orange-500">In {inputs.yearsProjection} years</p>
                </div>
                
                <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-lg border border-indigo-200">
                  <h4 className="font-semibold text-indigo-800 mb-2">Monthly Payment</h4>
                  <p className="text-2xl font-bold text-indigo-600">{formatCurrency(results.monthlyPayment)}</p>
                  <p className="text-sm text-indigo-500">Current mortgage payment</p>
                </div>
                
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2">Total Interest</h4>
                  <p className="text-2xl font-bold text-gray-600">{formatCurrency(results.totalInterest)}</p>
                  <p className="text-sm text-gray-500">Over loan term</p>
                </div>
                
                <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-4 rounded-lg border border-teal-200">
                  <h4 className="font-semibold text-teal-800 mb-2">Payoff Date</h4>
                  <p className="text-2xl font-bold text-teal-600">{results.payoffDate}</p>
                  <p className="text-sm text-teal-500">Estimated loan payoff</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Home Equity Options */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Home Equity Options</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card text-blue-600" aria-hidden="true">
                  <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                  <line x1="2" x2="22" y1="10" y2="10"></line>
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Home Equity Loan</h4>
              <p className="text-gray-600 text-sm">Fixed-rate loan with predictable payments</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-line-chart text-green-600" aria-hidden="true">
                  <path d="M3 3v18h18"></path>
                  <path d="m19 9-5 5-4-4-3 3"></path>
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Home Equity Line of Credit</h4>
              <p className="text-gray-600 text-sm">Flexible credit line with variable rates</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home text-purple-600" aria-hidden="true">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9,22 9,12 15,12 15,22"></polyline>
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Reverse Mortgage</h4>
              <p className="text-gray-600 text-sm">Convert equity to income without payments</p>
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
                This calculator provides estimates based on simplified calculations and assumptions. Actual home equity and loan terms may vary based on your specific situation, current market conditions, and lender requirements. This tool does not account for all possible fees, costs, or factors that may affect your home equity calculations. Consult with a licensed mortgage professional and financial advisor for personalized advice and accurate calculations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeEquityCalculator


