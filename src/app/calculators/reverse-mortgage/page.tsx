import { Metadata } from 'next';
import ReverseMortgageCalculator from '@/components/calculators/ReverseMortgageCalculator';

export const metadata: Metadata = {
  title: 'Reverse Mortgage Calculator | SeniorSimple',
  description: 'Calculate how much you could borrow with a reverse mortgage. Get personalized estimates based on your home value, age, and location.',
  keywords: 'reverse mortgage calculator, reverse mortgage, home equity, senior housing, retirement income',
  openGraph: {
    title: 'Reverse Mortgage Calculator | SeniorSimple',
    description: 'Calculate how much you could borrow with a reverse mortgage.',
    type: 'website',
  },
};

export default function ReverseMortgageCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ReverseMortgageCalculator />
      </div>
    </div>
  );
}