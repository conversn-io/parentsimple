// Test script to check database connection and create sample content
// This script works with just the anon key (no service role required)

import { createClient } from '@supabase/supabase-js'

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL')
  console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY')
  console.error('\nPlease add these to your .env.local file')
  process.exit(1)
}

// Create Supabase client with anon key
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...\n')

    // Test 1: Check if we can connect to Supabase
    console.log('1. Testing basic connection...')
    const { data: connectionTest, error: connectionError } = await supabase
      .from('articles')
      .select('count')
      .limit(1)

    if (connectionError) {
      console.error('❌ Connection failed:', connectionError.message)
      console.error('\nThis could mean:')
      console.error('- The database tables don\'t exist yet')
      console.error('- The environment variables are incorrect')
      console.error('- The Supabase project is not accessible')
      return false
    }

    console.log('✅ Basic connection successful')

    // Test 2: Check if articles table exists and has data
    console.log('\n2. Checking articles table...')
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('id, title, slug, content_type, status')
      .limit(5)

    if (articlesError) {
      console.error('❌ Articles table error:', articlesError.message)
      return false
    }

    console.log(`✅ Articles table accessible. Found ${articles?.length || 0} articles`)

    if (articles && articles.length > 0) {
      console.log('\n📄 Sample articles:')
      articles.forEach((article, index) => {
        console.log(`   ${index + 1}. ${article.title} (${article.content_type}) - ${article.status}`)
      })
    } else {
      console.log('\n⚠️  No articles found. The database is empty.')
      console.log('   You need to run the database migration and import content.')
    }

    // Test 3: Check categories
    console.log('\n3. Checking categories...')
    const { data: categories, error: categoriesError } = await supabase
      .from('article_categories')
      .select('name, slug, description')
      .limit(5)

    if (categoriesError) {
      console.error('❌ Categories table error:', categoriesError.message)
    } else {
      console.log(`✅ Categories table accessible. Found ${categories?.length || 0} categories`)
      if (categories && categories.length > 0) {
        console.log('\n📂 Sample categories:')
        categories.forEach((category, index) => {
          console.log(`   ${index + 1}. ${category.name} (${category.slug})`)
        })
      }
    }

    return true

  } catch (error) {
    console.error('❌ Unexpected error:', error)
    return false
  }
}

async function createSampleContent() {
  try {
    console.log('\n📝 Creating sample content...\n')

    // Create a sample article
    const sampleArticle = {
      title: 'Complete Guide to Retirement Planning',
      slug: 'complete-guide-to-retirement-planning',
      content: `
# Complete Guide to Retirement Planning

Retirement planning is one of the most important financial decisions you'll make. This comprehensive guide covers everything you need to know about planning for a secure retirement.

## Key Topics Covered

- **Savings Strategies**: Learn how to maximize your retirement savings
- **Income Planning**: Understand different income sources in retirement
- **Tax Optimization**: Minimize taxes on your retirement income
- **Healthcare Planning**: Plan for medical expenses in retirement
- **Estate Planning**: Protect your assets for future generations

## Getting Started

The first step in retirement planning is understanding your current financial situation. This includes:

1. Calculating your current net worth
2. Estimating your retirement expenses
3. Determining your retirement income needs
4. Creating a savings plan

## Conclusion

Proper retirement planning requires careful consideration of many factors. Start early, save consistently, and seek professional advice when needed.
      `,
      excerpt: 'Everything you need to know about planning for a secure retirement, from savings strategies to income planning.',
      content_type: 'guide',
      difficulty_level: 'beginner',
      category: 'retirement-planning',
      meta_title: 'Complete Guide to Retirement Planning | SeniorSimple',
      meta_description: 'Everything you need to know about planning for a secure retirement, from savings strategies to income planning.',
      meta_keywords: ['retirement planning', 'savings', 'income', 'financial security'],
      reading_time: 15,
      readability_score: 75,
      semantic_keywords: ['retirement', 'planning', 'savings', 'income', 'financial', 'security'],
      topic_cluster: 'retirement-planning',
      featured_snippet_optimized: true,
      status: 'published',
      priority: 'high',
      featured: true,
      published_at: new Date().toISOString()
    }

    const { data: article, error: articleError } = await supabase
      .from('articles')
      .insert(sampleArticle)
      .select()
      .single()

    if (articleError) {
      console.error('❌ Could not create sample article:', articleError.message)
      return false
    }

    console.log('✅ Sample article created successfully!')
    console.log(`   Title: ${article.title}`)
    console.log(`   Slug: ${article.slug}`)
    console.log(`   URL: /content/${article.slug}`)

    return true

  } catch (error) {
    console.error('❌ Error creating sample content:', error)
    return false
  }
}

// Main execution
async function main() {
  console.log('🚀 SeniorSimple Database Connection Test\n')
  
  const connectionSuccess = await testDatabaseConnection()
  
  if (connectionSuccess) {
    console.log('\n✅ Database connection test completed successfully!')
    
    // Ask if user wants to create sample content
    const shouldCreateSample = process.argv.includes('--create-sample')
    if (shouldCreateSample) {
      await createSampleContent()
    } else {
      console.log('\n💡 To create sample content, run: npm run test:db -- --create-sample')
    }
  } else {
    console.log('\n❌ Database connection test failed!')
    console.log('\nNext steps:')
    console.log('1. Check your .env.local file has correct Supabase credentials')
    console.log('2. Run the database migration: npm run migrate:db')
    console.log('3. Import content from HTML files: npm run import:content')
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error)
}

export { testDatabaseConnection, createSampleContent }





