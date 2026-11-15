import React from 'react';

const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-brand-500/20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-brand-500 border-t-transparent animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-2 border-cyan-400 border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
      </div>
      {text && (
        <p className="text-xs font-mono text-gray-400 tracking-wider uppercase animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
