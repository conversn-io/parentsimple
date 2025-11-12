'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { 
  CheckCircle, 
  Shield, 
  TrendingUp, 
  DollarSign,
  AlertTriangle,
  Star,
  Users,
  Award,
  ArrowRight,
  Phone,
  Mail,
  Lock,
  Calculator,
  PiggyBank,
  Target,
  Zap,
  Clock
} from 'lucide-react'

export default function RetirementRescuePage() {
  useEffect(() => {
    document.title = "Retirement Rescue™ - Why Wealthy Americans Are Rushing to This Little-Known Strategy"
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', "Discover the retirement strategy that's helping Americans with $250k+ protect their savings from market crashes while still participating in growth. See if you qualify.")
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      
      {/* Header Alert Bar */}
      <div className="bg-red-600 text-white py-2 px-4 text-center text-sm font-medium">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          ATTENTION: AMERICANS WITH MORE THAN $250K IN RETIREMENT SAVINGS
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-[#36596A] to-[#2a4a5a] text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Why Are Average Americans Rushing To 
              <span className="block text-orange-300">Rescue Their Retirement?</span>
            </h1>
            <div className="w-32 h-1 bg-orange-300 mx-auto mb-8"></div>
            <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in-delay max-w-4xl mx-auto">
              It's True…You May Be Able To <strong>Rescue Your Retirement</strong> From Market Crashes and Taxes
            </p>
            {/* Removed CTA button from hero per request */}
          </div>

          {/* Testimonials Row */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 animate-fade-in-delay-3">
              <div className="flex items-center mb-4">
                <Image
                  src="/images/retirement-rescue/avatar-1.jpg"
                  alt="Margaret S."
                  width={50}
                  height={50}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <p className="font-semibold">Margaret S.</p>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm italic">
                "I was so tired of worrying about market crashes, and now I have guaranteed growth with upside potential because of the Retirement Rescue team."
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 animate-fade-in-delay-4">
              <div className="flex items-center mb-4">
                <Image
                  src="/images/retirement-rescue/avatar-2.jpg"
                  alt="Robert K."
                  width={50}
                  height={50}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <p className="font-semibold">Robert K.</p>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm italic">
                "Now I never have to worry about outliving my money. Peace of mind!"
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 animate-fade-in-delay-4">
              <div className="flex items-center mb-4">
                <Image
                  src="/images/retirement-rescue/avatar-3.jpg"
                  alt="John and Susan P."
                  width={50}
                  height={50}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <p className="font-semibold">John and Susan P.</p>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm italic">
                "We rescued our retirement assets from market risk and got tax advantages too! We would definitely recommend Retirement Rescue."
              </p>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="flex flex-col items-center justify-center mt-16 animate-bounce">
            <div className="text-white/80 text-sm mb-2 font-medium">Learn More Below</div>
            <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/80 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              It's True, Now Could Be The Best Time To 
              <span className="block bg-gradient-to-r from-[#36596A] to-[#2a4a5a] bg-clip-text text-transparent">Rescue Your Retirement</span>
            </h2>
            <div className="w-24 h-1 bg-[#36596A] mx-auto mb-8"></div>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto">
              Dear Reader,
            </p>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto mt-4">
              <strong>The window of opportunity is closing fast</strong>…
            </p>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto mt-4">
              With market volatility at historic highs and traditional retirement accounts offering no protection from crashes...
            </p>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto mt-4">
              Now is the best time to <strong>protect your investments and secure your retirement income</strong>.
            </p>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto mt-6">
              Why is the Retirement Rescue™ quickly becoming the go-to strategy for the nation's elite?
            </p>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto mt-4">
              It's because there is a perfect storm on the horizon…
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-center hover:shadow-xl transition-shadow">
              <TrendingUp className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Market Crashes</h3>
              <p className="text-gray-600 text-sm">
                Stock market crashes can destroy decades of savings overnight
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-center hover:shadow-xl transition-shadow">
              <DollarSign className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Inflation Risk</h3>
              <p className="text-gray-600 text-sm">
                Rising costs are eating away at your purchasing power
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-center hover:shadow-xl transition-shadow">
              <Clock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Required Distributions</h3>
              <p className="text-gray-600 text-sm">
                Traditional accounts force you to take RMDs at age 73
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-center hover:shadow-xl transition-shadow">
              <Calculator className="w-12 h-12 text-[#36596A] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tax Burden</h3>
              <p className="text-gray-600 text-sm">
                Your heirs are forced to pay taxes on traditional accounts
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg text-gray-700 mb-4">
              You might be saying, <em>"I've heard of retirement strategies before, and I don't want to give up market upside."</em>
            </p>
            <p className="text-lg text-gray-700 mb-8">
              Well, there's good news.
            </p>
            <p className="text-xl font-semibold text-[#36596A]">
              With Retirement Rescue™, you get market upside potential with downside protection.
            </p>
          </div>
        </div>
      </section>

      {/* What Is Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              What Is Retirement Rescue™?
            </h2>
            <div className="w-24 h-1 bg-[#36596A] mx-auto mb-8"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-lg text-gray-700 mb-6">
                Simply put...
              </p>
              <p className="text-lg text-gray-700 mb-6">
                It's when you move money from a traditional retirement account (like a 401(k) or traditional IRA) into a <strong>Retirement Rescue Account</strong>.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                But unlike traditional investments (where you can lose money in market downturns), <strong>you get potential for growth when markets go up, but your principal is protected when markets go down</strong>.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Once in the Retirement Rescue account, the money grows tax-deferred, and you can <strong>convert it to guaranteed lifetime income</strong>.
              </p>
              <p className="text-lg text-gray-700">
                It's a legal way to "<strong><em>have your cake and eat it too</em></strong>" - market upside potential with downside protection!
              </p>
            </div>
            <div className="text-center">
              <div className="relative w-full rounded-lg overflow-hidden">
                <Image
                  src="/images/retirement-rescue/hero-retirement-couple.jpg"
                  alt="Happy senior couple enjoying secure retirement"
                  width={600}
                  height={400}
                  className="w-full h-auto rounded-lg"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              With Retirement Rescue™:
            </h2>
            <div className="w-24 h-1 bg-[#36596A] mx-auto mb-8"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Shield className="w-8 h-8 text-[#36596A]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Never Lose Your Principal</h3>
                <p className="text-gray-600">
                  Your money is protected from market downturns - you never lose your initial investment.
                </p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex items-start space-x-4">
              <div className="flex-shrink-0">
                <TrendingUp className="w-8 h-8 text-[#36596A]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Participate in Market Gains</h3>
                <p className="text-gray-600">
                  When markets go up, you benefit from the growth potential.
                </p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex items-start space-x-4">
              <div className="flex-shrink-0">
                <PiggyBank className="w-8 h-8 text-[#36596A]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tax-Deferred Growth</h3>
                <p className="text-gray-600">
                  Your money grows without being taxed until you withdraw it.
                </p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Target className="w-8 h-8 text-[#36596A]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Guaranteed Income Options</h3>
                <p className="text-gray-600">
                  Convert to lifetime income that you can never outlive.
                </p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Lock className="w-8 h-8 text-[#36596A]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Legacy Protection</h3>
                <p className="text-gray-600">
                  Protect your loved ones with death benefits and inheritance solutions.
                </p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Zap className="w-8 h-8 text-[#36596A]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Required Distributions</h3>
                <p className="text-gray-600">
                  Unlike 401(k)s and IRAs, no forced withdrawals at age 73.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catch Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            There Must Be A Catch, Right?
          </h2>
          <div className="w-24 h-1 bg-[#36596A] mx-auto mb-12"></div>
          
          <p className="text-lg text-gray-700 mb-8">
            Well, there's actually two...
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-orange-50 p-8 rounded-xl border border-orange-200">
              <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">The first catch</h3>
              <p className="text-gray-700">
                This strategy works best if you have more than <strong>$250k saved for retirement</strong>.
              </p>
            </div>
            
            <div className="bg-blue-50 p-8 rounded-xl border border-blue-200">
              <div className="w-12 h-12 bg-[#36596A] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">The second catch</h3>
              <p className="text-gray-700">
                You can't set it up yourself. You must speak with a <strong>Licensed Retirement Rescue Advisor</strong> to set this type of account up.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-Qualification Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-[#36596A] to-[#2a4a5a] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            What Are Americans Like You Doing To Prequalify For 
            <span className="text-orange-300"> Retirement Rescue™ Protection?</span>
          </h2>
          <div className="w-32 h-1 bg-orange-300 mx-auto mb-12"></div>
          
          <p className="text-xl mb-8 opacity-90">
            You may prequalify for <strong>Retirement Rescue™ if you have more than $250k saved for retirement</strong> in a 401(k) or IRA.
          </p>
          <p className="text-lg mb-12 opacity-80">
            However, there are a few more steps you must take.
          </p>
          <p className="text-lg mb-8">
            To discover if you prequalify for Retirement Rescue protection, please complete the following:
          </p>
          
          {/* CTA Button to Quiz */}
          <div className="mt-8">
            <Link
              href="/quiz"
              className="relative inline-flex items-center bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white px-8 py-4 rounded-lg font-bold text-xl shadow-2xl hover:shadow-yellow-500/50 transform hover:scale-105 transition-all duration-300 animate-pulse hover:animate-none"
              style={{
                boxShadow: '0 0 20px rgba(251, 191, 36, 0.4), 0 0 40px rgba(251, 191, 36, 0.2), 0 0 60px rgba(251, 191, 36, 0.1)',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }}
            >
              <span className="relative z-10">Start Your Retirement Rescue™ Quiz</span>
              <ArrowRight className="w-6 h-6 ml-2 relative z-10" />
              {/* Gradient overlay for extra shine */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-lg"></div>
            </Link>
          </div>
        </div>
      </section>

      {/* Licensed Advisor Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              What Is A Licensed Retirement Rescue™ Advisor?
            </h2>
            <div className="w-24 h-1 bg-[#36596A] mx-auto mb-8"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-lg text-gray-700 mb-6">
                <strong>A Licensed Retirement Rescue™ Advisor</strong> has earned a special license required by your state...
              </p>
              <p className="text-lg text-gray-700 mb-6">
                This is often different than your typical financial advisor.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                This allows them to work directly with <strong>Insurance Companies that offer Retirement Rescue™ strategies</strong>.
              </p>
              <p className="text-lg text-gray-700">
                And allows them to be certified as a Licensed Retirement Rescue™ Advisor.
              </p>
            </div>
            <div className="text-center">
              <div className="relative w-full rounded-lg overflow-hidden">
                <Image
                  src="/images/retirement-rescue/professional-advisor.jpg"
                  alt="Professional financial advisor"
                  width={600}
                  height={400}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Schedule Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Why Should I Schedule My Complimentary 
            <span className="bg-gradient-to-r from-[#36596A] to-[#2a4a5a] bg-clip-text text-transparent"> Retirement Rescue™ Suitability Review Call?</span>
          </h2>
          <div className="w-24 h-1 bg-[#36596A] mx-auto mb-12"></div>
          
          <p className="text-lg text-gray-700 mb-8">
            <strong>Unfortunately, only 30%</strong> of prequalified Americans can actually implement a Retirement Rescue™ strategy.
          </p>
          <p className="text-lg text-gray-700 mb-8">
            There are legal restrictions like the types of accounts you have, and how long you've been funding them for.
          </p>
          <p className="text-lg text-gray-700 mb-8">
            To complete your <strong>qualification and provide a customized and personalized Retirement Rescue™ strategy</strong>, your Licensed Retirement Rescue™ Advisor will need 5 - 15 minutes so they can determine if a Retirement Rescue™ is suitable for you.
          </p>
          <p className="text-lg text-gray-700 mb-8">
            Like a mortgage, once you're pre-qualified, you need to speak with a banker.
          </p>
          <p className="text-lg text-gray-700 mb-12">
            This is no different.
          </p>
          
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 mb-8">
            <p className="text-lg font-semibold text-gray-900 mb-4">
              Your Licensed Retirement Rescue™ Advisor will be the first to tell you that a Retirement Rescue™ will not work for you.
            </p>
            <p className="text-lg text-[#36596A] font-semibold">
              Don't wait, and begin the suitability process by completing the brief survey above.
            </p>
          </div>
          
          <p className="text-sm text-gray-600 italic">
            ** The Retirement Rescue strategy works best if you have more than $250k in retirement savings **
          </p>
        </div>
      </section>
    </div>
  );
}
