// Content migration script to convert HTML pages to CMS format

import { 
  generateSEOTitle, 
  generateSEODescription, 
  generateSemanticKeywords,
  calculateReadabilityScore,
  calculateReadingTime,
  simplifyText,
  generateFAQSection,
  generateTopicClusters
} from './seo-templates'
import { 
  generateArticleStructuredData,
  generateHowToStructuredData,
  generateCalculatorStructuredData,
  generateToolStructuredData,
  generateChecklistStructuredData
} from './structured-data'

export interface HTMLPageData {
  filename: string
  title: string
  description?: string
  keywords?: string
  content: string
  contentType: 'guide' | 'calculator' | 'tool' | 'checklist'
  category: string
  priority: 'high' | 'medium' | 'low'
}

export interface MigratedContent {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  meta_title: string
  meta_description: string
  meta_keywords: string[]
  content_type: string
  category: string
  tags: string[]
  reading_time: number
  readability_score: number
  semantic_keywords: string[]
  structured_data: any
  calculator_config?: any
  tool_config?: any
  checklist_config?: any
  status: 'published'
  created_at: string
  updated_at: string
}

// Content type mappings
const CONTENT_TYPE_MAPPINGS: Record<string, string> = {
  'complete_retirement_planning_guide': 'guide',
  'medicare_made_simple': 'guide',
  'estate_planning_essentials': 'guide',
  'aging_in_place_calculator': 'guide',
  'long_term_care_planning_guide': 'guide',
  'indexed_annuities_secret': 'guide',
  'reverse_mortgages_guide': 'guide',
  'life_insurance_retirement_guide': 'guide',
  'hsa_strategy_guide': 'guide',
  'ira_withdrawal_strategy_guide': 'guide',
  'retirement_tax_strategy_guide': 'guide',
  'will_trust_planning_guide': 'guide',
  'medicare_enrollment_guide': 'guide',
  'medicare_plan_comparison': 'guide',
  'medigap_guide': 'guide',
  'estate_tax_planning_guide': 'guide',
  'tax_efficient_withdrawals': 'guide',
  'social_security_optimization': 'guide',
  'long_term_care_planning_guide-1': 'guide',
  'long_term_care_planning': 'guide',
  
  'downsizing_calculator': 'calculator',
  'life_insurance_calculator': 'calculator',
  'reverse_mortgage_calculator': 'calculator',
  'medicare_cost_calculator': 'calculator',
  'roth_conversion_calculator': 'calculator',
  'rmd_calculator': 'calculator',
  'tax_impact_calculator': 'calculator',
  'healthcare_cost_calculator': 'calculator',
  'home_equity_calculator': 'calculator',
  'long_term_care_insurance_calculator': 'calculator',
  'disability_insurance_calculator': 'calculator',
  
  'beneficiary_planning_tool': 'tool',
  'home_modification_planner': 'tool',
  'withdrawal_planner_tool': 'tool',
  'power_of_attorney_forms': 'tool',
  'probate_avoidance_strategies': 'tool',
  'downsizing_home_retirement': 'tool',
  'senior_housing_options': 'tool',
  
  'estate_planning_checklist': 'checklist'
}

// Category mappings
const CATEGORY_MAPPINGS: Record<string, string> = {
  'complete_retirement_planning_guide': 'retirement-planning',
  'ira_withdrawal_strategy_guide': 'retirement-planning',
  'retirement_tax_strategy_guide': 'retirement-planning',
  'tax_efficient_withdrawals': 'retirement-planning',
  'social_security_optimization': 'retirement-planning',
  'downsizing_calculator': 'retirement-planning',
  'withdrawal_planner_tool': 'retirement-planning',
  
  'medicare_made_simple': 'medicare',
  'medicare_enrollment_guide': 'medicare',
  'medicare_plan_comparison': 'medicare',
  'medigap_guide': 'medicare',
  'medicare_cost_calculator': 'medicare',
  'healthcare_cost_calculator': 'medicare',
  
  'estate_planning_essentials': 'estate-planning',
  'estate_planning_checklist': 'estate-planning',
  'estate_tax_planning_guide': 'estate-planning',
  'will_trust_planning_guide': 'estate-planning',
  'beneficiary_planning_tool': 'estate-planning',
  'power_of_attorney_forms': 'estate-planning',
  'probate_avoidance_strategies': 'estate-planning',
  
  'life_insurance_calculator': 'insurance',
  'life_insurance_retirement_guide': 'insurance',
  'long_term_care_insurance_calculator': 'insurance',
  'disability_insurance_calculator': 'insurance',
  'long_term_care_planning_guide': 'insurance',
  'long_term_care_planning_guide-1': 'insurance',
  'long_term_care_planning': 'insurance',
  
  'reverse_mortgage_calculator': 'housing',
  'reverse_mortgages_guide': 'housing',
  'home_equity_calculator': 'housing',
  'aging_in_place_calculator': 'housing',
  'home_modification_planner': 'housing',
  'downsizing_home_retirement': 'housing',
  'senior_housing_options': 'housing',
  
  'tax_impact_calculator': 'taxes',
  'roth_conversion_calculator': 'taxes',
  'rmd_calculator': 'taxes',
  'hsa_strategy_guide': 'taxes',
  
  'indexed_annuities_secret': 'investments'
}

// Priority mappings
const PRIORITY_MAPPINGS: Record<string, string> = {
  'complete_retirement_planning_guide': 'high',
  'medicare_made_simple': 'high',
  'estate_planning_essentials': 'high',
  'downsizing_calculator': 'high',
  'life_insurance_calculator': 'high',
  'reverse_mortgage_calculator': 'high',
  'beneficiary_planning_tool': 'high',
  'estate_planning_checklist': 'high',
  
  'medicare_cost_calculator': 'medium',
  'long_term_care_planning_guide': 'medium',
  'indexed_annuities_secret': 'medium',
  'reverse_mortgages_guide': 'medium',
  'life_insurance_retirement_guide': 'medium',
  'home_equity_calculator': 'medium',
  'aging_in_place_calculator': 'medium',
  'home_modification_planner': 'medium',
  
  'roth_conversion_calculator': 'low',
  'rmd_calculator': 'low',
  'tax_impact_calculator': 'low',
  'healthcare_cost_calculator': 'low',
  'long_term_care_insurance_calculator': 'low',
  'disability_insurance_calculator': 'low',
  'hsa_strategy_guide': 'low',
  'ira_withdrawal_strategy_guide': 'low',
  'retirement_tax_strategy_guide': 'low',
  'will_trust_planning_guide': 'low',
  'medicare_enrollment_guide': 'low',
  'medicare_plan_comparison': 'low',
  'medigap_guide': 'low',
  'estate_tax_planning_guide': 'low',
  'tax_efficient_withdrawals': 'low',
  'social_security_optimization': 'low',
  'long_term_care_planning_guide-1': 'low',
  'long_term_care_planning': 'low',
  'withdrawal_planner_tool': 'low',
  'power_of_attorney_forms': 'low',
  'probate_avoidance_strategies': 'low',
  'downsizing_home_retirement': 'low',
  'senior_housing_options': 'low'
}

// Function to extract content from HTML
export function extractContentFromHTML(html: string): {
  title: string
  description: string
  keywords: string
  content: string
} {
  // Extract title
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i)
  const title = titleMatch ? titleMatch[1].trim() : 'Untitled'
  
  // Extract meta description
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i)
  const description = descMatch ? descMatch[1].trim() : ''
  
  // Extract meta keywords
  const keywordsMatch = html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']*)["'][^>]*>/i)
  const keywords = keywordsMatch ? keywordsMatch[1].trim() : ''
  
  // Extract main content (remove HTML tags and clean up)
  let content = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove scripts
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove styles
    .replace(/<[^>]+>/g, ' ') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
  
  return { title, description, keywords, content }
}

// Function to generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

// Function to extract calculator configuration from HTML
export function extractCalculatorConfig(html: string, filename: string): any {
  // This would need to be customized for each calculator
  // For now, return a basic structure
  return {
    calculator_type: getCalculatorType(filename),
    inputs: [],
    calculations: [],
    outputs: [],
    charts: [],
    print_enabled: true,
    save_enabled: true
  }
}

// Function to get calculator type from filename
function getCalculatorType(filename: string): string {
  if (filename.includes('insurance')) return 'insurance'
  if (filename.includes('medicare') || filename.includes('healthcare')) return 'healthcare'
  if (filename.includes('tax') || filename.includes('roth') || filename.includes('rmd')) return 'tax'
  if (filename.includes('home') || filename.includes('downsizing') || filename.includes('reverse')) return 'housing'
  return 'financial'
}

// Function to extract tool configuration from HTML
export function extractToolConfig(html: string, filename: string): any {
  return {
    tool_type: getToolType(filename),
    steps: [],
    progress_tracking: true,
    data_persistence: true,
    export_options: ['pdf', 'print']
  }
}

// Function to get tool type from filename
function getToolType(filename: string): string {
  if (filename.includes('checklist')) return 'assessment'
  if (filename.includes('planner')) return 'planning'
  if (filename.includes('comparison')) return 'comparison'
  return 'tracker'
}

// Function to extract checklist configuration from HTML
export function extractChecklistConfig(html: string, filename: string): any {
  return {
    checklist_type: 'planning',
    items: [],
    categories: [],
    progress_tracking: true,
    completion_rewards: []
  }
}

// Main migration function
export function migrateHTMLPage(htmlData: HTMLPageData): MigratedContent {
  const { filename, title, description, keywords, content } = htmlData
  
  // Determine content type and category
  const contentType = CONTENT_TYPE_MAPPINGS[filename] || 'guide'
  const category = CATEGORY_MAPPINGS[filename] || 'general'
  const priority = PRIORITY_MAPPINGS[filename] || 'low'
  
  // Generate optimized content
  const optimizedTitle = generateSEOTitle(title)
  const optimizedDescription = generateSEODescription(description || content)
  const semanticKeywords = generateSemanticKeywords(content, keywords ? keywords.split(',').map(k => k.trim()) : [])
  const readabilityScore = calculateReadabilityScore(content)
  const readingTime = calculateReadingTime(content)
  
  // Generate structured data
  let structuredData: any = {}
  switch (contentType) {
    case 'guide':
      structuredData = generateHowToStructuredData({
        title: optimizedTitle,
        description: optimizedDescription,
        steps: [], // Would need to extract from content
        url: `https://seniorsimple.org/${generateSlug(optimizedTitle)}`
      })
      break
    case 'calculator':
      structuredData = generateCalculatorStructuredData({
        title: optimizedTitle,
        description: optimizedDescription,
        inputs: [],
        outputs: [],
        url: `https://seniorsimple.org/${generateSlug(optimizedTitle)}`
      })
      break
    case 'tool':
      structuredData = generateToolStructuredData({
        title: optimizedTitle,
        description: optimizedDescription,
        toolType: 'planning',
        features: [],
        url: `https://seniorsimple.org/${generateSlug(optimizedTitle)}`
      })
      break
    case 'checklist':
      structuredData = generateChecklistStructuredData({
        title: optimizedTitle,
        description: optimizedDescription,
        items: [],
        url: `https://seniorsimple.org/${generateSlug(optimizedTitle)}`
      })
      break
  }
  
  // Extract configuration based on content type
  let calculatorConfig, toolConfig, checklistConfig
  if (contentType === 'calculator') {
    calculatorConfig = extractCalculatorConfig(htmlData.content, filename)
  } else if (contentType === 'tool') {
    toolConfig = extractToolConfig(htmlData.content, filename)
  } else if (contentType === 'checklist') {
    checklistConfig = extractChecklistConfig(htmlData.content, filename)
  }
  
  // Generate excerpt (first 200 characters)
  const excerpt = content.substring(0, 200).replace(/\s+\w*$/, '') + '...'
  
  return {
    id: generateSlug(optimizedTitle),
    title: optimizedTitle,
    slug: generateSlug(optimizedTitle),
    content: simplifyText(content),
    excerpt,
    meta_title: optimizedTitle,
    meta_description: optimizedDescription,
    meta_keywords: semanticKeywords,
    content_type: contentType,
    category,
    tags: semanticKeywords.slice(0, 10), // Limit to 10 tags
    reading_time: readingTime,
    readability_score: readabilityScore,
    semantic_keywords: semanticKeywords,
    structured_data: structuredData,
    calculator_config: calculatorConfig,
    tool_config: toolConfig,
    checklist_config: checklistConfig,
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
}

// Function to migrate all HTML pages
export function migrateAllHTMLPages(htmlPages: HTMLPageData[]): MigratedContent[] {
  return htmlPages.map(page => migrateHTMLPage(page))
}

// Function to generate migration report
export function generateMigrationReport(migratedContent: MigratedContent[]): {
  total: number
  byType: Record<string, number>
  byCategory: Record<string, number>
  byPriority: Record<string, number>
  readabilityStats: {
    average: number
    min: number
    max: number
  }
  readingTimeStats: {
    average: number
    min: number
    max: number
  }
} {
  const byType: Record<string, number> = {}
  const byCategory: Record<string, number> = {}
  const byPriority: Record<string, number> = {}
  
  let totalReadability = 0
  let totalReadingTime = 0
  let minReadability = 100
  let maxReadability = 0
  let minReadingTime = Infinity
  let maxReadingTime = 0
  
  migratedContent.forEach(content => {
    // Count by type
    byType[content.content_type] = (byType[content.content_type] || 0) + 1
    
    // Count by category
    byCategory[content.category] = (byCategory[content.category] || 0) + 1
    
    // Count by priority (would need to add priority to MigratedContent interface)
    
    // Readability stats
    totalReadability += content.readability_score
    minReadability = Math.min(minReadability, content.readability_score)
    maxReadability = Math.max(maxReadability, content.readability_score)
    
    // Reading time stats
    totalReadingTime += content.reading_time
    minReadingTime = Math.min(minReadingTime, content.reading_time)
    maxReadingTime = Math.max(maxReadingTime, content.reading_time)
  })
  
  return {
    total: migratedContent.length,
    byType,
    byCategory,
    byPriority: {}, // Would need priority data
    readabilityStats: {
      average: Math.round(totalReadability / migratedContent.length),
      min: minReadability,
      max: maxReadability
    },
    readingTimeStats: {
      average: Math.round(totalReadingTime / migratedContent.length),
      min: minReadingTime,
      max: maxReadingTime
    }
  }
}





