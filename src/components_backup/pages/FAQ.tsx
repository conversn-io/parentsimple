'use client'

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Shield, Phone, Mail } from 'lucide-react';
import Footer from "../Footer";

const FAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqData = [
    {
      question: "What is an indexed annuity?",
      answer: "An indexed annuity is a type of fixed annuity that offers the potential for higher returns by linking your interest earnings to the performance of a market index, such as the S&P 500, while protecting your principal from market losses."
    },
    {
      question: "How do indexed annuities protect my money?",
      answer: "Indexed annuities offer principal protection, meaning you cannot lose your initial investment due to market downturns. They typically provide a guaranteed minimum return, ensuring your money grows even if the market performs poorly."
    },
    {
      question: "What are the benefits of indexed annuities for retirement?",
      answer: "Indexed annuities provide market-linked growth potential without market risk, guaranteed income options, tax-deferred growth, and protection against longevity risk. They're ideal for conservative investors who want growth potential with downside protection."
    },
    {
      question: "How much can I invest in an indexed annuity?",
      answer: "Investment minimums vary by insurance company, typically starting around $5,000 to $10,000. There's usually no maximum limit, but larger investments may qualify for better terms and bonuses."
    },
    {
      question: "When can I access my money?",
      answer: "Most indexed annuities allow penalty-free withdrawals of up to 10% of your account value annually after the first year. Full withdrawals before age 59½ may incur IRS penalties, and surrender charges may apply during the initial surrender period."
    },
    {
      question: "What is a surrender period?",
      answer: "The surrender period is typically 5-10 years during which you may pay penalties for withdrawing more than the free withdrawal amount. Surrender charges usually decrease each year and eventually disappear."
    },
    {
      question: "How are indexed annuities taxed?",
      answer: "Indexed annuities grow tax-deferred, meaning you don't pay taxes on gains until you withdraw money. Withdrawals are taxed as ordinary income, and early withdrawals before age 59½ may incur a 10% IRS penalty."
    },
    {
      question: "What happens to my annuity when I die?",
      answer: "Most indexed annuities include a death benefit that pays your beneficiaries at least the amount you invested, or the current account value if higher. Some contracts offer enhanced death benefits for an additional cost."
    },
    {
      question: "Can I convert my annuity to guaranteed income?",
      answer: "Yes, most indexed annuities offer annuitization options that convert your account value into guaranteed lifetime income payments. Many also offer optional income riders for additional fees."
    },
    {
      question: "How do I choose the right indexed annuity?",
      answer: "Consider factors like participation rates, caps, floors, surrender periods, fees, and the financial strength of the insurance company. Working with a qualified financial professional can help you compare options and find the best fit for your situation."
    },
    {
      question: "Are there fees associated with indexed annuities?",
      answer: "Basic indexed annuities typically have no annual management fees, but may include mortality and expense charges. Optional riders for enhanced benefits usually carry additional fees of 0.25% to 1.5% annually."
    },
    {
      question: "What's the difference between fixed and indexed annuities?",
      answer: "Fixed annuities provide a guaranteed interest rate, while indexed annuities offer variable returns based on market index performance with downside protection. Indexed annuities provide more growth potential but with some complexity in how returns are calculated."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#36596A] to-[#82A6B1] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Get answers to common questions about indexed annuities and retirement planning
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md mb-8">
            <div className="p-8">
              <h2 className="text-2xl font-serif font-semibold text-center text-[#36596A] mb-8">
                Common Questions About Indexed Annuities
              </h2>
              
              <div className="space-y-4">
                {faqData.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleItem(index)}
                      className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 rounded-lg"
                    >
                      <h3 className="text-lg font-semibold text-[#36596A] pr-4">
                        {faq.question}
                      </h3>
                      {openItems.includes(index) ? (
                        <ChevronUp className="h-5 w-5 text-[#36596A] flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-[#36596A] flex-shrink-0" />
                      )}
                    </button>
                    
                    {openItems.includes(index) && (
                      <div className="px-6 pb-4">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="bg-gradient-to-r from-[#36596A] to-[#82A6B1] text-white rounded-lg shadow-md p-8 text-center">
            <Shield className="h-12 w-12 text-[#E4CDA1] mx-auto mb-4" />
            <h3 className="text-2xl font-serif font-semibold mb-4">
              Still Have Questions?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Our retirement specialists are here to help you understand your options
              and find the right solution for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/consultation"
                className="bg-[#E4CDA1] text-[#36596A] px-6 py-3 rounded-lg font-medium hover:bg-[#d4b885] transition-colors"
              >
                Schedule Free Consultation
              </Link>
              <div className="flex items-center justify-center gap-4 text-[#E4CDA1]">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  (888) 440-9669
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  info@seniorsimple.com
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default FAQ;