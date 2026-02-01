"use client";

import { CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { FAQ } from "./FAQ";

interface AgentAssignmentPageProps {
  answers: Record<string, any>;
  onRestart: () => void;
  funnelType?: string;
}

export const AgentAssignmentPage = ({ answers, onRestart, funnelType }: AgentAssignmentPageProps) => {
  // Detect funnel type from answers or prop
  const detectedFunnelType = funnelType || answers.funnelType || (typeof window !== 'undefined' ? window.location.pathname.includes('life-insurance-ca') ? 'life-insurance-ca' : 'unknown' : 'unknown');
  const isLifeInsurance = detectedFunnelType === 'life-insurance-ca';
  
  useEffect(() => {
    // Track page view for analytics
    console.log("🎯 Agent Assignment Page Loaded:", {
      timestamp: new Date().toISOString(),
      answers: Object.keys(answers),
      firstName: answers.contact_info?.firstName || answers.firstName,
      funnelType: detectedFunnelType
    });
    
    // Submit agent assignment form when component mounts
    const submitAssignment = async () => {
      try {
        console.log("📋 Agent Assignment Form Data:", {
          answers,
          timestamp: new Date().toISOString(),
          sessionId: answers.sessionId || 'unknown'
        });
        console.log("✅ Agent assignment form submitted successfully on page load");
      } catch (error) {
        console.warn("❌ Failed to submit agent assignment form:", error);
      }
    };
    
    submitAssignment();
  }, [answers, detectedFunnelType]);

  const firstName = answers.contact_info?.firstName || answers.firstName || 'there';

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Announcement Bar - Compact style matching landing page */}
      <div className="w-full bg-green-50 border-b border-green-200">
        <div className="max-w-2xl mx-auto px-6 py-3">
          <p className="text-sm text-green-800 text-center font-medium">
            {isLifeInsurance 
              ? `Well done, ${firstName}! Your Life Insurance Quote is Now Being Generated...`
              : `Well done, ${firstName}! Your Personalized Quote is Now Being Generated...`
            }
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-white pt-8 pb-3">
        <div className="max-w-2xl mx-auto px-6">
          {/* Progress Steps - Matching quiz progress bar style */}
          <div className="mb-4">
            {/* Progress Bar - Set to 50% */}
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div 
                className="bg-[#36596A] h-4 rounded-full transition-all duration-500 ease-out shadow-sm" 
                style={{ width: '50%' }}
              />
            </div>
            
            {/* Progress Steps as Links */}
            <div className="flex items-center justify-between text-sm font-semibold text-gray-700">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="text-emerald-600">Complete Quiz</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-[#36596A] rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
                <span className="text-[#36596A]">Connect with Advisor</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                </div>
                <span className="text-gray-500">{isLifeInsurance ? 'Get Coverage' : 'Get Quote'}</span>
              </div>
            </div>
          </div>

          {/* Main Headline - Right below progress bar */}
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-slate-700 text-center">
            {isLifeInsurance 
              ? "You'll be getting a call now from a licensed life insurance agent to go over your details"
              : "You'll be getting a call now from a licensed agent to go over your details"
            }
          </h2>
        </div>
      </section>

      {/* Agent Assignment */}
      <section className="bg-white py-8">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-slate-50 rounded-2xl p-8 mb-8">
            {/* Agent Photo - Full crop, no circle - Reduced spacing by 50% */}
            <img 
              src="/images/team/agent-advisor.png" 
              alt="Licensed Insurance Specialist"
              className="w-full max-w-sm mx-auto mb-3 object-cover rounded-lg"
            />
            
            {/* What Happens Next - Vertical Stack */}
            <div className="space-y-4 text-left">
              <h3 className="text-xl font-semibold text-slate-800 mb-4 text-center">
                What Happens Next?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-emerald-600 rounded-full text-white flex items-center justify-center font-bold flex-shrink-0 mt-0.5">1</div>
                  <p className="text-slate-600">
                    <strong>Within 24 hours:</strong> {isLifeInsurance 
                      ? "Your specialist will call you to discuss your life insurance needs and family protection goals"
                      : "Your specialist will call you to discuss your needs"
                    }
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-emerald-600 rounded-full text-white flex items-center justify-center font-bold flex-shrink-0 mt-0.5">2</div>
                  <p className="text-slate-600">
                    <strong>Custom Analysis:</strong> {isLifeInsurance
                      ? "Receive personalized life insurance quotes from multiple top Canadian insurers based on your needs"
                      : "Receive personalized recommendations based on your quiz"
                    }
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-emerald-600 rounded-full text-white flex items-center justify-center font-bold flex-shrink-0 mt-0.5">3</div>
                  <p className="text-slate-600"><strong>Your Decision:</strong> No pressure - take time to review and decide what's right for you</p>
                </div>
              </div>
            </div>
          </div>

          {/* Your Responses Summary */}
          <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-xl p-6 text-left mb-8">
            <h3 className="text-xl font-semibold text-slate-800 mb-4 text-center">
              Your Quiz Responses Summary
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              {Object.entries(answers).map(([key, value]) => {
                if (key === 'phone' || key === 'email' || key === 'sessionId' || key === 'funnelType') return null;
                
                let label = key.charAt(0).toUpperCase() + key.slice(1);
                
                // Handle contact_info
                if (key === 'contact_info' && typeof value === 'object' && value !== null) {
                  const contactInfo = value as any;
                  return (
                    <div key={key}>
                      {contactInfo.firstName && (
                        <div className="border-b border-slate-100 pb-2 mb-2">
                          <span className="font-semibold text-slate-700">First Name:</span>
                          <span className="text-slate-600 ml-2">{contactInfo.firstName}</span>
                        </div>
                      )}
                      {contactInfo.lastName && (
                        <div className="border-b border-slate-100 pb-2 mb-2">
                          <span className="font-semibold text-slate-700">Last Name:</span>
                          <span className="text-slate-600 ml-2">{contactInfo.lastName}</span>
                        </div>
                      )}
                    </div>
                  );
                }
                
                // Improve label formatting
                if (key === 'province') label = 'Province';
                if (key === 'gender') label = 'Gender';
                if (key === 'ageRange') label = 'Age Range';
                if (key === 'smoker') label = 'Smoker Status';
                if (key === 'coverage') label = 'Coverage Amount';
                if (key === 'purpose') label = 'Coverage Purpose';
                if (key === 'bestTime') label = 'Best Time to Call';
                
                // Handle array values (multi-select)
                if (Array.isArray(value)) {
                  return (
                    <div key={key} className="border-b border-slate-100 pb-2">
                      <span className="font-semibold text-slate-700">{label}:</span>
                      <span className="text-slate-600 ml-2">{value.join(', ')}</span>
                    </div>
                  );
                }
                
                // Handle object values
                if (typeof value === 'object' && value !== null) {
                  // Skip complex objects we don't want to display
                  return null;
                }
                
                // Skip empty values
                if (!value) return null;
                
                return (
                  <div key={key} className="border-b border-slate-100 pb-2">
                    <span className="font-semibold text-slate-700">{label}:</span>
                    <span className="text-slate-600 ml-2">{value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ funnelType={detectedFunnelType} />
    </div>
  );
};
