// SEO optimization templates for 7th-grade readability and AI search optimization

export interface SEOOptimizedContent {
  title: string
  metaDescription: string
  metaKeywords: string[]
  headings: {
    h1: string
    h2: string[]
    h3: string[]
  }
  content: string
  semanticKeywords: string[]
  readabilityScore: number
  readingTime: number
}

// 7th-grade readability word replacements
const SIMPLIFICATION_MAP: Record<string, string> = {
  // Complex to simple
  'utilize': 'use',
  'implement': 'put in place',
  'facilitate': 'help',
  'comprehensive': 'complete',
  'sophisticated': 'advanced',
  'substantial': 'large',
  'significant': 'important',
  'approximately': 'about',
  'consequently': 'so',
  'furthermore': 'also',
  'moreover': 'also',
  'nevertheless': 'but',
  'subsequently': 'then',
  'therefore': 'so',
  'thus': 'so',
  'whereas': 'while',
  'accomplish': 'do',
  'acquire': 'get',
  'ascertain': 'find out',
  'commence': 'start',
  'conclude': 'end',
  'demonstrate': 'show',
  'establish': 'set up',
  'evaluate': 'check',
  'examine': 'look at',
  'indicate': 'show',
  'maintain': 'keep',
  'obtain': 'get',
  'participate': 'take part',
  'prioritize': 'put first',
  'recognize': 'know',
  'recommend': 'suggest',
  'represent': 'stand for',
  'require': 'need',
  'reside': 'live',
  'retain': 'keep',
  'select': 'choose',
  'terminate': 'end',
  'transmit': 'send',
  'verify': 'check',
  
  // Financial terms to simple explanations
  'annuity': 'retirement income plan',
  'beneficiary': 'person who gets your money',
  'deductible': 'amount you pay first',
  'dividend': 'money from investments',
  'equity': 'home value minus debt',
  'fiduciary': 'person who must help you',
  'liquidity': 'how easy it is to get cash',
  'portfolio': 'your investments',
  'premium': 'insurance payment',
  'principal': 'original amount',
  'yield': 'money earned',
  
  // Medical terms
  'copayment': 'small payment you make',
  'medigap': 'extra Medicare insurance',
  'out-of-pocket': 'money you pay yourself',
  
  // Legal terms
  'testament': 'will',
  'executor': 'person who handles your will',
  'probate': 'court process after death',
  'trust': 'legal way to hold property',
  'power of attorney': 'legal permission to act for someone'
}

// Function to simplify text for 7th-grade readability
export function simplifyText(text: string): string {
  let simplified = text
  
  // Replace complex words with simple ones
  Object.entries(SIMPLIFICATION_MAP).forEach(([complex, simple]) => {
    const regex = new RegExp(`\\b${complex}\\b`, 'gi')
    simplified = simplified.replace(regex, simple)
  })
  
  // Break up long sentences (over 20 words)
  simplified = simplified.replace(/([^.!?]*[.!?])/g, (sentence) => {
    const words = sentence.trim().split(/\s+/)
    if (words.length > 20) {
      // Find a good place to break (after a comma or conjunction)
      const breakPoint = Math.floor(words.length / 2)
      for (let i = breakPoint; i < words.length; i++) {
        if (words[i].match(/[,;]/) || ['and', 'but', 'or', 'so'].includes(words[i].toLowerCase())) {
          const firstPart = words.slice(0, i + 1).join(' ')
          const secondPart = words.slice(i + 1).join(' ')
          return `${firstPart} ${secondPart}`
        }
      }
    }
    return sentence
  })
  
  return simplified
}

// Function to generate SEO-optimized title
export function generateSEOTitle(originalTitle: string, maxLength: number = 60): string {
  let title = originalTitle
  
  // Simplify the title
  title = simplifyText(title)
  
  // Remove extra words and ensure it's under 60 characters
  const words = title.split(' ')
  let optimizedTitle = ''
  
  for (const word of words) {
    const testTitle = optimizedTitle ? `${optimizedTitle} ${word}` : word
    if (testTitle.length <= maxLength) {
      optimizedTitle = testTitle
    } else {
      break
    }
  }
  
  // Add brand if there's room
  const brand = ' | SeniorSimple'
  if (optimizedTitle.length + brand.length <= maxLength) {
    optimizedTitle += brand
  }
  
  return optimizedTitle
}

// Function to generate SEO-optimized meta description
export function generateSEODescription(content: string, maxLength: number = 155): string {
  // Extract the first meaningful sentence
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20)
  let description = sentences[0] || content.substring(0, maxLength)
  
  // Simplify the description
  description = simplifyText(description)
  
  // Ensure it ends with a period and is under the limit
  if (!description.endsWith('.')) {
    description += '.'
  }
  
  if (description.length > maxLength) {
    description = description.substring(0, maxLength - 3) + '...'
  }
  
  return description
}

// Function to generate semantic keywords for AI search
export function generateSemanticKeywords(content: string, primaryKeywords: string[]): string[] {
  const text = content.toLowerCase()
  const words = text.match(/\b\w{4,}\b/g) || []
  const wordFreq: Record<string, number> = {}
  
  // Count word frequency
  words.forEach(word => {
    if (!isStopWord(word)) {
      wordFreq[word] = (wordFreq[word] || 0) + 1
    }
  })
  
  // Get top semantic keywords
  const semanticKeywords = Object.entries(wordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 15)
    .map(([word]) => word)
  
  // Combine with primary keywords and remove duplicates
  return [...new Set([...primaryKeywords, ...semanticKeywords])]
}

// Function to check if a word is a stop word
function isStopWord(word: string): boolean {
  const stopWords = [
    'this', 'that', 'with', 'from', 'they', 'been', 'have', 'were', 'said', 'each',
    'which', 'their', 'time', 'will', 'about', 'there', 'could', 'other', 'after',
    'first', 'well', 'also', 'where', 'much', 'some', 'very', 'when', 'come', 'here',
    'just', 'like', 'long', 'make', 'many', 'over', 'such', 'take', 'than', 'them',
    'these', 'think', 'want', 'good', 'great', 'little', 'new', 'now', 'old', 'see',
    'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'
  ]
  return stopWords.includes(word)
}

// Function to calculate Flesch Reading Ease score
export function calculateReadabilityScore(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length
  const words = text.split(/\s+/).filter(w => w.length > 0).length
  const syllables = estimateSyllables(text)
  
  if (sentences === 0 || words === 0) return 0
  
  const score = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words))
  return Math.max(0, Math.min(100, Math.round(score)))
}

// Function to estimate syllables in text
function estimateSyllables(text: string): number {
  const words = text.toLowerCase().match(/\b\w+\b/g) || []
  let totalSyllables = 0
  
  words.forEach(word => {
    totalSyllables += estimateWordSyllables(word)
  })
  
  return totalSyllables
}

// Function to estimate syllables in a word
function estimateWordSyllables(word: string): number {
  if (word.length <= 3) return 1
  
  const vowels = 'aeiouy'
  let syllables = 0
  let previousWasVowel = false
  
  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i])
    if (isVowel && !previousWasVowel) {
      syllables++
    }
    previousWasVowel = isVowel
  }
  
  // Handle silent 'e'
  if (word.endsWith('e')) {
    syllables--
  }
  
  // Every word has at least one syllable
  return Math.max(1, syllables)
}

// Function to calculate reading time
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200 // Average reading speed for adults
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length
  return Math.ceil(wordCount / wordsPerMinute)
}

// Function to optimize headings for SEO
export function optimizeHeadings(headings: string[]): string[] {
  return headings.map(heading => {
    let optimized = heading
    
    // Simplify the heading
    optimized = simplifyText(optimized)
    
    // Ensure it's not too long (under 60 characters)
    if (optimized.length > 60) {
      const words = optimized.split(' ')
      optimized = words.slice(0, 8).join(' ') // Limit to 8 words
    }
    
    return optimized
  })
}

// Function to create FAQ sections for better SEO
export function generateFAQSection(content: string, topic: string): Array<{question: string, answer: string}> {
  const faqs: Array<{question: string, answer: string}> = []
  
  // Common FAQ patterns for retirement topics
  const commonFAQs: Record<string, Array<{question: string, answer: string}>> = {
    'retirement': [
      {
        question: "How much money do I need to retire?",
        answer: "Most experts suggest you need 70-80% of your pre-retirement income. Use our retirement calculator to find your specific number."
      },
      {
        question: "When should I start planning for retirement?",
        answer: "The best time to start is now, no matter your age. Even small amounts saved early can grow significantly over time."
      },
      {
        question: "What is the 4% rule for retirement?",
        answer: "The 4% rule suggests you can safely withdraw 4% of your retirement savings each year without running out of money."
      }
    ],
    'medicare': [
      {
        question: "When can I enroll in Medicare?",
        answer: "You can enroll in Medicare starting 3 months before your 65th birthday. The enrollment period lasts 7 months total."
      },
      {
        question: "What's the difference between Medicare Parts A, B, C, and D?",
        answer: "Part A covers hospital stays, Part B covers doctor visits, Part C is Medicare Advantage, and Part D covers prescription drugs."
      },
      {
        question: "Do I need Medigap insurance?",
        answer: "Medigap helps cover costs that Medicare doesn't pay. It's optional but can save you money on out-of-pocket costs."
      }
    ],
    'estate': [
      {
        question: "Do I need a will?",
        answer: "Yes, everyone should have a will. It ensures your assets go to the people you choose and can save your family time and money."
      },
      {
        question: "What's the difference between a will and a trust?",
        answer: "A will takes effect after you die and goes through probate. A trust can take effect immediately and avoids probate."
      },
      {
        question: "How often should I update my estate plan?",
        answer: "Review your estate plan every 3-5 years or after major life events like marriage, divorce, or the birth of grandchildren."
      }
    ]
  }
  
  // Add topic-specific FAQs
  if (commonFAQs[topic.toLowerCase()]) {
    faqs.push(...commonFAQs[topic.toLowerCase()])
  }
  
  return faqs
}

// Function to create topic clusters for internal linking
export function generateTopicClusters(): Record<string, string[]> {
  return {
    'retirement-planning': [
      'retirement-income-calculator',
      'complete-retirement-guide',
      'ira-withdrawal-strategies',
      'retirement-tax-strategy'
    ],
    'medicare': [
      'medicare-made-simple',
      'medicare-cost-calculator',
      'medicare-enrollment-guide',
      'medigap-guide'
    ],
    'estate-planning': [
      'estate-planning-essentials',
      'estate-planning-checklist',
      'will-trust-planning',
      'beneficiary-planning-tool'
    ],
    'insurance': [
      'life-insurance-calculator',
      'long-term-care-calculator',
      'disability-insurance-calculator',
      'life-insurance-retirement-guide'
    ],
    'housing': [
      'downsizing-calculator',
      'reverse-mortgage-calculator',
      'home-equity-calculator',
      'aging-in-place-guide'
    ],
    'taxes': [
      'tax-impact-calculator',
      'roth-conversion-calculator',
      'rmd-calculator',
      'tax-efficient-withdrawals'
    ]
  }
}

// Function to optimize content for featured snippets
export function optimizeForFeaturedSnippets(content: string): string {
  let optimized = content
  
  // Add clear, concise answers to common questions
  const questionPatterns = [
    /what is (.+)\?/gi,
    /how does (.+) work\?/gi,
    /when should I (.+)\?/gi,
    /how much does (.+) cost\?/gi
  ]
  
  questionPatterns.forEach(pattern => {
    optimized = optimized.replace(pattern, (match, topic) => {
      return `${match}\n\n**Answer:** ${generateSimpleAnswer(topic)}`
    })
  })
  
  return optimized
}

// Function to generate simple answers for featured snippets
function generateSimpleAnswer(topic: string): string {
  const answers: Record<string, string> = {
    'retirement planning': 'Retirement planning is the process of saving and investing money to support yourself after you stop working. Start by calculating how much you need and creating a savings plan.',
    'medicare': 'Medicare is health insurance for people 65 and older. It has different parts that cover hospital stays, doctor visits, and prescription drugs.',
    'estate planning': 'Estate planning is making sure your money and property go to the right people after you die. It includes writing a will and choosing beneficiaries.',
    'annuity': 'An annuity is a contract with an insurance company that provides regular income payments, usually for retirement.',
    'reverse mortgage': 'A reverse mortgage lets you borrow money against your home\'s value while you still live there. You don\'t have to pay it back until you move or die.'
  }
  
  return answers[topic.toLowerCase()] || `This is a complex topic that requires careful consideration. Use our tools and guides to learn more.`
}
