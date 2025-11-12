
'use client';

import { useFunnelLayout } from "../../hooks/useFunnelFooter";

const LifeInsuranceQuiz = () => {
  useFunnelLayout(); // This sets both header and footer to 'funnel'
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-[#36596A] mb-4">
            Life Insurance Quiz
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Find out how much life insurance coverage you need to protect your family's financial future.
          </p>
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-gray-600">Life Insurance Quiz coming soon...</p>
          </div>
        </div>
      </div>
      {/* Footer is now handled by layout */}
    </div>
  );
};

export default LifeInsuranceQuiz;
