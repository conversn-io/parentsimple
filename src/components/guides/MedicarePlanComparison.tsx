import React, { useState } from 'react';

const MedicarePlanComparison: React.FC = () => {
  const [selectedPlans, setSelectedPlans] = useState<string[]>(['original', 'advantage']);

  const plans = {
    original: {
      name: 'Original Medicare',
      parts: 'Part A + Part B',
      monthlyPremium: '$174.70',
      deductible: '$1,632 (Part A), $240 (Part B)',
      coverage: 'Hospital + Medical',
      network: 'Any provider that accepts Medicare',
      prescriptions: 'Requires separate Part D plan',
      outOfPocketMax: 'No limit'
    },
    advantage: {
      name: 'Medicare Advantage',
      parts: 'Part A + Part B + Usually Part D',
      monthlyPremium: '$0 - $100+ (varies)',
      deductible: 'Varies by plan',
      coverage: 'Hospital + Medical + Often extras',
      network: 'Plan network only',
      prescriptions: 'Usually included',
      outOfPocketMax: 'Annual maximum set by plan'
    },
    supplement: {
      name: 'Medigap',
      parts: 'Supplements Original Medicare',
      monthlyPremium: '$50 - $300+ (varies)',
      deductible: 'Covers most Medicare deductibles',
      coverage: 'Fills gaps in Original Medicare',
      network: 'Any Medicare provider',
      prescriptions: 'Requires separate Part D plan',
      outOfPocketMax: 'Very low out-of-pocket costs'
    }
  };

  const togglePlan = (planKey: string) => {
    setSelectedPlans(prev => {
      if (prev.includes(planKey)) {
        return prev.length > 1 ? prev.filter(p => p !== planKey) : prev;
      } else {
        return [...prev, planKey];
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#36596A] mb-4">
              Medicare Plan Comparison
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Compare different Medicare options side by side to find the best coverage for your needs.
            </p>
          </div>
          
          {/* Plan Selection */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold text-[#36596A] mb-4">Select Plans to Compare</h2>
            <div className="flex flex-wrap gap-4">
              {Object.entries(plans).map(([key, plan]) => (
                <button
                  key={key}
                  onClick={() => togglePlan(key)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    selectedPlans.includes(key)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                  }`}
                >
                  {plan.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Comparison Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Feature
                    </th>
                    {selectedPlans.map(planKey => (
                      <th key={planKey} className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        {plans[planKey as keyof typeof plans].name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { label: 'Medicare Parts', key: 'parts' },
                    { label: 'Monthly Premium', key: 'monthlyPremium' },
                    { label: 'Annual Deductible', key: 'deductible' },
                    { label: 'Coverage', key: 'coverage' },
                    { label: 'Provider Network', key: 'network' },
                    { label: 'Prescription Drugs', key: 'prescriptions' },
                    { label: 'Out-of-Pocket Maximum', key: 'outOfPocketMax' }
                  ].map((feature, index) => (
                    <tr key={feature.key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {feature.label}
                      </td>
                      {selectedPlans.map(planKey => (
                        <td key={planKey} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {plans[planKey as keyof typeof plans][feature.key as keyof typeof plans.original]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Key Considerations */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3">Original Medicare</h3>
              <div className="space-y-2">
                <div className="flex items-start">
                  <span className="text-green-600 mr-2 mt-1">✓</span>
                  <span className="text-blue-800 text-sm">Freedom to choose any doctor</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2 mt-1">✓</span>
                  <span className="text-blue-800 text-sm">Nationwide coverage</span>
                </div>
                <div className="flex items-start">
                  <span className="text-red-600 mr-2 mt-1">✗</span>
                  <span className="text-blue-800 text-sm">No out-of-pocket maximum</span>
                </div>
                <div className="flex items-start">
                  <span className="text-red-600 mr-2 mt-1">✗</span>
                  <span className="text-blue-800 text-sm">No prescription coverage</span>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-3">Medicare Advantage</h3>
              <div className="space-y-2">
                <div className="flex items-start">
                  <span className="text-green-600 mr-2 mt-1">✓</span>
                  <span className="text-green-800 text-sm">Often includes extras</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2 mt-1">✓</span>
                  <span className="text-green-800 text-sm">Out-of-pocket maximum</span>
                </div>
                <div className="flex items-start">
                  <span className="text-red-600 mr-2 mt-1">✗</span>
                  <span className="text-green-800 text-sm">Limited provider network</span>
                </div>
                <div className="flex items-start">
                  <span className="text-red-600 mr-2 mt-1">✗</span>
                  <span className="text-green-800 text-sm">May need referrals</span>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-3">Medigap</h3>
              <div className="space-y-2">
                <div className="flex items-start">
                  <span className="text-green-600 mr-2 mt-1">✓</span>
                  <span className="text-purple-800 text-sm">Predictable costs</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-2 mt-1">✓</span>
                  <span className="text-purple-800 text-sm">Any Medicare provider</span>
                </div>
                <div className="flex items-start">
                  <span className="text-red-600 mr-2 mt-1">✗</span>
                  <span className="text-purple-800 text-sm">Additional monthly premium</span>
                </div>
                <div className="flex items-start">
                  <span className="text-red-600 mr-2 mt-1">✗</span>
                  <span className="text-purple-800 text-sm">No prescription coverage</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-lg font-semibold text-[#36596A] mb-4">
              Need Help Choosing the Right Plan?
            </h3>
            <p className="text-gray-600 mb-6">
              Get personalized Medicare guidance from our licensed insurance agents.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
              Schedule a Medicare Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicarePlanComparison;