'use client'

import React, { useState, useEffect } from 'react'
import { 
  CheckCircle, 
  Circle, 
  ChevronRight, 
  ChevronLeft, 
  Save, 
  Download, 
  RotateCcw,
  FileText,
  Clock,
  Target
} from 'lucide-react'
import { ToolConfig, ToolStep } from '../../lib/enhanced-articles'

interface InteractiveToolProps {
  config: ToolConfig
  title: string
  description?: string
  className?: string
}

interface ToolState {
  currentStep: number
  completedSteps: Set<number>
  stepData: Record<number, Record<string, any>>
  isComplete: boolean
  startTime: Date
  completionTime: Date | null
}

export default function InteractiveTool({ 
  config, 
  title, 
  description, 
  className = '' 
}: InteractiveToolProps) {
  const [state, setState] = useState<ToolState>({
    currentStep: 0,
    completedSteps: new Set(),
    stepData: {},
    isComplete: false,
    startTime: new Date(),
    completionTime: null
  })

  const [isLoading, setIsLoading] = useState(false)

  // Load saved progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem(`tool-progress-${title}`)
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress)
        setState(prev => ({
          ...prev,
          ...parsed,
          completedSteps: new Set(parsed.completedSteps || []),
          startTime: new Date(parsed.startTime || Date.now())
        }))
      } catch (error) {
        console.warn('Failed to load saved progress:', error)
      }
    }
  }, [title])

  // Save progress to localStorage whenever state changes
  useEffect(() => {
    const progressData = {
      ...state,
      completedSteps: Array.from(state.completedSteps)
    }
    localStorage.setItem(`tool-progress-${title}`, JSON.stringify(progressData))
  }, [state, title])

  const currentStepConfig = config.steps[state.currentStep]
  const progress = ((state.completedSteps.size + (state.isComplete ? 1 : 0)) / config.steps.length) * 100

  const handleStepDataChange = (fieldId: string, value: any) => {
    setState(prev => ({
      ...prev,
      stepData: {
        ...prev.stepData,
        [state.currentStep]: {
          ...prev.stepData[state.currentStep],
          [fieldId]: value
        }
      }
    }))
  }

  const handleNextStep = () => {
    if (state.currentStep < config.steps.length - 1) {
      setState(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1,
        completedSteps: new Set([...prev.completedSteps, prev.currentStep])
      }))
    } else {
      // Complete the tool
      setState(prev => ({
        ...prev,
        isComplete: true,
        completionTime: new Date(),
        completedSteps: new Set([...prev.completedSteps, prev.currentStep])
      }))
    }
  }

  const handlePreviousStep = () => {
    if (state.currentStep > 0) {
      setState(prev => ({
        ...prev,
        currentStep: prev.currentStep - 1
      }))
    }
  }

  const handleReset = () => {
    setState({
      currentStep: 0,
      completedSteps: new Set(),
      stepData: {},
      isComplete: false,
      startTime: new Date(),
      completionTime: null
    })
    localStorage.removeItem(`tool-progress-${title}`)
  }

  const handleSave = () => {
    const data = {
      title,
      description,
      steps: config.steps,
      stepData: state.stepData,
      completedSteps: Array.from(state.completedSteps),
      isComplete: state.isComplete,
      startTime: state.startTime,
      completionTime: state.completionTime,
      timestamp: new Date().toISOString()
    }
    
    const savedTools = JSON.parse(localStorage.getItem('savedTools') || '[]')
    savedTools.push(data)
    localStorage.setItem('savedTools', JSON.stringify(savedTools))
    
    alert('Tool progress saved successfully!')
  }

  const handleDownload = () => {
    const data = {
      title,
      description,
      steps: config.steps,
      stepData: state.stepData,
      completedSteps: Array.from(state.completedSteps),
      isComplete: state.isComplete,
      startTime: state.startTime,
      completionTime: state.completionTime,
      timestamp: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.replace(/\s+/g, '-').toLowerCase()}-tool-progress.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const renderFormField = (field: any) => {
    const value = state.stepData[state.currentStep]?.[field.id] || field.default_value || ''

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            id={field.id}
            value={value}
            onChange={(e) => handleStepDataChange(field.id, e.target.value)}
            className="tool-form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            placeholder={field.placeholder}
            required={field.required}
          />
        )
      
      case 'number':
        return (
          <input
            type="number"
            id={field.id}
            value={value}
            onChange={(e) => handleStepDataChange(field.id, parseFloat(e.target.value) || 0)}
            className="tool-form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            step={field.step}
            required={field.required}
          />
        )
      
      case 'date':
        return (
          <input
            type="date"
            id={field.id}
            value={value}
            onChange={(e) => handleStepDataChange(field.id, e.target.value)}
            className="tool-form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            required={field.required}
          />
        )
      
      case 'checkbox':
        return (
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id={field.id}
              checked={value}
              onChange={(e) => handleStepDataChange(field.id, e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor={field.id} className="text-lg text-gray-700">
              {field.label}
            </label>
          </div>
        )
      
      case 'select':
        return (
          <select
            id={field.id}
            value={value}
            onChange={(e) => handleStepDataChange(field.id, e.target.value)}
            className="tool-form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            required={field.required}
          >
            <option value="">Select an option</option>
            {field.options?.map((option: string, index: number) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        )
      
      default:
        return (
          <input
            type="text"
            id={field.id}
            value={value}
            onChange={(e) => handleStepDataChange(field.id, e.target.value)}
            className="tool-form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            placeholder={field.placeholder}
            required={field.required}
          />
        )
    }
  }

  const renderStepOutputs = (outputs: any[]) => {
    if (!outputs || outputs.length === 0) return null

    return (
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-3">Step Results:</h4>
        <div className="space-y-2">
          {outputs.map((output, index) => {
            const value = state.stepData[state.currentStep]?.[output.id]
            return (
              <div key={index} className="flex justify-between">
                <span className="text-green-700">{output.label}:</span>
                <span className="font-semibold text-green-800">
                  {output.display_type === 'boolean' ? (value ? 'Yes' : 'No') : value}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (state.isComplete) {
    return (
      <div className={`tool-wrapper p-8 ${className}`}>
        {/* Completion Header */}
        <div className="tool-completion-celebration text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Tool Complete!</h2>
          <p className="text-lg text-gray-600">{title}</p>
        </div>

        {/* Completion Message */}
        {config.completion_message && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <p className="text-green-800 text-lg">{config.completion_message}</p>
          </div>
        )}

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">
              {Math.round((state.completionTime!.getTime() - state.startTime.getTime()) / 1000 / 60)} min
            </div>
            <div className="text-sm text-blue-700">Time to Complete</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">
              {config.steps.length}
            </div>
            <div className="text-sm text-green-700">Steps Completed</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">
              {Object.keys(state.stepData).length}
            </div>
            <div className="text-sm text-purple-700">Data Points Collected</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-5 h-5" />
            <span>Save Results</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Download</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Start Over</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`tool-wrapper p-8 ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            {description && (
              <p className="text-gray-600 mt-1">{description}</p>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {state.currentStep + 1} of {config.steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="tool-progress-bar w-full bg-gray-200 rounded-full h-2">
            <div 
              className="tool-progress-fill h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="tool-step-indicators flex space-x-2">
            {config.steps.map((_, index) => (
              <div
                key={index}
                className={`tool-step-indicator w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index === state.currentStep
                    ? 'active'
                    : state.completedSteps.has(index)
                    ? 'completed'
                    : 'pending'
                }`}
              >
                {state.completedSteps.has(index) ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Step */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {currentStepConfig.title}
        </h3>
        
        {currentStepConfig.description && (
          <p className="text-gray-600 mb-6">{currentStepConfig.description}</p>
        )}

        {/* Step Inputs */}
        {currentStepConfig.inputs && currentStepConfig.inputs.length > 0 && (
          <div className="space-y-6">
            {currentStepConfig.inputs.map((field) => (
              <div key={field.id} className="space-y-2">
                <label 
                  htmlFor={field.id}
                  className="block text-sm font-medium text-gray-700"
                >
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderFormField(field)}
              </div>
            ))}
          </div>
        )}

        {/* Step Outputs */}
        {currentStepConfig.outputs && renderStepOutputs(currentStepConfig.outputs)}

        {/* Step Guidance */}
        {currentStepConfig.guidance && (
          <div className="tool-guidance-box mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">{currentStepConfig.guidance}</p>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handlePreviousStep}
          disabled={state.currentStep === 0}
          className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Previous</span>
        </button>

        <div className="flex space-x-3">
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            title="Save Progress"
          >
            <Save className="w-5 h-5" />
          </button>
          <button
            onClick={handleReset}
            className="flex items-center space-x-2 px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            title="Reset Tool"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={handleNextStep}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span>{state.currentStep === config.steps.length - 1 ? 'Complete' : 'Next'}</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
