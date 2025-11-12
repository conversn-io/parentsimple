"use client";

import { Loader2, CheckCircle } from 'lucide-react';

interface ProcessingStateProps {
  message: string;
  isComplete?: boolean;
}

export const ProcessingState = ({ message, isComplete = false }: ProcessingStateProps) => {
  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          {isComplete ? (
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          ) : (
            <Loader2 className="w-16 h-16 text-[#36596A] mx-auto animate-spin" />
          )}
        </div>
        
        <h2 className="text-xl font-semibold text-[#36596A] mb-2">
          {isComplete ? 'Complete!' : 'Processing...'}
        </h2>
        
        <p className="text-gray-600">
          {message}
        </p>
      </div>
    </div>
  );
};






