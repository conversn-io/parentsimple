'use client'

import React, { useState, useEffect } from 'react'
import { Calculator } from 'lucide-react'

interface ReverseMortgageResult {
  principalLimit: number
  availableProceeds: number
  monthlyPayment: number
  lineOfCredit: number
  lumpSum: number
  tenurePayment: number
  termPayment: number
  totalInterest: number
  totalLoanBalance: number
}

const ReverseMortgageCalculator: React.FC = () => {
  const [inputs, setInputs] = useState({
    age: 65,
    homeValue: 300000,
    mortgageBalance: 0,
    interestRate: 6.5,
    termYears: 10
  })

  const [results, setResults] = useState<ReverseMortgageResult>({
    principalLimit: 0,
    availableProceeds: 0,
    monthlyPayment: 0,
    lineOfCredit: 0,
    lumpSum: 0,
    tenurePayment: 0,
    termPayment: 0,
    totalInterest: 0,
    totalLoanBalance: 0
  })

  const calculateReverseMortgage = () => {
    const { age, homeValue, mortgageBalance, interestRate, termYears } = inputs

    // Calculate principal limit factor based on age (simplified)
    const ageFactor = Math.min(0.8, 0.4 + (age - 62) * 0.02) // Simplified calculation
    
    // Calculate principal limit
    const principalLimit = homeValue * ageFactor
    
    // Calculate available proceeds (principal limit minus existing mortgage)
    const availableProceeds = Math.max(0, principalLimit - mortgageBalance)
    
    // Calculate different payment options
    const monthlyRate = interestRate / 100 / 12
    const totalMonths = termYears * 12
    
    // Monthly payment calculation (simplified)
    const monthlyPayment = availableProceeds * 0.1 // Simplified: 10% of proceeds as monthly payment
    
    // Line of credit (50% of available proceeds)
    const lineOfCredit = availableProceeds * 0.5
    
    // Lump sum (30% of available proceeds)
    const lumpSum = availableProceeds * 0.3
    
    // Tenure payment (lifetime monthly payments)
    const tenurePayment = availableProceeds * 0.05 // Simplified: 5% of proceeds as tenure payment
    
    // Term payment (fixed term monthly payments)
    const termPayment = availableProceeds * 0.08 // Simplified: 8% of proceeds as term payment
    
    // Calculate total interest (simplified)
    const totalInterest = availableProceeds * (interestRate / 100) * termYears
    
    // Total loan balance
    const totalLoanBalance = availableProceeds + totalInterest

    setResults({
      principalLimit,
      availableProceeds,
      monthlyPayment,
      lineOfCredit,
      lumpSum,
      tenurePayment,
      termPayment,
      totalInterest,
      totalLoanBalance
    })
  }

  useEffect(() => {
    calculateReverseMortgage()
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
            <h1 className="text-4xl font-bold text-gray-800">Reverse Mortgage Calculator</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Discover how much you could receive from a reverse mortgage based on your age, home value, and current market rates</p>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home w-6 h-6 mr-2 text-blue-600" aria-hidden="true">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9,22 9,12 15,12 15,22"></polyline>
            </svg>
            Calculate Your Reverse Mortgage Proceeds
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-clock mr-2 text-blue-600" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12,6 12,12 16,14"></polyline>
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                  </svg>
                  Your Age
                </label>
                <input 
                  type="number" 
                  value={inputs.age} 
                  onChange={(e) => handleInputChange('age', Number(e.target.value))}
                  min="62" 
                  max="100" 
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
                <p className="text-sm text-gray-500 mt-1">Must be 62 or older to qualify</p>
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home mr-2 text-blue-600" aria-hidden="true">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9,22 9,12 15,12 15,22"></polyline>
                  </svg>
                  Estimated Home Value
                </label>
                <input 
                  type="number" 
                  value={inputs.homeValue} 
                  onChange={(e) => handleInputChange('homeValue', Number(e.target.value))}
                  min="50000" 
                  max="2000000" 
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
                <p className="text-sm text-gray-500 mt-1">Current market value of your home</p>
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dollar-sign mr-2 text-blue-600" aria-hidden="true">
                    <line x1="12" x2="12" y1="2" y2="22"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                  Current Mortgage Balance
                </label>
                <input 
                  type="number" 
                  value={inputs.mortgageBalance} 
                  onChange={(e) => handleInputChange('mortgageBalance', Number(e.target.value))}
                  min="0" 
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
                <p className="text-sm text-gray-500 mt-1">Enter 0 if home is paid off</p>
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-percent mr-2 text-blue-600" aria-hidden="true">
                    <line x1="19" x2="5" y1="5" y2="19"></line>
                    <line x1="6.5" x2="17.5" y1="6.5" y2="17.5"></line>
                  </svg>
                  Current Interest Rate
                </label>
                <input 
                  type="number" 
                  value={inputs.interestRate} 
                  onChange={(e) => handleInputChange('interestRate', Number(e.target.value))}
                  min="3" 
                  max="12" 
                  step="0.1" 
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
                <p className="text-sm text-gray-500 mt-1">Current HECM rates (typically 6-8%)</p>
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar mr-2 text-blue-600" aria-hidden="true">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                    <line x1="16" x2="16" y1="2" y2="6"></line>
                    <line x1="8" x2="8" y1="2" y2="6"></line>
                    <line x1="3" x2="21" y1="10" y2="10"></line>
                  </svg>
                  Term Length (Years)
                </label>
                <input 
                  type="number" 
                  value={inputs.termYears} 
                  onChange={(e) => handleInputChange('termYears', Number(e.target.value))}
                  min="1" 
                  max="30" 
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
                <p className="text-sm text-gray-500 mt-1">For term payment calculations</p>
              </div>
            </div>

            {/* Calculate Button */}
            <div className="mt-8 text-center">
              <button
                onClick={calculateReverseMortgage}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto font-semibold text-lg shadow-lg hover:shadow-xl"
                disabled={inputs.age < 62}
              >
                <Calculator className="h-5 w-5 mr-2" />
                {results.principalLimit > 0 ? 'Recalculate Reverse Mortgage' : 'Calculate Reverse Mortgage Proceeds'}
              </button>
            </div>
            
            {/* Results Section */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                <h3 className="text-xl font-semibold text-green-800 mb-4">Available Proceeds</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-green-700">Principal Limit:</span>
                    <span className="text-lg font-bold text-green-600">{formatCurrency(results.principalLimit)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-700">Available Proceeds:</span>
                    <span className="text-2xl font-bold text-green-600">{formatCurrency(results.availableProceeds)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">Payment Options</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">Monthly Payment:</span>
                    <span className="text-lg font-bold text-blue-600">{formatCurrency(results.monthlyPayment)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">Line of Credit:</span>
                    <span className="text-lg font-bold text-blue-600">{formatCurrency(results.lineOfCredit)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">Lump Sum:</span>
                    <span className="text-lg font-bold text-blue-600">{formatCurrency(results.lumpSum)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">Tenure Payment:</span>
                    <span className="text-lg font-bold text-blue-600">{formatCurrency(results.tenurePayment)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">Term Payment:</span>
                    <span className="text-lg font-bold text-blue-600">{formatCurrency(results.termPayment)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                <h3 className="text-xl font-semibold text-purple-800 mb-4">Loan Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-700">Total Interest:</span>
                    <span className="text-lg font-bold text-purple-600">{formatCurrency(results.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-700">Total Loan Balance:</span>
                    <span className="text-lg font-bold text-purple-600">{formatCurrency(results.totalLoanBalance)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Important Reverse Mortgage Information</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Benefits</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check text-green-600 mr-2 mt-0.5" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5"></path>
                  </svg>
                  No monthly mortgage payments required
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check text-green-600 mr-2 mt-0.5" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5"></path>
                  </svg>
                  Stay in your home as long as you live
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check text-green-600 mr-2 mt-0.5" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5"></path>
                  </svg>
                  Flexible payment options
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check text-green-600 mr-2 mt-0.5" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5"></path>
                  </svg>
                  Non-recourse loan protection
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Considerations</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-triangle text-yellow-600 mr-2 mt-0.5" aria-hidden="true">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                    <path d="M12 9v4"></path>
                    <path d="M12 17h.01"></path>
                  </svg>
                  Interest accrues over time
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-triangle text-yellow-600 mr-2 mt-0.5" aria-hidden="true">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                    <path d="M12 9v4"></path>
                    <path d="M12 17h.01"></path>
                  </svg>
                  Upfront costs and fees
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-triangle text-yellow-600 mr-2 mt-0.5" aria-hidden="true">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                    <path d="M12 9v4"></path>
                    <path d="M12 17h.01"></path>
                  </svg>
                  Must maintain home and pay taxes
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-triangle text-yellow-600 mr-2 mt-0.5" aria-hidden="true">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                    <path d="M12 9v4"></path>
                    <path d="M12 17h.01"></path>
                  </svg>
                  Reduces home equity over time
                </li>
              </ul>
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
                This calculator provides estimates based on simplified calculations and assumptions. Actual reverse mortgage proceeds may vary based on your specific situation, current market conditions, and lender requirements. This tool does not account for all possible fees, costs, or factors that may affect your reverse mortgage. Consult with a licensed reverse mortgage counselor and lender for personalized advice and accurate calculations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReverseMortgageCalculator


