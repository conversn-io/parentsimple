
'use client'

import { useState } from "react";
import Link from "next/link";
import { Download, CheckCircle, Users, Star, Clock, BookOpen, Award, TrendingUp } from "lucide-react";
import { useFunnelLayout } from "../../hooks/useFunnelFooter";

const EbookLanding = () => {
  useFunnelLayout(); // This sets both header and footer to 'funnel'

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Form submitted:", formData);
      
      // Redirect to thank you page
      window.location.href = '/thank-you';
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#36596A] to-[#82A6B1] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Book Image */}
            <div className="lg:w-1/3 flex justify-center">
              <div className="relative">
                <img 
                  src="https://indexedannuitysecrets.com/wp-content/uploads/bb-plugin/cache/GS_Indexed-Annuity-Secrets_cov-V6-1-1024x1536-portrait-95d2808fee5ab66ba6093beb3c91b2bb-reslguxz71hd.jpg"
                  alt="Indexed Annuities Secrets Book Cover"
                  className="w-80 h-auto shadow-2xl rounded-lg transform hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute -top-4 -right-4 bg-[#E4CDA1] text-[#36596A] px-4 py-2 rounded-full text-lg font-bold transform rotate-12 shadow-lg">
                  FREE
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="lg:w-2/3 text-center lg:text-left">
              <div className="inline-flex items-center bg-[#E4CDA1] text-[#36596A] px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Download className="h-4 w-4 mr-2" />
                FREE INSTANT DOWNLOAD
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-serif font-semibold mb-4 leading-tight">
                The <span className="text-[#E4CDA1]">Secret</span> to 
                <br />Safe Retirement Growth
              </h1>
              
              <p className="text-2xl text-[#E4CDA1] font-semibold mb-6">
                "Indexed Annuities Secrets" - The Wall Street Insider's Guide
              </p>
              
              <p className="text-xl mb-8 leading-relaxed opacity-90">
                Discover how everyday Americans are protecting their life savings from market crashes 
                while still capturing stock market gains. This isn't available in bookstores - 
                it's the same strategy wealthy investors have used for decades.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 mb-8 text-sm opacity-90">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-[#E4CDA1] mr-2" />
                  Never lose money in market downturns
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-[#E4CDA1] mr-2" />
                  Participate in market upside
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-[#E4CDA1] mr-2" />
                  Guaranteed lifetime income
                </div>
              </div>
              
              <button 
                className="bg-[#E4CDA1] text-[#36596A] text-xl px-12 py-6 mb-6 shadow-lg rounded-lg font-semibold hover:bg-[#d4b885] transition-colors"
                onClick={() => setShowForm(true)}
              >
                <Download className="h-6 w-6 mr-3 inline" />
                Get Your Free Copy Now
              </button>
              
              <p className="text-sm opacity-75">
                No email spam • Instant access • Completely free forever
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-white border-y">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-3">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">50,000+</div>
              <div className="text-gray-600">Happy Readers</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mb-3">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">4.9/5</div>
              <div className="text-gray-600">Reader Rating</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-3">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">25+</div>
              <div className="text-gray-600">Years Experience</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-3">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">$2.5B+</div>
              <div className="text-gray-600">Assets Protected</div>
            </div>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What's Inside This Comprehensive Guide
            </h2>
            <p className="text-xl text-gray-600">
              68 pages of insider knowledge that could save you hundreds of thousands in retirement
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-3 text-[#36596A]">Chapter 1-3: The Foundation</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Why 401(k)s and IRAs aren't enough anymore</li>
                <li>• The hidden risks Wall Street won't tell you</li>
                <li>• How indexed annuities actually work</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-3 text-[#36596A]">Chapter 4-6: The Strategy</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Principal protection mechanisms explained</li>
                <li>• Participation rates and caps decoded</li>
                <li>• Income riders and withdrawal strategies</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-3 text-[#36596A]">Chapter 7-9: The Execution</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• How to evaluate annuity companies</li>
                <li>• Fee structures and what to avoid</li>
                <li>• Real client case studies and results</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-3 text-[#36596A]">Bonus Materials</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Comparison worksheet templates</li>
                <li>• Questions to ask every agent</li>
                <li>• Red flags checklist</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Real Stories from Real People
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "This book saved my retirement. After reading it, I moved $400,000 into an indexed annuity. 
                During the 2022 market crash, I slept peacefully while my neighbors lost 30% of their 401(k)s."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#36596A] bg-opacity-10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-[#36596A] font-semibold text-lg">MS</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Margaret S.</div>
                  <div className="text-sm text-gray-600">Age 67, Retired Teacher</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "I wish I'd found this 10 years ago. The strategies in this book would have saved me 
                $180,000 that I lost in 2008. Now my money is protected AND growing at 7% annually."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 font-semibold text-lg">RT</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Robert T.</div>
                  <div className="text-sm text-gray-600">Age 63, Small Business Owner</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "The income rider chapter alone was worth thousands to me. I'm now getting $2,800 monthly 
                for life, guaranteed. My husband and I finally have peace of mind about our future."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-purple-600 font-semibold text-lg">LM</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Linda M.</div>
                  <div className="text-sm text-gray-600">Age 71, Retired Nurse</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Why This Book Is Worth More Than Gold
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">$180,000</div>
              <div className="text-gray-300">Average amount people lose in market crashes</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">$0</div>
              <div className="text-gray-300">Amount our readers lost in 2022</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">$500+</div>
              <div className="text-gray-300">What financial advisors charge for this info</div>
            </div>
          </div>
          
          <p className="text-xl mb-8 text-gray-300">
            This isn't just another retirement book. It's a blueprint that has helped 50,000+ 
            Americans protect and grow their life savings, even during the worst market conditions.
          </p>
          
          <button 
            className="bg-[#E4CDA1] text-[#36596A] text-xl px-12 py-6 rounded-lg font-semibold hover:bg-[#d4b885] transition-colors shadow-lg"
            onClick={() => setShowForm(true)}
          >
            <Download className="h-6 w-6 mr-3 inline" />
            Get Your Free Copy Now
          </button>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#36596A] to-[#82A6B1]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-serif font-semibold text-white mb-6">
            Don't Let Another Market Crash Destroy Your Dreams
          </h2>
          <p className="text-xl text-white opacity-90 mb-8">
            Download your free copy now and discover how to protect your retirement, 
            no matter what Wall Street throws at you next.
          </p>
          
          <button 
            className="bg-white text-[#36596A] hover:bg-gray-100 text-xl px-12 py-6 shadow-lg rounded-lg font-semibold transition-colors"
            onClick={() => setShowForm(true)}
          >
            <Download className="h-6 w-6 mr-3 inline" />
            Yes, I Want My Free Book Now!
          </button>
          
          <p className="text-sm text-white opacity-75 mt-6">
            Join over 50,000 Americans who have already secured their financial future. 
            Your information is 100% secure and will never be shared.
          </p>
        </div>
      </section>

      {/* Lead Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-serif font-semibold text-[#36596A]">Get Your Free Book</h3>
              <button 
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  placeholder="Your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36596A] focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36596A] focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36596A] focus:border-transparent"
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#36596A] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2a4a5a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing...' : 'Download Free Book Now'}
              </button>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                Your information is secure and will never be shared. You may receive follow-up communications about retirement planning.
              </p>
            </form>
          </div>
        </div>
      )}
      
      {/* Footer is now handled by layout */}
    </div>
  );
};

export default EbookLanding;
