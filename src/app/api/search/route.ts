import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'
import { EnhancedArticle } from '../../../lib/enhanced-articles'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const contentType = searchParams.get('type')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    // Build the search query
    let searchQuery = supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%,meta_keywords.cs.{${query}}`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Add content type filter if specified
    if (contentType) {
      searchQuery = searchQuery.eq('content_type', contentType)
    }

    // Add category filter if specified
    if (category) {
      searchQuery = searchQuery.eq('category', category)
    }

    const { data, error } = await searchQuery

    if (error) {
      console.error('Error searching content:', error)
      return NextResponse.json(
        { error: 'Failed to search content' },
        { status: 500 }
      )
    }

    // Calculate relevance scores and add matched terms
    const results = (data as EnhancedArticle[]).map(article => {
      const matchedTerms: string[] = []
      const queryLower = query.toLowerCase()
      
      // Check title matches
      if (article.title.toLowerCase().includes(queryLower)) {
        matchedTerms.push('title')
      }
      
      // Check content matches
      if (article.content.toLowerCase().includes(queryLower)) {
        matchedTerms.push('content')
      }
      
      // Check excerpt matches
      if (article.excerpt.toLowerCase().includes(queryLower)) {
        matchedTerms.push('excerpt')
      }
      
      // Check keyword matches
      if (article.meta_keywords?.some(keyword => 
        keyword.toLowerCase().includes(queryLower)
      )) {
        matchedTerms.push('keywords')
      }

      // Calculate simple relevance score
      let relevanceScore = 0
      if (article.title.toLowerCase().includes(queryLower)) relevanceScore += 10
      if (article.excerpt.toLowerCase().includes(queryLower)) relevanceScore += 5
      if (article.content.toLowerCase().includes(queryLower)) relevanceScore += 3
      if (article.meta_keywords?.some(keyword => 
        keyword.toLowerCase().includes(queryLower)
      )) relevanceScore += 2

      return {
        ...article,
        matchedTerms,
        relevanceScore
      }
    })

    // Sort by relevance score
    results.sort((a, b) => b.relevanceScore - a.relevanceScore)

    return NextResponse.json({
      results,
      query,
      total: results.length,
      limit,
      offset,
      filters: {
        contentType,
        category
      }
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}





