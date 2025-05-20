import React from 'react';

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Panel({ children, className, ...props }: PanelProps) {
  const cornerElClass = "absolute bg-sky-400 w-3 h-[1.5px]";
  const verticalLineClass = "absolute bg-sky-400 w-[1.5px] h-3";

  return (
    <div
      className={`bg-[#071e36] shadow-lg rounded-none p-3 flex flex-col relative ${className || ''}`}
      {...props}
    >
      {/* Corner Accent Elements */}
      <span className={`${cornerElClass} top-0 left-0`}></span>
      <span className={`${verticalLineClass} top-0 left-0`}></span>
      <span className={`${cornerElClass} top-0 right-0`}></span>
      <span className={`${verticalLineClass} top-0 right-0`}></span>
      <span className={`${cornerElClass} bottom-0 left-0`}></span>
      <span className={`${verticalLineClass} bottom-0 left-0`}></span>
      <span className={`${cornerElClass} bottom-0 right-0`}></span>
      <span className={`${verticalLineClass} bottom-0 right-0`}></span>
      
      {children}
    </div>
  );
}