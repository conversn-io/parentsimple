
'use client'

import { useState } from "react";
import { Shield, Phone, Mail, MapPin, Clock } from "lucide-react";
import Footer from "../Footer";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      
      setSubmitStatus('success');
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
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
              Contact SeniorSimple
            </h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Get in touch with our retirement planning experts. We're here to help secure your financial future.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-serif font-semibold text-[#36596A] mb-6">
                Send Us a Message
              </h2>
              
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                  Thank you for contacting us! We'll get back to you within 24 hours.
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  There was an error sending your message. Please try again.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
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
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(888) 440-9669"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36596A] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What can we help you with?"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36596A] focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    placeholder="Tell us about your retirement planning needs..."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36596A] focus:border-transparent resize-vertical"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#36596A] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2a4a5a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-serif font-semibold text-[#36596A] mb-6 flex items-center">
                  <Shield className="h-6 w-6 mr-2" />
                  Get in Touch
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-[#36596A] mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">Phone</h3>
                      <p className="text-gray-600">(888) 440-9669</p>
                      <p className="text-sm text-gray-500">Call for immediate assistance</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-[#36596A] mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">Email</h3>
                      <p className="text-gray-600">info@seniorsimple.com</p>
                      <p className="text-sm text-gray-500">We respond within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-[#36596A] mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">Office Address</h3>
                      <p className="text-gray-600">
                        123 Financial Plaza<br />
                        Suite 400<br />
                        Retirement City, RC 12345
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Clock className="h-6 w-6 text-[#36596A] mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">Office Hours</h3>
                      <div className="text-gray-600 space-y-1">
                        <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                        <p>Saturday: 9:00 AM - 2:00 PM</p>
                        <p>Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why Choose Us */}
              <div className="bg-gradient-to-r from-[#36596A] to-[#82A6B1] text-white rounded-lg shadow-md p-8">
                <h3 className="text-2xl font-serif font-semibold mb-4">
                  Why Choose SeniorSimple?
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 text-[#E4CDA1] mt-1 mr-3 flex-shrink-0" />
                    <span>Licensed and experienced retirement specialists</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 text-[#E4CDA1] mt-1 mr-3 flex-shrink-0" />
                    <span>Personalized indexed annuity solutions</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 text-[#E4CDA1] mt-1 mr-3 flex-shrink-0" />
                    <span>Free consultations and ongoing support</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 text-[#E4CDA1] mt-1 mr-3 flex-shrink-0" />
                    <span>A+ rated insurance company partnerships</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Contact;
