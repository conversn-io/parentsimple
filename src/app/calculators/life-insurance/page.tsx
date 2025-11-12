import { Metadata } from 'next';
import LifeInsuranceCalculator from '@/components/calculators/LifeInsuranceCalculator';

export const metadata: Metadata = {
  title: 'Life Insurance Calculator | SeniorSimple',
  description: 'Calculate the right amount of life insurance coverage for your family. Get personalized recommendations based on your financial situation, debts, and future needs.',
  keywords: 'life insurance calculator, life insurance coverage, insurance planning, family protection, financial planning',
  openGraph: {
    title: 'Life Insurance Calculator | SeniorSimple',
    description: 'Calculate the right amount of life insurance coverage for your family.',
    type: 'website',
  },
};

export default function LifeInsuranceCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <LifeInsuranceCalculator />
      </div>
    </div>
  );
}