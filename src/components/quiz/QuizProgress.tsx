interface QuizProgressProps {
  currentStep: number;
  totalSteps: number;
}

export const QuizProgress = ({ currentStep, totalSteps }: QuizProgressProps) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
      <div 
        className="bg-[#36596A] h-4 rounded-full transition-all duration-500 ease-out shadow-sm" 
        style={{ width: `${progressPercentage}%` }}
      />
      <div className="flex justify-between mt-4 text-lg font-semibold text-gray-700">
        <span>Question {currentStep + 1} of {totalSteps}</span>
        <span>{Math.round(progressPercentage)}% Complete</span>
      </div>
    </div>
  );
};