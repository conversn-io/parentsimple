import React, { useState } from 'react';

const MedigapGuide: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState('');

  const medigapPlans = [
    { id: 'A', name: 'Plan A', description: 'Basic benefits' },
    { id: 'B', name: 'Plan B', description: 'Plan A + Part A deductible' },
    { id: 'C', name: 'Plan C', description: 'Comprehensive coverage (closed to new enrollees)' },
    { id: 'D', name: 'Plan D', description: 'Plan A + Part A deductible + skilled nursing coinsurance' },
    { id: 'F', name: 'Plan F', description: 'Most comprehensive (closed to new enrollees)' },
    { id: 'G', name: 'Plan G', description: 'Plan F minus Part B deductible' },
    { id: 'K', name: 'Plan K', description: 'Basic benefits with cost-sharing' },
    { id: 'L', name: 'Plan L', description: 'Plan K with higher cost-sharing' },
    { id: 'M', name: 'Plan M', description: 'Plan A + 50% Part A deductible' },
    { id: 'N', name: 'Plan N', description: 'Plan G with copays for some services' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#36596A] mb-4">
              Medigap Guide
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Understanding Medicare Supplement Insurance to help fill the gaps in Original Medicare coverage.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold text-[#36596A] mb-6">What is Medigap?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-700 mb-4">
                  Medigap (Medicare Supplement Insurance) is private insurance that helps pay for some of the 
                  health care costs that Original Medicare doesn't cover, like copayments, coinsurance, and deductibles.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Key Benefits:</h3>
                  <ul className="space-y-1 text-blue-800 text-sm">
                    <li>• Helps pay Medicare deductibles and coinsurance</li>
                    <li>• Guaranteed renewable</li>
                    <li>• Works with any doctor that accepts Medicare</li>
                    <li>• Standardized plans (A, B, C, D, F, G, K, L, M, N)</li>
                  </ul>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Important Notes</h3>
                <div className="space-y-3">
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-yellow-800 text-sm">
                      <strong>Best time to buy:</strong> During your 6-month Medigap Open Enrollment Period 
                      when you first enroll in Medicare Part B at age 65 or older.
                    </p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <p className="text-red-800 text-sm">
                      <strong>Note:</strong> Plans C and F are no longer available to people who became 
                      eligible for Medicare on or after January 1, 2020.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Plan Comparison */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold text-[#36596A] mb-6">Popular Medigap Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-3">Plan G</h3>
                <p className="text-green-800 text-sm mb-4">
                  Most comprehensive plan available to new Medicare beneficiaries. Covers all Medicare-approved expenses 
                  except the Part B deductible.
                </p>
                <div className="text-green-700 text-sm">
                  <strong>Best for:</strong> Those who want comprehensive coverage and don't mind paying the Part B deductible.
                </div>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-3">Plan N</h3>
                <p className="text-blue-800 text-sm mb-4">
                  Lower premium option with small copays for doctor visits and emergency room visits. 
                  Good balance of coverage and cost.
                </p>
                <div className="text-blue-700 text-sm">
                  <strong>Best for:</strong> Those who want good coverage but are willing to pay small copays to save on premiums.
                </div>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg">
                                  <h3 className="font-semibold text-purple-900 mb-3">High-Deductible Plan G</h3>
                <p className="text-purple-800 text-sm mb-4">
                  Lower monthly premium with higher deductible ($2,800 in 2024). After meeting deductible, 
                  provides same benefits as Plan G.
                </p>
                <div className="text-purple-700 text-sm">
                  <strong>Best for:</strong> Healthy individuals who want catastrophic coverage with lower monthly costs.
                </div>
              </div>
            </div>
          </div>
          
          {/* Enrollment Information */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-[#36596A] mb-6">Enrollment Guidelines</h2>
            <div className="space-y-6">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-3">Open Enrollment Period</h3>
                <p className="text-green-800 mb-3">
                  The best time to buy Medigap is during your 6-month Open Enrollment Period. This period:
                </p>
                <ul className="space-y-2 text-green-700 text-sm">
                  <li>• Starts when you're 65 or older and enrolled in Medicare Part B</li>
                  <li>• Guarantees you can buy any Medigap policy sold in your state</li>
                  <li>• Insurance companies cannot deny coverage or charge more due to health problems</li>
                  <li>• Cannot be charged more due to past or present health problems</li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 p-6 rounded-lg">
                                      <h3 className="font-semibold text-yellow-900 mb-3">Special Circumstances</h3>
                <p className="text-yellow-800 mb-3">
                  You may have guaranteed issue rights in certain situations:
                </p>
                <ul className="space-y-2 text-yellow-700 text-sm">
                  <li>• You're leaving a Medicare Advantage Plan</li>
                  <li>• Your Medigap insurance company goes out of business</li>
                  <li>• You move outside your plan's service area</li>
                  <li>• Your employer-sponsored insurance ends</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-lg font-semibold text-[#36596A] mb-4">
              Ready to Compare Medigap Plans?
            </h3>
            <p className="text-gray-600 mb-6">
              Get personalized Medigap quotes and guidance from licensed insurance professionals.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
              Get Medigap Quotes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedigapGuide;