import React from 'react';

const QuizLoadingAnimation = ({ progress }) => {
  return (
    <div className="text-center py-2">
      <div className="max-w-md mx-auto">
        {/* Progress Bar */}
        <div className="relative h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg overflow-hidden">
          {/* Progress Fill */}
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          >
            {/* Moving Light Effect */}
            <div className="absolute inset-0">
              <div
                className="absolute h-full w-4 bg-white/30 blur-sm animate-slide"
                style={{ 
                  left: '-16px',
                  transform: 'skewX(-20deg)'
                }}
              />
            </div>
          </div>

          {/* Progress Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {progress}% - Generating Quiz
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizLoadingAnimation; 