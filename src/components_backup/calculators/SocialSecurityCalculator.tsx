'use client'

import React, { useState, useEffect } from 'react'
import { Calculator, TrendingUp, DollarSign, Calendar, User, AlertCircle } from 'lucide-react'

interface SocialSecurityCalculatorProps {
  className?: string
}

interface CalculationResults {
  fullRetirementBenefit: number
  earlyBenefit: number
  delayedBenefit: number
  breakEvenAge: number
  lifetimeBenefit: {
    early: number
    full: number
    delayed: number
  }
  recommendations: string[]
}

export default function SocialSecurityCalculator({ className = '' }: SocialSecurityCalculatorProps) {
  const [inputs, setInputs] = useState({
    birthYear: 1960,
    currentAge: 64,
    annualIncome: 75000,
    expectedRetirementAge: 67,
    lifeExpectancy: 85,
    maritalStatus: 'single' as 'single' | 'married',
    spouseBirthYear: 1962,
    spouseAnnualIncome: 50000
  })

  const [results, setResults] = useState<CalculationResults | null>(null)
  const [isCalculated, setIsCalculated] = useState(false)

  // Calculate Social Security benefits
  const calculateBenefits = () => {
    const { birthYear, currentAge, annualIncome, expectedRetirementAge, lifeExpectancy, maritalStatus, spouseBirthYear, spouseAnnualIncome } = inputs

    // Full Retirement Age calculation (simplified)
    const fullRetirementAge = birthYear <= 1954 ? 66 : birthYear >= 1960 ? 67 : 66 + (birthYear - 1954) * 0.5

    // Primary Insurance Amount (PIA) calculation (simplified)
    const averageIndexedMonthlyEarnings = Math.min(annualIncome, 160200) / 12 // 2023 max
    let pia = 0
    
    if (averageIndexedMonthlyEarnings <= 1115) {
      pia = averageIndexedMonthlyEarnings * 0.9
    } else if (averageIndexedMonthlyEarnings <= 6721) {
      pia = 1115 * 0.9 + (averageIndexedMonthlyEarnings - 1115) * 0.32
    } else {
      pia = 1115 * 0.9 + (6721 - 1115) * 0.32 + (averageIndexedMonthlyEarnings - 6721) * 0.15
    }

    // Calculate benefits at different ages
    const fullRetirementBenefit = pia
    const earlyBenefit = pia * 0.7 // 30% reduction for claiming at 62
    const delayedBenefit = pia * 1.24 // 24% increase for claiming at 70

    // Calculate break-even age
    const yearsToFullRetirement = fullRetirementAge - 62
    const yearsToDelayed = 70 - fullRetirementAge
    const breakEvenAge = 62 + (earlyBenefit * yearsToFullRetirement) / (fullRetirementBenefit - earlyBenefit)

    // Calculate lifetime benefits
    const yearsFromEarlyToDeath = lifeExpectancy - 62
    const yearsFromFullToDeath = lifeExpectancy - fullRetirementAge
    const yearsFromDelayedToDeath = lifeExpectancy - 70

    const lifetimeBenefit = {
      early: earlyBenefit * 12 * yearsFromEarlyToDeath,
      full: fullRetirementBenefit * 12 * yearsFromFullToDeath,
      delayed: delayedBenefit * 12 * yearsFromDelayedToDeath
    }

    // Generate recommendations
    const recommendations = []
    if (lifeExpectancy > breakEvenAge) {
      recommendations.push('Consider delaying benefits until full retirement age or later for higher lifetime benefits')
    } else {
      recommendations.push('Consider claiming benefits early if you have health concerns or need immediate income')
    }
    
    if (maritalStatus === 'married') {
      recommendations.push('Coordinate with your spouse to maximize combined benefits')
      recommendations.push('Consider spousal benefits and survivor benefits in your planning')
    }

    if (annualIncome > 50000) {
      recommendations.push('Higher earners may benefit from delaying benefits to maximize monthly payments')
    }

    setResults({
      fullRetirementBenefit,
      earlyBenefit,
      delayedBenefit,
      breakEvenAge,
      lifetimeBenefit,
      recommendations
    })
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

  const formatAge = (age: number) => {
    return `${Math.floor(age)} years ${Math.round((age - Math.floor(age)) * 12)} months`
  }

  useEffect(() => {
    calculateBenefits()
  }, [inputs])

  return (
    <div className={`social-security-calculator bg-gradient-to-br from-[#36596A] to-[#2D4A57] p-6 ${className}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-white/20 rounded-lg mr-4">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">
              Social Security Optimization Calculator
            </h1>
          </div>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Calculate your optimal Social Security claiming strategy and maximize your retirement benefits
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-[#36596A] flex items-center">
              <User className="w-6 h-6 mr-3" />
              Your Information
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birth Year
                </label>
                <input
                  type="number"
                  value={inputs.birthYear}
                  onChange={(e) => handleInputChange('birthYear', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#36596A] focus:ring-2 focus:ring-[#36596A]/20 transition-all"
                  min="1920"
                  max="2010"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Age
                </label>
                <input
                  type="number"
                  value={inputs.currentAge}
                  onChange={(e) => handleInputChange('currentAge', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#36596A] focus:ring-2 focus:ring-[#36596A]/20 transition-all"
                  min="18"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Income
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={inputs.annualIncome}
                    onChange={(e) => handleInputChange('annualIncome', parseInt(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#36596A] focus:ring-2 focus:ring-[#36596A]/20 transition-all"
                    min="0"
                    max="200000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Retirement Age
                </label>
                <input
                  type="number"
                  value={inputs.expectedRetirementAge}
                  onChange={(e) => handleInputChange('expectedRetirementAge', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#36596A] focus:ring-2 focus:ring-[#36596A]/20 transition-all"
                  min="62"
                  max="70"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Life Expectancy
                </label>
                <input
                  type="number"
                  value={inputs.lifeExpectancy}
                  onChange={(e) => handleInputChange('lifeExpectancy', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#36596A] focus:ring-2 focus:ring-[#36596A]/20 transition-all"
                  min="70"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marital Status
                </label>
                <select
                  value={inputs.maritalStatus}
                  onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#36596A] focus:ring-2 focus:ring-[#36596A]/20 transition-all"
                >
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                </select>
              </div>

              {inputs.maritalStatus === 'married' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Spouse Birth Year
                    </label>
                    <input
                      type="number"
                      value={inputs.spouseBirthYear}
                      onChange={(e) => handleInputChange('spouseBirthYear', parseInt(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#36596A] focus:ring-2 focus:ring-[#36596A]/20 transition-all"
                      min="1920"
                      max="2010"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Spouse Annual Income
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={inputs.spouseAnnualIncome}
                        onChange={(e) => handleInputChange('spouseAnnualIncome', parseInt(e.target.value))}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#36596A] focus:ring-2 focus:ring-[#36596A]/20 transition-all"
                        min="0"
                        max="200000"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Calculate Button */}
              <div className="mt-8 text-center">
                <button
                  onClick={calculateBenefits}
                  className="bg-[#36596A] text-white px-8 py-4 rounded-lg hover:bg-[#2a4a5a] transition-colors flex items-center justify-center mx-auto font-semibold text-lg shadow-lg hover:shadow-xl"
                  disabled={isCalculated && !inputs.birthYear}
                >
                  <Calculator className="h-5 w-5 mr-2" />
                  {isCalculated ? 'Recalculate Benefits' : 'Calculate Social Security Benefits'}
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {results && (
              <>
                {/* Benefit Comparison */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                  <h2 className="text-2xl font-bold mb-6 text-[#36596A] flex items-center">
                    <TrendingUp className="w-6 h-6 mr-3" />
                    Benefit Comparison
                  </h2>

                  <div className="grid gap-4">
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-red-800">Early Benefits (Age 62)</h3>
                          <p className="text-sm text-red-600">30% reduction</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-red-600">
                            {formatCurrency(results.earlyBenefit)}
                          </div>
                          <div className="text-sm text-red-500">per month</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-blue-800">Full Retirement Age</h3>
                          <p className="text-sm text-blue-600">No reduction</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            {formatCurrency(results.fullRetirementBenefit)}
                          </div>
                          <div className="text-sm text-blue-500">per month</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-green-800">Delayed Benefits (Age 70)</h3>
                          <p className="text-sm text-green-600">24% increase</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            {formatCurrency(results.delayedBenefit)}
                          </div>
                          <div className="text-sm text-green-500">per month</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lifetime Benefits */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                  <h2 className="text-2xl font-bold mb-6 text-[#36596A] flex items-center">
                    <Calendar className="w-6 h-6 mr-3" />
                    Lifetime Benefits
                  </h2>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium">Early Benefits (Age 62)</span>
                      <span className="text-xl font-bold text-red-600">
                        {formatCurrency(results.lifetimeBenefit.early)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium">Full Retirement Age</span>
                      <span className="text-xl font-bold text-blue-600">
                        {formatCurrency(results.lifetimeBenefit.full)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium">Delayed Benefits (Age 70)</span>
                      <span className="text-xl font-bold text-green-600">
                        {formatCurrency(results.lifetimeBenefit.delayed)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-800">Break-Even Age</h4>
                        <p className="text-sm text-yellow-700">
                          You would need to live until age {formatAge(results.breakEvenAge)} for delayed benefits to equal early benefits.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                  <h2 className="text-2xl font-bold mb-6 text-[#36596A]">
                    Personalized Recommendations
                  </h2>

                  <div className="space-y-4">
                    {results.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start p-4 bg-blue-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                        <p className="text-gray-700">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-white/80 mr-3 mt-0.5" />
            <div className="text-white/90">
              <h3 className="font-semibold mb-2">Important Disclaimer</h3>
              <p className="text-sm leading-relaxed">
                This calculator provides estimates based on simplified Social Security benefit calculations. 
                Actual benefits may vary based on your complete earnings history, work credits, and other factors. 
                For accurate benefit estimates, visit the official Social Security Administration website or contact them directly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
