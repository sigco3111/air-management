
import React from 'react';

const TrophyIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 1013.5 0h-4.5m0-13.5h-3V3.75h3v1.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15.375c0 .621.504 1.125 1.125 1.125h3.75c.621 0 1.125-.504 1.125-1.125V12.75A3.375 3.375 0 0012 9.375h0A3.375 3.375 0 008.625 12.75v2.625z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 15.375V12.75a4.875 4.875 0 019.75 0v2.625" />
  </svg>
);

export default TrophyIcon;
