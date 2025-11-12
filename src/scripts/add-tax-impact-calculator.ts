import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
config({ path: '.env.local' })

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Create the Tax Impact Calculator content page
async function createTaxImpactCalculator() {
  try {
    const { data, error } = await supabase
      .from('articles')
      .insert({
        title: 'Tax Impact Calculator',
        slug: 'tax-impact-calculator',
        content: `# Tax Impact Calculator

## Plan Your Retirement Tax Strategy

Use this comprehensive calculator to estimate how different retirement income sources affect your taxes and plan your withdrawals strategically. Understanding your tax impact is crucial for maximizing your retirement income and minimizing your tax burden.

## How It Works

This calculator uses your retirement income information to:

- Calculate your federal tax liability
- Determine your effective and marginal tax rates
- Show tax bracket breakdown
- Estimate taxable Social Security benefits
- Provide tax-efficient withdrawal strategies

## Understanding Retirement Taxes

### Taxable Income Sources
- **Social Security Benefits**: Up to 85% may be taxable depending on other income
- **Pension Income**: Generally fully taxable
- **Traditional IRA/401(k) Withdrawals**: Fully taxable as ordinary income
- **Roth IRA/401(k) Withdrawals**: Tax-free (if qualified)
- **Investment Income**: Dividends, interest, and capital gains
- **Other Income**: Part-time work, rental income, etc.

### Social Security Taxation
Social Security benefits may be taxable based on your "combined income":

**Combined Income = Adjusted Gross Income + Nontaxable Interest + 50% of Social Security Benefits**

#### Taxability Thresholds (2024)
- **Single/Head of Household**:
  - $0 - $25,000: 0% taxable
  - $25,001 - $34,000: Up to 50% taxable
  - Over $34,000: Up to 85% taxable

- **Married Filing Jointly**:
  - $0 - $32,000: 0% taxable
  - $32,001 - $44,000: Up to 50% taxable
  - Over $44,000: Up to 85% taxable

### 2024 Federal Tax Brackets

#### Single Filers
- 10%: $0 - $11,000
- 12%: $11,001 - $44,725
- 22%: $44,726 - $95,375
- 24%: $95,376 - $182,050
- 32%: $182,051 - $231,250
- 35%: $231,251 - $578,125
- 37%: $578,126+

#### Married Filing Jointly
- 10%: $0 - $22,000
- 12%: $22,001 - $89,450
- 22%: $89,451 - $190,750
- 24%: $190,751 - $364,200
- 32%: $364,201 - $462,500
- 35%: $462,501 - $693,750
- 37%: $693,751+

### Standard Deductions (2024)
- **Single**: $13,850
- **Married Filing Jointly**: $27,700
- **Married Filing Separately**: $13,850
- **Head of Household**: $20,800

### Senior Additional Deduction (Age 65+)
- **Single**: +$1,850
- **Married Filing Jointly**: +$1,500 (per spouse)
- **Married Filing Separately**: +$1,500
- **Head of Household**: +$1,850

## Tax-Efficient Retirement Strategies

### 1. Tax Diversification
Spread your retirement savings across different account types:

- **Traditional 401(k)/IRA**: Current tax deductions, future tax liability
- **Roth 401(k)/IRA**: After-tax contributions, tax-free growth and withdrawals
- **Taxable Investment Accounts**: After-tax contributions, capital gains treatment

### 2. Withdrawal Sequencing
Strategic order of account withdrawals:

1. **Taxable Accounts First**: Use investment accounts for initial retirement income
2. **Tax-Deferred Accounts**: Traditional IRAs/401(k)s for income needs
3. **Roth Accounts Last**: Save for later years or legacy planning

### 3. Tax-Loss Harvesting
Offset gains with losses to reduce current year tax liability:

- Sell investments with losses to offset gains
- Be aware of wash sale rules (30-day rule)
- Consider tax implications of portfolio rebalancing

### 4. Charitable Giving Strategies
- **Qualified Charitable Distributions (QCDs)**: Direct IRA distributions to charity (age 70½+)
- **Donor-Advised Funds**: Bunch charitable deductions
- **Appreciated Securities**: Donate instead of selling

### 5. Roth Conversion Strategies
Convert traditional IRA funds to Roth IRAs during low-income years:

- Pay taxes now at lower rates
- Enjoy tax-free growth and withdrawals
- Reduce future RMDs
- Consider partial conversions over multiple years

## Income Planning Strategies

### Manage Tax Brackets
- Stay within lower tax brackets when possible
- Use Roth conversions to fill lower brackets
- Time large withdrawals carefully

### Social Security Optimization
- Consider delaying Social Security to reduce taxable benefits
- Coordinate with other income sources
- Plan for the "tax torpedo" effect

### Required Minimum Distributions (RMDs)
- Plan for RMDs starting at age 73 (born 1951-1959) or 75 (born 1960+)
- Consider Roth conversions before RMD age
- Use QCDs to satisfy RMD requirements

## State Tax Considerations

### High-Tax States
- California, New York, New Jersey, Connecticut
- Consider state tax implications of retirement location
- Some states don't tax Social Security or retirement income

### Tax-Friendly States
- Florida, Texas, Nevada, Washington (no state income tax)
- Tennessee, New Hampshire (no tax on wages, but tax on interest/dividends)
- Consider state tax benefits when choosing retirement location

## Important Dates and Deadlines

### Tax Filing Deadlines
- **April 15**: Individual tax returns due
- **October 15**: Extended filing deadline

### Retirement Account Deadlines
- **December 31**: Traditional IRA contributions for current year
- **April 15**: Roth IRA contributions for previous year
- **December 31**: Required Minimum Distributions

### Estimated Tax Payments
- **January 15**: 4th quarter estimated taxes
- **April 15**: 1st quarter estimated taxes
- **June 15**: 2nd quarter estimated taxes
- **September 15**: 3rd quarter estimated taxes

## Next Steps

1. Use this calculator to estimate your tax impact
2. Review your current retirement account allocation
3. Consider tax-efficient withdrawal strategies
4. Plan for Roth conversions during low-income years
5. Consult with a tax professional for personalized advice

## Resources

- **IRS Publication 915**: Social Security and Equivalent Railroad Retirement Benefits
- **IRS Publication 590-B**: Distributions from Individual Retirement Arrangements
- **Tax Foundation**: State tax information
- **AARP**: Retirement tax planning resources

Remember: Tax laws change frequently, and your situation may be unique. This calculator provides estimates based on current tax rates and simplified calculations. Consult with a qualified tax professional for personalized advice and accurate tax planning.`,
        excerpt: 'Estimate how different retirement income sources affect your taxes and plan your withdrawals strategically with our comprehensive tax impact calculator.',
        content_type: 'html',
        category: 'retirement-planning',
        meta_title: 'Tax Impact Calculator - Plan Your Retirement Tax Strategy | SeniorSimple',
        meta_description: 'Calculate your retirement tax impact and plan strategic withdrawals. Estimate federal taxes, understand tax brackets, and optimize your retirement income strategy.',
        canonical_url: 'https://seniorsimple.org/content/tax-impact-calculator',
        og_title: 'Tax Impact Calculator',
        og_description: 'Estimate how different retirement income sources affect your taxes and plan your withdrawals strategically.',
        og_image: '/images/webp/hero/couple-share-coffee-meeting-home-couch.webp',
        twitter_title: 'Tax Impact Calculator',
        twitter_description: 'Estimate how different retirement income sources affect your taxes and plan your withdrawals strategically.',
        twitter_image: '/images/webp/hero/couple-share-coffee-meeting-home-couch.webp',
        status: 'published',
        readability_score: 85,
        focus_keyword: 'tax impact calculator',
        tags: ['tax calculator', 'retirement taxes', 'tax planning', 'social security taxes', 'tax brackets', 'retirement income', 'tax strategy', 'withdrawal planning'],
        schema_type: 'Calculator',
        seo_score: 95,
        user_id: '430cd47d-1cad-4188-a8bb-6812f76fb9bc' // Existing user
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating Tax Impact Calculator:', error)
      return { success: false, error }
    }

    console.log('✅ Tax Impact Calculator created successfully:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error in createTaxImpactCalculator:', error)
    return { success: false, error }
  }
}

// Run the script
if (require.main === module) {
  createTaxImpactCalculator()
    .then(result => {
      if (result.success) {
        console.log('🎉 Tax Impact Calculator content page created successfully!')
        console.log('📄 Content ID:', result.data?.id)
        console.log('🔗 URL: /content/tax-impact-calculator')
      } else {
        console.error('❌ Failed to create Tax Impact Calculator:', result.error)
      }
      process.exit(result.success ? 0 : 1)
    })
    .catch(error => {
      console.error('❌ Script error:', error)
      process.exit(1)
    })
}

export { createTaxImpactCalculator }


