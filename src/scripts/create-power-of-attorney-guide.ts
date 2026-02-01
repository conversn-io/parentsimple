import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const powerOfAttorneyGuide = {
  title: 'Power of Attorney Guide: Protect Your Rights and Assets',
  slug: 'power-of-attorney-guide',
  content: `# Power of Attorney Guide: Protect Your Rights and Assets

## Ensure Your Affairs Are Managed When You Cannot

A power of attorney is a legal document that allows someone else to act on your behalf in financial, legal, or healthcare matters. This comprehensive guide explains the different types of powers of attorney, when to use each, and how to create them to protect your interests and ensure your wishes are carried out.

## Understanding Power of Attorney

### What is a Power of Attorney?

A **power of attorney** (POA) is a legal document that gives another person (called an "agent" or "attorney-in-fact") the authority to act on your behalf in specific situations. The person creating the POA is called the "principal."

**Key Concepts:**
- **Principal**: The person granting the authority
- **Agent/Attorney-in-Fact**: The person receiving the authority
- **Scope**: What the agent can and cannot do
- **Duration**: When the POA is effective
- **Revocation**: How to cancel the POA

### Why You Need a Power of Attorney

**Protection Against Incapacity:**
- Accidents can happen at any age
- Illness can affect decision-making
- Aging may reduce mental capacity
- Temporary incapacity is common
- Permanent incapacity requires planning

**Benefits of Having a POA:**
- Avoid court-appointed guardianship
- Choose who will act for you
- Maintain control over decisions
- Reduce family stress and conflict
- Ensure continuity of affairs
- Protect your interests

## Types of Power of Attorney

### Durable vs. Non-Durable

**Durable Power of Attorney:**
- Remains effective even if you become incapacitated
- Most common type for estate planning
- Continues until revoked or death
- Essential for incapacity planning
- Recommended for most situations

**Non-Durable Power of Attorney:**
- Becomes invalid if you become incapacitated
- Used for specific, temporary situations
- Common for business transactions
- Not suitable for incapacity planning
- Limited usefulness for most people

### Financial vs. Healthcare

**Financial Power of Attorney:**
- Handles money and property matters
- Manages bank accounts and investments
- Pays bills and manages expenses
- Handles real estate transactions
- Manages business affairs

**Healthcare Power of Attorney:**
- Makes medical decisions
- Chooses healthcare providers
- Consents to or refuses treatment
- Accesses medical records
- Makes end-of-life decisions

### General vs. Limited

**General Power of Attorney:**
- Broad authority over all affairs
- Can handle any legal matter
- Most comprehensive type
- Requires high level of trust
- Suitable for close family members

**Limited Power of Attorney:**
- Specific authority for particular matters
- Limited to defined transactions
- More restrictive and safer
- Suitable for specific situations
- Common for business transactions

## Financial Power of Attorney

### What It Covers

**Banking and Financial Accounts:**
- Access bank accounts
- Write checks and make deposits
- Manage investment accounts
- Handle credit card accounts
- Manage online banking

**Real Estate:**
- Buy and sell property
- Manage rental properties
- Pay property taxes and insurance
- Handle property maintenance
- Sign deeds and mortgages

**Business Affairs:**
- Manage business operations
- Sign contracts and agreements
- Handle business finances
- Make business decisions
- Represent business interests

**Legal Matters:**
- Sign legal documents
- File tax returns
- Handle insurance claims
- Manage legal disputes
- Represent in court

### Powers to Include

**Essential Powers:**
- Banking and financial transactions
- Real estate transactions
- Tax matters
- Insurance transactions
- Legal proceedings

**Optional Powers:**
- Gifts and charitable contributions
- Business operations
- Retirement account management
- Estate planning transactions
- Family support

### Powers to Consider Carefully

**Gift-Giving Authority:**
- Can make gifts to family members
- May affect estate planning
- Could reduce your assets
- May have tax implications
- Requires careful consideration

**Estate Planning Powers:**
- Can create or modify trusts
- May change beneficiary designations
- Could affect estate plan
- Requires professional guidance
- May have unintended consequences

## Healthcare Power of Attorney

### What It Covers

**Medical Decisions:**
- Consent to or refuse treatment
- Choose healthcare providers
- Make decisions about procedures
- Handle emergency situations
- Manage ongoing care

**Healthcare Management:**
- Access medical records
- Communicate with doctors
- Arrange for care services
- Manage medications
- Coordinate with family

**End-of-Life Decisions:**
- Life-sustaining treatment
- Pain management
- Comfort care decisions
- Hospice care choices
- Funeral arrangements

### Working with Living Wills

**Living Will (Advance Directive):**
- Specifies your wishes for end-of-life care
- Guides healthcare decisions
- Provides instructions for family
- Works with healthcare POA
- Ensures your wishes are followed

**Coordination:**
- Healthcare POA makes decisions
- Living will provides guidance
- Both documents work together
- Ensure consistency between documents
- Regular review and updates

## Choosing an Agent

### Qualities to Look For

**Personal Qualities:**
- Trustworthy and honest
- Available and willing to serve
- Good communication skills
- Understands your wishes
- Can handle responsibility

**Practical Considerations:**
- Lives nearby or can travel
- Has time to handle affairs
- Understands financial matters
- Can work with professionals
- Will act in your best interests

### Family vs. Professional

**Family Members:**
- Know your wishes and values
- Care about your well-being
- Usually no cost
- May lack expertise
- Can create family conflicts

**Professional Agents:**
- Experienced and knowledgeable
- Impartial and objective
- Available and reliable
- Charge fees for services
- May not know your wishes

### Co-Agents

**Advantages:**
- Combines family and professional expertise
- Provides checks and balances
- Reduces risk of abuse
- Allows for family input
- Professional guidance

**Disadvantages:**
- Can be more expensive
- May create conflicts
- Requires coordination
- Can slow decision-making
- More complex administration

## Creating a Power of Attorney

### Legal Requirements

**Capacity:**
- Must be mentally competent
- Must understand the document
- Must understand the consequences
- Must be able to make decisions
- Must be of legal age

**Formal Requirements:**
- Must be in writing
- Must be signed by principal
- Must be notarized (in most states)
- May require witnesses
- Must follow state law

### What to Include

**Basic Information:**
- Your name and address
- Agent's name and address
- Specific powers granted
- When POA becomes effective
- When POA terminates

**Specific Powers:**
- List all powers granted
- Be specific about limitations
- Include special instructions
- Address gift-giving authority
- Specify business powers

**Instructions:**
- How agent should act
- Your preferences and values
- Family considerations
- Professional relationships
- Special circumstances

## Common Mistakes to Avoid

### 1. Not Having a POA

**The Problem:**
- No one can act for you if incapacitated
- Court-appointed guardianship required
- Family cannot access accounts
- Medical decisions made by others
- Higher costs and delays

**The Solution:**
- Create POA while competent
- Choose trusted agent
- Include necessary powers
- Keep documents accessible
- Review and update regularly

### 2. Choosing Wrong Agent

**The Problem:**
- Agent may not be available
- Agent may lack necessary skills
- Agent may not understand wishes
- Agent may have conflicts of interest
- Agent may abuse authority

**The Solution:**
- Choose carefully and thoughtfully
- Consider availability and skills
- Discuss your wishes clearly
- Consider professional agents
- Name successor agents

### 3. Not Being Specific Enough

**The Problem:**
- Agent may not know what to do
- Powers may be too broad or narrow
- Instructions may be unclear
- May not address special situations
- Could lead to disputes

**The Solution:**
- Be specific about powers
- Include clear instructions
- Address special circumstances
- Work with attorney
- Regular review and updates

### 4. Not Keeping Documents Current

**The Problem:**
- Agent may no longer be available
- Powers may no longer be appropriate
- Instructions may be outdated
- May not reflect current wishes
- Could cause problems

**The Solution:**
- Review documents regularly
- Update for life changes
- Keep contact information current
- Ensure documents are accessible
- Communicate changes to agent

## State-Specific Considerations

### Legal Requirements

**Varies by State:**
- Different forms and requirements
- Different witnessing requirements
- Different notarization requirements
- Different effective dates
- Different revocation procedures

**Important Considerations:**
- Use state-specific forms
- Follow state requirements
- Work with local attorney
- Understand state differences
- Keep current with changes

### Portability

**Recognition Across States:**
- Some states recognize out-of-state POAs
- Some states have specific requirements
- May need to update when moving
- Consider creating new POA
- Work with local attorney

## Revoking a Power of Attorney

### When to Revoke

**Situations Requiring Revocation:**
- Agent is no longer suitable
- Relationship with agent changes
- Agent becomes unavailable
- You want to change agents
- Circumstances change

**How to Revoke:**
- Create written revocation
- Notify agent in writing
- Notify third parties
- Destroy old documents
- Create new POA if needed

### Automatic Termination

**Events That Terminate POA:**
- Death of principal
- Death of agent
- Divorce (in some states)
- Incapacity (for non-durable POAs)
- Expiration date (if specified)

## Getting Professional Help

### When to Use an Attorney

**Complex Situations:**
- Complex financial affairs
- Business ownership
- Special family circumstances
- State-specific requirements
- Coordination with other documents

**Benefits of Professional Help:**
- Ensures legal compliance
- Addresses complex situations
- Provides ongoing support
- Coordinates with other planning
- Reduces risk of problems

### DIY Options

**Simple Situations:**
- Basic financial affairs
- Simple family situations
- Standard state forms
- No special circumstances
- Good understanding of requirements

**Risks of DIY:**
- May not meet legal requirements
- May not address all issues
- May not be properly executed
- May not work as intended
- May cause problems later

## Power of Attorney Checklist

### Before Creating POA

**□** Identify your needs and goals
**□** Choose appropriate agent(s)
**□** Consider successor agents
**□** Research state requirements
**□** Gather necessary information
**□** Schedule professional consultation

### Creating POA

**□** Use appropriate form
**□** Include all necessary powers
**□** Be specific about limitations
**□** Include clear instructions
**□** Follow state requirements
**□** Have properly executed

### After Creating POA

**□** Provide copies to agent
**□** Notify relevant parties
**□** Keep original in safe place
**□** Review regularly
**□** Update as needed
**□** Communicate with agent

## Conclusion

A power of attorney is an essential component of comprehensive estate planning that protects your interests and ensures your affairs can be managed if you become unable to handle them yourself. By understanding the different types of POAs, choosing appropriate agents, and creating properly executed documents, you can provide peace of mind for yourself and your family.

The key to successful power of attorney planning is starting early, choosing carefully, and regularly reviewing and updating your documents as your circumstances change. Remember that a POA is not just a legal document—it's a tool for protecting your rights and ensuring your wishes are carried out.

**Ready to protect your interests? Use this guide to understand your options and create the power of attorney documents that best meet your needs and circumstances.**`,
  excerpt: 'Complete guide to power of attorney documents. Learn the different types, when to use each, and how to create them to protect your rights and assets.',
  content_type: 'guide',
  category: 'estate-planning',
  difficulty_level: 'beginner',
  meta_title: 'Power of Attorney Guide - Protect Your Rights and Assets | SeniorSimple',
  meta_description: 'Complete guide to power of attorney documents. Learn the different types, when to use each, and how to create them to protect your interests.',
  meta_keywords: ['power of attorney guide', 'power of attorney', 'durable power of attorney', 'healthcare power of attorney', 'financial power of attorney', 'estate planning'],
  status: 'published',
  priority: 'high',
  featured: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  published_at: new Date().toISOString()
};

async function createPowerOfAttorneyGuide() {
  try {
    console.log('Creating Power of Attorney Guide...');
    
    const { data, error } = await supabase
      .from('articles')
      .insert([powerOfAttorneyGuide])
      .select();

    if (error) {
      console.error('Error creating power of attorney guide:', error);
      return;
    }

    console.log('✅ Power of Attorney Guide created successfully:', data[0].id);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the function
createPowerOfAttorneyGuide();
