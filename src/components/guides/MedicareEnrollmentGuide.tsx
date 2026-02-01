import React, { useState } from 'react';

const MedicareEnrollmentGuide: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const enrollmentSteps = [
    "Understanding Medicare Basics",
    "Enrollment Periods",
    "Coverage Options",
    "Enrollment Process"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-[#36596A] mb-4">
            Medicare Enrollment Guide
          </h1>
          <p className="text-gray-600 mb-8">
            Your complete guide to understanding and enrolling in Medicare coverage.
          </p>
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-gray-600">
              Interactive Medicare enrollment guide coming soon. Get step-by-step guidance for Medicare enrollment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicareEnrollmentGuide;
