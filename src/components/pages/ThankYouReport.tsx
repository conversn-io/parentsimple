'use client'

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle, Clock, FileText, ArrowLeft } from "lucide-react";
import { useFunnelLayout } from "../../hooks/useFunnelFooter";

const ThankYouReport = () => {
  useFunnelLayout(); // This sets both header and footer to 'funnel'

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="bg-white rounded-lg shadow-md p-8 text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-serif font-semibold text-[#36596A] mb-4">
            Thank You for Your Request!
          </h1>
          
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Your free book download has been initiated and you should receive it shortly. 
            We've also received your information and one of our retirement specialists will be in touch.
          </p>
          
          <div className="bg-[#F5F5F0] rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-[#36596A] mb-4">What Happens Next?</h2>
            
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-[#36596A] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Download Your Book</h3>
                  <p className="text-sm text-gray-600">Check your email for the download link to "Indexed Annuities Secrets"</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-[#36596A] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Expect Our Call</h3>
                  <p className="text-sm text-gray-600">A retirement specialist will contact you within 24 hours</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-[#36596A] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Free Consultation</h3>
                  <p className="text-sm text-gray-600">Discuss your retirement goals and get personalized advice</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-serif font-semibold text-[#36596A] mb-6 text-center">
            While You Wait, Explore More Resources
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Link 
              href="/articles"
              className="flex items-start space-x-4 p-4 rounded-lg hover:bg-[#F5F5F0] transition-colors"
            >
              <FileText className="h-8 w-8 text-[#36596A] mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Read Our Articles</h3>
                <p className="text-sm text-gray-600">Discover more retirement planning insights and strategies</p>
              </div>
            </Link>
            
            <Link 
              href="/faq"
              className="flex items-start space-x-4 p-4 rounded-lg hover:bg-[#F5F5F0] transition-colors"
            >
              <Clock className="h-8 w-8 text-[#36596A] mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Frequently Asked Questions</h3>
                <p className="text-sm text-gray-600">Get answers to common questions about indexed annuities</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-[#36596A] to-[#82A6B1] text-white rounded-lg shadow-md p-8 mt-8 text-center">
          <h2 className="text-2xl font-serif font-semibold mb-4">
            Questions? We're Here to Help
          </h2>
          <p className="text-lg mb-6 opacity-90">
            If you have any immediate questions or concerns, don't hesitate to reach out.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:8884409669"
              className="bg-[#E4CDA1] text-[#36596A] px-6 py-3 rounded-lg font-medium hover:bg-[#d4b885] transition-colors"
            >
              Call (888) 440-9669
            </a>
            <Link 
              href="/contact"
              className="bg-white text-[#36596A] px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Send a Message
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link 
            href="/"
            className="inline-flex items-center text-[#36596A] hover:text-[#2a4a5a] transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Homepage
          </Link>
        </div>
      </div>
      
      {/* Footer is now handled by layout */}
    </div>
  );
};

export default ThankYouReport;