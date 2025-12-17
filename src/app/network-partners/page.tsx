import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Network Partners | ParentSimple',
  description: 'Published partners available through ParentSimple for college planning, education savings, and family financial services.',
}

type Partner = {
  id: string
  name: string
  lender_type?: string | null
  description?: string | null
  highlights?: string[] | null
  states?: string[] | null
}

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://vpysqshhafthuxvokwqj.supabase.co'
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_QUIZ_ANON_KEY

async function fetchPartners(): Promise<{ partners: Partner[]; error?: string }> {
  if (!SUPABASE_ANON_KEY) {
    return { partners: [], error: 'Missing Supabase anon key for public partners view' }
  }
  
  // Try to fetch from lenders table (same structure as RateRoots)
  const url = `${SUPABASE_URL}/rest/v1/lenders?site_id=eq.parentsimple&is_published=eq.true&order=name.asc`
  try {
    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      next: { revalidate: 60 * 60 }, // revalidate hourly
    })
    if (!res.ok) {
      // If table doesn't exist or query fails, return empty with error
      return { partners: [], error: `Upstream ${res.status} ${res.statusText}` }
    }
    const data = (await res.json()) as Partner[]
    return { partners: data }
  } catch (err) {
    return { partners: [], error: `Fetch failed: ${String(err)}` }
  }
}

function groupByType(partners: Partner[]) {
  const groups: Record<string, Partner[]> = {}
  partners.forEach((p) => {
    // Map lender_type to partner categories for ParentSimple
    let key = 'other'
    if (p.lender_type === 'college_planning' || p.lender_type === 'education') {
      key = 'college_planning'
    } else if (p.lender_type === 'financial_planning' || p.lender_type === 'education_savings') {
      key = 'financial_planning'
    } else if (p.lender_type === 'insurance' || p.lender_type === 'estate_planning') {
      key = 'insurance_estate'
    } else {
      key = p.lender_type?.toLowerCase() || 'other'
    }
    groups[key] = groups[key] || []
    groups[key].push(p)
  })
  return groups
}

export default async function NetworkPartnersPage() {
  const { partners, error } = await fetchPartners()
  const groups = groupByType(partners)
  const total = partners.length

  // Fallback static list if database is not available
  const staticPartners = [
    { name: 'Empowerly', type: 'college_planning' },
    { name: 'Global Financial Impact', type: 'financial_planning' },
    { name: 'Legacy Financial Group', type: 'financial_planning' },
  ]

  const displayPartners = partners.length > 0 ? partners : staticPartners.map((p, i) => ({ 
    id: `static-${i}`, 
    name: p.name, 
    lender_type: p.type 
  } as Partner))

  return (
    <main className="min-h-screen bg-[#F9F6EF]">
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-bold text-[#1A2B49]">Network Partners</h1>
          <p className="text-[#1A2B49]/80">
            ParentSimple connects families with trusted Network Partners who provide college planning, education savings, financial planning, 
            and related services. These partners are independent third-party companies that may offer products or services of interest to families 
            navigating their children's educational journey.
          </p>
          {total > 0 && (
            <div className="flex flex-wrap items-center gap-3 text-sm text-[#1A2B49]/60">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#1A2B49]/10 px-3 py-1">
                <span className="w-2 h-2 rounded-full bg-[#9DB89D]" /> Published partners: {total}
              </span>
            </div>
          )}
          {error && partners.length === 0 && (
            <p className="text-sm text-red-600">
              Unable to load live directory ({error}). Showing static partner list.
            </p>
          )}
        </header>

        {displayPartners.length > 0 ? (
          <>
            {['college_planning', 'financial_planning', 'insurance_estate', 'other'].map((type) => {
              const list = groups[type] || []
              if (!list.length && type === 'other') {
                // Show all partners in 'other' if they don't match categories
                const otherPartners = displayPartners.filter(p => {
                  const pType = p.lender_type?.toLowerCase() || 'other'
                  return !['college_planning', 'education', 'financial_planning', 'education_savings', 'insurance', 'estate_planning'].includes(pType)
                })
                if (otherPartners.length === 0) return null
                return (
                  <section key={type} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold text-[#1A2B49]">Network Partners</h2>
                      <span className="text-sm text-[#1A2B49]/60">{otherPartners.length} partners</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {otherPartners.map((partner) => (
                        <div
                          key={partner.id || partner.name}
                          className="rounded-lg border border-[#1A2B49]/20 bg-white px-4 py-3 shadow-sm"
                        >
                          <p className="font-semibold text-[#1A2B49] truncate">{partner.name}</p>
                          {partner.description && (
                            <p className="text-sm text-[#1A2B49]/70 mt-1 line-clamp-2">{partner.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )
              }
              if (!list.length) return null
              return (
                <section key={type} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-[#1A2B49] capitalize">
                      {type === 'college_planning' ? 'College Planning & Admissions' :
                       type === 'financial_planning' ? 'Education Savings & Financial Planning' :
                       type === 'insurance_estate' ? 'Insurance & Estate Planning' :
                       'Other Partners'}
                    </h2>
                    <span className="text-sm text-[#1A2B49]/60">{list.length} partners</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {list.map((partner) => (
                      <div
                        key={partner.id || partner.name}
                        className="rounded-lg border border-[#1A2B49]/20 bg-white px-4 py-3 shadow-sm"
                      >
                        <p className="font-semibold text-[#1A2B49] truncate">{partner.name}</p>
                        {partner.description && (
                          <p className="text-sm text-[#1A2B49]/70 mt-1 line-clamp-2">{partner.description}</p>
                        )}
                        {partner.highlights && partner.highlights.length > 0 && (
                          <ul className="text-xs text-[#1A2B49]/60 mt-2 space-y-1">
                            {partner.highlights.slice(0, 2).map((highlight, idx) => (
                              <li key={idx}>• {highlight}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )
            })}
          </>
        ) : (
          <div className="rounded-lg border border-dashed border-[#1A2B49]/30 bg-white p-6 text-[#1A2B49]/60">
            No partners are published yet for ParentSimple. Once partners are marked published in the directory, they will appear here.
          </div>
        )}

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">How It Works</h2>
          <ol className="list-decimal pl-6 space-y-3 text-[#1A2B49]/80">
            <li>
              <strong>Submit Your Inquiry:</strong> Complete a quiz or form on ParentSimple to share information about your family's 
              college planning needs and goals.
            </li>
            <li>
              <strong>Get Matched:</strong> Based on your information, ParentSimple may connect you with relevant Network Partners 
              who can assist with your specific needs.
            </li>
            <li>
              <strong>Connect with Partners:</strong> Network Partners may contact you to provide information, answer questions, or 
              discuss their services. You are under no obligation to proceed with any Network Partner.
            </li>
            <li>
              <strong>Make Your Decision:</strong> All decisions regarding products, services, pricing, and terms are made directly 
              between you and the Network Partner. ParentSimple does not make recommendations or decisions on your behalf.
            </li>
          </ol>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">Important Information</h2>
          <div className="bg-[#F9F6EF] border-l-4 border-[#1A2B49] p-4 space-y-2">
            <p className="text-[#1A2B49]/80">
              <strong>ParentSimple's Role:</strong> ParentSimple is not a lender, creditor, financial advisor, insurance producer, or 
              agent. We provide technology and educational tools to help families explore options and connect with Network Partners.
            </p>
            <p className="text-[#1A2B49]/80">
              <strong>Compensation:</strong> ParentSimple may receive compensation from Network Partners in connection with consumer 
              inquiries. This compensation may influence which Network Partners appear or are matched.
            </p>
            <p className="text-[#1A2B49]/80">
              <strong>No Guarantees:</strong> Submitting an inquiry does not guarantee that you will receive an offer, approval, or 
              connection with any Network Partner. All eligibility determinations and offers are made solely by Network Partners.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">Your Privacy</h2>
          <p className="text-[#1A2B49]/80">
            When you submit an inquiry, you authorize ParentSimple to share your information with Network Partners. Network Partners 
            may use this information to evaluate your inquiry, provide information about their products or services, and contact you. 
            For more information about how we handle your data, please review our{' '}
            <a href="/privacy-policy" className="text-[#1A2B49] hover:underline font-semibold">Privacy Policy</a>.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">Questions?</h2>
          <p className="text-[#1A2B49]/80">
            If you have questions about our Network Partners or how the matching process works, please contact us at{' '}
            <a href="mailto:support@parentsimple.org" className="text-[#1A2B49] hover:underline font-semibold">support@parentsimple.org</a>.
          </p>
        </section>
      </div>
    </main>
  )
}
