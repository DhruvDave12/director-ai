"use client";

import { useState, useEffect } from 'react';

interface LoadingComponentProps {
  loadingState: 'plan' | 'execute';
}

const LoadingComponent = ({ loadingState }: LoadingComponentProps) => {
  const [displayText, setDisplayText] = useState('');
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const stateConfig = {
    plan: {
      messages: [
        'Generating plan...',
        'Analyzing requirements...',
        'Estimating costs...',
        'Optimizing strategy...',
        'Finalizing blueprint...'
      ],
      icon: '🧠',
      color: 'text-purple-600',
      spinnerColor: 'border-purple-600',
      bgColor: 'purple-600'
    },
    execute: {
      messages: [
        'Executing task...',
        'Processing data...',
        'Running algorithms...',
        'Compiling results...',
        'Applying changes...',
        'Syncing updates...',
        'Validating output...',
        'Finalizing execution...',
        'Almost there...',
        'Wrapping up...'
      ],
      icon: '⚡️',
      color: 'text-pink-600',
      spinnerColor: 'border-pink-600',
      bgColor: 'pink-600'
    }
  };

  useEffect(() => {
    const config = stateConfig[loadingState];
    let currentIndex = 0;
    const currentMessage = config.messages[currentMessageIndex];

    setDisplayText('');

    const typingInterval = setInterval(() => {
      if (currentIndex <= currentMessage.length) {
        setDisplayText(currentMessage.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setCurrentMessageIndex(prev => (prev + 1) % config.messages.length);
        }, 1500);
      }
    }, 80);

    return () => clearInterval(typingInterval);
  }, [loadingState, currentMessageIndex]);

  const currentConfig = stateConfig[loadingState];

  return (
    <div className="flex flex-row items-center justify-center space-x-4 p-4">
      <div className="relative w-10 h-10">
        <div className={`w-full h-full border border-${currentConfig.bgColor} border-1 rounded-full flex items-center justify-center bg-opacity-10`}>
          <span className="text-xl">{currentConfig.icon}</span>
        </div>
        <div className={`absolute top-0 left-0 w-full h-full ${currentConfig.spinnerColor} border-t-2 border-t-transparent rounded-full animate-spin`}></div>
      </div>

      <div className="text-left">
        <p className={`text-lg font-bold ${currentConfig.color}`}>
          {displayText}
        </p>
      </div>
    </div>
  );
};

export default LoadingComponent;