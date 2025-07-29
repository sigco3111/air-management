
import React from 'react';

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 01-1.414 1.414L12 6.414l-2.293 2.293a1 1 0 01-1.414-1.414L10 4.707M12 21a1 1 0 01-1-1v-4a1 1 0 012 0v4a1 1 0 01-1 1zM21 12a1 1 0 01-1 1h-4a1 1 0 010-2h4a1 1 0 011 1z" />
  </svg>
);

export default SparklesIcon;
