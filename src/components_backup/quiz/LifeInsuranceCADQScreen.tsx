'use client'

/**
 * Disqualification screen for non-Ontario provinces.
 * Friendly message; built for scale so copy can later support "coming to your province/state".
 */
export function LifeInsuranceCADQScreen() {
  return (
    <div className="max-w-lg mx-auto text-center py-12 px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          We&apos;re currently serving Ontario
        </h2>
        <p className="text-gray-600 mb-6">
          Life insurance quotes are currently available for Ontario residents. We&apos;re expanding to more provinces soon.
        </p>
        <p className="text-sm text-gray-500">
          Check back later or visit our main site for other resources.
        </p>
      </div>
    </div>
  )
}
