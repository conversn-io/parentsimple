import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const willTrustGuide = {
  title: 'Will & Trust Guide: Essential Estate Planning Documents',
  slug: 'will-trust-guide',
  content: `# Will & Trust Guide: Essential Estate Planning Documents

## Protect Your Family and Assets with Proper Legal Planning

Wills and trusts are the foundation of any comprehensive estate plan. This guide explains the differences between these essential documents, when to use each, and how to create them to protect your family and ensure your wishes are carried out.

## Understanding Wills and Trusts

### What is a Will?

A **will** (also called a last will and testament) is a legal document that specifies how you want your assets distributed after your death. It also allows you to name guardians for minor children and an executor to manage your estate.

**Key Features of a Will:**
- Takes effect only after death
- Must go through probate court
- Can be changed or revoked during lifetime
- Names beneficiaries for assets
- Designates executor and guardians
- Specifies funeral and burial wishes

**What a Will Can Do:**
- Distribute assets to beneficiaries
- Name guardians for minor children
- Designate an executor
- Specify funeral arrangements
- Make charitable bequests
- Disinherit specific individuals

**What a Will Cannot Do:**
- Avoid probate
- Take effect during lifetime
- Control assets with beneficiary designations
- Reduce estate taxes
- Provide for incapacity planning

### What is a Trust?

A **trust** is a legal arrangement where you transfer assets to a trustee who manages them for the benefit of beneficiaries according to your instructions. Trusts can be revocable or irrevocable and can take effect during your lifetime or after death.

**Key Features of a Trust:**
- Can take effect during lifetime or after death
- Avoids probate for trust assets
- Provides privacy and control
- Can reduce estate taxes
- Allows for ongoing management
- Can provide for incapacity

**Types of Trusts:**
- **Revocable Living Trust**: Can be changed or revoked
- **Irrevocable Trust**: Cannot be changed once created
- **Testamentary Trust**: Created by will after death
- **Special Needs Trust**: For disabled beneficiaries
- **Charitable Trust**: For charitable giving
- **Life Insurance Trust**: For life insurance proceeds

## Will vs. Trust: When to Use Each

### When to Use a Will

**Simple Estates:**
- Modest assets
- Uncomplicated family situation
- No business interests
- No special needs beneficiaries
- No privacy concerns

**Specific Situations:**
- Naming guardians for minor children
- Making specific bequests
- Disinheriting individuals
- Specifying funeral arrangements
- Simple asset distribution

### When to Use a Trust

**Complex Estates:**
- Significant assets
- Multiple properties
- Business interests
- Blended families
- Privacy concerns

**Specific Benefits:**
- Avoiding probate
- Reducing estate taxes
- Providing for incapacity
- Managing assets for beneficiaries
- Protecting assets from creditors

### Using Both Together

**Comprehensive Planning:**
- Will handles assets not in trust
- Trust manages major assets
- Will names guardians for children
- Trust provides ongoing management
- Both work together for complete planning

## Creating a Will

### Essential Elements

**1. Testamentary Capacity:**
- Must be 18 or older (in most states)
- Must be of sound mind
- Must understand the nature of the will
- Must know your assets and beneficiaries

**2. Written Document:**
- Must be in writing
- Can be handwritten (holographic will)
- Can be typed or computer-generated
- Must be signed and dated

**3. Proper Execution:**
- Must be signed by you
- Must be witnessed by two people
- Witnesses must be disinterested parties
- Must follow state requirements

**4. Clear Instructions:**
- Identify yourself and your family
- List your assets and beneficiaries
- Name an executor
- Specify guardians for minor children
- Include funeral and burial wishes

### What to Include in Your Will

**Personal Information:**
- Full legal name and address
- Statement revoking previous wills
- Declaration of mental capacity
- Statement of marital status

**Asset Distribution:**
- Specific bequests to individuals
- Residuary estate distribution
- Charitable bequests
- Personal property distribution

**Family Provisions:**
- Guardianship for minor children
- Trust provisions for children
- Support for elderly parents
- Provisions for disabled family members

**Administrative Provisions:**
- Executor designation and powers
- Bond requirements
- Compensation for executor
- Powers of sale and investment

### Common Will Provisions

**Specific Bequests:**
- "I give my wedding ring to my daughter"
- "I give $10,000 to my church"
- "I give my car to my son"

**Residuary Clause:**
- "I give the rest of my estate to my spouse"
- "I give the remainder equally to my children"
- "I give the residue to my trust"

**Guardianship Provisions:**
- "I name my sister as guardian of my minor children"
- "I name my brother as alternate guardian"
- "I request that my children be raised in the Catholic faith"

## Creating a Trust

### Revocable Living Trust

**How It Works:**
- You create the trust during lifetime
- You transfer assets to the trust
- You serve as trustee initially
- You can change or revoke the trust
- Trust continues after your death

**Advantages:**
- Avoids probate
- Provides privacy
- Allows for incapacity planning
- Can reduce estate taxes
- Provides ongoing management

**Disadvantages:**
- More expensive to create
- Requires ongoing maintenance
- Must transfer assets to trust
- More complex than a will

### Testamentary Trust

**How It Works:**
- Created by your will
- Takes effect after your death
- Managed by trustee you name
- Provides for beneficiaries
- Can be designed for specific needs

**Advantages:**
- Created by will (simpler)
- Provides for minor children
- Can reduce estate taxes
- Allows for ongoing management
- Can protect assets

**Disadvantages:**
- Assets go through probate
- Less flexible than living trust
- Trustee must be named in will
- Cannot be changed after death

### Special Needs Trust

**Purpose:**
- Provides for disabled beneficiaries
- Preserves government benefits
- Allows for supplemental care
- Protects assets from creditors
- Provides ongoing management

**Key Features:**
- Must be irrevocable
- Cannot be used for basic needs
- Must have proper language
- Requires professional management
- Must follow government rules

## Choosing an Executor or Trustee

### Qualities to Look For

**Personal Qualities:**
- Trustworthy and honest
- Organized and detail-oriented
- Good communication skills
- Available and willing to serve
- Understands your wishes

**Professional Qualities:**
- Financial knowledge
- Legal understanding
- Experience with estates
- Professional credentials
- Good reputation

### Family vs. Professional

**Family Members:**
- Know your wishes
- Care about beneficiaries
- Usually no cost
- May lack expertise
- Can create family conflicts

**Professional Trustees:**
- Experienced and knowledgeable
- Impartial and objective
- Available and reliable
- Charge fees
- May not know your wishes

### Co-Trustees

**Advantages:**
- Combines family and professional expertise
- Provides checks and balances
- Reduces risk of errors
- Allows for family input
- Professional guidance

**Disadvantages:**
- Can be more expensive
- May create conflicts
- Requires coordination
- Can slow decision-making
- More complex administration

## Funding Your Trust

### What Assets to Put in Trust

**Good Candidates:**
- Real estate
- Investment accounts
- Business interests
- Personal property
- Bank accounts

**Not Suitable:**
- Retirement accounts (use beneficiaries)
- Life insurance (use beneficiaries)
- Jointly owned property
- Assets with beneficiary designations
- Some business assets

### How to Fund a Trust

**Real Estate:**
- Deed property to trust
- Update title insurance
- Notify mortgage company
- Update property insurance
- File deed with county

**Financial Accounts:**
- Change account ownership
- Update account titles
- Notify financial institutions
- Update account beneficiaries
- Review account statements

**Personal Property:**
- Create assignment document
- List valuable items
- Update insurance policies
- Consider storage arrangements
- Document ownership transfer

## Common Mistakes to Avoid

### Will Mistakes

**1. Not Having a Will:**
- Assets distributed by state law
- No guardianship for children
- No executor designated
- Family disputes likely
- Higher costs and delays

**2. Outdated Will:**
- Old beneficiary designations
- Outdated guardianship choices
- Changes in family not reflected
- New assets not included
- Tax laws changed

**3. Improper Execution:**
- Not following state requirements
- Insufficient witnesses
- Interested witnesses
- Not properly signed
- Not properly dated

### Trust Mistakes

**1. Not Funding the Trust:**
- Trust has no assets
- Assets still go through probate
- Trust doesn't work as intended
- Wasted time and money
- Family confusion

**2. Poor Trustee Selection:**
- Choosing unqualified trustee
- Not considering availability
- Not providing instructions
- Not considering conflicts
- Not naming successor trustees

**3. Inadequate Planning:**
- Not considering all assets
- Not planning for incapacity
- Not considering taxes
- Not providing for all beneficiaries
- Not updating regularly

## Getting Professional Help

### When to Use an Attorney

**Complex Situations:**
- Significant assets
- Business interests
- Blended families
- Special needs beneficiaries
- Tax planning needs

**Legal Requirements:**
- State-specific requirements
- Complex family situations
- Tax planning strategies
- Business succession
- Asset protection

### DIY Options

**Simple Situations:**
- Modest assets
- Uncomplicated family
- No special needs
- No business interests
- No tax concerns

**Risks of DIY:**
- May not meet legal requirements
- May not address all issues
- May not be tax-efficient
- May not provide adequate protection
- May not be properly executed

## Maintaining Your Estate Plan

### Regular Reviews

**Annual Review:**
- Check beneficiary designations
- Review asset values
- Update contact information
- Review insurance coverage
- Check for law changes

**Life Event Reviews:**
- Marriage or divorce
- Birth or adoption of children
- Death of family members
- Significant asset changes
- Moving to different state

### Keeping Documents Current

**Will Updates:**
- Major life changes
- Asset value changes
- Family situation changes
- Tax law changes
- Beneficiary changes

**Trust Updates:**
- Asset changes
- Beneficiary changes
- Trustee changes
- Tax law changes
- Family situation changes

## Conclusion

Wills and trusts are essential tools for protecting your family and ensuring your wishes are carried out. While wills are simpler and suitable for many situations, trusts offer additional benefits including probate avoidance, privacy, and ongoing management capabilities.

The key to successful estate planning is understanding your options, choosing the right tools for your situation, and working with qualified professionals when needed. Remember that estate planning is not a one-time event but an ongoing process that should be reviewed and updated regularly.

**Ready to protect your family and assets? Use this guide to understand your options and create the estate planning documents that best meet your needs and goals.**`,
  excerpt: 'Complete guide to wills and trusts. Learn the differences, when to use each, and how to create these essential estate planning documents to protect your family and assets.',
  content_type: 'guide',
  category: 'estate-planning',
  difficulty_level: 'beginner',
  meta_title: 'Will & Trust Guide - Essential Estate Planning Documents | SeniorSimple',
  meta_description: 'Complete guide to wills and trusts for estate planning. Learn the differences, when to use each, and how to create these essential legal documents.',
  meta_keywords: ['will and trust guide', 'estate planning', 'will', 'trust', 'probate', 'estate planning documents', 'legal planning'],
  status: 'published',
  priority: 'high',
  featured: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  published_at: new Date().toISOString()
};

async function createWillTrustGuide() {
  try {
    console.log('Creating Will & Trust Guide...');
    
    const { data, error } = await supabase
      .from('articles')
      .insert([willTrustGuide])
      .select();

    if (error) {
      console.error('Error creating will & trust guide:', error);
      return;
    }

    console.log('✅ Will & Trust Guide created successfully:', data[0].id);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the function
createWillTrustGuide();
