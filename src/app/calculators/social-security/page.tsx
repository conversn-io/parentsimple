import { Metadata } from 'next';
import SocialSecurityCalculator from '@/components/calculators/SocialSecurityCalculator';

export const metadata: Metadata = {
  title: 'Social Security Calculator | SeniorSimple',
  description: 'Calculate your Social Security benefits and optimize your claiming strategy. Get personalized estimates based on your work history and retirement goals.',
  keywords: 'social security calculator, social security benefits, retirement benefits, social security optimization',
  openGraph: {
    title: 'Social Security Calculator | SeniorSimple',
    description: 'Calculate your Social Security benefits and optimize your claiming strategy.',
    type: 'website',
  },
};

export default function SocialSecurityCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <SocialSecurityCalculator />
      </div>
    </div>
  );
}