import { Metadata } from 'next';
import RetirementSavingsCalculator from '@/components/calculators/RetirementSavingsCalculator';

export const metadata: Metadata = {
  title: 'Retirement Savings Calculator | SeniorSimple',
  description: 'Calculate how much you need to save for retirement. Get personalized estimates based on your current savings, income, and retirement goals.',
  keywords: 'retirement savings calculator, retirement planning, retirement goals, financial planning, retirement income',
  openGraph: {
    title: 'Retirement Savings Calculator | SeniorSimple',
    description: 'Calculate how much you need to save for retirement.',
    type: 'website',
  },
};

export default function RetirementSavingsCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <RetirementSavingsCalculator />
      </div>
    </div>
  );
}