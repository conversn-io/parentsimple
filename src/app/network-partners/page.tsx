import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Network Partners - ParentSimple',
  description: 'Network Partners for ParentSimple',
};

export default function NetworkPartnersPage() {
  return (
    <div className="min-h-screen bg-[#F9F6EF]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-[#1A2B49] mb-8">Network Partners</h1>
        <div className="bg-white rounded-lg shadow-md p-8 prose prose-lg max-w-none">
          <p className="text-gray-600">
            This page is currently under construction. Please check back soon for information about our Network Partners.
          </p>
          <p className="mt-4">
            <a href="/" className="text-[#1A2B49] hover:underline">
              Return to Homepage
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

