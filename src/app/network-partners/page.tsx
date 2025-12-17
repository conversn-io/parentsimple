import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Network Partners | ParentSimple',
  description: 'Published partners available through ParentSimple for college planning, education savings, and family financial services.',
}

export default function NetworkPartnersPage() {
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
          <p className="text-[#1A2B49]/80">
            When you submit an inquiry through ParentSimple, you may be connected with one or more Network Partners who can provide 
            information, guidance, or services related to your needs. All decisions regarding offers, eligibility, pricing, terms, and 
            availability are made solely by Network Partners.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-[#1A2B49]">Types of Network Partners</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-[#1A2B49]/20 p-6">
              <h3 className="text-xl font-semibold text-[#1A2B49] mb-2">College Planning & Admissions</h3>
              <p className="text-[#1A2B49]/80">
                Educational consultants, college counselors, and admissions advisors who help families navigate the college application 
                process, test preparation, and academic planning.
              </p>
            </div>
            
            <div className="bg-white rounded-lg border border-[#1A2B49]/20 p-6">
              <h3 className="text-xl font-semibold text-[#1A2B49] mb-2">Education Savings & Financial Planning</h3>
              <p className="text-[#1A2B49]/80">
                Financial advisors and planners specializing in 529 plans, education savings strategies, and family financial planning 
                to help parents prepare for their children's educational expenses.
              </p>
            </div>
            
            <div className="bg-white rounded-lg border border-[#1A2B49]/20 p-6">
              <h3 className="text-xl font-semibold text-[#1A2B49] mb-2">Insurance & Estate Planning</h3>
              <p className="text-[#1A2B49]/80">
                Insurance providers and estate planning professionals who offer life insurance, estate planning, and other financial 
                protection products for families.
              </p>
            </div>
          </div>
        </section>

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
