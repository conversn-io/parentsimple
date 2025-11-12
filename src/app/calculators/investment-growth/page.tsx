import { Metadata } from 'next';
import InvestmentGrowthCalculator from '@/components/calculators/InvestmentGrowthCalculator';

export const metadata: Metadata = {
  title: 'Investment Growth Calculator | SeniorSimple',
  description: 'See how your investments could grow over time with compound interest. Calculate different investment scenarios and growth projections.',
  keywords: 'investment growth calculator, compound interest, investment calculator, retirement investing, portfolio growth, investment planning',
  openGraph: {
    title: 'Investment Growth Calculator | SeniorSimple',
    description: 'See how your investments could grow over time with compound interest.',
    type: 'website',
  },
};

export default function InvestmentGrowthCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <InvestmentGrowthCalculator />
      </div>
    </div>
  );
}
