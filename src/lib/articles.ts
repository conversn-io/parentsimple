import { supabase } from './supabase'

export interface Article {
  id: string
  title: string
  slug: string
  content: string
  html_body?: string
  excerpt: string
  author_id: string
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

export interface ArticleWithCategory extends Article {
  category_details?: Category
}

// Get all published articles
export async function getPublishedArticles(limit?: number): Promise<{ articles: ArticleWithCategory[], error: Error | null }> {
  try {
    let query = supabase
      .from('articles')
      .select(`
        *,
        category_details:article_categories!articles_category_id_fkey(name, slug, description)
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    return { 
      articles: data as ArticleWithCategory[], 
      error 
    }
  } catch (error) {
    return { articles: [], error: error instanceof Error ? error : new Error(String(error)) }
  }
}

// Get a single article by slug
export async function getArticle(slug: string): Promise<{ article: ArticleWithCategory | null, error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        category_details:article_categories!articles_category_id_fkey(name, slug, description)
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    return { 
      article: data as ArticleWithCategory, 
      error 
    }
  } catch (error) {
    return { article: null, error: error instanceof Error ? error : new Error(String(error)) }
  }
}

// Get articles by category
export async function getArticlesByCategory(categorySlug: string, limit?: number): Promise<{ articles: ArticleWithCategory[], error: Error | null }> {
  try {
    let query = supabase
      .from('articles')
      .select(`
        *,
        category_details:article_categories!articles_category_id_fkey(name, slug, description)
      `)
      .eq('status', 'published')
      .eq('category_details.slug', categorySlug)
      .order('created_at', { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    return { 
      articles: data as ArticleWithCategory[], 
      error 
    }
  } catch (error) {
    return { articles: [], error: error instanceof Error ? error : new Error(String(error)) }
  }
}

// Get all categories
export async function getCategories(): Promise<{ categories: Category[], error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('article_categories')
      .select('*')
      .order('name', { ascending: true })

    return { 
      categories: data as Category[], 
      error 
    }
  } catch (error) {
    return { categories: [], error: error instanceof Error ? error : new Error(String(error)) }
  }
}

// Get related articles (same category, excluding current article)
export async function getRelatedArticles(currentArticleId: string, categoryId?: string, limit: number = 3): Promise<{ articles: Article[], error: Error | null }> {
  try {
    let query = supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .neq('id', currentArticleId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (categoryId) {
      query = query.eq('category_id', categoryId)
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
      .select(`
        *,
        category_details:article_categories!articles_category_id_fkey(name, slug, description)
      `)
      .eq('status', 'published')
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