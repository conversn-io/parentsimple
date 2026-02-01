'use client'

import { useEffect } from "react";
import Link from "next/link";
import { Clock, Phone, CheckCircle, Calendar, Mail, ArrowLeft } from "lucide-react";
import { useFunnelLayout } from "../../hooks/useFunnelFooter";

const ExpectCall = () => {
  useFunnelLayout(); // This sets both header and footer to 'funnel'

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Message */}
        <div className="bg-white rounded-lg shadow-md p-8 text-center mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Phone className="h-10 w-10 text-[#36596A]" />
          </div>
          
          <h1 className="text-3xl font-serif font-semibold text-[#36596A] mb-4">
            Expect Our Call Soon!
          </h1>
          
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Thank you for your interest in learning more about Retirement Rescue™ strategies. 
            One of our Retirement Rescue™ specialists will contact you within the next 24 hours.
          </p>
          
          <div className="bg-[#F5F5F0] rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-[#36596A] mb-4">What to Expect</h2>
            
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-[#36596A] mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Quick Call</h3>
                  <p className="text-sm text-gray-600">15-20 minute introduction call</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-[#36596A] mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">No Pressure</h3>
                  <p className="text-sm text-gray-600">Educational conversation only</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-[#36596A] mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Schedule Follow-up</h3>
                  <p className="text-sm text-gray-600">If you'd like to learn more</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call Timeline */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-serif font-semibold text-[#36596A] mb-6 text-center">
            When Will We Call?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Hours</h3>
              <div className="space-y-2 text-gray-600">
                <p><strong>Monday - Friday:</strong> 8:00 AM - 6:00 PM</p>
                <p><strong>Saturday:</strong> 9:00 AM - 2:00 PM</p>
                <p><strong>Sunday:</strong> Closed</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Time</h3>
              <div className="space-y-2 text-gray-600">
                <p>• Within 24 hours during business days</p>
                <p>• We'll call the number you provided</p>
                <p>• If we miss you, we'll leave a message</p>
                <p>• We'll try multiple times to reach you</p>
              </div>
            </div>
          </div>
        </div>

        {/* What We'll Discuss */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-serif font-semibold text-[#36596A] mb-6 text-center">
            What We'll Discuss
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Initial Questions</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Your current retirement situation</li>
                <li>• Your retirement timeline and goals</li>
                <li>• What you know about Retirement Rescue™ strategies</li>
                <li>• Any specific questions you have</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">We'll Explain</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• How Retirement Rescue™ strategies work</li>
                <li>• Benefits and potential drawbacks</li>
                <li>• Whether they might fit your situation</li>
                <li>• Next steps if you're interested</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-[#36596A] to-[#82A6B1] text-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-serif font-semibold mb-4">
            Questions Before We Call?
          </h2>
          <p className="text-lg mb-6 opacity-90">
            If you have any questions or need to update your contact information, reach out to us.
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

export default ExpectCall;