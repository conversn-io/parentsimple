export default function TestMegaMenuPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#36596A] mb-4">
            Mega Menu Test Page
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            This page is used to test the mega menu functionality. Try hovering over the navigation items in the header above.
          </p>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-[#36596A] mb-4">
              Mega Menu Features
            </h2>
            <ul className="text-left space-y-2 text-gray-700">
              <li>✅ Responsive design - works on desktop and mobile</li>
              <li>✅ Hover effects and smooth animations</li>
              <li>✅ Organized sections with icons</li>
              <li>✅ Site color scheme integration</li>
              <li>✅ Mobile hamburger menu</li>
              <li>✅ Accessibility features</li>
            </ul>
          </div>
          
          <div className="mt-8 bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-[#36596A] mb-4">
              Navigation Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left">
              <div className="p-4 bg-[#F5F5F0] rounded-lg">
                <h3 className="font-semibold text-[#36596A]">Retirement</h3>
                <p className="text-sm text-gray-600">Calculators, guides, and resources</p>
              </div>
              <div className="p-4 bg-[#F5F5F0] rounded-lg">
                <h3 className="font-semibold text-[#36596A]">Estate Planning</h3>
                <p className="text-sm text-gray-600">Tools and checklists</p>
              </div>
              <div className="p-4 bg-[#F5F5F0] rounded-lg">
                <h3 className="font-semibold text-[#36596A]">Health & Medicare</h3>
                <p className="text-sm text-gray-600">Healthcare navigation</p>
              </div>
              <div className="p-4 bg-[#F5F5F0] rounded-lg">
                <h3 className="font-semibold text-[#36596A]">Housing</h3>
                <p className="text-sm text-gray-600">Home options and calculators</p>
              </div>
              <div className="p-4 bg-[#F5F5F0] rounded-lg">
                <h3 className="font-semibold text-[#36596A]">Tax Planning</h3>
                <p className="text-sm text-gray-600">Tax optimization tools</p>
              </div>
              <div className="p-4 bg-[#F5F5F0] rounded-lg">
                <h3 className="font-semibold text-[#36596A]">Insurance</h3>
                <p className="text-sm text-gray-600">Protection calculators</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
