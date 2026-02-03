// Sample migration script demonstrating the conversion process

import { 
  extractContentFromHTML, 
  migrateHTMLPage, 
  generateMigrationReport 
} from '../lib/content-migration'
import { 
  generateSEOTitle, 
  generateSEODescription, 
  calculateReadabilityScore,
  calculateReadingTime 
} from '../lib/seo-templates'

// Sample HTML content for downsizing calculator
const sampleHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Downsizing Calculator - RetireSafe.ly</title>
    <meta name="description" content="Calculate the financial impact of downsizing your home in retirement">
    <meta name="keywords" content="downsizing, retirement, home, calculator, financial planning">
</head>
<body>
    <h1>Downsizing Calculator</h1>
    <p>Calculate the financial impact of downsizing your home in retirement. This comprehensive tool helps you understand the costs and savings associated with moving to a smaller home.</p>
    
    <h2>Current Home Details</h2>
    <p>Enter information about your current home to calculate potential savings and costs.</p>
    
    <h2>New Home Details</h2>
    <p>Compare your current home with a potential new, smaller home.</p>
    
    <h2>Financial Impact</h2>
    <p>See how much you could save annually and over time by downsizing.</p>
    
    <h2>Key Benefits of Downsizing</h2>
    <ul>
        <li>Lower monthly expenses</li>
        <li>Reduced maintenance costs</li>
        <li>Potential cash from home sale</li>
        <li>Simplified lifestyle</li>
    </ul>
    
    <h2>Considerations</h2>
    <p>Before making the decision to downsize, consider your lifestyle needs, location preferences, and long-term goals.</p>
</body>
</html>
`

// Sample migration demonstration
export function demonstrateMigration() {
  console.log('🚀 Starting Sample Migration Process...\n')
  
  // Step 1: Extract content from HTML
  console.log('📄 Step 1: Extracting content from HTML...')
  const extractedContent = extractContentFromHTML(sampleHTML)
  console.log('✅ Extracted content:', {
    title: extractedContent.title,
    description: extractedContent.description,
    contentLength: extractedContent.content.length
  })
  
  // Step 2: Create HTML page data
  console.log('\n📊 Step 2: Creating HTML page data...')
  const htmlPageData = {
    filename: 'downsizing_calculator.html',
    title: extractedContent.title,
    description: extractedContent.description,
    keywords: extractedContent.keywords,
    content: extractedContent.content,
    contentType: 'calculator' as const,
    category: 'retirement-planning',
    priority: 'high' as const
  }
  
  // Step 3: Migrate to CMS format
  console.log('\n🔄 Step 3: Migrating to CMS format...')
  const migratedContent = migrateHTMLPage(htmlPageData)
  console.log('✅ Migration completed!')
  
  // Step 4: Display results
  console.log('\n📋 Migration Results:')
  console.log('====================')
  console.log(`Title: ${migratedContent.title}`)
  console.log(`Slug: ${migratedContent.slug}`)
  console.log(`Content Type: ${migratedContent.content_type}`)
  console.log(`Category: ${migratedContent.category}`)
  console.log(`Reading Time: ${migratedContent.reading_time} minutes`)
  console.log(`Readability Score: ${migratedContent.readability_score}/100`)
  console.log(`Tags: ${migratedContent.tags.slice(0, 5).join(', ')}...`)
  console.log(`Meta Description: ${migratedContent.meta_description}`)
  
  // Step 5: Show SEO improvements
  console.log('\n🎯 SEO Improvements:')
  console.log('====================')
  console.log(`Original Title: ${extractedContent.title}`)
  console.log(`Optimized Title: ${migratedContent.meta_title}`)
  console.log(`Title Length: ${migratedContent.meta_title.length} characters`)
  console.log(`Description Length: ${migratedContent.meta_description.length} characters`)
  console.log(`Readability: ${migratedContent.readability_score}/100 (${getReadabilityLevel(migratedContent.readability_score)})`)
  
  // Step 6: Show structured data
  console.log('\n🏗️ Structured Data Generated:')
  console.log('=============================')
  console.log(`Type: ${migratedContent.structured_data.type}`)
  console.log(`Schema: ${migratedContent.structured_data.data['@type']}`)
  
  return migratedContent
}

// Helper function to get readability level
function getReadabilityLevel(score: number): string {
  if (score >= 90) return 'Very Easy (5th grade)'
  if (score >= 80) return 'Easy (6th grade)'
  if (score >= 70) return 'Fairly Easy (7th grade)'
  if (score >= 60) return 'Standard (8th-9th grade)'
  if (score >= 50) return 'Fairly Difficult (10th-12th grade)'
  if (score >= 30) return 'Difficult (College level)'
  return 'Very Difficult (Graduate level)'
}

// Function to demonstrate batch migration
export function demonstrateBatchMigration() {
  console.log('🔄 Demonstrating Batch Migration Process...\n')
  
  // Sample HTML pages data
  const samplePages = [
    {
      filename: 'downsizing_calculator.html',
      title: 'Downsizing Calculator - RetireSafe.ly',
      description: 'Calculate the financial impact of downsizing your home in retirement',
      keywords: 'downsizing, retirement, home, calculator, financial planning',
      content: 'Calculate the financial impact of downsizing your home in retirement. This comprehensive tool helps you understand the costs and savings associated with moving to a smaller home.',
      contentType: 'calculator' as const,
      category: 'retirement-planning',
      priority: 'high' as const
    },
    {
      filename: 'complete_retirement_planning_guide.html',
      title: 'Complete Guide to Retirement Planning - RetireSafe.ly',
      description: 'Everything you need to know about planning for a secure retirement, from savings strategies to income planning',
      keywords: 'retirement planning, savings, income, financial security',
      content: 'Everything you need to know about planning for a secure retirement, from savings strategies to income planning. This comprehensive guide covers all aspects of retirement planning.',
      contentType: 'guide' as const,
      category: 'retirement-planning',
      priority: 'high' as const
    },
    {
      filename: 'medicare_made_simple.html',
      title: 'Medicare Made Simple - Complete Guide for Baby Boomers | RetireSafe.ly',
      description: 'Navigate Medicare options, enrollment periods, and costs with confidence. Simple guide for baby boomers approaching retirement age',
      keywords: 'Medicare, Medicare Parts, enrollment, healthcare, retirement, baby boomers, Medicare costs',
      content: 'Navigate Medicare options, enrollment periods, and costs with confidence. Simple guide for baby boomers approaching retirement age.',
      contentType: 'guide' as const,
      category: 'medicare',
      priority: 'high' as const
    }
  ]
  
  // Migrate all pages
  const migratedPages = samplePages.map(page => migrateHTMLPage(page))
  
  // Generate report
  const report = generateMigrationReport(migratedPages)
  
  console.log('📊 Batch Migration Report:')
  console.log('==========================')
  console.log(`Total Pages: ${report.total}`)
  console.log(`By Type:`, report.byType)
  console.log(`By Category:`, report.byCategory)
  console.log(`Average Readability: ${report.readabilityStats.average}/100`)
  console.log(`Average Reading Time: ${report.readingTimeStats.average} minutes`)
  
  return { migratedPages, report }
}

// Function to show before/after comparison
export function showBeforeAfterComparison() {
  console.log('📊 Before/After Comparison:')
  console.log('==========================')
  
  const originalTitle = 'Complete Guide to Retirement Planning - RetireSafe.ly'
  const originalDescription = 'Everything you need to know about planning for a secure retirement, from savings strategies to income planning'
  const originalContent = 'Everything you need to know about planning for a secure retirement, from savings strategies to income planning. This comprehensive guide covers all aspects of retirement planning including savings strategies, income planning, and financial security.'
  
  const optimizedTitle = generateSEOTitle(originalTitle)
  const optimizedDescription = generateSEODescription(originalDescription)
  const readabilityScore = calculateReadabilityScore(originalContent)
  const readingTime = calculateReadingTime(originalContent)
  
  console.log('\n📝 Title Optimization:')
  console.log(`Before: ${originalTitle} (${originalTitle.length} chars)`)
  console.log(`After:  ${optimizedTitle} (${optimizedTitle.length} chars)`)
  
  console.log('\n📝 Description Optimization:')
  console.log(`Before: ${originalDescription} (${originalDescription.length} chars)`)
  console.log(`After:  ${optimizedDescription} (${optimizedDescription.length} chars)`)
  
  console.log('\n📊 Content Analysis:')
  console.log(`Readability Score: ${readabilityScore}/100 (${getReadabilityLevel(readabilityScore)})`)
  console.log(`Reading Time: ${readingTime} minutes`)
  
  console.log('\n✅ SEO Improvements:')
  console.log('- Title optimized for 7th-grade readability')
  console.log('- Description under 155 characters')
  console.log('- Content simplified for better comprehension')
  console.log('- Structured data ready for AI search engines')
  console.log('- Semantic keywords extracted for better ranking')
}

// Run the demonstration
if (require.main === module) {
  console.log('🎯 SeniorSimple Content Migration Demonstration')
  console.log('===============================================\n')
  
  // Run individual migration
  demonstrateMigration()
  
  console.log('\n' + '='.repeat(50) + '\n')
  
  // Run batch migration
  demonstrateBatchMigration()
  
  console.log('\n' + '='.repeat(50) + '\n')
  
  // Show before/after comparison
  showBeforeAfterComparison()
  
  console.log('\n🎉 Migration demonstration completed!')
  console.log('\nNext steps:')
  console.log('1. Run the actual migration script on all HTML files')
  console.log('2. Import migrated content into Supabase CMS')
  console.log('3. Test the new content structure')
  console.log('4. Deploy to production')
}





