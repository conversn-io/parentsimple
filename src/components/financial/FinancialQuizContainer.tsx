
// Removed UI card import - using standard HTML/Tailwind
// import QuizQuestion from "@/components/QuizQuestion";
// import QuizHeader from "@/components/quiz/QuizHeader";
// import QuizProgressSteps from "@/components/quiz/QuizProgressSteps";
// import QuizProgressBar from "@/components/quiz/QuizProgressBar";

interface FinancialQuizContainerProps {
  currentQuestion: number;
  totalQuestions: number;
  answers: Record<string, string>;
  isTransitioning: boolean;
  navigation: any;
  onAnswer: (questionId: string, answerValue: string) => void;
}

const FinancialQuizContainer = ({
  currentQuestion,
  totalQuestions,
  answers,
  isTransitioning,
  navigation,
  onAnswer
}: FinancialQuizContainerProps) => {
  return (
    <section className="py-2 px-4 sm:px-6 lg:px-8 min-h-screen flex items-start pt-4">
      <div className="max-w-2xl mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#36596A] mb-2">Financial Wellness Assessment</h1>
          <p className="text-gray-600">Personalized Financial Strategy</p>
        </div>

        <div className="mb-6">
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">Question {currentQuestion} of {totalQuestions}</p>
        </div>

        <div className="shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-lg">
          <div className="p-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Quiz Component Placeholder</h2>
              <p className="text-gray-600">This component is not currently in use and requires additional quiz components to function.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinancialQuizContainer;
