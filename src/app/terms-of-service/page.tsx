import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - SeniorSimple',
  description: 'Terms of Service for SeniorSimple',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-[#36596A] mb-8">Terms of Service</h1>
        <div className="bg-white rounded-lg shadow-md p-8 prose prose-lg max-w-none">
          <p className="text-gray-600">
            This page is currently under construction. Please check back soon for our complete Terms of Service.
          </p>
          <p className="mt-4">
            <a href="/" className="text-[#36596A] hover:underline">
              Return to Homepage
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}




