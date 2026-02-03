'use client'

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle, Calendar, Clock, Phone, Mail, ArrowLeft } from "lucide-react";
import { useFunnelLayout } from "../../hooks/useFunnelFooter";

const ConsultationBooked = () => {
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
            Consultation Successfully Scheduled!
          </h1>
          
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Thank you for scheduling your free consultation with SeniorSimple. 
            One of our licensed retirement specialists will contact you within 24 hours.
          </p>
          
          <div className="bg-[#F5F5F0] rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-[#36596A] mb-4">What Happens Next?</h2>
            
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-[#36596A] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Confirmation Call</h3>
                  <p className="text-sm text-gray-600">We'll call to confirm your appointment and preferred time</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-[#36596A] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Consultation Call</h3>
                  <p className="text-sm text-gray-600">30-45 minute discussion about your retirement goals</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-[#36596A] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Personalized Plan</h3>
                  <p className="text-sm text-gray-600">Receive customized recommendations for your situation</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What to Expect */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-serif font-semibold text-[#36596A] mb-6 text-center">
            What to Expect During Your Consultation
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 text-[#36596A] mr-2" />
                During the Call
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Review your current retirement savings</li>
                <li>• Discuss your retirement timeline and goals</li>
                <li>• Explain how indexed annuities work</li>
                <li>• Answer all your questions</li>
                <li>• Provide personalized recommendations</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 text-[#36596A] mr-2" />
                What You'll Receive
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Customized retirement analysis</li>
                <li>• Product comparisons and options</li>
                <li>• Written summary of recommendations</li>
                <li>• Educational materials</li>
                <li>• Ongoing support (no pressure)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-[#36596A] to-[#82A6B1] text-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-serif font-semibold mb-4">
            Questions Before Your Consultation?
          </h2>
          <p className="text-lg mb-6 opacity-90">
            If you need to reschedule or have any questions, don't hesitate to reach out.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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

export default ConsultationBooked;