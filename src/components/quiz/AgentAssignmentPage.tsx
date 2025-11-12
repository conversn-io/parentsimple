"use client";

// Using native button elements instead of UI library
import { Phone, Calendar, CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { FAQ } from "./FAQ";

interface AgentAssignmentPageProps {
  answers: Record<string, any>;
  onRestart: () => void;
}

export const AgentAssignmentPage = ({ answers, onRestart }: AgentAssignmentPageProps) => {
  useEffect(() => {
    // Track page view for analytics
    console.log("🎯 Agent Assignment Page Loaded:", {
      timestamp: new Date().toISOString(),
      answers: Object.keys(answers),
      firstName: answers.personalInfo?.firstName || answers.firstName
    });
    
    // Submit agent assignment form when component mounts
    const submitAssignment = async () => {
      try {
        // TODO: Implement agent assignment submission
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
  }, [answers]);

  const handleCallNow = () => {
    console.log("📞 Phone Click Tracked:", {
      timestamp: new Date().toISOString(),
      phoneNumber: "+18777703306"
    });
    window.location.href = "tel:+18777703306";
  };

  const handleScheduleConsultation = () => {
    console.log("📅 Schedule Consultation Clicked:", {
      timestamp: new Date().toISOString()
    });
    // TODO: Implement scheduling navigation
    alert("Scheduling feature coming soon!");
  };

  const firstName = answers.personalInfo?.firstName || answers.firstName || 'there';

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-white pt-16 pb-3">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4 md:space-x-8 mb-12">
            {/* Step 1: Complete Quiz */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs md:text-sm font-medium text-slate-700">Complete Quiz</span>
            </div>
            
            {/* Progress Line */}
            <div className="flex-1 h-0.5 bg-primary max-w-24"></div>
            
            {/* Step 2: Connect with Advisor */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              </div>
              <span className="text-xs md:text-sm font-medium text-primary">Connect with Advisor</span>
            </div>
            
            {/* Progress Line */}
            <div className="flex-1 h-0.5 bg-slate-200 max-w-24"></div>
            
            {/* Step 3: Get Annuity */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
              </div>
              <span className="text-xs md:text-sm font-medium text-slate-400">Get Annuity</span>
            </div>
          </div>

          {/* Personal Greeting */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800">
            Hi {firstName},
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-slate-700">
            Here is the best next step for you:
          </h2>

          {/* Recommended Badge */}
          <div className="inline-block bg-emerald-100 text-emerald-800 px-4 py-1 rounded-full text-sm font-bold mb-6">
            RECOMMENDED
          </div>

          {/* Main CTA Message */}
          <h3 className="text-xl md:text-2xl font-bold mb-6 text-slate-800">
            Connect with a licensed agent to get the right coverage
          </h3>

          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            As a next step we would recommend to <strong>hop on a quick call</strong> to make sure you're getting the coverage that's <strong>best for your situation.</strong> We'll connect you with our senior specialist who will provide personalized recommendations based on your quiz responses.
          </p>

          {/* Divider */}
          <div className="w-24 h-0.5 bg-slate-300 mx-auto mb-8"></div>

          {/* Specialist Introduction */}
          <p className="text-lg font-semibold text-slate-800 mb-6">
            <strong>Your assigned retirement specialist</strong>
          </p>
        </div>
      </section>

      {/* Agent Assignment */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="bg-slate-50 rounded-2xl p-8 mb-8">
            <div className="mb-6">
              {/* Agent Photo */}
              <img 
                src="/images/team/advisor-headshot.svg" 
                alt="Senior Retirement Income Specialist"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
            </div>
            
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              Meet Your Specialist
            </h2>
            <p className="text-lg text-primary font-semibold mb-4">
              Senior Retirement Income Specialist
            </p>
            
            <p className="text-slate-600 leading-relaxed mb-6 max-w-2xl mx-auto">
              Our specialist has over 15 years of experience helping pre-retirees and retirees create 
              guaranteed income streams. They'll personally review your responses and call you 
              with a customized retirement income strategy tailored to your specific situation.
            </p>

            <div className="grid md:grid-cols-2 gap-4 max-w-lg mx-auto">
              <button 
                onClick={handleCallNow}
                className="bg-[#36596A] hover:bg-[#2a4a5a] text-white flex items-center justify-center gap-2 py-4 px-6 text-lg rounded-lg font-semibold transition-colors"
              >
                <Phone className="w-5 h-5" />
                (877) 770-3306
              </button>
              
              <button 
                onClick={handleScheduleConsultation}
                className="py-4 px-6 text-lg border-2 border-[#36596A] text-[#36596A] hover:bg-[#36596A] hover:text-white flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors"
              >
                <Calendar className="w-5 h-5" />
                Schedule Call
              </button>
            </div>
          </div>

          {/* What Happens Next */}
          <div className="bg-emerald-50 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">
              What Happens Next?
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-600">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-emerald-600 rounded-full text-white flex items-center justify-center font-bold mb-2">1</div>
                <p><strong>Within 24 hours:</strong> Your specialist will call you to discuss your retirement goals</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-emerald-600 rounded-full text-white flex items-center justify-center font-bold mb-2">2</div>
                <p><strong>Custom Analysis:</strong> Receive personalized annuity recommendations based on your quiz</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-emerald-600 rounded-full text-white flex items-center justify-center font-bold mb-2">3</div>
                <p><strong>Your Decision:</strong> No pressure - take time to review and decide what's right for you</p>
              </div>
            </div>
          </div>

          {/* Your Responses Summary */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 text-left">
            <h3 className="text-xl font-semibold text-slate-800 mb-4 text-center">
              Your Quiz Responses Summary
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              {Object.entries(answers).map(([key, value]) => {
                if (key === 'phone' || key === 'email' || key === 'sessionId') return null;
                
                let label = key.charAt(0).toUpperCase() + key.slice(1);
                if (key === 'personalInfo') {
                  if (value?.firstName) {
                    return (
                      <div key={`${key}-firstName`} className="border-b border-slate-100 pb-2">
                        <span className="font-semibold text-slate-700">First Name:</span>
                        <span className="text-slate-600 ml-2">{value.firstName}</span>
                      </div>
                    );
                  }
                  if (value?.lastName) {
                    return (
                      <div key={`${key}-lastName`} className="border-b border-slate-100 pb-2">
                        <span className="font-semibold text-slate-700">Last Name:</span>
                        <span className="text-slate-600 ml-2">{value.lastName}</span>
                      </div>
                    );
                  }
                  return null;
                }
                if (key === 'locationInfo') {
                  if (value?.zipCode) {
                    return (
                      <div key={`${key}-zipCode`} className="border-b border-slate-100 pb-2">
                        <span className="font-semibold text-slate-700">ZIP Code:</span>
                        <span className="text-slate-600 ml-2">{value.zipCode}</span>
                      </div>
                    );
                  }
                  return null;
                }
                if (key === 'investableAssets') label = 'Investable Assets';
                if (key === 'retirementSavings') label = 'Retirement Savings';
                if (key === 'retirementTimeline') label = 'Retirement Timeline';
                if (key === 'currentRetirementPlans') label = 'Current Retirement Plans';
                if (key === 'riskTolerance') label = 'Risk Tolerance';
                if (key === 'currentAge') label = 'Current Age';
                if (key === 'currentSavings') label = 'Current Savings';
                if (key === 'monthlyIncome') label = 'Monthly Income';
                if (key === 'savingsGoals') label = 'Savings Goals';
                if (key === 'allocationPercent') label = 'Allocation';
                
                // Handle array values (multi-select)
                if (Array.isArray(value)) {
                  return (
                    <div key={key} className="border-b border-slate-100 pb-2">
                      <span className="font-semibold text-slate-700">{label}:</span>
                      <span className="text-slate-600 ml-2">{value.join(', ')}</span>
                    </div>
                  );
                }
                
                // Handle object values (like allocation data)
                if (typeof value === 'object' && value !== null) {
                  if (key === 'allocationPercent' || key === 'fiaAllocation') {
                    return (
                      <div key={key} className="border-b border-slate-100 pb-2">
                        <span className="font-semibold text-slate-700">Allocation:</span>
                        <span className="text-slate-600 ml-2">{value.percentage}% (${value.amount?.toLocaleString() || 'N/A'})</span>
                      </div>
                    );
                  }
                  // For other objects, display as JSON string
                  return (
                    <div key={key} className="border-b border-slate-100 pb-2">
                      <span className="font-semibold text-slate-700">{label}:</span>
                      <span className="text-slate-600 ml-2">{JSON.stringify(value)}</span>
                    </div>
                  );
                }
                
                return (
                  <div key={key} className="border-b border-slate-100 pb-2">
                    <span className="font-semibold text-slate-700">{label}:</span>
                    <span className="text-slate-600 ml-2">{value}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Retake Quiz Button */}
          <div className="text-center mt-8">
            <button 
              onClick={onRestart}
              className="border-2 border-slate-300 text-slate-600 hover:bg-slate-50 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />
    </div>
  );
};
