import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
config({ path: '.env.local' })

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Create the RMD Calculator content page
async function createRMDCalculator() {
  try {
    const { data, error } = await supabase
      .from('articles')
      .insert({
        title: 'Required Minimum Distribution (RMD) Calculator',
        slug: 'rmd-calculator',
        content: `# Required Minimum Distribution (RMD) Calculator

## Calculate Your Required Retirement Account Withdrawals

Use our IRS-compliant calculator to determine your required minimum distributions and avoid costly penalties. Understanding RMDs is crucial for proper retirement account management and tax planning.

## How It Works

This calculator uses your age and account balance to:

- Calculate your current year RMD amount
- Show your life expectancy factor from IRS tables
- Provide monthly distribution amounts
- Project future RMD requirements
- Help you plan for tax implications

## Understanding Required Minimum Distributions

### What Are RMDs?

Required Minimum Distributions are mandatory withdrawals from traditional retirement accounts that must begin at a specific age. The purpose is to ensure that retirement savings are eventually taxed and used for retirement income.

### RMD Age Requirements

**Current Rules (2024):**
- **Born 1951-1959**: RMDs begin at age 73
- **Born 1960 or later**: RMDs begin at age 75
- **Previous rule**: RMDs began at age 70½ (for those born before 1951)

### Account Types Subject to RMDs

#### Traditional IRAs
- Subject to RMDs starting at age 73/75
- Must calculate RMD for each IRA separately
- Can take total RMD from any one or combination of IRAs

#### 401(k) Plans
- Subject to RMDs unless still working for the employer
- Must take RMD from each 401(k) separately
- Cannot aggregate with other 401(k) plans

#### Roth IRAs
- **Not subject to RMDs** during the owner's lifetime
- Beneficiaries may be subject to RMDs
- Roth 401(k) accounts are subject to RMDs unless rolled to Roth IRA

#### Other Accounts
- 403(b) plans
- 457(b) plans
- SEP-IRAs
- SIMPLE IRAs

## RMD Calculation Process

### Step 1: Determine Your Age
- Use your age as of December 31st of the distribution year
- This is your "attained age" for RMD purposes

### Step 2: Find Your Life Expectancy Factor
- Use the IRS Uniform Lifetime Table
- The factor decreases each year as you age
- Factors are based on life expectancy statistics

### Step 3: Calculate Your RMD
**Formula: Account Balance ÷ Life Expectancy Factor = RMD Amount**

### Step 4: Take Your Distribution
- Must be taken by December 31st each year
- Can be taken in a lump sum or throughout the year
- First-year RMD can be delayed until April 1st of the following year

## IRS Uniform Lifetime Table (2024)

| Age | Life Expectancy | Age | Life Expectancy |
|-----|----------------|-----|----------------|
| 70  | 27.4           | 85  | 14.8           |
| 71  | 26.5           | 86  | 14.1           |
| 72  | 25.6           | 87  | 13.4           |
| 73  | 24.7           | 88  | 12.7           |
| 74  | 23.8           | 89  | 12.0           |
| 75  | 22.9           | 90  | 11.4           |
| 76  | 22.0           | 91  | 10.8           |
| 77  | 21.2           | 92  | 10.2           |
| 78  | 20.3           | 93  | 9.6            |
| 79  | 19.5           | 94  | 9.1            |
| 80  | 18.7           | 95  | 8.6            |
| 81  | 17.9           | 96  | 8.1            |
| 82  | 17.1           | 97  | 7.6            |
| 83  | 16.3           | 98  | 7.1            |
| 84  | 15.5           | 99  | 6.7            |

## RMD Penalties and Consequences

### Penalty for Not Taking RMDs
- **Current penalty**: 25% of the amount that should have been withdrawn
- **Previous penalty**: 50% (reduced for distributions required in 2023 and later)
- **Penalty applies**: To the amount not withdrawn by the deadline

### How to Avoid Penalties
1. **Calculate correctly**: Use the proper life expectancy table
2. **Take on time**: Withdraw by December 31st each year
3. **Take enough**: Ensure you withdraw at least the required amount
4. **Keep records**: Document your RMD calculations and withdrawals

## RMD Planning Strategies

### 1. Plan Ahead
- Start planning your RMD strategy before age 73/75
- Consider the tax implications of large distributions
- Plan for the impact on your overall tax situation

### 2. Roth Conversions
- Convert traditional IRA funds to Roth IRA before RMD age
- Pay taxes now at potentially lower rates
- Reduce future RMD requirements
- Consider partial conversions over multiple years

### 3. Qualified Charitable Distributions (QCDs)
- Direct IRA distributions to charity (age 70½+)
- Count toward RMD requirements
- Not included in taxable income
- Maximum $105,000 per year (2024)

### 4. Tax Planning
- Coordinate RMDs with other income sources
- Consider timing of large distributions
- Plan for state tax implications
- Use tax-loss harvesting strategies

### 5. Investment Strategy
- Consider more conservative investments as RMD age approaches
- Plan for the impact of distributions on portfolio growth
- Consider the sequence of withdrawals from different accounts

## Special Situations

### Spouse as Sole Beneficiary
- Use the Joint Life and Last Survivor Expectancy Table
- Generally results in smaller RMDs
- Beneficiary must be more than 10 years younger

### Multiple Beneficiaries
- Use the life expectancy of the oldest beneficiary
- Unless separate accounts are established by September 30th

### Inherited IRAs
- Different rules apply for inherited accounts
- Generally must be distributed within 10 years
- Some exceptions for eligible designated beneficiaries

## Tax Implications

### Federal Income Tax
- RMDs are taxed as ordinary income
- No special tax treatment for RMDs
- May push you into higher tax brackets

### State Taxes
- Varies by state
- Some states don't tax retirement income
- Consider state tax implications when planning

### Medicare Premiums
- RMDs count as income for Medicare premium calculations
- May increase Medicare Part B and D premiums
- Consider IRMAA (Income-Related Monthly Adjustment Amount)

## Important Deadlines

### Annual RMD Deadline
- **December 31st**: Must take RMD for the current year
- **First-year exception**: Can delay until April 1st of following year
- **Warning**: Delaying first RMD means taking two RMDs in one year

### Account Balance Date
- **December 31st**: Use prior year's balance for current year RMD
- **Example**: 2024 RMD based on December 31, 2023 balance

### Beneficiary Designations
- **September 30th**: Deadline to establish separate accounts for multiple beneficiaries
- **December 31st**: Beneficiary determination date

## Common Mistakes to Avoid

### 1. Calculation Errors
- Using wrong life expectancy table
- Not updating account balance
- Miscalculating the distribution amount

### 2. Timing Mistakes
- Missing the December 31st deadline
- Not taking enough to satisfy the requirement
- Taking too much and not planning for taxes

### 3. Planning Oversights
- Not considering tax implications
- Not coordinating with other income sources
- Not planning for future RMD increases

## Next Steps

1. Use this calculator to determine your current RMD
2. Review your account balances and beneficiaries
3. Consider Roth conversion strategies
4. Plan for tax implications
5. Consult with a financial advisor for personalized advice

## Resources

- **IRS Publication 590-B**: Distributions from Individual Retirement Arrangements
- **IRS Uniform Lifetime Table**: Official life expectancy factors
- **Social Security Administration**: RMD age requirements
- **Financial Planning Association**: RMD planning resources

Remember: RMD rules are complex and can have significant tax implications. This calculator provides estimates based on current IRS tables and simplified calculations. Consult with a qualified tax professional or financial advisor for personalized advice and accurate RMD planning.`,
        excerpt: 'Calculate your required minimum distributions from retirement accounts with our IRS-compliant calculator. Avoid penalties and plan your retirement withdrawals strategically.',
        content_type: 'html',
        category: 'retirement-planning',
        meta_title: 'RMD Calculator - Calculate Required Minimum Distributions | SeniorSimple',
        meta_description: 'Calculate your required minimum distributions from retirement accounts. IRS-compliant calculator with life expectancy tables, penalties, and planning strategies.',
        canonical_url: 'https://seniorsimple.org/content/rmd-calculator',
        og_title: 'Required Minimum Distribution (RMD) Calculator',
        og_description: 'Calculate your required minimum distributions from retirement accounts with our IRS-compliant calculator.',
        og_image: '/images/webp/hero/couple-share-coffee-meeting-home-couch.webp',
        twitter_title: 'Required Minimum Distribution (RMD) Calculator',
        twitter_description: 'Calculate your required minimum distributions from retirement accounts with our IRS-compliant calculator.',
        twitter_image: '/images/webp/hero/couple-share-coffee-meeting-home-couch.webp',
        status: 'published',
        readability_score: 85,
        focus_keyword: 'rmd calculator',
        tags: ['rmd calculator', 'required minimum distribution', 'retirement planning', 'ira distributions', '401k distributions', 'retirement taxes', 'rmd planning', 'retirement withdrawals'],
        schema_type: 'Calculator',
        seo_score: 95,
        user_id: '430cd47d-1cad-4188-a8bb-6812f76fb9bc' // Existing user
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating RMD Calculator:', error)
      return { success: false, error }
    }

    console.log('✅ RMD Calculator created successfully:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error in createRMDCalculator:', error)
    return { success: false, error }
  }
}

// Run the script
if (require.main === module) {
  createRMDCalculator()
    .then(result => {
      if (result.success) {
        console.log('🎉 RMD Calculator content page created successfully!')
        console.log('📄 Content ID:', result.data?.id)
        console.log('🔗 URL: /content/rmd-calculator')
      } else {
        console.error('❌ Failed to create RMD Calculator:', result.error)
      }
      process.exit(result.success ? 0 : 1)
    })
    .catch(error => {
      console.error('❌ Script error:', error)
      process.exit(1)
    })
}

export { createRMDCalculator }


