import Script from 'next/script'

interface StructuredDataProps {
  type: 'Organization' | 'WebSite' | 'BreadcrumbList' | 'FAQPage' | 'Article' | 'HowTo' | 'Calculator'
  data: Record<string, any>
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data
  }

  return (
    <Script
      id={`structured-data-${type.toLowerCase()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  )
}

// Predefined structured data templates
export const organizationStructuredData = {
  name: "SeniorSimple",
  description: "Free retirement planning help for seniors. Expert guidance on annuities, taxes, estate planning, reverse mortgages, and more.",
  url: "https://seniorsimple.org",
  logo: "https://seniorsimple.org/images/logo.png",
  sameAs: [
    "https://twitter.com/SeniorSimple",
    "https://facebook.com/SeniorSimple",
    "https://linkedin.com/company/SeniorSimple"
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-800-555-2040",
    contactType: "customer service",
    availableLanguage: "English"
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "US"
  }
}

export const websiteStructuredData = {
  name: "SeniorSimple",
  description: "Free retirement planning help for seniors. Expert guidance on annuities, taxes, estate planning, reverse mortgages, and more.",
  url: "https://seniorsimple.org",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://seniorsimple.org/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}

export const breadcrumbStructuredData = (items: Array<{name: string, url: string}>) => ({
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url
  }))
})

export const faqStructuredData = (faqs: Array<{question: string, answer: string}>) => ({
  mainEntity: faqs.map(faq => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer
    }
  }))
})

export const articleStructuredData = (article: {
  title: string
  description: string
  url: string
  datePublished: string
  dateModified: string
  author: string
  image?: string
}) => ({
  headline: article.title,
  description: article.description,
  url: article.url,
  datePublished: article.datePublished,
  dateModified: article.dateModified,
  author: {
    "@type": "Organization",
    name: article.author
  },
  publisher: {
    "@type": "Organization",
    name: "SeniorSimple",
    logo: {
      "@type": "ImageObject",
      url: "https://seniorsimple.org/images/logo.png"
    }
  },
  ...(article.image && {
    image: {
      "@type": "ImageObject",
      url: article.image
    }
  })
})

export const howToStructuredData = (howTo: {
  name: string
  description: string
  steps: Array<{name: string, text: string}>
}) => ({
  name: howTo.name,
  description: howTo.description,
  step: howTo.steps.map((step, index) => ({
    "@type": "HowToStep",
    position: index + 1,
    name: step.name,
    text: step.text
  }))
})

export const calculatorStructuredData = (calculator: {
  name: string
  description: string
  url: string
  category: string
}) => ({
  name: calculator.name,
  description: calculator.description,
  url: calculator.url,
  category: calculator.category,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web Browser"
})





