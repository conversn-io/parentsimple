// Content import script to migrate HTML pages to the enhanced CMS
// This script processes all HTML files and imports them into Supabase

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { 
  extractContentFromHTML, 
  migrateHTMLPage, 
  generateMigrationReport,
  HTMLPageData 
} from '../lib/content-migration'

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL')
  console.error('   SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface ImportResult {
  success: boolean
  imported: number
  failed: number
  errors: string[]
}

class ContentImporter {
  private pagesDirectory: string
  private importedCount = 0
  private failedCount = 0
  private errors: string[] = []

  constructor(pagesDirectory: string) {
    this.pagesDirectory = pagesDirectory
  }

  async importAllContent(): Promise<ImportResult> {
    try {
      console.log('🚀 Starting SeniorSimple Content Import...\n')
      console.log(`📁 Reading from: ${this.pagesDirectory}\n`)

      // Step 1: Read all HTML files
      const htmlFiles = await this.readHTMLFiles()
      console.log(`📄 Found ${htmlFiles.length} HTML files\n`)

      // Step 2: Process each file
      const htmlPages: HTMLPageData[] = []
      
      for (const file of htmlFiles) {
        try {
          const htmlContent = fs.readFileSync(file, 'utf8')
          const extracted = extractContentFromHTML(htmlContent)
          
          const filename = path.basename(file)
          const contentType = this.determineContentType(filename)
          const category = this.determineCategory(filename)
          const priority = this.determinePriority(filename)

          htmlPages.push({
            filename,
            title: extracted.title,
            description: extracted.description,
            keywords: extracted.keywords,
            content: extracted.content,
            contentType,
            category,
            priority
          })

          console.log(`✅ Processed: ${filename}`)
        } catch (error) {
          console.error(`❌ Failed to process ${file}:`, error)
          this.failedCount++
          this.errors.push(`Failed to process ${file}: ${error}`)
        }
      }

      // Step 3: Migrate to CMS format
      console.log('\n🔄 Migrating content to CMS format...')
      const migratedContent = htmlPages.map(page => migrateHTMLPage(page))
      console.log(`✅ Migrated ${migratedContent.length} pages\n`)

      // Step 4: Import to database
      console.log('💾 Importing to database...')
      await this.importToDatabase(migratedContent)

      // Step 5: Generate report
      const report = generateMigrationReport(migratedContent)
      this.printReport(report)

      return {
        success: true,
        imported: this.importedCount,
        failed: this.failedCount,
        errors: this.errors
      }

    } catch (error) {
      console.error('\n❌ Import failed:', error)
      return {
        success: false,
        imported: this.importedCount,
        failed: this.failedCount,
        errors: [...this.errors, error instanceof Error ? error.message : String(error)]
      }
    }
  }

  private async readHTMLFiles(): Promise<string[]> {
    const files: string[] = []
    
    const readDir = (dir: string): void => {
      const items = fs.readdirSync(dir)
      
      for (const item of items) {
        const fullPath = path.join(dir, item)
        const stat = fs.statSync(fullPath)
        
        if (stat.isDirectory()) {
          readDir(fullPath)
        } else if (item.endsWith('.html')) {
          files.push(fullPath)
        }
      }
    }

    if (fs.existsSync(this.pagesDirectory)) {
      readDir(this.pagesDirectory)
    } else {
      throw new Error(`Pages directory not found: ${this.pagesDirectory}`)
    }

    return files
  }

  private determineContentType(filename: string): 'guide' | 'calculator' | 'tool' | 'checklist' {
    if (filename.includes('calculator')) return 'calculator'
    if (filename.includes('checklist')) return 'checklist'
    if (filename.includes('tool') || filename.includes('planner')) return 'tool'
    return 'guide'
  }

  private determineCategory(filename: string): string {
    if (filename.includes('medicare')) return 'medicare'
    if (filename.includes('estate')) return 'estate-planning'
    if (filename.includes('insurance')) return 'insurance'
    if (filename.includes('home') || filename.includes('downsizing') || filename.includes('reverse')) return 'housing'
    if (filename.includes('tax') || filename.includes('roth') || filename.includes('rmd')) return 'taxes'
    if (filename.includes('retirement')) return 'retirement-planning'
    if (filename.includes('annuity')) return 'investments'
    return 'retirement-planning'
  }

  private determinePriority(filename: string): 'high' | 'medium' | 'low' {
    const highPriority = [
      'complete_retirement_planning_guide',
      'medicare_made_simple',
      'estate_planning_essentials',
      'downsizing_calculator',
      'life_insurance_calculator',
      'reverse_mortgage_calculator',
      'beneficiary_planning_tool',
      'estate_planning_checklist'
    ]

    const mediumPriority = [
      'medicare_cost_calculator',
      'long_term_care_planning_guide',
      'indexed_annuities_secret',
      'reverse_mortgages_guide',
      'life_insurance_retirement_guide',
      'home_equity_calculator',
      'aging_in_place_calculator',
      'home_modification_planner'
    ]

    if (highPriority.some(priority => filename.includes(priority))) return 'high'
    if (mediumPriority.some(priority => filename.includes(priority))) return 'medium'
    return 'low'
  }

  private async importToDatabase(migratedContent: any[]): Promise<void> {
    // Import articles
    for (const content of migratedContent) {
      try {
        const { data, error } = await supabase
          .from('articles')
          .upsert({
            id: content.id,
            title: content.title,
            slug: content.slug,
            content: content.content,
            excerpt: content.excerpt,
            meta_title: content.meta_title,
            meta_description: content.meta_description,
            meta_keywords: content.meta_keywords,
            content_type: content.content_type,
            category: content.category,
            tags: content.tags,
            reading_time: content.reading_time,
            readability_score: content.readability_score,
            semantic_keywords: content.semantic_keywords,
            calculator_config: content.calculator_config,
            tool_config: content.tool_config,
            checklist_config: content.checklist_config,
            status: content.status,
            created_at: content.created_at,
            updated_at: content.updated_at,
            published_at: content.created_at
          }, {
            onConflict: 'slug'
          })

        if (error) {
          console.error(`❌ Failed to import ${content.slug}:`, error.message)
          this.failedCount++
          this.errors.push(`Failed to import ${content.slug}: ${error.message}`)
        } else {
          console.log(`✅ Imported: ${content.slug}`)
          this.importedCount++

          // Import tags if they exist
          if (content.tags && content.tags.length > 0) {
            await this.importTags(content.id, content.tags)
          }

          // Import content sections if they exist
          if (content.content_sections && content.content_sections.length > 0) {
            await this.importContentSections(content.id, content.content_sections)
          }
        }
      } catch (error) {
        console.error(`❌ Error importing ${content.slug}:`, error)
        this.failedCount++
        this.errors.push(`Error importing ${content.slug}: ${error}`)
      }
    }
  }

  private async importTags(articleId: string, tags: string[]): Promise<void> {
    for (const tagName of tags) {
      try {
        // Insert or get tag
        const { data: tag, error: tagError } = await supabase
          .from('article_tags')
          .upsert({
            name: tagName,
            slug: tagName.toLowerCase().replace(/\s+/g, '-')
          }, {
            onConflict: 'slug'
          })
          .select()
          .single()

        if (tagError) {
          console.warn(`⚠️  Could not create tag ${tagName}:`, tagError.message)
          continue
        }

        // Link tag to article
        const { error: junctionError } = await supabase
          .from('article_tags_junction')
          .upsert({
            article_id: articleId,
            tag_id: tag.id
          })

        if (junctionError) {
          console.warn(`⚠️  Could not link tag ${tagName}:`, junctionError.message)
        }
      } catch (error) {
        console.warn(`⚠️  Error with tag ${tagName}:`, error)
      }
    }
  }

  private async importContentSections(articleId: string, sections: any[]): Promise<void> {
    for (const section of sections) {
      try {
        const { error } = await supabase
          .from('content_sections')
          .insert({
            article_id: articleId,
            title: section.title,
            content: section.content,
            section_type: section.section_type,
            section_order: section.order,
            interactive_elements: section.interactive_elements
          })

        if (error) {
          console.warn(`⚠️  Could not import content section:`, error.message)
        }
      } catch (error) {
        console.warn(`⚠️  Error importing content section:`, error)
      }
    }
  }

  private printReport(report: any): void {
    console.log('\n📊 Import Report:')
    console.log('=================')
    console.log(`Total Pages: ${report.total}`)
    console.log(`Successfully Imported: ${this.importedCount}`)
    console.log(`Failed: ${this.failedCount}`)
    console.log(`By Type:`, report.byType)
    console.log(`By Category:`, report.byCategory)
    console.log(`Average Readability: ${report.readabilityStats.average}/100`)
    console.log(`Average Reading Time: ${report.readingTimeStats.average} minutes`)

    if (this.errors.length > 0) {
      console.log('\n❌ Errors:')
      this.errors.forEach(error => console.log(`   - ${error}`))
    }

    console.log('\n✅ Content import completed!')
  }

  async clearExistingContent(): Promise<void> {
    console.log('🗑️  Clearing existing content...')

    // Delete in order to handle foreign key constraints
    const tablesToClear = [
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
      'articles'
    ]

    for (const table of tablesToClear) {
      const { error } = await supabase
        .from(table)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all rows

      if (error) {
        console.warn(`⚠️  Could not clear table ${table}:`, error.message)
      } else {
        console.log(`✅ Cleared table: ${table}`)
      }
    }
  }
}

// Main execution
async function main() {
  const pagesDirectory = path.join(process.cwd(), 'pages')
  const importer = new ContentImporter(pagesDirectory)
  
  const command = process.argv[2]
  
  if (command === 'clear') {
    await importer.clearExistingContent()
    console.log('✅ Content cleared')
  } else {
    const result = await importer.importAllContent()
    process.exit(result.success ? 0 : 1)
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error)
}

export { ContentImporter }





