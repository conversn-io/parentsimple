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
  programs?: Array<{ name?: string | null }> | null
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
  
  // Use the public view with site filtering (mirroring RateRoots structure)
  const url = `${SUPABASE_URL}/rest/v1/lenders_with_programs_public?site_id=eq.parentsimple&is_published=eq.true&order=name.asc`
  try {
    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      next: { revalidate: 60 * 60 }, // revalidate hourly
    })
    if (!res.ok) {
      // If view doesn't exist, try falling back to lenders table
      const fallbackUrl = `${SUPABASE_URL}/rest/v1/lenders?site_id=eq.parentsimple&is_published=eq.true&order=name.asc`
      const fallbackRes = await fetch(fallbackUrl, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        next: { revalidate: 60 * 60 },
      })
      
      if (!fallbackRes.ok) {
        return { partners: [], error: `Upstream ${res.status} ${res.statusText}` }
      }
      const fallbackData = (await fallbackRes.json()) as Partner[]
      return { partners: fallbackData }
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
    const type = p.lender_type?.toLowerCase() || 'other'
    let key = 'other'
    
    if (['college_planning', 'education', 'admissions'].includes(type)) {
      key = 'college_planning'
    } else if (['financial_planning', 'education_savings', '529'].includes(type)) {
      key = 'financial_planning'
    } else if (['insurance', 'estate_planning', 'protection'].includes(type)) {
      key = 'insurance_estate'
    } else {
      key = type
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

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-bold text-slate-900">Network Partners</h1>
          <p className="text-slate-700">
            These published partners are available through ParentSimple. We include specialists in college planning, education savings, 
            and family financial services, filtered to the ParentSimple site and marked as published in our directory.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
              <span className="w-2 h-2 rounded-full bg-green-500" /> Published partners: {total}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
              Admissions: {groups.college_planning?.length ?? 0}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
              Financial: {groups.financial_planning?.length ?? 0}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
              Insurance: {groups.insurance_estate?.length ?? 0}
            </span>
          </div>
          {error && total === 0 && (
            <p className="text-sm text-red-600">
              Unable to load live directory ({error}). Showing no partners until the connection is restored.
            </p>
          )}
        </header>

        {['college_planning', 'financial_planning', 'insurance_estate', 'other'].map((type) => {
          const list = groups[type] || []
          if (!list.length) return null
          
          const sectionTitle = 
            type === 'college_planning' ? 'College Planning & Admissions' :
            type === 'financial_planning' ? 'Education Savings & Financial Planning' :
            type === 'insurance_estate' ? 'Insurance & Estate Planning' :
            'Other Partners';

          return (
            <section key={type} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-slate-900">{sectionTitle}</h2>
                <span className="text-sm text-slate-600">{list.length} partners</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {list.map((partner) => (
                  <div
                    key={partner.id || partner.name}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm"
                  >
                    <p className="font-semibold text-slate-900 truncate">{partner.name}</p>
                    {partner.description && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{partner.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )
        })}

        {!partners.length && !error && (
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-slate-600">
            No partners are published yet for ParentSimple. Once partners are marked published in the directory, they will appear here.
          </div>
        )}

        <div className="pt-12 border-t border-slate-100 space-y-12">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900">How It Works</h2>
            <ol className="list-decimal pl-6 space-y-3 text-slate-700">
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
            <h2 className="text-2xl font-semibold text-slate-900">Important Information</h2>
            <div className="bg-slate-50 border-l-4 border-slate-400 p-4 space-y-2">
              <p className="text-slate-700 text-sm">
                <strong>ParentSimple's Role:</strong> ParentSimple is not a lender, creditor, financial advisor, insurance producer, or 
                agent. We provide technology and educational tools to help families explore options and connect with Network Partners.
              </p>
              <p className="text-slate-700 text-sm">
                <strong>Compensation:</strong> ParentSimple may receive compensation from Network Partners in connection with consumer 
                inquiries. This compensation may influence which Network Partners appear or are matched.
              </p>
              <p className="text-slate-700 text-sm">
                <strong>No Guarantees:</strong> Submitting an inquiry does not guarantee that you will receive an offer, approval, or 
                connection with any Network Partner. All eligibility determinations and offers are made solely by Network Partners.
              </p>
            </div>
          </section>

          <section className="space-y-4 text-sm text-slate-500">
            <h2 className="text-lg font-semibold text-slate-900">Your Privacy</h2>
            <p>
              When you submit an inquiry, you authorize ParentSimple to share your information with Network Partners. Network Partners 
              may use this information to evaluate your inquiry, provide information about their products or services, and contact you. 
              For more information about how we handle your data, please review our{' '}
              <a href="/privacy-policy" className="text-slate-900 hover:underline font-semibold">Privacy Policy</a>.
            </p>
            <p>
              If you have questions about our Network Partners or how the matching process works, please contact us at{' '}
              <a href="mailto:support@parentsimple.org" className="text-slate-900 hover:underline font-semibold">support@parentsimple.org</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
