import { supabase } from './supabase'
import { cache } from 'react'

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
      .eq('site_id', PUBLISHARE_SITE_ID)
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
      .eq('site_id', PUBLISHARE_SITE_ID)
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
      .eq('site_id', PUBLISHARE_SITE_ID)
      .order('created_at', { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    const filteredArticles = (data as ArticleWithCategory[] | null)?.filter((article) => {
      const categorySlugMatches =
        slugifyCategory(article.category_details?.slug) === categorySlug ||
        slugifyCategory(article.category_details?.name) === categorySlug ||
        slugifyCategory(article.category) === categorySlug

      return categorySlugMatches
    }) ?? []

    return { 
      articles: filteredArticles, 
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
      .from('articles')
      .select(`
        category_details:article_categories!articles_category_id_fkey(id, name, slug, description, created_at)
      `)
      .eq('status', 'published')
      .eq('site_id', PUBLISHARE_SITE_ID)
    const categoryMap = new Map<string, Category>()

    for (const row of data || []) {
      const category = row.category_details as Category | Category[] | null | undefined
      if (category && !Array.isArray(category) && category.id && !categoryMap.has(category.id)) {
        categoryMap.set(category.id, category)
      }
    }

    return { 
      categories: Array.from(categoryMap.values()), 
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
      .eq('site_id', PUBLISHARE_SITE_ID)
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
export const getUxCategories = cache(async (): Promise<{ categories: UxCategory[], error: Error | null }> => {
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
})

// Get UX category by slug
export const getUxCategoryBySlug = cache(async (slug: string): Promise<{ category: UxCategory | null, error: Error | null }> => {
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
})