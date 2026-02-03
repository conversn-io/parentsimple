'use client'

import React, { useState, useEffect } from 'react'
import { 
  CheckCircle, 
  Circle, 
  Save, 
  Download, 
  RotateCcw,
  FileText,
  Clock,
  Target,
  AlertCircle,
  Calendar,
  Star
} from 'lucide-react'
import { ChecklistConfig, ChecklistItem } from '../../lib/enhanced-articles'

interface InteractiveChecklistProps {
  config: ChecklistConfig
  title: string
  description?: string
  className?: string
}

interface ChecklistState {
  items: Record<string, ChecklistItem & { isCompleted: boolean; completedAt?: Date; notes?: string }>
  completionPercentage: number
  isComplete: boolean
  startTime: Date
  completionTime: Date | null
  totalTimeSpent: number // in minutes
}

export default function InteractiveChecklist({ 
  config, 
  title, 
  description, 
  className = '' 
}: InteractiveChecklistProps) {
  const [state, setState] = useState<ChecklistState>({
    items: {},
    completionPercentage: 0,
    isComplete: false,
    startTime: new Date(),
    completionTime: null,
    totalTimeSpent: 0
  })

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showCompleted, setShowCompleted] = useState(true)

  // Initialize items from config
  useEffect(() => {
    const initialItems: Record<string, any> = {}
    config.items.forEach(item => {
      initialItems[item.id] = {
        ...item,
        isCompleted: false,
        completedAt: undefined,
        notes: ''
      }
    })
    setState(prev => ({ ...prev, items: initialItems }))
  }, [config.items])

  // Load saved progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem(`checklist-progress-${title}`)
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress)
        setState(prev => ({
          ...prev,
          ...parsed,
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
      startTime: state.startTime.toISOString()
    }
    localStorage.setItem(`checklist-progress-${title}`, JSON.stringify(progressData))
  }, [state, title])

  // Calculate completion percentage
  useEffect(() => {
    const totalItems = config.items.length
    const completedItems = Object.values(state.items).filter(item => item.isCompleted).length
    const percentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0
    
    setState(prev => ({
      ...prev,
      completionPercentage: percentage,
      isComplete: percentage === 100
    }))

    if (percentage === 100 && !state.isComplete) {
      setState(prev => ({
        ...prev,
        completionTime: new Date(),
        totalTimeSpent: Math.round((Date.now() - prev.startTime.getTime()) / 1000 / 60)
      }))
    }
  }, [state.items, config.items.length, state.isComplete])

  const handleItemToggle = (itemId: string) => {
    setState(prev => ({
      ...prev,
      items: {
        ...prev.items,
        [itemId]: {
          ...prev.items[itemId],
          isCompleted: !prev.items[itemId].isCompleted,
          completedAt: !prev.items[itemId].isCompleted ? new Date() : undefined
        }
      }
    }))
  }

  const handleItemNotes = (itemId: string, notes: string) => {
    setState(prev => ({
      ...prev,
      items: {
        ...prev.items,
        [itemId]: {
          ...prev.items[itemId],
          notes
        }
      }
    }))
  }

  const handleReset = () => {
    const resetItems: Record<string, any> = {}
    config.items.forEach(item => {
      resetItems[item.id] = {
        ...item,
        isCompleted: false,
        completedAt: undefined,
        notes: ''
      }
    })
    setState({
      items: resetItems,
      completionPercentage: 0,
      isComplete: false,
      startTime: new Date(),
      completionTime: null,
      totalTimeSpent: 0
    })
    localStorage.removeItem(`checklist-progress-${title}`)
  }

  const handleSave = () => {
    const data = {
      title,
      description,
      items: state.items,
      completionPercentage: state.completionPercentage,
      isComplete: state.isComplete,
      startTime: state.startTime,
      completionTime: state.completionTime,
      totalTimeSpent: state.totalTimeSpent,
      timestamp: new Date().toISOString()
    }
    
    const savedChecklists = JSON.parse(localStorage.getItem('savedChecklists') || '[]')
    savedChecklists.push(data)
    localStorage.setItem('savedChecklists', JSON.stringify(savedChecklists))
    
    alert('Checklist progress saved successfully!')
  }

  const handleDownload = () => {
    const data = {
      title,
      description,
      items: state.items,
      completionPercentage: state.completionPercentage,
      isComplete: state.isComplete,
      startTime: state.startTime,
      completionTime: state.completionTime,
      totalTimeSpent: state.totalTimeSpent,
      timestamp: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.replace(/\s+/g, '-').toLowerCase()}-checklist.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-4 h-4" />
      case 'medium': return <Clock className="w-4 h-4" />
      case 'low': return <Circle className="w-4 h-4" />
      default: return <Circle className="w-4 h-4" />
    }
  }

  const filteredItems = config.items.filter(item => {
    if (selectedCategory && item.category_id !== selectedCategory) return false
    if (!showCompleted && state.items[item.id]?.isCompleted) return false
    return true
  })

  const categories = config.categories || []
  const completedItems = Object.values(state.items).filter(item => item.isCompleted).length
  const totalItems = config.items.length

  if (state.isComplete) {
    return (
      <div className={`checklist-wrapper p-8 ${className}`}>
        {/* Completion Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Checklist Complete!</h2>
          <p className="text-lg text-gray-600">{title}</p>
        </div>

        {/* Completion Message */}
        {config.conclusion && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <p className="text-green-800 text-lg">{config.conclusion}</p>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{totalItems}</div>
            <div className="text-sm text-blue-700">Total Items</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{completedItems}</div>
            <div className="text-sm text-green-700">Completed</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">{state.totalTimeSpent}</div>
            <div className="text-sm text-purple-700">Minutes</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <Star className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">100%</div>
            <div className="text-sm text-orange-700">Complete</div>
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
    <div className={`checklist-wrapper p-8 ${className}`}>
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

        {/* Introduction */}
        {config.introduction && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800">{config.introduction}</p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              {completedItems} of {totalItems} items completed
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(state.completionPercentage)}% Complete
            </span>
          </div>
          <div className="checklist-progress-bar w-full bg-gray-200 rounded-full h-3">
            <div 
              className="checklist-progress-fill h-3 rounded-full transition-all duration-300"
              style={{ width: `${state.completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {categories.length > 0 && (
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Category:</label>
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showCompleted"
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="showCompleted" className="text-sm text-gray-700">
              Show completed items
            </label>
          </div>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-4 mb-8">
        {filteredItems.map((item) => {
          const itemState = state.items[item.id]
          const isCompleted = itemState?.isCompleted || false
          
          return (
            <div
              key={item.id}
              className={`checklist-item border rounded-lg p-4 transition-all duration-200 ${
                isCompleted 
                  ? 'completed' 
                  : 'hover:border-blue-300'
              }`}
            >
              <div className="flex items-start space-x-3">
                <button
                  onClick={() => handleItemToggle(item.id)}
                  className={`mt-1 transition-colors ${
                    isCompleted ? 'text-green-600' : 'text-gray-400 hover:text-blue-600'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className={`text-lg font-medium ${
                      isCompleted ? 'text-green-800 line-through' : 'text-gray-900'
                    }`}>
                      {item.title}
                    </h3>
                    
                    <span className={`checklist-priority-badge inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${item.priority}`}>
                      {getPriorityIcon(item.priority)}
                      <span className="capitalize">{item.priority}</span>
                    </span>
                    
                    {item.estimated_time && (
                      <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium text-gray-600 bg-gray-100">
                        <Clock className="w-3 h-3" />
                        <span>{item.estimated_time}</span>
                      </span>
                    )}
                  </div>
                  
                  {item.due_date && (
                    <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>Due: {new Date(item.due_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  {/* Notes Section */}
                  <div className="mt-3">
                    <textarea
                      value={itemState?.notes || ''}
                      onChange={(e) => handleItemNotes(item.id, e.target.value)}
                      placeholder="Add notes for this item..."
                      className="checklist-notes-textarea w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      rows={2}
                    />
                  </div>
                  
                  {isCompleted && itemState?.completedAt && (
                    <p className="text-sm text-green-600 mt-2">
                      Completed on {itemState.completedAt.toLocaleDateString()} at {itemState.completedAt.toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-3">
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            title="Save Progress"
          >
            <Save className="w-5 h-5" />
            <span>Save</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center space-x-2 px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            title="Reset Checklist"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Reset</span>
          </button>
        </div>
        
        <div className="text-sm text-gray-500">
          {completedItems} of {totalItems} items completed
        </div>
      </div>
    </div>
  )
}
