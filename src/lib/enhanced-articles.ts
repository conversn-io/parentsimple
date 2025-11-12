import { supabase } from './supabase'
import { Article } from './articles'

// Enhanced interfaces for the new content types
export interface EnhancedArticle extends Article {
  // Content type classification
  content_type: 'guide' | 'calculator' | 'tool' | 'checklist' | 'comparison'
  featured?: boolean
  page_views?: number
  table_of_contents?: Array<{ id: string; title: string; level: number }>
  
  // Enhanced SEO fields
  meta_keywords?: string[]
  canonical_url?: string
  og_title?: string
  og_description?: string
  og_image?: string
  twitter_title?: string
  twitter_description?: string
  twitter_image?: string
  
  // Content structure
  reading_time?: number
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  content_sections?: ContentSection[]
  
  // Interactive elements
  calculator_config?: CalculatorConfig
  tool_config?: ToolConfig
  checklist_config?: ChecklistConfig
  
  // AI/GEO optimization
  semantic_keywords?: string[]
  topic_cluster?: string
  featured_snippet_optimized?: boolean
  
  // Performance metrics
  engagement_score?: number
  conversion_rate?: number
  bounce_rate?: number
}

export interface ContentSection {
  id: string
  title: string
  content: string
  section_type: 'text' | 'calculator' | 'checklist' | 'comparison' | 'faq'
  order: number
  interactive_elements?: InteractiveElement[]
}

export interface InteractiveElement {
  id: string
  type: 'form' | 'calculator' | 'chart' | 'checklist' | 'comparison_table'
  config: Record<string, any>
  position: 'inline' | 'sidebar' | 'modal'
}

export interface Calculation {
  id: string
  formula: string
  description?: string
  dependencies?: string[]
}

export interface CalculatorConfig {
  calculator_type: 'financial' | 'insurance' | 'healthcare' | 'tax' | 'housing'
  inputs: CalculatorInput[]
  calculations: Calculation[]
  outputs: CalculatorOutput[]
  charts?: ChartConfig[]
  print_enabled: boolean
  save_enabled: boolean
  disclaimer?: string
}

export interface CalculatorInput {
  id: string
  label: string
  type: 'number' | 'text' | 'select' | 'checkbox' | 'radio' | 'range'
  required: boolean
  default_value?: any
  validation?: ValidationRule[]
  help_text?: string
  placeholder?: string
  min?: number
  max?: number
  step?: number
  options?: string[]
  unit?: string
}

export interface CalculatorOutput {
  id: string
  label: string
  type: 'currency' | 'percentage' | 'number' | 'text'
  display_type: 'currency' | 'percentage' | 'number' | 'text'
  formula: string
  format?: string
  description?: string
}

export interface ChartConfig {
  id: string
  type: 'bar' | 'line' | 'pie' | 'doughnut'
  title: string
  data_source: string
  responsive: boolean
}

export interface ToolConfig {
  tool_type: 'planning' | 'assessment' | 'comparison' | 'tracker'
  steps: ToolStep[]
  progress_tracking: boolean
  data_persistence: boolean
  export_options: string[]
  completion_message?: string
}

export interface ToolStep {
  id: string
  title: string
  description: string
  form_fields: FormField[]
  inputs?: FormField[] // Alias for form_fields for compatibility
  outputs?: any[] // Step outputs/results
  guidance?: string // Step guidance text
  validation_rules: ValidationRule[]
  next_step_condition?: string
}

export interface FormField {
  id: string
  label: string
  type: 'text' | 'email' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio'
  required: boolean
  options?: string[]
  validation?: ValidationRule[]
}

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'email'
  value?: any
  message: string
}

export interface ChecklistConfig {
  checklist_type: 'planning' | 'review' | 'action' | 'assessment'
  items: ChecklistItem[]
  categories: ChecklistCategory[]
  progress_tracking: boolean
  completion_rewards?: string[]
  introduction?: string
  conclusion?: string
}

export interface ChecklistItem {
  id: string
  title: string
  description: string
  category_id: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  estimated_time?: string
  resources?: Resource[]
  completed: boolean
  due_date?: string
}

export interface ChecklistCategory {
  id: string
  name: string
  description: string
  color: string
  icon: string
}

export interface Resource {
  id: string
  title: string
  url: string
  type: 'article' | 'calculator' | 'tool' | 'external'
  description?: string
}

// Enhanced database functions
export async function createEnhancedArticle(article: Partial<EnhancedArticle>): Promise<{ article: EnhancedArticle | null, error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .insert(article)
      .select()
      .single()

    return { 
      article: data as EnhancedArticle, 
      error 
    }
  } catch (error) {
    return { article: null, error: error instanceof Error ? error : new Error(String(error)) }
  }
}

export async function getArticlesByContentType(contentType: string): Promise<{ articles: EnhancedArticle[], error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('content_type', contentType)
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    return { 
      articles: data as EnhancedArticle[], 
      error 
    }
  } catch (error) {
    return { articles: [], error: error instanceof Error ? error : new Error(String(error)) }
  }
}

export async function getCalculators(): Promise<{ calculators: EnhancedArticle[], error: Error | null }> {
  const result = await getArticlesByContentType('calculator')
  return { calculators: result.articles, error: result.error }
}

export async function getGuides(): Promise<{ guides: EnhancedArticle[], error: Error | null }> {
  const result = await getArticlesByContentType('guide')
  return { guides: result.articles, error: result.error }
}

export async function getTools(): Promise<{ tools: EnhancedArticle[], error: Error | null }> {
  const result = await getArticlesByContentType('tool')
  return { tools: result.articles, error: result.error }
}

export async function getChecklists(): Promise<{ checklists: EnhancedArticle[], error: Error | null }> {
  const result = await getArticlesByContentType('checklist')
  return { checklists: result.articles, error: result.error }
}

// SEO optimization functions
export function generateMetaTitle(title: string, brand: string = 'SeniorSimple'): string {
  // Ensure 7th-grade readability and 60 character limit
  const cleanTitle = title.replace(/[^\w\s]/g, '').toLowerCase()
  const words = cleanTitle.split(' ').slice(0, 8) // Limit to 8 words
  const optimizedTitle = words.join(' ').replace(/\b\w/g, l => l.toUpperCase())
  
  return `${optimizedTitle} | ${brand}`
}

export function generateMetaDescription(content: string, maxLength: number = 155): string {
  // Extract first meaningful sentence and ensure 7th-grade readability
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20)
  let description = sentences[0] || content.substring(0, maxLength)
  
  // Simplify language for 7th-grade readability
  description = description
    .replace(/\b(utilize|implement|facilitate|comprehensive|sophisticated)\b/g, (match) => {
      const replacements: Record<string, string> = {
        'utilize': 'use',
        'implement': 'put in place',
        'facilitate': 'help',
        'comprehensive': 'complete',
        'sophisticated': 'advanced'
      }
      return replacements[match] || match
    })
  
  return description.length > maxLength 
    ? description.substring(0, maxLength - 3) + '...'
    : description
}

export function generateSemanticKeywords(content: string, primaryKeywords: string[]): string[] {
  // Extract semantic keywords for AI search optimization
  const words = content.toLowerCase().match(/\b\w{4,}\b/g) || []
  const wordFreq: Record<string, number> = {}
  
  words.forEach(word => {
    if (!['this', 'that', 'with', 'from', 'they', 'been', 'have', 'were', 'said', 'each', 'which', 'their', 'time', 'will', 'about', 'there', 'could', 'other', 'after', 'first', 'well', 'also', 'where', 'much', 'some', 'very', 'when', 'come', 'here', 'just', 'like', 'long', 'make', 'many', 'over', 'such', 'take', 'than', 'them', 'these', 'think', 'want', 'been', 'good', 'great', 'little', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'].includes(word)) {
      wordFreq[word] = (wordFreq[word] || 0) + 1
    }
  })
  
  const semanticKeywords = Object.entries(wordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20)
    .map(([word]) => word)
  
  return [...new Set([...primaryKeywords, ...semanticKeywords])]
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200 // Average reading speed
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

export function calculateReadabilityScore(content: string): number {
  // Simplified Flesch Reading Ease calculation
  const sentences = content.split(/[.!?]+/).length
  const words = content.split(/\s+/).length
  const syllables = content.toLowerCase().replace(/[^a-z]/g, '').length * 0.5 // Rough estimate
  
  if (sentences === 0 || words === 0) return 0
  
  const score = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words))
  return Math.max(0, Math.min(100, Math.round(score)))
}
