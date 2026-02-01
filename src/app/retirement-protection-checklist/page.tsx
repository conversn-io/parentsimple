import { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, Shield, Calculator, Receipt, Clock, UserCheck, TrendingUp, DollarSign, Heart, ClipboardList } from 'lucide-react'
import InteractiveCheckbox from '@/components/checklist/InteractiveCheckbox'

export const metadata: Metadata = {
  title: 'Retirement Protection Checklist - 10 Essential Points Every Pre-Retiree Should Know',
  description: 'Complete this checklist to identify gaps in your retirement protection strategy. Essential for Americans with $250K+ in retirement savings.',
  keywords: ['retirement protection', 'retirement checklist', 'pre-retirement planning', 'retirement security', 'retirement strategy'],
}

export default function RetirementProtectionChecklistPage() {
  const checklistItems = [
    {
      id: 1,
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'EVALUATE YOUR CURRENT RISK LEVEL',
      subtitle: 'Calculate how much you could lose in a market crash',
      color: 'bg-red-500',
      items: [
        'Review your current portfolio allocation',
        'Calculate potential loss if market drops 30-40%',
        'Determine if you have time to recover from losses',
        'Ask: "Can I afford to lose this much 5 years before retirement?"',
      ],
    },
    {
      id: 2,
      icon: <Shield className="w-6 h-6" />,
      title: 'UNDERSTAND YOUR PROTECTION OPTIONS',
      subtitle: 'Not all retirement strategies offer the same protection',
      color: 'bg-amber-500',
      items: [
        { text: 'Traditional IRAs/401ks: NO downside protection', type: 'negative' },
        { text: 'Conservative portfolios: Still lose 10-20% in crashes', type: 'warning' },
        { text: 'Indexed annuities: Principal protection with growth potential', type: 'positive' },
        { text: 'Compare features: protection vs. growth vs. liquidity', type: 'info' },
      ],
    },
    {
      id: 3,
      icon: <Calculator className="w-6 h-6" />,
      title: 'CHECK YOUR REQUIRED MINIMUM DISTRIBUTIONS (RMDs)',
      subtitle: 'At age 73, the IRS forces withdrawals whether you need money or not',
      color: 'bg-purple-500',
      items: [
        'Calculate your projected RMD amounts',
        'Understand how RMDs affect your tax bracket',
        'Explore strategies to minimize or eliminate RMDs',
        'Consider accounts that aren\'t subject to RMDs',
      ],
    },
    {
      id: 4,
      icon: <Receipt className="w-6 h-6" />,
      title: 'ASSESS YOUR TAX EXPOSURE',
      subtitle: 'Retirement taxes can consume 30-40% of your savings',
      color: 'bg-teal-500',
      items: [
        'Calculate taxes on current retirement accounts',
        'Estimate the "tax bomb" your heirs will face',
        'Review Roth conversion opportunities',
        'Explore tax-advantaged retirement strategies',
      ],
    },
    {
      id: 5,
      icon: <Clock className="w-6 h-6" />,
      title: 'TEST YOUR RECOVERY ABILITY',
      subtitle: 'How long would it take to recover from a major loss?',
      color: 'bg-red-500',
      items: [
        'Review past market crashes (2008, 2020, 2022)',
        'Calculate recovery time based on your age',
        'Determine if you have enough working years left',
        'Reality check: Most don\'t have 5-10 years to recover',
      ],
    },
    {
      id: 6,
      icon: <UserCheck className="w-6 h-6" />,
      title: 'VERIFY YOUR QUALIFICATION STATUS',
      subtitle: 'Not everyone can access advanced protection strategies',
      color: 'bg-amber-500',
      items: [
        'Age limits (most strategies cap at age 85)',
        'Minimum account balance requirements ($250K+)',
        'Account type eligibility (401k, IRA, etc.)',
        'Health and insurability requirements',
        'Get a suitability review from licensed advisor',
      ],
    },
    {
      id: 7,
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'UNDERSTAND SEQUENCE OF RETURNS RISK',
      subtitle: 'Losing money early in retirement can be devastating',
      color: 'bg-purple-500',
      items: [
        { text: 'First 5 years of retirement are CRITICAL', type: 'critical' },
        'Early losses compound negatively for decades',
        'Protection is most important RIGHT before retirement',
        { text: 'Don\'t wait - protect your principal NOW', type: 'critical' },
      ],
    },
    {
      id: 8,
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'REVIEW YOUR INFLATION PROTECTION',
      subtitle: 'Your dollars lose 3% purchasing power every year',
      color: 'bg-teal-500',
      items: [
        'Calculate real value of your savings in 20 years',
        'Understand how inflation erodes retirement income',
        'Ensure your strategy includes growth potential',
        'Balance protection with inflation-beating returns',
      ],
    },
    {
      id: 9,
      icon: <Heart className="w-6 h-6" />,
      title: 'PLAN FOR HEALTHCARE COSTS',
      subtitle: 'Medical expenses are the #1 retirement budget killer',
      color: 'bg-red-500',
      items: [
        { text: 'Average couple needs $300K+ for healthcare', type: 'highlight' },
        'Out-of-pocket costs are rising faster than inflation',
        'Some retirement strategies offer healthcare benefits',
        'Don\'t let medical bills destroy your retirement plan',
      ],
    },
    {
      id: 10,
      icon: <ClipboardList className="w-6 h-6" />,
      title: 'CREATE A BACKUP PLAN',
      subtitle: 'Hope is not a strategy - have contingency plans',
      color: 'bg-amber-500',
      items: [
        'What if markets crash right before you retire?',
        'What if you\'re forced into early retirement?',
        'What if you live longer than expected?',
        { text: 'Have a written plan that protects against worst-case scenarios', type: 'highlight' },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      {/* Header Section */}
      <section className="py-16 px-6" style={{ background: 'linear-gradient(135deg, #36596A 0%, #82A6B1 100%)' }}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#36596A] font-bold text-2xl">SS</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-4">Retirement Protection Checklist</h1>
          <h2 className="text-xl md:text-2xl font-medium mb-4">10 Essential Points Every Pre-Retiree Should Know</h2>
          <div className="inline-block bg-white bg-opacity-20 px-6 py-2 rounded-full">
            <span className="text-sm font-medium text-[#36596A]">For Americans with $250K+ in Retirement Savings</span>
          </div>
        </div>
      </section>

      {/* Alert Banner */}
      <div className="bg-red-600 text-white p-4 text-center">
        <div className="max-w-4xl mx-auto flex items-center justify-center space-x-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="font-medium text-sm md:text-base">
            ATTENTION: This checklist could save your retirement from the next market crash
          </span>
        </div>
      </div>

      {/* Introduction */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg md:text-xl text-[#36596A] font-medium mb-4">
            Complete this checklist honestly and identify the gaps in your retirement protection strategy.
          </p>
          <p className="text-base md:text-lg text-gray-600">
            Each point includes action items you can implement immediately to strengthen your retirement security.
          </p>
        </div>
      </section>

      {/* Checklist Items */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {checklistItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start space-x-4">
                {/* Checkbox */}
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 border-2 border-[#36596A] rounded flex items-center justify-center cursor-pointer hover:bg-[#F5F5F0] transition-colors checklist-checkbox">
                    <CheckCircle2 className="w-4 h-4 text-[#36596A] opacity-0" />
                  </div>
                </div>

                {/* Icon */}
                <div className={`${item.color} w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0`}>
                  {item.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#36596A] mb-2">{item.id}. {item.title}</h3>
                  <p className="text-lg font-medium text-gray-700 mb-4">{item.subtitle}</p>
                  <ul className="space-y-2 text-gray-600">
                    {item.items.map((listItem, idx) => {
                      const isString = typeof listItem === 'string'
                      const text = isString ? listItem : listItem.text
                      const type = isString ? 'default' : listItem.type

                      return (
                        <li key={idx} className="flex items-start space-x-2">
                          {type === 'negative' ? (
                            <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          ) : type === 'warning' ? (
                            <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          ) : type === 'positive' ? (
                            <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          ) : type === 'critical' || type === 'highlight' ? (
                            <svg className="w-5 h-5 text-[#36596A] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-[#36596A] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          )}
                          <span className={type === 'critical' || type === 'highlight' ? 'font-semibold' : ''}>{text}</span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Next Steps Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-[#36596A] mb-4">Next Steps</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Complete this checklist honestly to identify the biggest gaps in your retirement protection strategy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#F5F5F0] p-6 rounded-lg border-l-4 border-green-500">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <h3 className="font-bold text-[#36596A]">Complete this checklist honestly</h3>
              </div>
            </div>

            <div className="bg-[#F5F5F0] p-6 rounded-lg border-l-4 border-amber-500">
              <div className="flex items-center space-x-3 mb-4">
                <svg className="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
                </svg>
                <h3 className="font-bold text-[#36596A]">Identify your biggest gaps and concerns</h3>
              </div>
            </div>

            <div className="bg-[#F5F5F0] p-6 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-center space-x-3 mb-4">
                <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <h3 className="font-bold text-[#36596A]">Schedule a complimentary suitability review</h3>
              </div>
            </div>

            <div className="bg-[#F5F5F0] p-6 rounded-lg border-l-4 border-purple-500">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-6 h-6 text-purple-500" />
                <h3 className="font-bold text-[#36596A]">Get a personalized protection strategy</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-6" style={{ background: 'linear-gradient(135deg, #36596A 0%, #82A6B1 100%)' }}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">Ready to Protect Your Retirement?</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
              </svg>
              <span className="text-lg">SeniorSimple.org | Retirement Rescue Division</span>
            </div>
            <p className="text-lg font-medium mb-6">Connect with a Licensed Retirement Rescue Advisor</p>
            <Link 
              href="/consultation"
              className="inline-block bg-[#36596A] text-white py-3 px-8 rounded-lg font-medium hover:bg-[#2a4a5a] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Schedule Your Complimentary Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 px-6 bg-gray-100">
        <div className="max-w-4xl mx-auto text-sm text-gray-600">
          <h3 className="font-bold text-[#36596A] mb-2 text-base">IMPORTANT DISCLAIMER</h3>
          <p className="mb-4">
            This checklist is for educational purposes only and does not constitute financial advice. Retirement Rescue strategies using indexed annuities are not suitable for everyone. A licensed advisor must conduct a suitability review to determine if these strategies are appropriate for your situation. Past performance does not guarantee future results.
          </p>
          <p className="text-xs text-gray-500">
            Insurance products are backed by the financial strength and claims-paying ability of the issuing insurance company. Withdrawals may be subject to surrender charges and tax implications. Please consult with a qualified professional before making any financial decisions.
          </p>
        </div>
      </section>

      {/* Interactive Checkbox Component */}
      <InteractiveCheckbox />
    </div>
  )
}

