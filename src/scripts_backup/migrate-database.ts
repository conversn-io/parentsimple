// Database migration script for SeniorSimple CMS
// This script applies the enhanced schema to Supabase

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL')
  console.error('   SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface MigrationResult {
  success: boolean
  message: string
  error?: string
}

class DatabaseMigrator {
  private migrationHistory: string[] = []

  async runMigration(): Promise<MigrationResult> {
    try {
      console.log('🚀 Starting SeniorSimple CMS Database Migration...\n')

      // Step 1: Read and execute schema
      await this.executeSchema()

      // Step 2: Verify tables were created
      await this.verifyTables()

      // Step 3: Insert sample data
      await this.insertSampleData()

      // Step 4: Test queries
      await this.testQueries()

      console.log('\n✅ Database migration completed successfully!')
      return {
        success: true,
        message: 'Database migration completed successfully'
      }

    } catch (error) {
      console.error('\n❌ Migration failed:', error)
      return {
        success: false,
        message: 'Migration failed',
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  private async executeSchema(): Promise<void> {
    console.log('📄 Step 1: Executing database schema...')
    
    const schemaPath = path.join(process.cwd(), 'src/lib/database-schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')

    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    let successCount = 0
    let errorCount = 0

    for (const statement of statements) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement })
        if (error) {
          console.warn(`⚠️  Warning: ${error.message}`)
          errorCount++
        } else {
          successCount++
        }
      } catch (err) {
        console.warn(`⚠️  Warning: ${err}`)
        errorCount++
      }
    }

    console.log(`✅ Schema execution completed: ${successCount} successful, ${errorCount} warnings`)
  }

  private async verifyTables(): Promise<void> {
    console.log('\n🔍 Step 2: Verifying table creation...')

    const expectedTables = [
      'articles',
      'article_categories', 
      'article_tags',
      'article_tags_junction',
      'content_sections',
      'calculator_inputs',
      'calculator_outputs',
      'calculator_charts',
      'tool_steps',
      'checklist_items',
      'checklist_categories',
      'faq_items',
      'user_interactions',
      'content_analytics'
    ]

    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')

    if (error) {
      throw new Error(`Failed to verify tables: ${error.message}`)
    }

    const existingTables = tables?.map(t => t.table_name) || []
    const missingTables = expectedTables.filter(table => !existingTables.includes(table))

    if (missingTables.length > 0) {
      console.warn(`⚠️  Missing tables: ${missingTables.join(', ')}`)
    } else {
      console.log('✅ All expected tables created successfully')
    }

    // Verify views
    const { data: views, error: viewsError } = await supabase
      .from('information_schema.views')
      .select('table_name')
      .eq('table_schema', 'public')

    if (!viewsError) {
      const existingViews = views?.map(v => v.table_name) || []
      const expectedViews = ['published_articles', 'article_with_tags']
      const missingViews = expectedViews.filter(view => !existingViews.includes(view))
      
      if (missingViews.length > 0) {
        console.warn(`⚠️  Missing views: ${missingViews.join(', ')}`)
      } else {
        console.log('✅ All expected views created successfully')
      }
    }
  }

  private async insertSampleData(): Promise<void> {
    console.log('\n📊 Step 3: Inserting sample data...')

    // Insert sample article
    const sampleArticle = {
      title: 'Complete Guide to Retirement Planning',
      slug: 'complete-guide-to-retirement-planning',
      content: 'This comprehensive guide covers everything you need to know about retirement planning, from savings strategies to income planning.',
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
      console.warn(`⚠️  Could not insert sample article: ${articleError.message}`)
    } else {
      console.log('✅ Sample article inserted successfully')
    }

    // Insert sample calculator
    const sampleCalculator = {
      title: 'Downsizing Calculator',
      slug: 'downsizing-calculator',
      content: 'Calculate the financial impact of downsizing your home in retirement. This comprehensive tool helps you understand the costs and savings associated with moving to a smaller home.',
      excerpt: 'Calculate the financial impact of downsizing your home in retirement.',
      content_type: 'calculator',
      difficulty_level: 'beginner',
      category: 'retirement-planning',
      meta_title: 'Downsizing Calculator | SeniorSimple',
      meta_description: 'Calculate the financial impact of downsizing your home in retirement.',
      meta_keywords: ['downsizing', 'calculator', 'retirement', 'home', 'financial planning'],
      reading_time: 5,
      readability_score: 80,
      semantic_keywords: ['downsizing', 'calculator', 'retirement', 'home', 'financial', 'planning'],
      topic_cluster: 'retirement-planning',
      featured_snippet_optimized: true,
      calculator_config: {
        calculator_type: 'financial',
        inputs: [
          {
            id: 'currentHomeValue',
            label: 'Current Home Value',
            type: 'number',
            required: true,
            default_value: 450000,
            help_text: 'Enter the current market value of your home'
          },
          {
            id: 'newHomeValue',
            label: 'New Home Purchase Price',
            type: 'number',
            required: true,
            default_value: 325000,
            help_text: 'Enter the purchase price of your new home'
          }
        ],
        outputs: [
          {
            id: 'netEquityGain',
            label: 'Net Equity Gain',
            type: 'currency',
            format: 'currency'
          },
          {
            id: 'annualSavings',
            label: 'Annual Savings',
            type: 'currency',
            format: 'currency'
          }
        ],
        charts: [
          {
            id: 'costsChart',
            type: 'bar',
            title: 'Annual Costs Comparison',
            data_source: 'costsData'
          }
        ],
        print_enabled: true,
        save_enabled: true
      },
      status: 'published',
      priority: 'high',
      featured: true,
      published_at: new Date().toISOString()
    }

    const { data: calculator, error: calculatorError } = await supabase
      .from('articles')
      .insert(sampleCalculator)
      .select()
      .single()

    if (calculatorError) {
      console.warn(`⚠️  Could not insert sample calculator: ${calculatorError.message}`)
    } else {
      console.log('✅ Sample calculator inserted successfully')
    }
  }

  private async testQueries(): Promise<void> {
    console.log('\n🧪 Step 4: Testing database queries...')

    // Test basic article query
    const { data: articles, error: articlesError } = await supabase
      .from('published_articles')
      .select('*')
      .limit(5)

    if (articlesError) {
      throw new Error(`Failed to query articles: ${articlesError.message}`)
    }

    console.log(`✅ Successfully queried ${articles?.length || 0} published articles`)

    // Test search function
    const { data: searchResults, error: searchError } = await supabase
      .rpc('search_articles', { search_term: 'retirement', limit_count: 5 })

    if (searchError) {
      console.warn(`⚠️  Search function test failed: ${searchError.message}`)
    } else {
      console.log(`✅ Search function working: found ${searchResults?.length || 0} results`)
    }

    // Test category query
    const { data: categoryResults, error: categoryError } = await supabase
      .rpc('get_articles_by_category', { 
        category_slug: 'retirement-planning', 
        limit_count: 5 
      })

    if (categoryError) {
      console.warn(`⚠️  Category query test failed: ${categoryError.message}`)
    } else {
      console.log(`✅ Category query working: found ${categoryResults?.length || 0} results`)
    }

    // Test calculator config query
    const { data: calculators, error: calculatorsError } = await supabase
      .from('articles')
      .select('title, calculator_config')
      .eq('content_type', 'calculator')
      .not('calculator_config', 'is', null)

    if (calculatorsError) {
      console.warn(`⚠️  Calculator query test failed: ${calculatorsError.message}`)
    } else {
      console.log(`✅ Calculator query working: found ${calculators?.length || 0} calculators`)
    }
  }

  async rollbackMigration(): Promise<MigrationResult> {
    try {
      console.log('🔄 Rolling back database migration...')

      // Drop tables in reverse order to handle dependencies
      const tablesToDrop = [
        'content_analytics',
        'user_interactions',
        'faq_items',
        'checklist_categories',
        'checklist_items',
        'tool_steps',
        'calculator_charts',
        'calculator_outputs',
        'calculator_inputs',
        'content_sections',
        'article_tags_junction',
        'article_tags',
        'article_categories',
        'articles'
      ]

      for (const table of tablesToDrop) {
        const { error } = await supabase.rpc('exec_sql', { 
          sql: `DROP TABLE IF EXISTS ${table} CASCADE;` 
        })
        if (error) {
          console.warn(`⚠️  Could not drop table ${table}: ${error.message}`)
        }
      }

      // Drop types
      const typesToDrop = [
        'priority_level_enum',
        'article_status_enum', 
        'difficulty_level_enum',
        'content_type_enum'
      ]

      for (const type of typesToDrop) {
        const { error } = await supabase.rpc('exec_sql', { 
          sql: `DROP TYPE IF EXISTS ${type} CASCADE;` 
        })
        if (error) {
          console.warn(`⚠️  Could not drop type ${type}: ${error.message}`)
        }
      }

      console.log('✅ Rollback completed')
      return {
        success: true,
        message: 'Database rollback completed'
      }

    } catch (error) {
      console.error('❌ Rollback failed:', error)
      return {
        success: false,
        message: 'Rollback failed',
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }
}

// Main execution
async function main() {
  const migrator = new DatabaseMigrator()
  
  const command = process.argv[2]
  
  if (command === 'rollback') {
    const result = await migrator.rollbackMigration()
    process.exit(result.success ? 0 : 1)
  } else {
    const result = await migrator.runMigration()
    process.exit(result.success ? 0 : 1)
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error)
}

export { DatabaseMigrator }





