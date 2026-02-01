import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'
import { EnhancedArticle } from '../../../../lib/enhanced-articles'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Content not found' },
          { status: 404 }
        )
      }
      console.error('Error fetching content:', error)
      return NextResponse.json(
        { error: 'Failed to fetch content' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      content: data as EnhancedArticle
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await request.json()

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      )
    }

    // Update the updated_at timestamp
    const updateData = {
      ...body,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('articles')
      .update(updateData)
      .eq('slug', slug)
      .select()
      .single()

    if (error) {
      console.error('Error updating content:', error)
      return NextResponse.json(
        { error: 'Failed to update content' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      content: data as EnhancedArticle,
      message: 'Content updated successfully'
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('slug', slug)

    if (error) {
      console.error('Error deleting content:', error)
      return NextResponse.json(
        { error: 'Failed to delete content' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Content deleted successfully'
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
