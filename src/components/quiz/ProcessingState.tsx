"use client";

import { Loader2, CheckCircle } from 'lucide-react';

interface ProcessingStateProps {
  message: string;
  isComplete?: boolean;
}

export const ProcessingState = ({ message, isComplete = false }: ProcessingStateProps) => {
  return (
    <div className="w-full max-w-xl mx-auto px-4 py-10">
      <div className="w-full bg-white rounded-2xl shadow-2xl border border-[#E3E0D5] p-6 sm:p-8 text-center space-y-4">
        <div>
          {isComplete ? (
            <CheckCircle className="w-14 h-14 text-green-500 mx-auto" />
          ) : (
            <Loader2 className="w-14 h-14 text-[#1A2B49] mx-auto animate-spin" />
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#1A2B49] mb-2">
            {isComplete ? 'Complete!' : 'Processing...'}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};






