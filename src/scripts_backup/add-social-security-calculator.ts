import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { CalculatorConfig } from '../lib/enhanced-articles'

// Load environment variables
config({ path: '.env.local' })

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Social Security Calculator Configuration
const socialSecurityCalculatorConfig: CalculatorConfig = {
  calculator_type: 'financial',
  inputs: [
    {
      id: 'birth_year',
      label: 'Birth Year',
      type: 'number',
      required: true,
      default_value: 1960,
      validation: [
        { type: 'min', value: 1920, message: 'Birth year must be 1920 or later' },
        { type: 'max', value: 2010, message: 'Birth year must be 2010 or earlier' }
      ],
      help_text: 'Enter your birth year to determine your full retirement age',
      min: 1920,
      max: 2010
    },
    {
      id: 'current_age',
      label: 'Current Age',
      type: 'number',
      required: true,
      default_value: 64,
      validation: [
        { type: 'min', value: 18, message: 'Age must be 18 or older' },
        { type: 'max', value: 100, message: 'Age must be 100 or younger' }
      ],
      help_text: 'Your current age in years',
      min: 18,
      max: 100
    },
    {
      id: 'annual_income',
      label: 'Annual Income',
      type: 'number',
      required: true,
      default_value: 75000,
      validation: [
        { type: 'min', value: 0, message: 'Income must be positive' },
        { type: 'max', value: 200000, message: 'Income must be $200,000 or less' }
      ],
      help_text: 'Your current annual income (used to estimate benefits)',
      unit: '$',
      min: 0,
      max: 200000
    },
    {
      id: 'expected_retirement_age',
      label: 'Expected Retirement Age',
      type: 'number',
      required: true,
      default_value: 67,
      validation: [
        { type: 'min', value: 62, message: 'Retirement age must be 62 or later' },
        { type: 'max', value: 70, message: 'Retirement age must be 70 or earlier' }
      ],
      help_text: 'When you plan to retire (between 62 and 70)',
      min: 62,
      max: 70
    },
    {
      id: 'life_expectancy',
      label: 'Life Expectancy',
      type: 'number',
      required: true,
      default_value: 85,
      validation: [
        { type: 'min', value: 70, message: 'Life expectancy must be 70 or higher' },
        { type: 'max', value: 100, message: 'Life expectancy must be 100 or lower' }
      ],
      help_text: 'Your expected life expectancy for lifetime benefit calculations',
      min: 70,
      max: 100
    },
    {
      id: 'marital_status',
      label: 'Marital Status',
      type: 'select',
      required: true,
      default_value: 'single',
      options: ['single', 'married'],
      help_text: 'Your current marital status affects benefit calculations'
    },
    {
      id: 'spouse_birth_year',
      label: 'Spouse Birth Year',
      type: 'number',
      required: false,
      default_value: 1962,
      validation: [
        { type: 'min', value: 1920, message: 'Spouse birth year must be 1920 or later' },
        { type: 'max', value: 2010, message: 'Spouse birth year must be 2010 or earlier' }
      ],
      help_text: 'Your spouse\'s birth year (if married)',
      min: 1920,
      max: 2010
    },
    {
      id: 'spouse_annual_income',
      label: 'Spouse Annual Income',
      type: 'number',
      required: false,
      default_value: 50000,
      validation: [
        { type: 'min', value: 0, message: 'Spouse income must be positive' },
        { type: 'max', value: 200000, message: 'Spouse income must be $200,000 or less' }
      ],
      help_text: 'Your spouse\'s annual income (if married)',
      unit: '$',
      min: 0,
      max: 200000
    }
  ],
  calculations: [
    {
      id: 'full_retirement_age',
      formula: 'birth_year <= 1954 ? 66 : birth_year >= 1960 ? 67 : 66 + (birth_year - 1954) * 0.5',
      description: 'Calculate full retirement age based on birth year'
    },
    {
      id: 'primary_insurance_amount',
      formula: 'calculatePIA(annual_income)',
      description: 'Calculate Primary Insurance Amount based on earnings'
    },
    {
      id: 'early_benefit',
      formula: 'primary_insurance_amount * 0.7',
      description: 'Calculate benefit at age 62 (30% reduction)'
    },
    {
      id: 'full_benefit',
      formula: 'primary_insurance_amount',
      description: 'Calculate benefit at full retirement age'
    },
    {
      id: 'delayed_benefit',
      formula: 'primary_insurance_amount * 1.24',
      description: 'Calculate benefit at age 70 (24% increase)'
    },
    {
      id: 'break_even_age',
      formula: 'calculateBreakEven(early_benefit, full_benefit)',
      description: 'Calculate break-even age for delayed benefits'
    }
  ],
  outputs: [
    {
      id: 'full_retirement_benefit',
      label: 'Full Retirement Benefit',
      type: 'currency',
      display_type: 'currency',
      formula: 'primary_insurance_amount',
      description: 'Monthly benefit at full retirement age'
    },
    {
      id: 'early_benefit',
      label: 'Early Benefit (Age 62)',
      type: 'currency',
      display_type: 'currency',
      formula: 'primary_insurance_amount * 0.7',
      description: 'Monthly benefit if claimed at age 62'
    },
    {
      id: 'delayed_benefit',
      label: 'Delayed Benefit (Age 70)',
      type: 'currency',
      display_type: 'currency',
      formula: 'primary_insurance_amount * 1.24',
      description: 'Monthly benefit if claimed at age 70'
    },
    {
      id: 'break_even_age',
      label: 'Break-Even Age',
      type: 'text',
      display_type: 'text',
      formula: 'calculateBreakEven(early_benefit, full_benefit)',
      description: 'Age when delayed benefits equal early benefits'
    },
    {
      id: 'lifetime_benefit_early',
      label: 'Lifetime Benefits (Early)',
      type: 'currency',
      display_type: 'currency',
      formula: 'early_benefit * 12 * (life_expectancy - 62)',
      description: 'Total lifetime benefits if claimed early'
    },
    {
      id: 'lifetime_benefit_full',
      label: 'Lifetime Benefits (Full Retirement)',
      type: 'currency',
      display_type: 'currency',
      formula: 'full_benefit * 12 * (life_expectancy - full_retirement_age)',
      description: 'Total lifetime benefits at full retirement age'
    },
    {
      id: 'lifetime_benefit_delayed',
      label: 'Lifetime Benefits (Delayed)',
      type: 'currency',
      display_type: 'currency',
      formula: 'delayed_benefit * 12 * (life_expectancy - 70)',
      description: 'Total lifetime benefits if claimed at age 70'
    }
  ],
  charts: [
    {
      id: 'benefit_comparison',
      type: 'bar',
      title: 'Monthly Benefit Comparison',
      data_source: 'benefit_outputs',
      responsive: true
    },
    {
      id: 'lifetime_benefits',
      type: 'bar',
      title: 'Lifetime Benefits Comparison',
      data_source: 'lifetime_outputs',
      responsive: true
    }
  ],
  print_enabled: true,
  save_enabled: true,
  disclaimer: 'This calculator provides estimates based on simplified Social Security benefit calculations. Actual benefits may vary based on your complete earnings history, work credits, and other factors. For accurate benefit estimates, visit the official Social Security Administration website or contact them directly.'
}

// Create the Social Security Calculator content page
async function createSocialSecurityCalculator() {
  try {
    const { data, error } = await supabase
      .from('articles')
      .insert({
        title: 'Social Security Optimization Calculator',
        slug: 'social-security-optimization-calculator',
        content: `# Social Security Optimization Calculator

## Maximize Your Social Security Benefits

Use this comprehensive calculator to determine the optimal time to claim your Social Security benefits. Our tool helps you understand how different claiming strategies can impact your monthly and lifetime benefits.

## How It Works

This calculator uses your personal information to:

- Calculate your Primary Insurance Amount (PIA)
- Compare benefits at different claiming ages (62, full retirement age, 70)
- Determine your break-even age
- Estimate lifetime benefits for each strategy
- Provide personalized recommendations

## Key Factors

### Full Retirement Age
Your full retirement age depends on your birth year:
- Born 1943-1954: Age 66
- Born 1955-1959: Gradually increases to 67
- Born 1960 or later: Age 67

### Benefit Adjustments
- **Early claiming (age 62)**: 30% reduction in monthly benefits
- **Full retirement age**: No reduction or increase
- **Delayed claiming (age 70)**: 24% increase in monthly benefits

### Break-Even Analysis
The break-even age is when the total benefits received from delayed claiming equal the total benefits from early claiming. This helps you decide which strategy makes sense based on your life expectancy.

## Strategies to Consider

### 1. Early Claiming (Age 62)
**Best for:**
- Health concerns or shorter life expectancy
- Immediate need for income
- Lower lifetime earnings

**Considerations:**
- 30% reduction in monthly benefits
- Benefits are permanently reduced
- May impact spousal benefits

### 2. Full Retirement Age Claiming
**Best for:**
- Average life expectancy
- Balanced approach
- No immediate income needs

**Considerations:**
- No reduction or increase
- Standard benefit amount
- Good middle-ground option

### 3. Delayed Claiming (Age 70)
**Best for:**
- Longer life expectancy
- Other income sources available
- Higher lifetime earnings

**Considerations:**
- 24% increase in monthly benefits
- Maximum monthly benefit
- Requires other income until age 70

## Married Couples

If you're married, consider:

- **Spousal benefits**: Lower-earning spouse can claim up to 50% of higher-earning spouse's benefit
- **Survivor benefits**: Widow(er) can claim up to 100% of deceased spouse's benefit
- **Coordination**: Plan together to maximize combined benefits

## Important Notes

- These calculations are estimates based on simplified formulas
- Actual benefits depend on your complete earnings history
- Work credits (minimum 40 quarters) are required for benefits
- Benefits are adjusted annually for inflation (COLA)
- Consult with a financial advisor for personalized advice

## Next Steps

1. Use this calculator to explore different scenarios
2. Consider your health, life expectancy, and financial needs
3. Review your complete earnings history with Social Security
4. Consult with a financial advisor
5. Visit ssa.gov for official benefit estimates

Remember: The best claiming strategy depends on your individual circumstances, health, and financial goals.`,
        excerpt: 'Calculate your optimal Social Security claiming strategy and maximize your retirement benefits with our comprehensive calculator.',
        content_type: 'html',
        category: 'retirement-planning',
        meta_title: 'Social Security Calculator - Optimize Your Benefits | SeniorSimple',
        meta_description: 'Calculate your optimal Social Security claiming strategy. Get personalized recommendations for maximizing your retirement benefits with our free calculator.',
        canonical_url: 'https://seniorsimple.org/content/social-security-optimization-calculator',
        og_title: 'Social Security Optimization Calculator',
        og_description: 'Calculate your optimal Social Security claiming strategy and maximize your retirement benefits.',
        og_image: '/images/webp/hero/couple-share-coffee-meeting-home-couch.webp',
        twitter_title: 'Social Security Optimization Calculator',
        twitter_description: 'Calculate your optimal Social Security claiming strategy and maximize your retirement benefits.',
        twitter_image: '/images/webp/hero/couple-share-coffee-meeting-home-couch.webp',
        status: 'published',
        readability_score: 85,
        focus_keyword: 'social security calculator',
        tags: ['social security', 'retirement benefits', 'claiming strategy', 'break even age', 'lifetime benefits', 'pension planning', 'retirement income', 'social security optimization'],
        schema_type: 'Calculator',
        seo_score: 95,
        user_id: '430cd47d-1cad-4188-a8bb-6812f76fb9bc' // Existing user
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating Social Security Calculator:', error)
      return { success: false, error }
    }

    console.log('✅ Social Security Calculator created successfully:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error in createSocialSecurityCalculator:', error)
    return { success: false, error }
  }
}

// Run the script
if (require.main === module) {
  createSocialSecurityCalculator()
    .then(result => {
      if (result.success) {
        console.log('🎉 Social Security Calculator content page created successfully!')
        console.log('📄 Content ID:', result.data?.id)
        console.log('🔗 URL: /content/social-security-optimization-calculator')
      } else {
        console.error('❌ Failed to create Social Security Calculator:', result.error)
      }
      process.exit(result.success ? 0 : 1)
    })
    .catch(error => {
      console.error('❌ Script error:', error)
      process.exit(1)
    })
}

export { createSocialSecurityCalculator, socialSecurityCalculatorConfig }
