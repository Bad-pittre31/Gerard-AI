import React from 'react';

export function AcornLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M12 2V4" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      <path 
        d="M18 8C18 5.79086 15.3137 4 12 4C8.68629 4 6 5.79086 6 8C6 9.10457 6.89543 10 8 10H16C17.1046 10 18 9.10457 18 8Z" 
        fill="currentColor"
      />
      <path 
        d="M7 10C7 14.4183 9.23858 18 12 18C14.7614 18 17 14.4183 17 10H7Z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M12 18V21" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
    </svg>
  );
}
