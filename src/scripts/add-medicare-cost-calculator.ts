import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
config({ path: '.env.local' })

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Create the Medicare Cost Calculator content page
async function createMedicareCostCalculator() {
  try {
    const { data, error } = await supabase
      .from('articles')
      .insert({
        title: 'Medicare Cost Calculator',
        slug: 'medicare-cost-calculator',
        content: `# Medicare Cost Calculator

## Estimate Your Medicare Costs

Use this comprehensive calculator to estimate your Medicare costs and compare different plan options. Our tool helps you understand the financial impact of Medicare coverage and find the most cost-effective plan for your needs.

## How It Works

This calculator uses your personal information to:

- Calculate Part A, B, C, and D premiums
- Estimate Medigap supplement costs
- Factor in income-related adjustments (IRMAA)
- Compare different plan options
- Provide personalized cost estimates

## Understanding Medicare Costs

### Part A (Hospital Insurance)
- **Premium**: Usually $0 if you have enough work credits (40 quarters)
- **Deductible**: $1,632 per benefit period (2024)
- **Covers**: Inpatient hospital care, skilled nursing facility care, hospice care

### Part B (Medical Insurance)
- **Premium**: $174.70/month (2024) for most people
- **Deductible**: $240 per year (2024)
- **Covers**: Doctor visits, outpatient care, preventive services

### Part C (Medicare Advantage)
- **Premium**: Varies by plan (may be $0)
- **Additional costs**: Copays, coinsurance, deductibles
- **Covers**: All Part A and B services, often includes Part D

### Part D (Prescription Drug Coverage)
- **Premium**: Varies by plan (average $50/month)
- **Deductible**: Up to $545 per year (2024)
- **Covers**: Prescription medications

## Income-Related Monthly Adjustment Amount (IRMAA)

If your modified adjusted gross income exceeds certain thresholds, you'll pay higher premiums for Part B and Part D:

### 2024 IRMAA Thresholds
- **$103,000 or less**: Standard premiums
- **$103,001 - $129,000**: +$69.90 for Part B, +$12.90 for Part D
- **$129,001 - $161,000**: +$174.70 for Part B, +$33.30 for Part D
- **$161,001 - $193,000**: +$279.50 for Part B, +$53.80 for Part D
- **$193,001 - $500,000**: +$384.30 for Part B, +$74.20 for Part D
- **$500,001 or more**: +$419.30 for Part B, +$81.00 for Part D

## Medigap Plans

Medigap (Medicare Supplement) plans help cover out-of-pocket costs:

### Popular Plans
- **Plan G**: Most comprehensive coverage, covers Part B deductible
- **Plan N**: Lower premium, small copays for some services
- **Plan F**: Covers all deductibles and copays (not available to new enrollees)

### Plan G Benefits
- Part A coinsurance and hospital costs
- Part B coinsurance or copayment
- Blood (first 3 pints)
- Part A hospice care coinsurance or copayment
- Skilled nursing facility care coinsurance
- Part A deductible
- Part B deductible
- Part B excess charges
- Foreign travel emergency (up to plan limits)

## Plan Comparison

### Original Medicare + Medigap
**Best for:**
- Maximum flexibility in choosing doctors
- Nationwide coverage
- Predictable costs

**Considerations:**
- Higher monthly premiums
- May need separate Part D plan
- Higher out-of-pocket maximums

### Medicare Advantage
**Best for:**
- Lower monthly premiums
- Comprehensive coverage in one plan
- Additional benefits (dental, vision, hearing)

**Considerations:**
- Network restrictions
- May require referrals
- Limited to service area

### Medicare Advantage + Supplement
**Best for:**
- Comprehensive coverage
- Lower out-of-pocket costs
- Additional benefits included

**Considerations:**
- Must use plan network
- Limited provider choice
- May have higher copays

## Cost-Saving Strategies

### 1. Choose the Right Plan
- Compare Original Medicare + Medigap vs. Medicare Advantage
- Consider your healthcare needs and budget
- Factor in prescription drug costs

### 2. Manage IRMAA
- Plan retirement income to stay below IRMAA thresholds
- Consider Roth conversions to reduce future IRMAA
- Time large withdrawals carefully

### 3. Optimize Prescription Coverage
- Compare Part D plans annually
- Use generic medications when possible
- Consider mail-order pharmacies

### 4. Take Advantage of Preventive Care
- Annual wellness visits are free
- Screenings and vaccinations covered
- Early detection saves money

## Important Dates

### Initial Enrollment Period
- **7 months**: 3 months before, month of, and 3 months after 65th birthday
- **Best time to enroll**: Avoid late enrollment penalties

### Annual Enrollment Period
- **October 15 - December 7**: Change Medicare Advantage or Part D plans
- **January 1 - March 31**: Switch to Original Medicare from Medicare Advantage

### General Enrollment Period
- **January 1 - March 31**: Enroll in Part A and/or Part B
- **Coverage begins**: July 1

## Next Steps

1. Use this calculator to estimate your costs
2. Compare plans in your area
3. Consider your healthcare needs and budget
4. Enroll during your Initial Enrollment Period
5. Review your coverage annually

## Resources

- **Medicare.gov**: Official Medicare website
- **State Health Insurance Assistance Program (SHIP)**: Free counseling
- **Medicare Plan Finder**: Compare plans in your area
- **Social Security Administration**: IRMAA information

Remember: Medicare costs change annually, so review your coverage each year during the Annual Enrollment Period.`,
        excerpt: 'Estimate your Medicare costs and compare different plan options with our comprehensive calculator. Find the most cost-effective coverage for your needs.',
        content_type: 'html',
        category: 'healthcare-medicare',
        meta_title: 'Medicare Cost Calculator - Estimate Your Healthcare Costs | SeniorSimple',
        meta_description: 'Calculate your Medicare costs and compare plan options. Get personalized estimates for Part A, B, C, D premiums and find the best coverage for your budget.',
        canonical_url: 'https://seniorsimple.org/content/medicare-cost-calculator',
        og_title: 'Medicare Cost Calculator',
        og_description: 'Estimate your Medicare costs and compare different plan options with our comprehensive calculator.',
        og_image: '/images/webp/hero/couple-share-coffee-meeting-home-couch.webp',
        twitter_title: 'Medicare Cost Calculator',
        twitter_description: 'Estimate your Medicare costs and compare different plan options with our comprehensive calculator.',
        twitter_image: '/images/webp/hero/couple-share-coffee-meeting-home-couch.webp',
        status: 'published',
        readability_score: 85,
        focus_keyword: 'medicare cost calculator',
        tags: ['medicare calculator', 'medicare costs', 'medicare plans', 'healthcare costs', 'medicare premiums', 'medigap plans', 'medicare advantage', 'healthcare planning'],
        schema_type: 'Calculator',
        seo_score: 95,
        user_id: '430cd47d-1cad-4188-a8bb-6812f76fb9bc' // Existing user
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating Medicare Cost Calculator:', error)
      return { success: false, error }
    }

    console.log('✅ Medicare Cost Calculator created successfully:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error in createMedicareCostCalculator:', error)
    return { success: false, error }
  }
}

// Run the script
if (require.main === module) {
  createMedicareCostCalculator()
    .then(result => {
      if (result.success) {
        console.log('🎉 Medicare Cost Calculator content page created successfully!')
        console.log('📄 Content ID:', result.data?.id)
        console.log('🔗 URL: /content/medicare-cost-calculator')
      } else {
        console.error('❌ Failed to create Medicare Cost Calculator:', result.error)
      }
      process.exit(result.success ? 0 : 1)
    })
    .catch(error => {
      console.error('❌ Script error:', error)
      process.exit(1)
    })
}

export { createMedicareCostCalculator }


