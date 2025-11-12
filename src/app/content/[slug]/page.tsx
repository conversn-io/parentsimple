import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import EnhancedArticleDisplay from '@/components/content/EnhancedArticleDisplay';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import InteractiveTool from '@/components/tools/InteractiveTool';
import InteractiveChecklist from '@/components/checklists/InteractiveChecklist';
import ContentSearch from '@/components/search/ContentSearch';
import { processMarkdownToHTML, extractTableOfContents, calculateReadingTime } from '@/lib/markdown';
import { Metadata } from 'next';

// Import specific calculator components
import SocialSecurityCalculator from '@/components/calculators/SocialSecurityCalculator';
import MedicareCostCalculator from '@/components/calculators/MedicareCostCalculator';
import TaxImpactCalculator from '@/components/calculators/TaxImpactCalculator';
import RMDCalculator from '@/components/calculators/RMDCalculator';
import RothConversionCalculator from '@/components/calculators/RothConversionCalculator';
import HealthcareCostCalculator from '@/components/calculators/HealthcareCostCalculator';

// Import comprehensive strategy guides
import SocialSecurityStrategyGuide from '@/components/content/SocialSecurityStrategyGuide';
import MedicarePlanningStrategyGuide from '@/components/content/MedicarePlanningStrategyGuide';
import TaxPlanningStrategyGuide from '@/components/content/TaxPlanningStrategyGuide';
import RMDPlanningStrategyGuide from '@/components/content/RMDPlanningStrategyGuide';
import RothConversionStrategyGuide from '@/components/content/RothConversionStrategyGuide';
import HealthcareCostPlanningStrategyGuide from '@/components/content/HealthcareCostPlanningStrategyGuide';
import LongTermCarePlanningStrategyGuide from '@/components/content/LongTermCarePlanningStrategyGuide';
import LongTermCareStrategyGuide from '@/components/content/LongTermCareStrategyGuide';
import DisabilityInsuranceStrategyGuide from '@/components/content/DisabilityInsuranceStrategyGuide';
import LifeInsuranceStrategyGuide from '@/components/content/LifeInsuranceStrategyGuide';
import ReverseMortgageStrategyGuide from '@/components/content/ReverseMortgageStrategyGuide';
import HomeEquityStrategyGuide from '@/components/content/HomeEquityStrategyGuide';
import DownsizingStrategyGuide from '@/components/content/DownsizingStrategyGuide';
import HSAStrategyGuide from '@/components/content/HSAStrategyGuide';
import TaxEfficientWithdrawalsStrategyGuide from '@/components/content/TaxEfficientWithdrawalsStrategyGuide';
import BeneficiaryPlanningStrategyGuide from '@/components/content/BeneficiaryPlanningStrategyGuide';
import WithdrawalPlannerStrategyGuide from '@/components/content/WithdrawalPlannerStrategyGuide';
import HomeModificationPlannerStrategyGuide from '@/components/content/HomeModificationPlannerStrategyGuide';
import TaxImpactStrategyGuide from '@/components/content/TaxImpactStrategyGuide';
import HealthcareCostStrategyGuide from '@/components/content/HealthcareCostStrategyGuide';
import MedicareCostStrategyGuide from '@/components/content/MedicareCostStrategyGuide';

interface ContentPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ContentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: content } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!content) {
    return {}; // Or return a default metadata for 404
  }

  // Use seo-utils to generate comprehensive metadata
  // Assuming generateContentMetadata is available and correctly implemented
  // import { generateContentMetadata } from '@/lib/seo-utils';
  // return generateContentMetadata(content);

  // Placeholder for now, will integrate seo-utils later
  return {
    title: content.meta_title || content.title,
    description: content.meta_description || content.excerpt,
    keywords: content.meta_keywords?.join(', ') || content.ai_tags?.join(', '),
    openGraph: {
      title: content.og_title || content.meta_title || content.title,
      description: content.og_description || content.meta_description || content.excerpt,
      images: content.og_image ? [{ url: content.og_image }] : [],
      type: 'article',
      url: `https://seniorsimple.org/content/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: content.twitter_title || content.meta_title || content.title,
      description: content.twitter_description || content.meta_description || content.excerpt,
      images: content.twitter_image ? [content.twitter_image] : [],
    },
    alternates: {
      canonical: content.canonical_url || `https://seniorsimple.org/content/${slug}`,
    },
  };
}

// Dynamic route - no generateStaticParams needed

export default async function ContentPage({ params }: ContentPageProps) {
  const { slug } = await params;

  const { data: content, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !content) {
    console.error('Error fetching content:', error?.message);
    notFound();
  }

  // Generate structured data for SEO/AEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": content.title,
    "description": content.excerpt || content.meta_description,
    "image": content.featured_image_url ? [content.featured_image_url] : [],
    "datePublished": content.created_at,
    "dateModified": content.updated_at,
    "author": {
      "@type": "Organization",
      "name": "SeniorSimple"
    },
    "publisher": {
      "@type": "Organization",
      "name": "SeniorSimple",
      "logo": {
        "@type": "ImageObject",
        "url": "https://seniorsimple.org/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://seniorsimple.org/content/${slug}`
    }
  }

  // Check for comprehensive strategy guides
  const strategyGuideSlugs = {
    'social-security-optimization-strategy-guide': SocialSecurityStrategyGuide,
    'medicare-planning-guide': MedicarePlanningStrategyGuide,
    'tax-planning-guide': TaxPlanningStrategyGuide,
    'rmd-planning-guide': RMDPlanningStrategyGuide,
    'roth-conversion-guide': RothConversionStrategyGuide,
    'roth-conversion-strategy-guide': RothConversionStrategyGuide,
    'healthcare-cost-planning-guide': HealthcareCostPlanningStrategyGuide,
    'long-term-care-planning-guide': LongTermCarePlanningStrategyGuide,
    'long-term-care-planning-strategy-guide': LongTermCareStrategyGuide,
    'disability-insurance-guide': DisabilityInsuranceStrategyGuide,
    'disability-insurance-strategy-guide': DisabilityInsuranceStrategyGuide,
    'life-insurance-strategy-guide': LifeInsuranceStrategyGuide,
    'reverse-mortgage-strategy-guide': ReverseMortgageStrategyGuide,
    'home-equity-strategy-guide': HomeEquityStrategyGuide,
    'downsizing-strategy-guide': DownsizingStrategyGuide,
  'hsa-strategy-guide': HSAStrategyGuide,
  'tax-efficient-withdrawals-strategy-guide': TaxEfficientWithdrawalsStrategyGuide,
  'beneficiary-planning-strategy-guide': BeneficiaryPlanningStrategyGuide,
  'withdrawal-planner-strategy-guide': WithdrawalPlannerStrategyGuide,
  'home-modification-planner-strategy-guide': HomeModificationPlannerStrategyGuide,
  'tax-impact-strategy-guide': TaxImpactStrategyGuide,
  'healthcare-cost-strategy-guide': HealthcareCostStrategyGuide,
  'medicare-cost-strategy-guide': MedicareCostStrategyGuide,
};

  // If this is a strategy guide, process markdown and render the comprehensive component
  if (strategyGuideSlugs[slug as keyof typeof strategyGuideSlugs]) {
    // Prefer html_body if available, otherwise process markdown
    const processedContent = content.html_body || await processMarkdownToHTML(content.content);
    const tableOfContents = extractTableOfContents(content.content);
    const readingTime = calculateReadingTime(content.content);

    // Create enhanced article object with processed content
    const enhancedArticle = {
      ...content,
      content: processedContent,
      table_of_contents: tableOfContents,
      reading_time: readingTime
    };

    const StrategyGuideComponent = strategyGuideSlugs[slug as keyof typeof strategyGuideSlugs];
    return <StrategyGuideComponent article={enhancedArticle} />;
  }

  // Check for calculator pages by slug pattern
  const calculatorSlugs = {
    'social-security-optimization-calculator': SocialSecurityCalculator,
    'medicare-cost-calculator': MedicareCostCalculator,
    'tax-impact-calculator': TaxImpactCalculator,
    'rmd-calculator': RMDCalculator,
    'roth-conversion-calculator': RothConversionCalculator,
    'healthcare-cost-calculator': HealthcareCostCalculator,
  };

  // If this is a calculator page, render the specific calculator component
  if (calculatorSlugs[slug as keyof typeof calculatorSlugs]) {
    const CalculatorComponent = calculatorSlugs[slug as keyof typeof calculatorSlugs];
    return <CalculatorComponent />;
  }

  // Prefer html_body if available, otherwise process markdown on the server side
  const processedContent = content.html_body || await processMarkdownToHTML(content.content);
  const tableOfContents = extractTableOfContents(content.content);
  const readingTime = calculateReadingTime(content.content);

  // Create enhanced article object with processed content
  const enhancedArticle = {
    ...content,
    content: processedContent,
    table_of_contents: tableOfContents,
    reading_time: readingTime
  };

  // Render different components based on content_type
  switch (content.content_type) {
    case 'calculator':
      if (!content.calculator_config) {
        console.error('Calculator content missing config:', slug);
        notFound();
      }
      return (
        <CalculatorWrapper
          config={content.calculator_config}
          title={content.title}
          description={content.excerpt}
        />
      );
    case 'tool':
      if (!content.tool_config) {
        console.error('Tool content missing config:', slug);
        notFound();
      }
      return (
        <InteractiveTool
          config={content.tool_config}
          title={content.title}
          description={content.excerpt}
        />
      );
    case 'checklist':
      if (!content.checklist_config) {
        console.error('Checklist content missing config:', slug);
        notFound();
      }
      return (
        <InteractiveChecklist
          config={content.checklist_config}
          title={content.title}
          description={content.excerpt}
        />
      );
            case 'guide':
            case 'comparison':
            default:
              return (
                <>
                  {/* Structured Data for SEO/AEO */}
                  <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                  />
                  <EnhancedArticleDisplay article={enhancedArticle} />
                </>
              );
  }
}
