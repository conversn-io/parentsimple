
'use client';

import { useState } from "react";
import { ArrowLeft, CheckCircle, Mail, Phone, User } from "lucide-react";

interface FinancialContactFormProps {
  answers: Record<string, string>;
  onSubmissionComplete: () => void;
  onBack: () => void;
}

const FinancialContactForm = ({ answers, onSubmissionComplete, onBack }: FinancialContactFormProps) => {
  const [formData, setFormData] = useState({
    name: answers.name || "",
    email: answers.email || "",
    phone: answers.phone || "",
    preferredContact: "email"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    setTimeout(() => {
      onSubmissionComplete();
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <section className="py-8 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="max-w-2xl mx-auto w-full">
          <div className="shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-lg">
            <div className="p-12 text-center">
              <div className="animate-scale-in">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Thank You!
                </h2>
                <p className="text-gray-600 text-lg mb-6">
                  Your financial health report has been sent to your email. 
                  A financial advisor will contact you within 24 hours.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700">
                    Check your inbox for your personalized financial assessment report.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
      <div className="max-w-2xl mx-auto w-full">
        <div className="shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-lg">
          <div className="p-8">
            <div className="mb-6">
              <button
                onClick={onBack}
                className="mb-4 flex items-center text-blue-600 hover:text-blue-700 bg-transparent hover:bg-blue-50 p-2 rounded transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </button>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Get Your Financial Health Report
              </h2>
              <p className="text-gray-600">
                Enter your details to receive your personalized financial assessment
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Your full name"
                    required
                    className="h-12 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-4 w-4 inline mr-2" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    className="h-12 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="h-4 w-4 inline mr-2" />
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="(888) 440-9669"
                    className="h-12 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">What you'll receive:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Complete financial health assessment</li>
                  <li>• Gap analysis and recommendations</li>
                  <li>• Retirement planning projections</li>
                  <li>• Personalized action plan</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !formData.name || !formData.email}
                className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Generating Report..." : "Get My Financial Report"}
              </button>

              <p className="text-xs text-gray-500 text-center">
                By submitting, you agree to receive your financial assessment and follow-up communications.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinancialContactForm;
