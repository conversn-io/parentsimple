import { NextResponse } from 'next/server'
import { getUxCategories } from '@/lib/articles'
import { supabase } from '@/lib/supabase'

const PUBLISHARE_SITE_ID =
  process.env.NEXT_PUBLIC_PUBLISHARE_SITE_ID ||
  process.env.PUBLISHARE_SITE_ID ||
  'parentsimple'

export async function GET() {
  try {
    const { categories, error } = await getUxCategories()
    
    if (error) {
      console.error('Failed to fetch UX categories:', error)
      return NextResponse.json({ categories: [] }, { status: 500 })
    }

    // Get article counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        // Query article_ux_categories with inner join to articles
        const { data: articleAssignments, error: articlesError } = await supabase
          .from('article_ux_categories')
          .select(`
            article_id,
            articles!inner(
              id,
              site_id,
              status
            )
          `)
          .eq('ux_category_id', category.id)
          .eq('articles.site_id', PUBLISHARE_SITE_ID)
          .eq('articles.status', 'published')

        // Count published articles (already filtered by query, but double-check)
        const articleCount = articleAssignments?.filter(
          (assignment: any) => assignment.articles?.status === 'published'
        ).length || 0

        return {
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          display_order: category.display_order,
          article_count: articleCount,
          has_articles: articleCount > 0,
        }
      })
    )

    return NextResponse.json({
      categories: categoriesWithCounts,
    })
  } catch (error) {
    console.error('Exception fetching UX categories:', error)
    return NextResponse.json({ categories: [] }, { status: 500 })
  }
}

