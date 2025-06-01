
import React from 'react';
import RNELogo from './RNELogo';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex gap-3 mb-4 message-animation">
      <RNELogo size="sm" />
      
      <div className="bg-white border border-rne-gray-light rounded-2xl px-4 py-3 shadow-sm">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-rne-navy rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-rne-blue rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-rne-cyan rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <p className="text-xs text-rne-text-light mt-2 opacity-70">
          L'assistant tape...
        </p>
      </div>
    </div>
  );
};

export default TypingIndicator;
