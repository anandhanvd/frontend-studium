import React from 'react';

const QuizLoadingAnimation = ({ progress }) => {
  return (
    <div className="text-black text-center mt-4">
      <p className="mb-2 text-sm font-semibold">Generating quiz... {progress}%</p>
      
      {/* Road container */}
      <div className="relative h-8 bg-gray-800 rounded-lg overflow-hidden max-w-md mx-auto border border-gray-700">
        {/* Road markings */}
        <div className="absolute inset-0 flex items-center justify-around">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className="w-4 h-1 bg-yellow-400"
              style={{
                opacity: i * 12.5 <= progress ? 1 : 0.2
              }}
            />
          ))}
        </div>

        {/* Car */}
        <div 
          className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-300"
          style={{ 
            left: `${progress}%`,
            transform: `translate(-50%, -50%) scaleX(-1)`
          }}
        >
          <span className="text-xl" role="img" aria-label="car">🚗</span>
        </div>
      </div>
    </div>
  );
};

export default QuizLoadingAnimation; 