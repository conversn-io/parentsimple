'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Calculator, Download, Printer, RotateCcw, Save, Share2 } from 'lucide-react'
import { CalculatorConfig, CalculatorInput, CalculatorOutput } from '../../lib/enhanced-articles'

interface CalculatorWrapperProps {
  config: CalculatorConfig
  title: string
  description?: string
  className?: string
}

interface CalculatorState {
  inputs: Record<string, any>
  outputs: Record<string, any>
  isCalculated: boolean
  lastCalculated: Date | null
}

export default function CalculatorWrapper({ 
  config, 
  title, 
  description, 
  className = '' 
}: CalculatorWrapperProps) {
  const [state, setState] = useState<CalculatorState>({
    inputs: {},
    outputs: {},
    isCalculated: false,
    lastCalculated: null
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize inputs with default values
  useEffect(() => {
    const initialInputs: Record<string, any> = {}
    config.inputs.forEach(input => {
      initialInputs[input.id] = input.default_value || ''
    })
    setState(prev => ({ ...prev, inputs: initialInputs }))
  }, [config.inputs])

  // Calculate outputs when inputs change
  const calculateOutputs = useCallback(async () => {
    if (!state.inputs || Object.keys(state.inputs).length === 0) return

    setIsLoading(true)
    setError(null)

    try {
      const calculatedOutputs: Record<string, any> = {}

      for (const output of config.outputs) {
        try {
          // Create a safe evaluation context
          const context = { ...state.inputs }
          
          // Simple formula evaluation (in production, use a proper math parser)
          let result = output.formula
          
          // Replace input variables with actual values
          Object.keys(context).forEach(key => {
            const value = context[key]
            const regex = new RegExp(`\\b${key}\\b`, 'g')
            result = result.replace(regex, value.toString())
          })

          // Evaluate the formula (basic implementation)
          // In production, use a proper math evaluation library
          const calculatedValue = eval(result)
          calculatedOutputs[output.id] = calculatedValue
        } catch (calcError) {
          console.warn(`Error calculating ${output.id}:`, calcError)
          calculatedOutputs[output.id] = 0
        }
      }

      setState(prev => ({
        ...prev,
        outputs: calculatedOutputs,
        isCalculated: true,
        lastCalculated: new Date()
      }))
    } catch (err) {
      setError('An error occurred during calculation. Please check your inputs.')
      console.error('Calculation error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [state.inputs, config.outputs])

  // Auto-calculate when inputs change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(state.inputs).length > 0) {
        calculateOutputs()
      }
    }, 500) // Debounce calculations

    return () => clearTimeout(timer)
  }, [state.inputs, calculateOutputs])

  const handleInputChange = (inputId: string, value: any) => {
    setState(prev => ({
      ...prev,
      inputs: {
        ...prev.inputs,
        [inputId]: value
      }
    }))
  }

  const handleReset = () => {
    const resetInputs: Record<string, any> = {}
    config.inputs.forEach(input => {
      resetInputs[input.id] = input.default_value || ''
    })
    setState({
      inputs: resetInputs,
      outputs: {},
      isCalculated: false,
      lastCalculated: null
    })
    setError(null)
  }

  const handleSave = () => {
    const data = {
      title,
      inputs: state.inputs,
      outputs: state.outputs,
      timestamp: new Date().toISOString()
    }
    
    // Save to localStorage for now (in production, save to user account)
    const savedCalculations = JSON.parse(localStorage.getItem('savedCalculations') || '[]')
    savedCalculations.push(data)
    localStorage.setItem('savedCalculations', JSON.stringify(savedCalculations))
    
    // Show success message (you could use a toast notification here)
    alert('Calculation saved successfully!')
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    const data = {
      title,
      description,
      inputs: state.inputs,
      outputs: state.outputs,
      timestamp: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.replace(/\s+/g, '-').toLowerCase()}-calculation.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatValue = (value: any, output: CalculatorOutput): string => {
    if (value === null || value === undefined) return '0'
    
    switch (output.display_type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value)
      case 'percentage':
        return `${value.toFixed(2)}%`
      case 'number':
        return new Intl.NumberFormat('en-US').format(value)
      default:
        return value.toString()
    }
  }

  const renderInput = (input: CalculatorInput) => {
    const value = state.inputs[input.id] || input.default_value || ''

    switch (input.type) {
      case 'number':
        return (
          <input
            type="number"
            id={input.id}
            value={value}
            onChange={(e) => handleInputChange(input.id, parseFloat(e.target.value) || 0)}
            className="calculator-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            placeholder={input.placeholder}
            min={input.min}
            max={input.max}
            step={input.step}
            required={input.required}
          />
        )
      
      case 'select':
        return (
          <select
            id={input.id}
            value={value}
            onChange={(e) => handleInputChange(input.id, e.target.value)}
            className="calculator-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            required={input.required}
          >
            <option value="">Select an option</option>
            {input.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        )
      
      case 'range':
        return (
          <div className="space-y-2">
            <input
              type="range"
              id={input.id}
              value={value}
              onChange={(e) => handleInputChange(input.id, parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              min={input.min}
              max={input.max}
              step={input.step}
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{input.min}</span>
              <span className="font-semibold">{value}</span>
              <span>{input.max}</span>
            </div>
          </div>
        )
      
      default:
        return (
          <input
            type="text"
            id={input.id}
            value={value}
            onChange={(e) => handleInputChange(input.id, e.target.value)}
            className="calculator-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            placeholder={input.placeholder}
            required={input.required}
          />
        )
    }
  }

  return (
    <div className={`calculator-wrapper p-8 ${className}`}>
      {/* Header */}
      <div className="calculator-header flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            {description && (
              <p className="text-white/90 mt-1">{description}</p>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="calculator-action-buttons flex items-center space-x-2">
          <button
            onClick={handleReset}
            className="calculator-action-button secondary p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Reset Calculator"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={handleSave}
            className="calculator-action-button secondary p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Save Calculation"
          >
            <Save className="w-5 h-5" />
          </button>
          <button
            onClick={handleDownload}
            className="calculator-action-button secondary p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Download Results"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={handlePrint}
            className="calculator-action-button secondary p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Print Results"
          >
            <Printer className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Inputs Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Enter Your Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {config.inputs.map((input) => (
            <div key={input.id} className="calculator-input-group space-y-2">
              <label 
                htmlFor={input.id}
                className="calculator-input-label block text-sm font-medium text-gray-700"
              >
                {input.label}
                {input.required && <span className="text-red-500 ml-1">*</span>}
                {input.unit && <span className="text-gray-500 ml-1">({input.unit})</span>}
              </label>
              {renderInput(input)}
              {input.help_text && (
                <p className="text-sm text-gray-500">{input.help_text}</p>
              )}
            </div>
          ))}
        </div>

        {/* Calculate Button */}
        <div className="mt-8 text-center">
          <button
            onClick={calculateOutputs}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || Object.keys(state.inputs).length === 0}
          >
            <Calculator className="h-5 w-5 mr-2" />
            {isLoading ? 'Calculating...' : state.isCalculated ? 'Recalculate' : 'Calculate'}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {state.isCalculated && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Results</h3>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {config.outputs.map((output) => (
              <div key={output.id} className="calculator-result-card rounded-lg p-6">
                <h4 className="text-lg font-semibold text-blue-900 mb-2">
                  {output.label}
                </h4>
                <div className="calculator-result-value text-3xl font-bold text-blue-600 mb-2">
                  {formatValue(state.outputs[output.id], output)}
                </div>
                {output.description && (
                  <p className="text-sm text-blue-700">{output.description}</p>
                )}
              </div>
            ))}
          </div>
          
          {state.lastCalculated && (
            <p className="text-sm text-gray-500 mt-4">
              Last calculated: {state.lastCalculated.toLocaleString()}
            </p>
          )}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Calculating...</span>
        </div>
      )}

      {/* Disclaimer */}
      {config.disclaimer && (
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Disclaimer:</strong> {config.disclaimer}
          </p>
        </div>
      )}
    </div>
  )
}
