'use client'

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle, Download, FileText, Phone, Mail, ArrowLeft } from "lucide-react";
import { useFunnelLayout } from "../../hooks/useFunnelFooter";

const BookConfirmation = () => {
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
            Book Download Confirmed!
          </h1>
          
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Your free book "Indexed Annuities Secrets" has been sent to your email. 
            Check your inbox (and spam folder) for the download link.
          </p>
          
          <div className="bg-[#F5F5F0] rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-[#36596A] mb-4">What's Next?</h2>
            
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-[#36596A] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Check Your Email</h3>
                  <p className="text-sm text-gray-600">Download link sent to your inbox</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-[#36596A] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Read the Book</h3>
                  <p className="text-sm text-gray-600">68 pages of expert insights</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-[#36596A] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Schedule Consultation</h3>
                  <p className="text-sm text-gray-600">Get personalized advice</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Book Details */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-serif font-semibold text-[#36596A] mb-6 text-center">
            About Your Free Book
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 text-[#36596A] mr-2" />
                What You'll Learn
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• How indexed annuities protect your principal</li>
                <li>• Strategies to participate in market gains</li>
                <li>• Income planning for retirement</li>
                <li>• How to evaluate different products</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Download className="h-5 w-5 text-[#36596A] mr-2" />
                Download Details
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• PDF format for easy reading</li>
                <li>• 68 pages of expert content</li>
                <li>• Includes bonus worksheets</li>
                <li>• Lifetime access to updates</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-[#36596A] to-[#82A6B1] text-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-serif font-semibold mb-4">
            Ready to Take the Next Step?
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Schedule a free consultation to discuss how indexed annuities can work for your specific situation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/consultation"
              className="bg-[#E4CDA1] text-[#36596A] px-6 py-3 rounded-lg font-medium hover:bg-[#d4b885] transition-colors"
            >
              Schedule Free Consultation
            </Link>
            <a 
              href="tel:8884409669"
              className="bg-white text-[#36596A] px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call (888) 440-9669
            </a>
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

export default BookConfirmation;