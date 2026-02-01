// Enhanced CMS Components Export
// This file exports all the new interactive components for the SeniorSimple CMS

// Calculator Components
export { default as CalculatorWrapper } from './calculators/CalculatorWrapper'

// Tool Components
export { default as InteractiveTool } from './tools/InteractiveTool'

// Checklist Components
export { default as InteractiveChecklist } from './checklists/InteractiveChecklist'

// Content Display Components
export { default as EnhancedArticleDisplay } from './content/EnhancedArticleDisplay'

// Search Components
export { default as ContentSearch } from './search/ContentSearch'

// Re-export existing components for convenience
export { Header } from './navigation/Header'
export { default as Footer } from './Footer'
export { MegaMenu } from './navigation/MegaMenu'
export { MobileMenu } from './navigation/MobileMenu'

// Component Types
export type { CalculatorConfig, CalculatorInput, CalculatorOutput } from '../lib/enhanced-articles'
export type { ToolConfig, ToolStep } from '../lib/enhanced-articles'
export type { ChecklistConfig, ChecklistItem } from '../lib/enhanced-articles'
export type { EnhancedArticle } from '../lib/enhanced-articles'
