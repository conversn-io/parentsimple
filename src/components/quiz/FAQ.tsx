"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqData = [
  {
    question: "What is an annuity?",
    answer: "An annuity is a financial product that provides guaranteed income payments, typically for retirement. It's designed to help protect against outliving your savings by providing a steady stream of income for life."
  },
  {
    question: "How do I know if an annuity is right for me?",
    answer: "Annuities are typically suitable for people who want guaranteed income, are concerned about market volatility, or want to supplement their retirement income. Our specialist will help determine if an annuity fits your specific financial goals."
  },
  {
    question: "What types of annuities are available?",
    answer: "There are several types including fixed annuities (guaranteed interest), variable annuities (market-based), and indexed annuities (market participation with downside protection). Each has different features and benefits."
  },
  {
    question: "Are there any fees or charges?",
    answer: "Annuities may have various fees depending on the type and features. Our specialist will explain all costs, fees, and charges associated with any recommended products so you can make an informed decision."
  },
  {
    question: "How long does the consultation take?",
    answer: "The initial consultation typically takes 15-30 minutes. This allows us to understand your goals and provide personalized recommendations. Follow-up calls may be scheduled if needed."
  },
  {
    question: "Is there any obligation to purchase?",
    answer: "Absolutely not. The consultation is completely free with no obligation to purchase anything. We're here to provide information and help you understand your options so you can make the best decision for your situation."
  }
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div key={index} className="border border-slate-200 rounded-lg">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <span className="font-semibold text-slate-800">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-slate-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-500" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-slate-600 mb-4">
            Have more questions? Our specialist is here to help.
          </p>
          <a 
            href="tel:+18777703306" 
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Call (877) 770-3306
          </a>
        </div>
      </div>
    </section>
  );
};

