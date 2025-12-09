#!/usr/bin/env node

/**
 * Analyze content gaps and recommend specific articles to create
 */

const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://vpysqshhafthuxvokwqj.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZweXNxc2hoYWZ0aHV4dm9rd3FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNTY3ODcsImV4cCI6MjA2NTkzMjc4N30.fza16gc2qHpGzzMFa1H3O6W-YIsVTsCLH9uYy9pR31I'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function analyzeContentGaps() {
  console.log('🔍 Analyzing Content Gaps and Recommending Articles')
  console.log('='.repeat(70))
  console.log('')

  // Get all published articles with their categories
  const { data: allArticles, error: articlesError } = await supabase
    .from('articles')
    .select('id, title, slug, category, status, site_id')
    .eq('site_id', 'parentsimple')
    .eq('status', 'published')

  if (articlesError) {
    console.error('❌ Error fetching articles:', articlesError)
    return
  }

  console.log(`📚 Found ${allArticles.length} published articles`)
  console.log('')

  // Get UX categories
  const { data: uxCategories } = await supabase
    .from('ux_categories')
    .select('id, name, slug')
    .eq('site_id', 'parentsimple')
    .eq('is_active', true)

  // Get articles by UX category
  const { data: articleUxCategories } = await supabase
    .from('article_ux_categories')
    .select(`
      article_id,
      ux_category_id,
      ux_categories!inner(name, slug)
    `)
    .eq('ux_categories.site_id', 'parentsimple')

  // Build map of articles by UX category
  const articlesByCategory = {}
  uxCategories.forEach(cat => {
    articlesByCategory[cat.slug] = []
  })

  articleUxCategories?.forEach(assignment => {
    const categorySlug = assignment.ux_categories?.slug
    if (categorySlug && articlesByCategory[categorySlug]) {
      const article = allArticles.find(a => a.id === assignment.article_id)
      if (article) {
        articlesByCategory[categorySlug].push(article)
      }
    }
  })

  // Categories that need content
  const emptyCategories = ['financial-planning', 'high-school', 'middle-school', 'early-years']

  console.log('📋 CONTENT GAP ANALYSIS')
  console.log('='.repeat(70))
  console.log('')

  for (const categorySlug of emptyCategories) {
    const category = uxCategories.find(c => c.slug === categorySlug)
    if (!category) continue

    console.log(`📝 ${category.name} (${categorySlug})`)
    console.log(`   Current articles: ${articlesByCategory[categorySlug]?.length || 0}`)
    console.log('')

    // Look for similar articles in other categories
    const similarArticles = allArticles.filter(a => {
      const title = a.title?.toLowerCase() || ''
      const category = a.category?.toLowerCase() || ''
      
      // Keywords that might indicate relevance
      const keywords = {
        'financial-planning': ['529', 'financial', 'planning', 'savings', 'insurance', 'estate', 'funding', 'cost'],
        'high-school': ['high school', 'gpa', 'sat', 'act', 'test', 'prep', 'extracurricular', 'college prep'],
        'middle-school': ['middle school', 'course', 'study', 'skills', 'preparation', 'academic'],
        'early-years': ['early', 'childhood', 'preschool', 'elementary', 'foundation', 'development', 'learning']
      }

      const relevantKeywords = keywords[categorySlug] || []
      return relevantKeywords.some(keyword => 
        title.includes(keyword) || category.includes(keyword)
      )
    })

    if (similarArticles.length > 0) {
      console.log(`   🔍 Found ${similarArticles.length} potentially similar articles in other categories:`)
      similarArticles.slice(0, 5).forEach(a => {
        console.log(`      - "${a.title}" (category: ${a.category || 'none'})`)
      })
      console.log('')
    }

    // Recommend specific content to create
    console.log('   💡 Recommended Articles to Create:')
    const recommendations = {
      'financial-planning': [
        '529 Plan Basics: Everything Parents Need to Know',
        'How to Calculate Your College Savings Goal',
        'Life Insurance for Parents: Protecting Your Family\'s Future',
        'Estate Planning Essentials for College-Bound Families',
        'Financial Aid vs. Merit Scholarships: A Parent\'s Guide'
      ],
      'high-school': [
        'GPA Optimization Strategies for College Admissions',
        'SAT vs. ACT: Which Test Should Your Student Take?',
        'Building a Strong Extracurricular Profile',
        'How to Get Strong Teacher Recommendations',
        'AP Course Selection Guide for College-Bound Students'
      ],
      'middle-school': [
        'Middle School Course Selection: Setting Up for Success',
        'Study Skills and Time Management for Teens',
        'Preparing for High School: A Parent\'s Guide',
        'Summer Programs and Enrichment Opportunities',
        'Building Academic Foundations in Middle School'
      ],
      'early-years': [
        'Early Childhood Development Milestones',
        'Choosing the Right Preschool for Your Child',
        'Learning Through Play: Educational Strategies',
        'Building Academic Foundations (Ages 0-10)',
        'Character Development and Values Education'
      ]
    }

    recommendations[categorySlug]?.forEach((title, idx) => {
      console.log(`      ${idx + 1}. ${title}`)
    })
    console.log('')
  }

  // Summary
  console.log('='.repeat(70))
  console.log('📊 SUMMARY')
  console.log('='.repeat(70))
  console.log('')
  console.log(`Total published articles: ${allArticles.length}`)
  console.log(`Categories with content: ${Object.values(articlesByCategory).filter(arr => arr.length > 0).length}`)
  console.log(`Categories needing content: ${emptyCategories.length}`)
  console.log('')
  console.log('🎯 PRIORITY ACTIONS:')
  console.log('')
  console.log('1. Create at least 2-3 articles per empty category to prevent 404s')
  console.log('2. Focus on foundational/pillar content first')
  console.log('3. Consider repurposing similar content from other categories')
  console.log('4. Update MegaMenu to link to /articles?category=X as fallback until content is ready')
  console.log('')
}

analyzeContentGaps()
  .then(() => {
    console.log('✅ Analysis complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })


