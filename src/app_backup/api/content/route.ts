import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'
import { EnhancedArticle } from '../../../lib/enhanced-articles'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contentType = searchParams.get('type')
    const category = searchParams.get('category')
    const status = searchParams.get('status') || 'published'
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('articles')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (contentType) {
      query = query.eq('content_type', contentType)
    }

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching content:', error)
      return NextResponse.json(
        { error: 'Failed to fetch content' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      content: data as EnhancedArticle[],
      total: data?.length || 0,
      limit,
      offset
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.title || !body.content || !body.content_type) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, content_type' },
        { status: 400 }
      )
    }

    // Generate slug if not provided
    if (!body.slug) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }

    // Set default values
    const articleData = {
      ...body,
      status: body.status || 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author_id: body.author_id || 'system'
    }

    const { data, error } = await supabase
      .from('articles')
      .insert([articleData])
      .select()
      .single()

    if (error) {
      console.error('Error creating content:', error)
      return NextResponse.json(
        { error: 'Failed to create content' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      content: data as EnhancedArticle,
      message: 'Content created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}





