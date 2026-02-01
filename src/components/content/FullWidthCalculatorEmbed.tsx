'use client'

import React from 'react'

interface FullWidthCalculatorEmbedProps {
  title: string
  description: string
  children: React.ReactNode
  className?: string
  theme?: 'blue' | 'green' | 'purple' | 'orange'
}

const FullWidthCalculatorEmbed: React.FC<FullWidthCalculatorEmbedProps> = ({
  title,
  description,
  children,
  className = '',
  theme = 'blue'
}) => {
  const themeClasses = {
    blue: 'from-blue-50 to-indigo-100 border-blue-200',
    green: 'from-green-50 to-emerald-100 border-green-200',
    purple: 'from-purple-50 to-fuchsia-100 border-purple-200',
    orange: 'from-orange-50 to-amber-100 border-orange-200'
  }

  return (
    <div className={`w-full -mx-4 sm:-mx-6 lg:-mx-8 mb-12 ${className}`}>
      <div className={`bg-gradient-to-br ${themeClasses[theme]} border-y`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {description}
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FullWidthCalculatorEmbed
