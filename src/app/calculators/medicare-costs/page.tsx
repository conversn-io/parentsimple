import { Metadata } from 'next';
import MedicareCostCalculator from '@/components/calculators/MedicareCostCalculator';

export const metadata: Metadata = {
  title: 'Medicare Cost Calculator | SeniorSimple',
  description: 'Calculate your Medicare costs and compare different plan options. Get personalized estimates for premiums, deductibles, and out-of-pocket expenses.',
  keywords: 'medicare cost calculator, medicare costs, medicare premiums, healthcare costs, senior healthcare',
  openGraph: {
    title: 'Medicare Cost Calculator | SeniorSimple',
    description: 'Calculate your Medicare costs and compare different plan options.',
    type: 'website',
  },
};

export default function MedicareCostCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <MedicareCostCalculator />
      </div>
    </div>
  );
}