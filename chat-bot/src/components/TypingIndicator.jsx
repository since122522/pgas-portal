import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
      <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
      <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
    </div>
  );
};

export default TypingIndicator;
