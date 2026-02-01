'use client'

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle, Calendar, Clock, Phone, Mail, ArrowLeft } from "lucide-react";
import { useFunnelLayout } from "../../hooks/useFunnelFooter";

const ConsultationConfirmed = () => {
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
            Consultation Confirmed!
          </h1>
          
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Your consultation has been confirmed and added to our calendar. 
            We're looking forward to helping you with your retirement planning goals.
          </p>
          
          <div className="bg-[#F5F5F0] rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-[#36596A] mb-4">Consultation Details</h2>
            
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-[#36596A] mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Date & Time</h3>
                  <p className="text-sm text-gray-600">As scheduled during booking</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-[#36596A] mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Duration</h3>
                  <p className="text-sm text-gray-600">30-45 minutes</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-[#36596A] mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Phone Call</h3>
                  <p className="text-sm text-gray-600">We'll call the number you provided</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-[#36596A] mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Confirmation Email</h3>
                  <p className="text-sm text-gray-600">Check your inbox for details</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preparation Tips */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-serif font-semibold text-[#36596A] mb-6 text-center">
            How to Prepare for Your Consultation
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Have Ready</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Current retirement account statements</li>
                <li>• Information about your retirement goals</li>
                <li>• Questions about indexed annuities</li>
                <li>• Your preferred retirement timeline</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">We'll Discuss</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Your current financial situation</li>
                <li>• Retirement income strategies</li>
                <li>• How indexed annuities work</li>
                <li>• Personalized recommendations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-[#36596A] to-[#82A6B1] text-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-serif font-semibold mb-4">
            Need to Reschedule?
          </h2>
          <p className="text-lg mb-6 opacity-90">
            If you need to reschedule or have any questions, please contact us as soon as possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:8884409669"
              className="bg-[#E4CDA1] text-[#36596A] px-6 py-3 rounded-lg font-medium hover:bg-[#d4b885] transition-colors flex items-center justify-center"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call (888) 440-9669
            </a>
            <Link 
              href="/contact"
              className="bg-white text-[#36596A] px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <Mail className="h-4 w-4 mr-2" />
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

export default ConsultationConfirmed;