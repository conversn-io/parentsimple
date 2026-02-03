#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import slugify from 'slugify';

interface ContentAnalysis {
  file: string;
  title: string;
  description: string;
  content_type: 'guide' | 'calculator' | 'tool' | 'checklist';
  word_count: number;
  read_time_minutes: number;
  has_interactive_elements: boolean;
  has_charts: boolean;
  has_forms: boolean;
  topics: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_priority: number;
}

function analyzeHTMLFile(filePath: string): ContentAnalysis {
  const html = fs.readFileSync(filePath, 'utf-8');
  const dom = new JSDOM(html);
  const document = dom.window.document;

  // Extract title
  const titleElement = document.querySelector('title');
  const title = titleElement?.textContent?.trim() || 'Untitled';

  // Extract description
  const metaDescription = document.querySelector('meta[name="description"]');
  const description = metaDescription?.getAttribute('content')?.trim() || '';

  // Extract main content
  const mainContent = document.querySelector('main') || document.body;
  const textContent = mainContent?.textContent || '';
  const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;
  const readTimeMinutes = Math.ceil(wordCount / 200); // 200 words per minute

  // Detect content type based on file name and content
  let contentType: 'guide' | 'calculator' | 'tool' | 'checklist' = 'guide';
  const fileName = path.basename(filePath, '.html').toLowerCase();
  
  if (fileName.includes('calculator')) {
    contentType = 'calculator';
  } else if (fileName.includes('tool') || fileName.includes('planner')) {
    contentType = 'tool';
  } else if (fileName.includes('checklist')) {
    contentType = 'checklist';
  }

  // Detect interactive elements
  const hasInteractiveElements = !!(
    document.querySelector('form') ||
    document.querySelector('input') ||
    document.querySelector('button') ||
    document.querySelector('select')
  );

  const hasCharts = !!(
    document.querySelector('canvas') ||
    document.querySelector('[class*="chart"]') ||
    html.includes('Chart.js') ||
    html.includes('chart')
  );

  const hasForms = !!(
    document.querySelector('form') ||
    document.querySelector('input[type="text"]') ||
    document.querySelector('input[type="number"]')
  );

  // Extract topics from content
  const topics: string[] = [];
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach(heading => {
    const text = heading.textContent?.trim();
    if (text && text.length > 3 && text.length < 50) {
      topics.push(text);
    }
  });

  // Determine difficulty based on content length and complexity
  let difficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
  if (wordCount > 3000 || topics.length > 10) {
    difficulty = 'advanced';
  } else if (wordCount > 1500 || topics.length > 5) {
    difficulty = 'intermediate';
  }

  // Calculate priority based on content type and interactivity
  let estimatedPriority = 5; // Default medium priority
  if (contentType === 'calculator' && hasInteractiveElements) {
    estimatedPriority = 8; // High priority for interactive calculators
  } else if (contentType === 'tool' && hasForms) {
    estimatedPriority = 7; // High priority for interactive tools
  } else if (contentType === 'checklist') {
    estimatedPriority = 6; // Medium-high priority for checklists
  } else if (wordCount > 2000) {
    estimatedPriority = 6; // Medium-high priority for comprehensive guides
  }

  return {
    file: path.basename(filePath),
    title,
    description,
    content_type: contentType,
    word_count: wordCount,
    read_time_minutes: readTimeMinutes,
    has_interactive_elements: hasInteractiveElements,
    has_charts: hasCharts,
    has_forms: hasForms,
    topics: topics.slice(0, 10), // Limit to first 10 topics
    difficulty,
    estimated_priority: estimatedPriority
  };
}

function main() {
  const pagesDir = path.join(process.cwd(), 'pages');
  
  if (!fs.existsSync(pagesDir)) {
    console.error('❌ Pages directory not found');
    process.exit(1);
  }

  const htmlFiles = fs.readdirSync(pagesDir)
    .filter(file => file.endsWith('.html'))
    .map(file => path.join(pagesDir, file));

  console.log(`📁 Found ${htmlFiles.length} HTML files to analyze\n`);

  const analyses: ContentAnalysis[] = [];
  const contentTypeCounts = {
    guide: 0,
    calculator: 0,
    tool: 0,
    checklist: 0
  };

  for (const filePath of htmlFiles) {
    try {
      const analysis = analyzeHTMLFile(filePath);
      analyses.push(analysis);
      contentTypeCounts[analysis.content_type]++;
      
      console.log(`✅ ${analysis.file}`);
      console.log(`   Title: ${analysis.title}`);
      console.log(`   Type: ${analysis.content_type}`);
      console.log(`   Words: ${analysis.word_count} (${analysis.read_time_minutes} min read)`);
      console.log(`   Interactive: ${analysis.has_interactive_elements ? 'Yes' : 'No'}`);
      console.log(`   Charts: ${analysis.has_charts ? 'Yes' : 'No'}`);
      console.log(`   Forms: ${analysis.has_forms ? 'Yes' : 'No'}`);
      console.log(`   Priority: ${analysis.estimated_priority}/10`);
      console.log(`   Topics: ${analysis.topics.slice(0, 3).join(', ')}${analysis.topics.length > 3 ? '...' : ''}`);
      console.log('');
    } catch (error) {
      console.error(`❌ Error analyzing ${filePath}:`, error);
    }
  }

  // Summary
  console.log('📊 CONTENT ANALYSIS SUMMARY');
  console.log('==========================');
  console.log(`Total files analyzed: ${analyses.length}`);
  console.log(`Guides: ${contentTypeCounts.guide}`);
  console.log(`Calculators: ${contentTypeCounts.calculator}`);
  console.log(`Tools: ${contentTypeCounts.tool}`);
  console.log(`Checklists: ${contentTypeCounts.checklist}`);
  console.log('');

  // Priority recommendations
  const highPriority = analyses.filter(a => a.estimated_priority >= 7);
  const mediumPriority = analyses.filter(a => a.estimated_priority >= 5 && a.estimated_priority < 7);
  const lowPriority = analyses.filter(a => a.estimated_priority < 5);

  console.log('🎯 MIGRATION PRIORITY RECOMMENDATIONS');
  console.log('=====================================');
  console.log(`High Priority (${highPriority.length} files):`);
  highPriority.forEach(a => console.log(`  • ${a.file} (${a.content_type})`));
  console.log('');
  console.log(`Medium Priority (${mediumPriority.length} files):`);
  mediumPriority.forEach(a => console.log(`  • ${a.file} (${a.content_type})`));
  console.log('');
  console.log(`Low Priority (${lowPriority.length} files):`);
  lowPriority.forEach(a => console.log(`  • ${a.file} (${a.content_type})`));

  // Save analysis to JSON file
  const outputPath = path.join(process.cwd(), 'content-analysis.json');
  fs.writeFileSync(outputPath, JSON.stringify(analyses, null, 2));
  console.log(`\n💾 Analysis saved to: ${outputPath}`);
}

if (require.main === module) {
  main();
}
