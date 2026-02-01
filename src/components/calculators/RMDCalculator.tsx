'use client'

import React, { useState, useEffect } from 'react'
import { Calculator, DollarSign, Calendar, TrendingUp, AlertCircle, Info, Lightbulb, Heart } from 'lucide-react'

interface RMDCalculatorProps {
  className?: string
}

interface RMDResults {
  rmdAmount: number
  monthlyAmount: number
  lifeExpectancy: number
  projectedRMDs: Array<{
    age: number
    rmdAmount: number
    balance: number
  }>
}

export default function RMDCalculator({ className = '' }: RMDCalculatorProps) {
  const [inputs, setInputs] = useState({
    age: 72,
    balance: 500000,
    taxYear: 2024
  })

  const [results, setResults] = useState<RMDResults | null>(null)
  const [isCalculated, setIsCalculated] = useState(false)

  // IRS Uniform Lifetime Table (2024)
  const lifeExpectancyTable: Record<number, number> = {
    70: 27.4, 71: 26.5, 72: 25.6, 73: 24.7, 74: 23.8, 75: 22.9, 76: 22.0, 77: 21.2,
    78: 20.3, 79: 19.5, 80: 18.7, 81: 17.9, 82: 17.1, 83: 16.3, 84: 15.5, 85: 14.8,
    86: 14.1, 87: 13.4, 88: 12.7, 89: 12.0, 90: 11.4, 91: 10.8, 92: 10.2, 93: 9.6,
    94: 9.1, 95: 8.6, 96: 8.1, 97: 7.6, 98: 7.1, 99: 6.7, 100: 6.3, 101: 5.9,
    102: 5.5, 103: 5.2, 104: 4.9, 105: 4.5, 106: 4.2, 107: 3.9, 108: 3.7, 109: 3.4,
    110: 3.1, 111: 2.9, 112: 2.6, 113: 2.4, 114: 2.1, 115: 1.9
  }

  // Calculate RMD
  const calculateRMD = () => {
    const { age, balance } = inputs

    if (!age || !balance || age < 70) {
      return
    }

    const lifeExpectancy = lifeExpectancyTable[age] || 1.0
    const rmdAmount = balance / lifeExpectancy
    const monthlyAmount = rmdAmount / 12

    // Generate projected RMDs for next 10 years
    const projectedRMDs = []
    let projectedBalance = balance

    for (let i = 0; i < 10; i++) {
      const projectedAge = age + i
      const projectedLifeExpectancy = lifeExpectancyTable[projectedAge] || 1.0
      const projectedRMD = projectedBalance / projectedLifeExpectancy

      projectedRMDs.push({
        age: projectedAge,
        rmdAmount: projectedRMD,
        balance: projectedBalance
      })

      // Assume 5% growth minus RMD for next year projection
      projectedBalance = (projectedBalance - projectedRMD) * 1.05
    }

    const calculatedResults: RMDResults = {
      rmdAmount,
      monthlyAmount,
      lifeExpectancy,
      projectedRMDs
    }

    setResults(calculatedResults)
    setIsCalculated(true)
  }

  const handleInputChange = (field: string, value: number | string) => {
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

  useEffect(() => {
    calculateRMD()
  }, [inputs])

  return (
    <div className={`rmd-calculator bg-gray-50 min-h-screen ${className}`}>
      {/* Header */}
      <header className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-white/20 rounded-lg mr-4">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">
                Required Minimum Distribution Calculator
              </h1>
            </div>
            <p className="text-xl md:text-2xl mb-6">Calculate Your Required Retirement Account Withdrawals</p>
            <p className="text-lg opacity-90 max-w-3xl mx-auto">
              Use our IRS-compliant calculator to determine your required minimum distributions and avoid costly penalties
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Calculator Section */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
              <Calculator className="w-8 h-8 text-blue-600 mr-3" />
              RMD Calculator
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2 flex items-center">
                    <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                    Your Age (as of December 31st)
                  </label>
                  <input
                    type="number"
                    value={inputs.age}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-[#667eea] focus:ring-2 focus:ring-[#667eea]/20 transition-all"
                    placeholder="Enter your age"
                    min="70"
                    max="110"
                  />
                  <p className="text-sm text-gray-600 mt-1">You must be at least 70½ to be subject to RMDs</p>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2 flex items-center">
                    <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
                    Account Balance (as of December 31st)
                  </label>
                  <input
                    type="number"
                    value={inputs.balance}
                    onChange={(e) => handleInputChange('balance', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-[#667eea] focus:ring-2 focus:ring-[#667eea]/20 transition-all"
                    placeholder="Enter total account balance"
                    min="0"
                    step="0.01"
                  />
                  <p className="text-sm text-gray-600 mt-1">Include all traditional IRA, 401(k), and similar accounts</p>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2 flex items-center">
                    <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                    Tax Year
                  </label>
                  <select
                    value={inputs.taxYear}
                    onChange={(e) => handleInputChange('taxYear', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-[#667eea] focus:ring-2 focus:ring-[#667eea]/20 transition-all"
                  >
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                  </select>
                </div>
              </div>

              {/* Calculate Button */}
              <div className="mt-8 text-center">
                <button
                  onClick={calculateRMD}
                  className="bg-[#667eea] text-white px-8 py-4 rounded-lg hover:bg-[#5568d3] transition-colors flex items-center justify-center mx-auto font-semibold text-lg shadow-lg hover:shadow-xl"
                  disabled={!inputs.age || !inputs.balance || inputs.age < 70}
                >
                  <Calculator className="h-5 w-5 mr-2" />
                  {isCalculated ? 'Recalculate RMD' : 'Calculate Required Minimum Distribution'}
                </button>
              </div>

              {/* Results Section */}
              <div className="space-y-6">
                {results && (
                  <>
                    {/* RMD Result */}
                    <div className="bg-gradient-to-br from-pink-400 to-red-500 text-white rounded-2xl p-8 text-center">
                      <h3 className="text-2xl font-bold mb-4">Your Required Minimum Distribution</h3>
                      <div className="text-5xl font-bold mb-2">
                        {formatCurrency(results.rmdAmount)}
                      </div>
                      <p className="text-lg opacity-90">
                        Based on account balance of {formatCurrency(inputs.balance)}
                      </p>
                    </div>

                    {/* Additional Details */}
                    <div className="bg-gradient-to-br from-blue-400 to-cyan-400 text-white rounded-2xl p-6">
                      <h4 className="text-xl font-bold mb-4 flex items-center">
                        <Info className="w-5 h-5 mr-2" />
                        Calculation Details
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Life Expectancy Factor:</span>
                          <span className="font-bold">{results.lifeExpectancy.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Monthly Amount:</span>
                          <span className="font-bold">{formatCurrency(results.monthlyAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Account Balance:</span>
                          <span className="font-bold">{formatCurrency(inputs.balance)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Projected RMDs */}
                    <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                      <h4 className="text-xl font-bold mb-4 flex items-center text-gray-800">
                        <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                        Projected RMDs (Next 5 Years)
                      </h4>
                      <div className="space-y-2">
                        {results.projectedRMDs.slice(0, 5).map((projection, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium">Age {projection.age}:</span>
                            <span className="font-bold text-green-600">
                              {formatCurrency(projection.rmdAmount)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Important Information */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-500 mr-3" />
              Important RMD Information
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">What Are RMDs?</h3>
                <p className="text-gray-600 mb-4">
                  Required Minimum Distributions are mandatory withdrawals from traditional retirement accounts 
                  starting at age 73 (for those born 1951-1959) or 75 (for those born 1960 or later).
                </p>
                <p className="text-gray-600">
                  The penalty for not taking RMDs is 25% of the amount that should have been withdrawn 
                  (reduced from 50% for distributions required in 2023 and later).
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Account Types Subject to RMDs</h3>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Traditional IRAs:</strong> Subject to RMDs starting at age 73/75.</p>
                  <p><strong>401(k) Plans:</strong> Subject to RMDs unless still working.</p>
                  <p><strong>Roth IRAs:</strong> Not subject to RMDs during the owner's lifetime.</p>
                  <p><strong>Multiple accounts:</strong> Calculate RMDs for each account, but can take total from one account.</p>
                  <p><strong>Tax implications:</strong> RMDs are taxed as ordinary income in the year withdrawn.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RMD Planning Tips */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-yellow-500 mr-3" />
              RMD Planning Tips
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Plan Ahead</h3>
                <p className="text-gray-600">Start planning your RMD strategy before you're required to take distributions.</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Consider Roth Conversions</h3>
                <p className="text-gray-600">Convert traditional IRA funds to Roth IRA before RMDs begin to reduce future requirements.</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Charitable Giving</h3>
                <p className="text-gray-600">Consider Qualified Charitable Distributions to satisfy RMDs while supporting causes you care about.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Life Expectancy Table */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              IRS Uniform Lifetime Table (2024)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 font-semibold">Age</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold">Life Expectancy</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold">Age</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold">Life Expectancy</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(lifeExpectancyTable).map(([age, lifeExp], index) => {
                    if (index % 2 === 0) {
                      const nextAge = Object.keys(lifeExpectancyTable)[index + 1]
                      const nextLifeExp = nextAge ? lifeExpectancyTable[parseInt(nextAge)] : null
                      return (
                        <tr key={age} className={index % 4 === 0 ? 'bg-gray-50' : ''}>
                          <td className="border border-gray-300 px-4 py-2">{age}</td>
                          <td className="border border-gray-300 px-4 py-2">{lifeExp}</td>
                          <td className="border border-gray-300 px-4 py-2">{nextAge || ''}</td>
                          <td className="border border-gray-300 px-4 py-2">{nextLifeExp || ''}</td>
                        </tr>
                      )
                    }
                    return null
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* Disclaimer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-lg mb-2">© 2024 SeniorSimple - Your Trusted Retirement Planning Resource</p>
          <p className="text-gray-400">This calculator is for educational purposes only. Consult a qualified financial advisor for personalized advice.</p>
        </div>
      </footer>
    </div>
  )
}


