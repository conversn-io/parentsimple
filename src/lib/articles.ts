import { supabase } from './supabase'

const PUBLISHARE_SITE_ID =
  process.env.NEXT_PUBLIC_PUBLISHARE_SITE_ID ||
  process.env.PUBLISHARE_SITE_ID ||
  'parentsimple'

const slugifyCategory = (value?: string | null) =>
  value
    ? value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    : ''

export interface Article {
  id: string
  title: string
  slug: string
  content: string
  html_body?: string
  excerpt: string
  author_id: string
  site_id?: string
  status: 'draft' | 'published' | 'pending' | 'private' | 'scheduled'
  created_at: string
  updated_at: string
  meta_title?: string
  meta_description?: string
  featured_image_url?: string
  featured_image_alt?: string
  category?: string
  category_id?: string
  tags?: string[]
  persona?: string
  seo_score?: number
  readability_score?: number
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  created_at: string
}

export interface UxCategory {
  id: string
  name: string
  slug: string
  description?: string | null
  display_order?: number | null
}

export interface ArticleWithCategory extends Article {
  category_details?: Category
  primary_ux_category?: UxCategory
}

// Get all published articles - using view with primary UX category
export async function getPublishedArticles(limit?: number): Promise<{ articles: ArticleWithCategory[], error: Error | null }> {
  try {
    let query = supabase
      .from('articles_with_primary_ux_category')
      .select('*')
      .eq('status', 'published')
      .eq('site_id', PUBLISHARE_SITE_ID)
      .order('created_at', { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      return { articles: [], error }
    }

    // Map to include category_details for backward compatibility
    const articles = (data || []).map((article: any) => ({
      ...article,
      primary_ux_category: article.primary_ux_category_slug ? {
        id: article.primary_ux_category_id,
        name: article.primary_ux_category_name,
        slug: article.primary_ux_category_slug,
        description: null,
        display_order: null,
      } : undefined,
      category_details: article.primary_ux_category_slug ? {
        id: article.primary_ux_category_id,
        name: article.primary_ux_category_name,
        slug: article.primary_ux_category_slug,
        description: null,
        created_at: '',
      } : undefined,
    }))

    return { 
      articles: articles as ArticleWithCategory[], 
      error: null 
    }
  } catch (error) {
    return { articles: [], error: error instanceof Error ? error : new Error(String(error)) }
  }
}

// Get a single article by slug - using view with primary UX category
export async function getArticle(slug: string): Promise<{ article: ArticleWithCategory | null, error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('articles_with_primary_ux_category')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .eq('site_id', PUBLISHARE_SITE_ID)
      .maybeSingle()

    if (error) {
      return { article: null, error }
    }

    if (!data) {
      return { article: null, error: null }
    }

    // Map to include category_details for backward compatibility
    const article = {
      ...data,
      primary_ux_category: data.primary_ux_category_slug ? {
        id: data.primary_ux_category_id,
        name: data.primary_ux_category_name,
        slug: data.primary_ux_category_slug,
        description: null,
        display_order: null,
      } : undefined,
      category_details: data.primary_ux_category_slug ? {
        id: data.primary_ux_category_id,
        name: data.primary_ux_category_name,
        slug: data.primary_ux_category_slug,
        description: null,
        created_at: '',
      } : undefined,
    }

    return { 
      article: article as ArticleWithCategory, 
      error: null 
    }
  } catch (error) {
    return { article: null, error: error instanceof Error ? error : new Error(String(error)) }
  }
}

// Get articles by UX category slug - using articles_with_primary_ux_category view
export async function getArticlesByCategory(categorySlug: string, limit?: number): Promise<{ articles: ArticleWithCategory[], error: Error | null }> {
  try {
    // Use the view which includes primary_ux_category fields
    let query = supabase
      .from('articles_with_primary_ux_category')
      .select('*')
      .eq('status', 'published')
      .eq('site_id', PUBLISHARE_SITE_ID)
      .eq('primary_ux_category_slug', categorySlug)
      .order('created_at', { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error('[getArticlesByCategory] Query error:', error)
      return { articles: [], error }
    }

    // Map the data to include category_details for backward compatibility
    const articles = (data || []).map((article: any) => ({
      ...article,
      primary_ux_category: article.primary_ux_category_slug ? {
        id: article.primary_ux_category_id,
        name: article.primary_ux_category_name,
        slug: article.primary_ux_category_slug,
        description: null,
        display_order: null,
      } : undefined,
      category_details: article.primary_ux_category_slug ? {
        id: article.primary_ux_category_id,
        name: article.primary_ux_category_name,
        slug: article.primary_ux_category_slug,
        description: null,
        created_at: '',
      } : undefined,
    }))

    return { 
      articles: articles as ArticleWithCategory[], 
      error: null 
    }
  } catch (error) {
    console.error('[getArticlesByCategory] Exception:', error)
    return { articles: [], error: error instanceof Error ? error : new Error(String(error)) }
  }
}

// Get UX categories (for navigation) - returns UX categories, not article_categories
export async function getCategories(): Promise<{ categories: UxCategory[], error: Error | null }> {
  try {
    const { categories, error } = await getUxCategories()
    return { categories, error }
  } catch (error) {
    return { categories: [], error: error instanceof Error ? error : new Error(String(error)) }
  }
}

// Get related articles (same UX category, excluding current article)
export async function getRelatedArticles(currentArticleId: string, categoryId?: string, limit: number = 3): Promise<{ articles: Article[], error: Error | null }> {
  try {
    // If categoryId is provided, use it to filter by UX category
    let query = supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .eq('site_id', PUBLISHARE_SITE_ID)
      .neq('id', currentArticleId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (categoryId) {
      // Filter by UX category via join
      query = supabase
        .from('articles')
        .select(`
          *,
          article_ux_categories!inner(ux_category_id)
        `)
        .eq('status', 'published')
        .eq('site_id', PUBLISHARE_SITE_ID)
        .eq('article_ux_categories.ux_category_id', categoryId)
        .neq('id', currentArticleId)
        .order('created_at', { ascending: false })
        .limit(limit)
    }

    const { data, error } = await query

    return { 
      articles: data as Article[], 
      error 
    }
  } catch (error) {
    return { articles: [], error: error instanceof Error ? error : new Error(String(error)) }
  }
}

// Search articles
export async function searchArticles(searchTerm: string, limit: number = 10): Promise<{ articles: Article[], error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .eq('site_id', PUBLISHARE_SITE_ID)
      .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false })
      .limit(limit)

    return { 
      articles: data as Article[], 
      error 
    }
  } catch (error) {
    return { articles: [], error: error instanceof Error ? error : new Error(String(error)) }
  }
}

// Get featured articles (for homepage)
export async function getFeaturedArticles(limit: number = 6): Promise<{ articles: Article[], error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .eq('site_id', PUBLISHARE_SITE_ID)
      .order('created_at', { ascending: false })
      .limit(limit)

    return { 
      articles: data as Article[], 
      error 
    }
  } catch (error) {
    return { articles: [], error: error instanceof Error ? error : new Error(String(error)) }
  }
}

// Get UX categories from CMS
export async function getUxCategories(): Promise<{ categories: UxCategory[], error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('ux_categories')
      .select('*')
      .eq('site_id', PUBLISHARE_SITE_ID)
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('name', { ascending: true })

    if (error) {
      console.error('[getUxCategories] Supabase query error:', error)
      return { categories: [], error }
    }

    const categories = (data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description ?? null,
      display_order: row.display_order ?? null,
    }))

    return { 
      categories, 
      error: null 
    }
  } catch (error) {
    console.error('[getUxCategories] Exception:', error)
    return { 
      categories: [], 
      error: error instanceof Error ? error : new Error(String(error)) 
    }
  }
}

// Get UX category by slug
export async function getUxCategoryBySlug(slug: string): Promise<{ category: UxCategory | null, error: Error | null }> {
  if (!slug) {
    return { category: null, error: null }
  }

  try {
    const { data, error } = await supabase
      .from('ux_categories')
      .select('*')
      .eq('site_id', PUBLISHARE_SITE_ID)
      .eq('is_active', true)
      .eq('slug', slug)
      .maybeSingle()

    if (error) {
      console.error(`[getUxCategoryBySlug] Failed to fetch UX category for slug "${slug}":`, error)
      return { category: null, error }
    }

    if (!data) {
      return { category: null, error: null }
    }

    const category: UxCategory = {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description ?? null,
      display_order: data.display_order ?? null,
    }

    return { category, error: null }
  } catch (error) {
    console.error('[getUxCategoryBySlug] Exception:', error)
    return { 
      category: null, 
      error: error instanceof Error ? error : new Error(String(error)) 
    }
  }
}
