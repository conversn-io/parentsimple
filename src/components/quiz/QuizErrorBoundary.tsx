'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class QuizErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Quiz error:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-xl">
            <div className="p-8 text-center space-y-6">
              <div className="flex justify-center">
                <AlertTriangle className="h-16 w-16 text-red-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Something went wrong
                </h2>
                <p className="text-gray-600">
                  We encountered an unexpected error. Please try refreshing the quiz.
                </p>
              </div>
              <button
                onClick={this.handleReset}
                className="w-full bg-[#36596A] hover:bg-[#2a4a5a] text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Restart Quiz
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default QuizErrorBoundary;
