#!/usr/bin/env node

/**
 * Script to check MegaMenu routes for 404s and recommend content
 * 
 * Checks:
 * 1. Which routes exist in the codebase
 * 2. Which UX categories have articles in the DB
 * 3. Which category pages would return 404 (no articles)
 * 4. Recommends replacement links or content to create
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// ParentSimple Publishare CMS Supabase credentials
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vpysqshhafthuxvokwqj.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZweXNxc2hoYWZ0aHV4dm9rd3FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNTY3ODcsImV4cCI6MjA2NTkzMjc4N30.fza16gc2qHpGzzMFa1H3O6W-YIsVTsCLH9uYy9pR31I'

if (!SUPABASE_URL || !SUPABASE_KEY || SUPABASE_URL.includes('placeholder') || SUPABASE_KEY.includes('placeholder')) {
  console.error('❌ Error: Missing Supabase credentials')
  console.error('Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables')
  console.error('Or update the script with valid credentials')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Routes that should exist in the codebase
const expectedRoutes = {
  static: [
    { path: '/college-planning', type: 'page', description: 'College planning hub page' },
    { path: '/consultation', type: 'page', description: 'Consultation booking page' },
    { path: '/calculators/life-insurance', type: 'page', description: 'Life insurance calculator' },
    { path: '/articles', type: 'page', description: 'Articles listing page' },
  ],
  dynamic: [
    { path: '/category/[slug]', type: 'dynamic', description: 'Category pages' },
    { path: '/articles/[slug]', type: 'dynamic', description: 'Article pages' },
  ]
}

// Check if route files exist
function checkRouteExists(routePath) {
  const appDir = path.join(__dirname, '..', 'src', 'app')
  
  if (routePath.startsWith('/category/')) {
    const categoryPage = path.join(appDir, 'category', '[slug]', 'page.tsx')
    return fs.existsSync(categoryPage)
  }
  
  if (routePath.startsWith('/articles/')) {
    const articlePage = path.join(appDir, 'articles', '[slug]', 'page.tsx')
    return fs.existsSync(articlePage)
  }
  
  // Remove leading slash and check
  const cleanPath = routePath.replace(/^\//, '')
  const routeFile = path.join(appDir, cleanPath, 'page.tsx')
  return fs.existsSync(routeFile)
}

async function checkMegaMenuRoutes() {
  console.log('🔍 Checking MegaMenu Routes and Content Availability')
  console.log('='.repeat(70))
  console.log('')

  // 1. Check route files exist
  console.log('📁 Checking Route Files...')
  const routeChecks = {}
  
  for (const route of expectedRoutes.static) {
    const exists = checkRouteExists(route.path)
    routeChecks[route.path] = { exists, type: route.type, description: route.description }
    console.log(`   ${exists ? '✅' : '❌'} ${route.path} - ${route.description}`)
  }
  
  for (const route of expectedRoutes.dynamic) {
    const exists = checkRouteExists(route.path)
    routeChecks[route.path] = { exists, type: route.type, description: route.description }
    console.log(`   ${exists ? '✅' : '❌'} ${route.path} - ${route.description}`)
  }
  
  console.log('')

  // 2. Get UX categories from DB
  console.log('📋 Fetching UX Categories from Database...')
  const { data: uxCategories, error: uxError } = await supabase
    .from('ux_categories')
    .select('id, name, slug, description, display_order')
    .eq('site_id', 'parentsimple')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (uxError) {
    console.error('❌ Error fetching UX categories:', uxError)
    return
  }

  console.log(`   Found ${uxCategories.length} active UX categories`)
  console.log('')

  // 3. Check articles for each UX category
  console.log('📚 Checking Articles by UX Category...')
  const categoryAnalysis = []

  for (const category of uxCategories) {
    // Get articles with this UX category
    const { data: articles, error: articlesError } = await supabase
      .from('article_ux_categories')
      .select(`
        article_id,
        articles!inner(
          id,
          title,
          slug,
          status,
          site_id
        )
      `)
      .eq('ux_category_id', category.id)
      .eq('articles.site_id', 'parentsimple')
      .eq('articles.status', 'published')

    if (articlesError) {
      console.error(`   ❌ Error fetching articles for ${category.name}:`, articlesError)
      continue
    }

    const publishedArticles = articles?.filter(a => a.articles?.status === 'published') || []
    const articleCount = publishedArticles.length

    const categoryRoute = category.slug === 'college-planning' 
      ? '/college-planning' 
      : `/category/${category.slug}`

    const routeExists = category.slug === 'college-planning' 
      ? routeChecks['/college-planning']?.exists
      : routeChecks['/category/[slug]']?.exists

    const hasContent = articleCount > 0
    const will404 = routeExists && !hasContent

    categoryAnalysis.push({
      category: category.name,
      slug: category.slug,
      route: categoryRoute,
      routeExists,
      articleCount,
      hasContent,
      will404,
      articles: publishedArticles.map(a => ({
        id: a.articles?.id,
        title: a.articles?.title,
        slug: a.articles?.slug,
      }))
    })

    const status = will404 ? '⚠️  WILL 404' : hasContent ? '✅' : '❌ NO CONTENT'
    console.log(`   ${status} ${category.name} (${category.slug})`)
    console.log(`      Route: ${categoryRoute} ${routeExists ? '✅' : '❌'}`)
    console.log(`      Articles: ${articleCount} published`)
    if (articleCount > 0 && articleCount <= 3) {
      console.log(`      Sample articles:`)
      publishedArticles.slice(0, 3).forEach(a => {
        console.log(`        - ${a.articles?.title} (/${a.articles?.slug})`)
      })
    }
    console.log('')
  }

  // 4. Generate report
  console.log('')
  console.log('='.repeat(70))
  console.log('📊 MEGA MENU ROUTE ANALYSIS REPORT')
  console.log('='.repeat(70))
  console.log('')

  // Routes that will 404
  const routes404 = categoryAnalysis.filter(c => c.will404)
  if (routes404.length > 0) {
    console.log('⚠️  ROUTES THAT WILL RETURN 404:')
    console.log('')
    routes404.forEach(c => {
      console.log(`   ❌ ${c.route}`)
      console.log(`      Category: ${c.category}`)
      console.log(`      Issue: Route exists but has no published articles`)
      console.log(`      Recommendation: Create content or link to alternative`)
      console.log('')
    })
  } else {
    console.log('✅ No routes will return 404')
    console.log('')
  }

  // Categories with no content
  const noContent = categoryAnalysis.filter(c => !c.hasContent && c.routeExists)
  if (noContent.length > 0) {
    console.log('📝 CATEGORIES NEEDING CONTENT:')
    console.log('')
    noContent.forEach(c => {
      console.log(`   📋 ${c.category} (${c.slug})`)
      console.log(`      Route: ${c.route}`)
      console.log(`      Status: Route exists, but no published articles`)
      console.log(`      Recommendation: Create articles in this category`)
      console.log('')
    })
  }

  // Categories with minimal content
  const minimalContent = categoryAnalysis.filter(c => c.hasContent && c.articleCount < 3)
  if (minimalContent.length > 0) {
    console.log('📚 CATEGORIES WITH MINIMAL CONTENT (< 3 articles):')
    console.log('')
    minimalContent.forEach(c => {
      console.log(`   📖 ${c.category} (${c.slug})`)
      console.log(`      Current articles: ${c.articleCount}`)
      console.log(`      Recommendation: Add more articles to strengthen this category`)
      if (c.articles.length > 0) {
        console.log(`      Existing articles:`)
        c.articles.forEach(a => {
          console.log(`        - ${a.title}`)
        })
      }
      console.log('')
    })
  }

  // Static route checks
  console.log('🔗 STATIC ROUTE CHECKS:')
  console.log('')
  for (const route of expectedRoutes.static) {
    const check = routeChecks[route.path]
    if (!check.exists) {
      console.log(`   ❌ ${route.path} - Route file missing`)
      console.log(`      Description: ${route.description}`)
      console.log(`      Recommendation: Create ${route.path.replace(/^\//, '')}/page.tsx`)
      console.log('')
    } else {
      console.log(`   ✅ ${route.path} - Route exists`)
    }
  }
  console.log('')

  // Summary
  console.log('='.repeat(70))
  console.log('📈 SUMMARY')
  console.log('='.repeat(70))
  console.log('')
  console.log(`Total UX Categories: ${uxCategories.length}`)
  console.log(`Categories with content: ${categoryAnalysis.filter(c => c.hasContent).length}`)
  console.log(`Categories without content: ${categoryAnalysis.filter(c => !c.hasContent).length}`)
  console.log(`Routes that will 404: ${routes404.length}`)
  console.log(`Categories needing more content: ${minimalContent.length}`)
  console.log('')

  // Recommendations
  if (routes404.length > 0 || noContent.length > 0) {
    console.log('💡 RECOMMENDATIONS:')
    console.log('')
    
    if (routes404.length > 0) {
      console.log('1. For routes that will 404:')
      routes404.forEach(c => {
        console.log(`   - ${c.route}: Create at least 1-2 articles in "${c.category}" category`)
        console.log(`     OR temporarily link to /articles with category filter`)
      })
      console.log('')
    }

    if (noContent.length > 0) {
      console.log('2. Priority content to create:')
      noContent.forEach((c, idx) => {
        console.log(`   ${idx + 1}. ${c.category} - Create 3-5 foundational articles`)
      })
      console.log('')
    }

    if (minimalContent.length > 0) {
      console.log('3. Categories to expand:')
      minimalContent.forEach(c => {
        console.log(`   - ${c.category}: Currently has ${c.articleCount} articles, target 5-10`)
      })
      console.log('')
    }
  }

  return {
    routeChecks,
    categoryAnalysis,
    routes404,
    noContent,
    minimalContent
  }
}

// Run the check
checkMegaMenuRoutes()
  .then((results) => {
    console.log('✅ Analysis complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error running analysis:', error)
    process.exit(1)
  })

