import React from 'react';

const SparkleIcon = ({ className }) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M9.828 5.495C10.638 3.558 13.362 3.558 14.172 5.495L15.025 7.537C15.305 8.209 15.833 8.737 16.505 9.017L18.547 9.87C20.484 10.68 20.484 13.404 18.547 14.214L16.505 15.067C15.833 15.347 15.305 15.875 15.025 16.547L14.172 18.589C13.362 20.526 10.638 20.526 9.828 18.589L8.975 16.547C8.695 15.875 8.167 15.347 7.495 15.067L5.453 14.214C3.516 13.404 3.516 10.68 5.453 9.87L7.495 9.017C8.167 8.737 8.695 8.209 8.975 7.537L9.828 5.495Z" 
        fill="url(#sparkle-gradient)" 
      />
      <defs>
        <linearGradient id="sparkle-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4f46e5" /> {/* Indigo */}
          <stop offset="0.5" stopColor="#ec4899" /> {/* Pink */}
          <stop offset="1" stopColor="#eab308" /> {/* Yellow */}
        </linearGradient>
      </defs>
    </svg>
  );
};

export default SparkleIcon;