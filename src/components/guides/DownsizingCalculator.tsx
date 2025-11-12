import React, { useState } from 'react';

const DownsizingCalculator: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-[#36596A] mb-4">
            Downsizing Calculator
          </h1>
          <p className="text-gray-600 mb-8">
            Calculate the potential financial benefits of downsizing your home in retirement.
          </p>
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-gray-600">
              Interactive calculator coming soon. This tool will help you evaluate the financial impact of downsizing your home.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownsizingCalculator;
