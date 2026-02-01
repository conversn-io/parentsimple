import { Metadata } from 'next';
import DownsizingCalculator from '@/components/calculators/DownsizingCalculator';

export const metadata: Metadata = {
  title: 'Downsizing Calculator | SeniorSimple',
  description: 'Calculate the financial benefits of downsizing your home. Get personalized estimates of costs, savings, and potential proceeds from selling your current home.',
  keywords: 'downsizing calculator, senior housing, home downsizing, retirement housing, senior living, housing options',
  openGraph: {
    title: 'Downsizing Calculator | SeniorSimple',
    description: 'Calculate the financial benefits of downsizing your home.',
    type: 'website',
  },
};

export default function DownsizingCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <DownsizingCalculator />
      </div>
    </div>
  );
}
