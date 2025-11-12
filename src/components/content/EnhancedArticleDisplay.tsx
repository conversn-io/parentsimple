'use client'

import React, { useState, useEffect } from 'react'
import { 
  Clock, 
  User, 
  Calendar, 
  Tag, 
  Share2, 
  Bookmark, 
  Printer, 
  Download,
  ChevronDown,
  ChevronUp,
  Star,
  TrendingUp,
  Eye,
  ThumbsUp
} from 'lucide-react'
import { EnhancedArticle } from '../../lib/enhanced-articles'
import CalculatorWrapper from '../calculators/CalculatorWrapper'
import InteractiveTool from '../tools/InteractiveTool'
import InteractiveChecklist from '../checklists/InteractiveChecklist'
// Markdown processing is now handled on the server side

interface EnhancedArticleDisplayProps {
  article: EnhancedArticle
  className?: string
}

// Function to get related content based on the current article
function getRelatedContent(slug: string) {
  const relatedContentMap: Record<string, Array<{title: string, description: string, href: string}>> = {
    'social-security-optimization-strategy-guide': [
      {
        title: 'Medicare Planning Guide',
        description: 'Learn how to coordinate Social Security with Medicare enrollment for optimal benefits.',
        href: '/content/medicare-planning-guide'
      },
      {
        title: 'Tax Impact Calculator',
        description: 'Calculate how Social Security benefits affect your tax situation.',
        href: '/content/tax-impact-strategy-guide'
      },
      {
        title: 'RMD Planning Guide',
        description: 'Understand how Required Minimum Distributions work with Social Security.',
        href: '/content/rmd-planning-guide'
      },
      {
        title: 'Retirement Income Planning',
        description: 'Create a comprehensive retirement income strategy.',
        href: '/content/tax-free-retirement-income-complete-guide'
      }
    ],
    'medicare-planning-guide': [
      {
        title: 'Healthcare Cost Calculator',
        description: 'Calculate your total healthcare costs in retirement.',
        href: '/content/healthcare-cost-strategy-guide'
      },
      {
        title: 'Medicare Cost Calculator',
        description: 'Estimate your Medicare premiums and out-of-pocket costs.',
        href: '/content/medicare-cost-strategy-guide'
      },
      {
        title: 'Long-Term Care Planning',
        description: 'Plan for long-term care needs and insurance options.',
        href: '/content/long-term-care-planning-strategy-guide'
      },
      {
        title: 'Social Security Optimization',
        description: 'Coordinate Medicare with Social Security claiming strategies.',
        href: '/content/social-security-optimization-strategy-guide'
      }
    ],
    'tax-planning-guide': [
      {
        title: 'Tax Impact Calculator',
        description: 'Calculate the tax implications of different retirement income sources.',
        href: '/content/tax-impact-strategy-guide'
      },
      {
        title: 'Roth Conversion Calculator',
        description: 'Evaluate the benefits of converting traditional IRA to Roth IRA.',
        href: '/content/roth-conversion-strategy-guide'
      },
      {
        title: 'RMD Planning Guide',
        description: 'Optimize your Required Minimum Distribution strategy.',
        href: '/content/rmd-planning-guide'
      },
      {
        title: 'Tax-Efficient Withdrawals',
        description: 'Learn strategies for tax-efficient retirement withdrawals.',
        href: '/content/tax-efficient-withdrawals-strategy-guide'
      }
    ],
    'reverse-mortgage-strategy-guide': [
      {
        title: 'Home Equity Calculator',
        description: 'Calculate your available home equity and options.',
        href: '/content/home-equity-strategy-guide'
      },
      {
        title: 'Downsizing Calculator',
        description: 'Evaluate the benefits of downsizing your home.',
        href: '/content/downsizing-strategy-guide'
      },
      {
        title: 'Retirement Income Planning',
        description: 'Create a comprehensive retirement income strategy.',
        href: '/content/tax-free-retirement-income-complete-guide'
      },
      {
        title: 'Estate Planning Guide',
        description: 'Protect your assets and plan for your legacy.',
        href: '/content/estate-planning-checklist'
      }
    ],
    'life-insurance-strategy-guide': [
      {
        title: 'Long-Term Care Planning',
        description: 'Plan for long-term care needs and insurance options.',
        href: '/content/long-term-care-planning-strategy-guide'
      },
      {
        title: 'Estate Planning Guide',
        description: 'Protect your assets and plan for your legacy.',
        href: '/content/estate-planning-checklist'
      },
      {
        title: 'Beneficiary Planning',
        description: 'Plan your beneficiary designations and distributions.',
        href: '/content/beneficiary-planning-strategy-guide'
      },
      {
        title: 'Retirement Income Planning',
        description: 'Create a comprehensive retirement income strategy.',
        href: '/content/tax-free-retirement-income-complete-guide'
      }
    ]
  }

  return relatedContentMap[slug] || [
    {
      title: 'Retirement Planning Guide',
      description: 'Get comprehensive guidance on retirement planning strategies.',
      href: '/content/tax-free-retirement-income-complete-guide'
    },
    {
      title: 'Social Security Optimization',
      description: 'Learn how to maximize your Social Security benefits.',
      href: '/content/social-security-optimization-strategy-guide'
    },
    {
      title: 'Medicare Planning Guide',
      description: 'Navigate Medicare enrollment and coverage options.',
      href: '/content/medicare-planning-guide'
    },
    {
      title: 'Tax Planning Guide',
      description: 'Optimize your tax strategy for retirement.',
      href: '/content/tax-planning-guide'
    }
  ]
}

export default function EnhancedArticleDisplay({ 
  article, 
  className = '' 
}: EnhancedArticleDisplayProps) {
  const [showTableOfContents, setShowTableOfContents] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)

  // Load bookmark status from localStorage
  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]')
    setIsBookmarked(bookmarks.includes(article.slug))
  }, [article.slug])

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setReadingProgress(Math.min(100, Math.max(0, progress)))
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]')
    if (isBookmarked) {
      const updatedBookmarks = bookmarks.filter((id: string) => id !== article.id)
      localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks))
    } else {
      bookmarks.push(article.id)
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    }
    setIsBookmarked(!isBookmarked)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    const data = {
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      author: article.author_id,
      publishedAt: article.created_at,
      url: window.location.href
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${article.slug}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const renderContentTypeIcon = () => {
    switch (article.content_type) {
      case 'calculator':
        return <TrendingUp className="w-5 h-5 text-blue-600" />
      case 'tool':
        return <Star className="w-5 h-5 text-green-600" />
      case 'checklist':
        return <Tag className="w-5 h-5 text-purple-600" />
      default:
        return <Bookmark className="w-5 h-5 text-gray-600" />
    }
  }

  const renderInteractiveContent = () => {
    switch (article.content_type) {
      case 'calculator':
        if (article.calculator_config) {
          return (
            <CalculatorWrapper
              config={article.calculator_config}
              title={article.title}
              description={article.excerpt}
              className="mb-8"
            />
          )
        }
        break
      
      case 'tool':
        if (article.tool_config) {
          return (
            <InteractiveTool
              config={article.tool_config}
              title={article.title}
              description={article.excerpt}
              className="mb-8"
            />
          )
        }
        break
      
      case 'checklist':
        if (article.checklist_config) {
          return (
            <InteractiveChecklist
              config={article.checklist_config}
              title={article.title}
              description={article.excerpt}
              className="mb-8"
            />
          )
        }
        break
    }
    return null
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'text-green-600 bg-green-100'
      case 'intermediate': return 'text-yellow-600 bg-yellow-100'
      case 'advanced': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <article className={`article-wrapper max-w-4xl mx-auto ${className}`}>
      {/* Reading Progress Bar */}
      <div className="article-reading-progress fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="article-reading-progress-fill h-full bg-blue-600 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        ></div>
      </div>

      {/* Article Header */}
      <header className="article-header mb-8">
        {/* Breadcrumb */}
        <nav className="article-breadcrumb flex items-center space-x-2 text-sm text-gray-600 mb-4">
          <span>Home</span>
          <span>/</span>
          <span className="capitalize">{article.category}</span>
          <span>/</span>
          <span className="text-gray-900">{article.title}</span>
        </nav>

        {/* Title and Meta */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            {renderContentTypeIcon()}
            <span className={`article-content-type-badge inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${article.content_type}`}>
              {article.content_type.charAt(0).toUpperCase() + article.content_type.slice(1)}
            </span>
            {article.difficulty_level && (
              <span className={`article-difficulty-badge inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${article.difficulty_level}`}>
                {article.difficulty_level.charAt(0).toUpperCase() + article.difficulty_level.slice(1)}
              </span>
            )}
            {article.featured && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                <Star className="w-4 h-4 mr-1" />
                Featured
              </span>
            )}
          </div>

          <h1 className="article-title text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-xl text-gray-600 leading-relaxed mb-6">
              {article.excerpt}
            </p>
          )}

          {/* Article Meta */}
          <div className="article-meta flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{article.reading_time} min read</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Published {formatDate(article.created_at)}</span>
            </div>
            {article.readability_score && (
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>Readability: {article.readability_score}/100</span>
              </div>
            )}
            {article.page_views && (
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>{article.page_views.toLocaleString()} views</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <Tag className="w-4 h-4 text-gray-500" />
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleBookmark}
              className={`article-action-button flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isBookmarked
                  ? 'primary'
                  : 'secondary'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="article-action-button secondary p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Print Article"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownload}
              className="article-action-button secondary p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Download Article"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Table of Contents */}
      {article.table_of_contents && article.table_of_contents.length > 0 && (
        <div className="mb-8">
          <button
            onClick={() => setShowTableOfContents(!showTableOfContents)}
            className="article-table-of-contents flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="font-semibold text-gray-900">Table of Contents</span>
            {showTableOfContents ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          
          {showTableOfContents && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <nav className="space-y-2">
                {article.table_of_contents.map((item, index) => (
                  <a
                    key={index}
                    href={`#${item.id}`}
                    className={`block py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors ${
                      item.level === 1 ? 'font-semibold' : 'ml-4 text-sm'
                    }`}
                  >
                    {item.title}
                  </a>
                ))}
              </nav>
            </div>
          )}
        </div>
      )}

      {/* Interactive Content */}
      {renderInteractiveContent()}

      {/* Article Content */}
      <div className="article-prose prose prose-lg max-w-none">
        <div 
          dangerouslySetInnerHTML={{ __html: article.html_body || article.content }}
          className="text-gray-800 leading-relaxed"
        />
      </div>

      {/* Article Footer */}
      <footer className="mt-12 pt-8 border-t border-gray-200">
        {/* Author Info */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">SeniorSimple Team</h3>
              <p className="text-gray-600">Expert retirement planning guidance</p>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getRelatedContent(article.slug).map((related, index) => (
              <a
                key={index}
                href={related.href}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors block"
              >
                <h4 className="font-semibold text-gray-900 mb-2">{related.title}</h4>
                <p className="text-gray-600 text-sm">{related.description}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Engagement Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{article.page_views?.toLocaleString() || 0} views</span>
            </div>
            <div className="flex items-center space-x-1">
              <ThumbsUp className="w-4 h-4" />
              <span>Helpful</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Last updated: {formatDate(article.updated_at)}
          </div>
        </div>
      </footer>
    </article>
  )
}
