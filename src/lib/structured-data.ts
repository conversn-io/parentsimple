// Structured Data (JSON-LD) templates for SEO and AI search optimization

export interface StructuredDataConfig {
  type: 'Article' | 'HowTo' | 'Calculator' | 'Tool' | 'Checklist' | 'FAQPage' | 'Organization' | 'WebSite' | 'BreadcrumbList'
  data: Record<string, any>
}

// Article structured data for guides
export function generateArticleStructuredData(article: {
  title: string
  description: string
  content: string
  author: string
  publishedDate: string
  modifiedDate: string
  image?: string
  url: string
}): StructuredDataConfig {
  return {
    type: 'Article',
    data: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "description": article.description,
      "image": article.image || "https://seniorsimple.org/images/default-article.jpg",
      "author": {
        "@type": "Person",
        "name": article.author
      },
      "publisher": {
        "@type": "Organization",
        "name": "SeniorSimple",
        "logo": {
          "@type": "ImageObject",
          "url": "https://seniorsimple.org/logo.png"
        }
      },
      "datePublished": article.publishedDate,
      "dateModified": article.modifiedDate,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": article.url
      },
      "articleSection": "Retirement Planning",
      "keywords": generateKeywordsFromContent(article.content),
      "inLanguage": "en-US",
      "isAccessibleForFree": true,
      "audience": {
        "@type": "Audience",
        "audienceType": "Seniors and Baby Boomers"
      }
    }
  }
}

// HowTo structured data for step-by-step guides
export function generateHowToStructuredData(guide: {
  title: string
  description: string
  steps: Array<{
    name: string
    text: string
    image?: string
    url?: string
  }>
  totalTime?: string
  estimatedCost?: string
  url: string
}): StructuredDataConfig {
  return {
    type: 'HowTo',
    data: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": guide.title,
      "description": guide.description,
      "image": "https://seniorsimple.org/images/howto-default.jpg",
      "totalTime": guide.totalTime || "PT30M",
      "estimatedCost": guide.estimatedCost || "Free",
      "supply": [],
      "tool": [],
      "step": guide.steps.map((step, index) => ({
        "@type": "HowToStep",
        "position": index + 1,
        "name": step.name,
        "text": step.text,
        "image": step.image,
        "url": step.url
      })),
      "url": guide.url
    }
  }
}

// Calculator structured data
export function generateCalculatorStructuredData(calculator: {
  title: string
  description: string
  inputs: Array<{
    name: string
    description: string
    type: string
  }>
  outputs: Array<{
    name: string
    description: string
    type: string
  }>
  url: string
}): StructuredDataConfig {
  return {
    type: 'Calculator',
    data: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": calculator.title,
      "description": calculator.description,
      "url": calculator.url,
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        ...calculator.inputs.map(input => `Input: ${input.name} - ${input.description}`),
        ...calculator.outputs.map(output => `Output: ${output.name} - ${output.description}`)
      ],
      "audience": {
        "@type": "Audience",
        "audienceType": "Seniors and Baby Boomers"
      }
    }
  }
}

// Tool structured data
export function generateToolStructuredData(tool: {
  title: string
  description: string
  toolType: string
  features: string[]
  url: string
}): StructuredDataConfig {
  return {
    type: 'Tool',
    data: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": tool.title,
      "description": tool.description,
      "url": tool.url,
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": tool.features,
      "audience": {
        "@type": "Audience",
        "audienceType": "Seniors and Baby Boomers"
      }
    }
  }
}

// Checklist structured data
export function generateChecklistStructuredData(checklist: {
  title: string
  description: string
  items: Array<{
    name: string
    description: string
    category: string
  }>
  url: string
}): StructuredDataConfig {
  return {
    type: 'Checklist',
    data: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": checklist.title,
      "description": checklist.description,
      "url": checklist.url,
      "numberOfItems": checklist.items.length,
      "itemListElement": checklist.items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "description": item.description,
        "additionalProperty": {
          "@type": "PropertyValue",
          "name": "category",
          "value": item.category
        }
      }))
    }
  }
}

// FAQ structured data
export function generateFAQStructuredData(faq: {
  title: string
  questions: Array<{
    question: string
    answer: string
  }>
  url: string
}): StructuredDataConfig {
  return {
    type: 'FAQPage',
    data: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faq.questions.map(qa => ({
        "@type": "Question",
        "name": qa.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": qa.answer
        }
      }))
    }
  }
}

// Organization structured data
export function generateOrganizationStructuredData(): StructuredDataConfig {
  return {
    type: 'Organization',
    data: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "SeniorSimple",
      "description": "Your trusted partner in retirement planning and financial security for seniors and baby boomers.",
      "url": "https://seniorsimple.org",
      "logo": "https://seniorsimple.org/logo.png",
      "sameAs": [
        "https://facebook.com/seniorsimple",
        "https://twitter.com/seniorsimple",
        "https://linkedin.com/company/seniorsimple"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-800-555-2040",
        "contactType": "customer service",
        "availableLanguage": "English"
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "US"
      },
      "foundingDate": "2024",
      "knowsAbout": [
        "Retirement Planning",
        "Medicare",
        "Estate Planning",
        "Annuities",
        "Reverse Mortgages",
        "Long-term Care Planning"
      ]
    }
  }
}

// Website structured data
export function generateWebsiteStructuredData(): StructuredDataConfig {
  return {
    type: 'WebSite',
    data: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "SeniorSimple",
      "description": "Comprehensive retirement planning resources, calculators, and guides for seniors and baby boomers.",
      "url": "https://seniorsimple.org",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://seniorsimple.org/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      },
      "publisher": {
        "@type": "Organization",
        "name": "SeniorSimple"
      }
    }
  }
}

// Breadcrumb structured data
export function generateBreadcrumbStructuredData(breadcrumbs: Array<{
  name: string
  url: string
}>): StructuredDataConfig {
  return {
    type: 'BreadcrumbList',
    data: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url
      }))
    }
  }
}

// Helper function to generate keywords from content
function generateKeywordsFromContent(content: string): string[] {
  const words = content.toLowerCase().match(/\b\w{4,}\b/g) || []
  const wordFreq: Record<string, number> = {}
  
  words.forEach(word => {
    if (!['this', 'that', 'with', 'from', 'they', 'been', 'have', 'were', 'said', 'each', 'which', 'their', 'time', 'will', 'about', 'there', 'could', 'other', 'after', 'first', 'well', 'also', 'where', 'much', 'some', 'very', 'when', 'come', 'here', 'just', 'like', 'long', 'make', 'many', 'over', 'such', 'take', 'than', 'them', 'these', 'think', 'want'].includes(word)) {
      wordFreq[word] = (wordFreq[word] || 0) + 1
    }
  })
  
  return Object.entries(wordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word)
}

// Function to render structured data as JSON-LD script tag
export function renderStructuredData(config: StructuredDataConfig): string {
  return `<script type="application/ld+json">
${JSON.stringify(config.data, null, 2)}
</script>`
}

// Function to generate all structured data for a page
export function generatePageStructuredData(pageType: string, data: any): StructuredDataConfig[] {
  const structuredData: StructuredDataConfig[] = []
  
  // Always include organization and website data
  structuredData.push(generateOrganizationStructuredData())
  structuredData.push(generateWebsiteStructuredData())
  
  // Add page-specific structured data
  switch (pageType) {
    case 'article':
      structuredData.push(generateArticleStructuredData(data))
      break
    case 'guide':
      structuredData.push(generateHowToStructuredData(data))
      break
    case 'calculator':
      structuredData.push(generateCalculatorStructuredData(data))
      break
    case 'tool':
      structuredData.push(generateToolStructuredData(data))
      break
    case 'checklist':
      structuredData.push(generateChecklistStructuredData(data))
      break
    case 'faq':
      structuredData.push(generateFAQStructuredData(data))
      break
  }
  
  // Add breadcrumbs if provided
  if (data.breadcrumbs) {
    structuredData.push(generateBreadcrumbStructuredData(data.breadcrumbs))
  }
  
  return structuredData
}
