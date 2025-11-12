import React, { useState } from 'react';

const LifeInsuranceRetirementGuide: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Understanding Life Insurance in Retirement",
      content: "Learn how life insurance needs change as you approach and enter retirement."
    },
    {
      title: "Types of Coverage",
      content: "Explore different types of life insurance suitable for retirees."
    },
    {
      title: "Estate Planning Integration",
      content: "See how life insurance fits into your overall estate planning strategy."
    },
    {
      title: "Tax Considerations",
      content: "Understand the tax implications of life insurance in retirement."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#36596A] mb-4">
              Life Insurance in Retirement Guide
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Navigate the complexities of life insurance planning during your retirement years.
            </p>
          </div>
          
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="text-xs text-center mt-2 px-2">
                    {step.title}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-1 w-full mt-4 ${
                      index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Content */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-xl font-semibold text-[#36596A] mb-4">
              {steps[currentStep].title}
            </h2>
            <div className="text-gray-700">
              {currentStep === 0 && (
                <div className="space-y-4">
                  <p>
                    Life insurance needs often change significantly as you transition into retirement. 
                    Understanding these changes is crucial for making informed decisions.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Key Considerations</h3>
                    <ul className="space-y-2 text-blue-800">
                      <li>• Reduced income replacement needs</li>
                      <li>• Estate planning objectives</li>
                      <li>• Long-term care considerations</li>
                      <li>• Tax optimization strategies</li>
                    </ul>
                  </div>
                </div>
              )}
              
              {currentStep === 1 && (
                <div className="space-y-4">
                  <p>
                    Different types of life insurance serve different purposes in retirement planning.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-900 mb-2">Term Life</h3>
                      <p className="text-green-800 text-sm">
                        Lower cost, temporary coverage for specific needs like mortgage payoff.
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-900 mb-2">Permanent Life</h3>
                      <p className="text-purple-800 text-sm">
                        Lifetime coverage with cash value for estate planning and wealth transfer.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {currentStep === 2 && (
                <div className="space-y-4">
                  <p>
                    Life insurance can be a powerful tool in your estate planning strategy.
                  </p>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-yellow-900 mb-2">Estate Planning Benefits</h3>
                    <ul className="space-y-2 text-yellow-800">
                      <li>• Provide liquidity for estate taxes</li>
                      <li>• Equalize inheritances among heirs</li>
                      <li>• Create a tax-free legacy</li>
                      <li>• Fund charitable giving strategies</li>
                    </ul>
                  </div>
                </div>
              )}
              
              {currentStep === 3 && (
                <div className="space-y-4">
                  <p>
                    Understanding the tax implications of life insurance can help optimize your strategy.
                  </p>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-red-900 mb-2">Tax Considerations</h3>
                    <ul className="space-y-2 text-red-800">
                      <li>• Death benefits are generally tax-free</li>
                      <li>• Cash value growth is tax-deferred</li>
                      <li>• Modified Endowment Contract rules</li>
                      <li>• Estate tax implications for large policies</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={currentStep === steps.length - 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          </div>
          
          <div className="mt-8 bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-lg font-semibold text-[#36596A] mb-4">
              Need Personalized Life Insurance Guidance?
            </h3>
            <p className="text-gray-600 mb-6">
              Get expert advice on life insurance strategies for your retirement planning.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
              Schedule a Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifeInsuranceRetirementGuide;