'use client'

import { useState } from "react";
import Link from "next/link";
import { Calendar, Clock, CheckCircle, Phone, Mail, User } from "lucide-react";
import { useFunnelLayout } from "../../hooks/useFunnelFooter";

const Consultation = () => {
  useFunnelLayout(); // This sets both header and footer to 'funnel'

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredTime: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      console.log("Consultation form submitted:", formData);
      
      setSubmitStatus('success');
      // Redirect to consultation booked page
      setTimeout(() => {
        window.location.href = '/consultation-booked';
      }, 2000);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#36596A] to-[#82A6B1] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-6">
              Schedule Your Free Consultation
            </h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Get personalized retirement planning advice from our licensed specialists. 
              No cost, no obligation - just expert guidance for your financial future.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Consultation Form */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-serif font-semibold text-[#36596A] mb-6">
                Schedule Your Consultation
              </h2>
              
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                  Consultation scheduled successfully! Redirecting to confirmation page...
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  There was an error scheduling your consultation. Please try again.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36596A] focus:border-transparent"
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
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
                </div>
                
                <div>
                  <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time for Call
                  </label>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36596A] focus:border-transparent"
                  >
                    <option value="">Select preferred time</option>
                    <option value="morning">Morning (9 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                    <option value="evening">Evening (5 PM - 8 PM)</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Tell us about your retirement goals
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="What are your main retirement planning concerns or goals?"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36596A] focus:border-transparent resize-vertical"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#36596A] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2a4a5a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Scheduling...' : 'Schedule Free Consultation'}
                </button>
              </form>
            </div>

            {/* Benefits & Information */}
            <div className="space-y-8">
              {/* What's Included */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-serif font-semibold text-[#36596A] mb-6 flex items-center">
                  <Calendar className="h-6 w-6 mr-2" />
                  What's Included in Your Consultation
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-[#36596A] mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Personalized Retirement Analysis</h3>
                      <p className="text-gray-600 text-sm">Review your current financial situation and retirement goals</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-[#36596A] mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Indexed Annuity Education</h3>
                      <p className="text-gray-600 text-sm">Learn how indexed annuities can protect and grow your savings</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-[#36596A] mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Product Recommendations</h3>
                      <p className="text-gray-600 text-sm">Get specific product suggestions tailored to your needs</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-[#36596A] mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Q&A Session</h3>
                      <p className="text-gray-600 text-sm">Ask any questions about retirement planning or annuities</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-gradient-to-r from-[#36596A] to-[#82A6B1] text-white rounded-lg shadow-md p-8">
                <h3 className="text-2xl font-serif font-semibold mb-4">
                  Prefer to Call Directly?
                </h3>
                <p className="text-lg mb-6 opacity-90">
                  Speak with one of our retirement specialists right now.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-[#E4CDA1] mr-3" />
                    <span className="text-lg font-semibold">(888) 440-9669</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-[#E4CDA1] mr-3" />
                    <span>info@seniorsimple.com</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-[#E4CDA1] mr-3" />
                    <span>Monday - Friday: 8 AM - 6 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer is now handled by layout */}
    </div>
  );
};

export default Consultation;