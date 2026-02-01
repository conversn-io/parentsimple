'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { 
  Search, 
  Filter, 
  X, 
  Clock, 
  Tag, 
  TrendingUp,
  Calculator,
  FileText,
  CheckSquare,
  Wrench,
  Calendar
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { EnhancedArticle } from '../../lib/enhanced-articles'

interface ContentSearchProps {
  onResultSelect?: (article: EnhancedArticle) => void
  className?: string
  placeholder?: string
}

interface SearchFilters {
  contentType: string[]
  category: string[]
  difficulty: string[]
  tags: string[]
}

interface SearchResult extends EnhancedArticle {
  rank?: number
  matchedTerms?: string[]
}

export default function ContentSearch({ 
  onResultSelect, 
  className = '',
  placeholder = "Search guides, calculators, tools, and checklists..."
}: ContentSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    contentType: [],
    category: [],
    difficulty: [],
    tags: []
  })
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [popularSearches, setPopularSearches] = useState<string[]>([])

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Load popular searches (mock data for now)
  useEffect(() => {
    setPopularSearches([
      'medicare enrollment',
      'retirement planning',
      'estate planning',
      'life insurance calculator',
      'downsizing calculator',
      'reverse mortgage',
      'long term care',
      'social security'
    ])
  }, [])

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string, searchFilters: SearchFilters) => {
      if (!searchQuery.trim()) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        // Use the search function from our database
        const { data, error } = await supabase
          .rpc('search_articles', {
            search_term: searchQuery,
            limit_count: 20
          })

        if (error) {
          console.error('Search error:', error)
          setResults([])
          return
        }

        // Apply additional filters
        let filteredResults = data || []
        
        if (searchFilters.contentType.length > 0) {
          filteredResults = filteredResults.filter((article: any) =>
            searchFilters.contentType.includes(article.content_type)
          )
        }
        
        if (searchFilters.category.length > 0) {
          filteredResults = filteredResults.filter((article: any) =>
            searchFilters.category.includes(article.category)
          )
        }
        
        if (searchFilters.difficulty.length > 0) {
          filteredResults = filteredResults.filter((article: any) =>
            searchFilters.difficulty.includes(article.difficulty_level)
          )
        }

        // Highlight matched terms
        const processedResults = filteredResults.map((article: any) => ({
          ...article,
          matchedTerms: extractMatchedTerms(searchQuery, article)
        }))

        setResults(processedResults)

        // Save to recent searches
        if (searchQuery.trim()) {
          const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
          setRecentSearches(updated)
          localStorage.setItem('recentSearches', JSON.stringify(updated))
        }

      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300),
    [recentSearches]
  )

  // Trigger search when query or filters change
  useEffect(() => {
    debouncedSearch(query, filters)
  }, [query, filters, debouncedSearch])

  const extractMatchedTerms = (searchQuery: string, article: any): string[] => {
    const terms = searchQuery.toLowerCase().split(' ').filter(term => term.length > 2)
    const matchedTerms: string[] = []
    
    const searchableText = `${article.title} ${article.excerpt} ${article.content}`.toLowerCase()
    
    terms.forEach(term => {
      if (searchableText.includes(term)) {
        matchedTerms.push(term)
      }
    })
    
    return matchedTerms
  }

  const handleFilterChange = (filterType: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }))
  }

  const clearFilters = () => {
    setFilters({
      contentType: [],
      category: [],
      difficulty: [],
      tags: []
    })
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'calculator': return <Calculator className="w-4 h-4" />
      case 'tool': return <Wrench className="w-4 h-4" />
      case 'checklist': return <CheckSquare className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'calculator': return 'text-blue-600 bg-blue-100'
      case 'tool': return 'text-green-600 bg-green-100'
      case 'checklist': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className={`search-wrapper relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          placeholder={placeholder}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-colors ${
              showFilters || Object.values(filters).some(arr => arr.length > 0)
                ? 'text-blue-600 bg-blue-100'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="search-filters-panel absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Filters</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Content Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
              <div className="space-y-2">
                {['guide', 'calculator', 'tool', 'checklist'].map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.contentType.includes(type)}
                      onChange={() => handleFilterChange('contentType', type)}
                      className="search-filter-checkbox w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <div className="space-y-2">
                {['retirement-planning', 'medicare', 'estate-planning', 'insurance', 'housing', 'taxes'].map(category => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.category.includes(category)}
                      onChange={() => handleFilterChange('category', category)}
                      className="search-filter-checkbox w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">
                      {category.replace('-', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <div className="space-y-2">
                {['beginner', 'intermediate', 'advanced'].map(difficulty => (
                  <label key={difficulty} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.difficulty.includes(difficulty)}
                      onChange={() => handleFilterChange('difficulty', difficulty)}
                      className="search-filter-checkbox w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{difficulty}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      {query && (
        <div className="search-results absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-40">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="p-2">
              {results.map((result, index) => (
                <div
                  key={result.id}
                  onClick={() => onResultSelect?.(result)}
                  className="search-result-item p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getContentTypeColor(result.content_type)}`}>
                      {getContentTypeIcon(result.content_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {result.title}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getContentTypeColor(result.content_type)}`}>
                          {result.content_type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {result.excerpt}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{result.reading_time} min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(result.created_at)}</span>
                        </div>
                        {result.matchedTerms && result.matchedTerms.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <Tag className="w-3 h-3" />
                            <span>{result.matchedTerms.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-600">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>No results found for "{query}"</p>
              <p className="text-sm mt-1">Try different keywords or check your spelling</p>
            </div>
          )}
        </div>
      )}

      {/* Recent/Popular Searches */}
      {!query && (recentSearches.length > 0 || popularSearches.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-40">
          {recentSearches.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Searches</h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(search)}
                    className="search-suggestion-button recent px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {popularSearches.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Popular Searches</h3>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(search)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
