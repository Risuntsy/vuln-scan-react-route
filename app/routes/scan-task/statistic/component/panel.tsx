import React from 'react';

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Panel({ children, className, ...props }: PanelProps) {
  return (
    <div
      className={`relative bg-gradient-to-br from-[#071e36] via-[#081f37] to-[#061c33] 
        shadow-lg rounded-lg p-3 flex flex-col
        border border-sky-500/20 
        before:absolute before:inset-0 before:rounded-lg 
        before:bg-gradient-to-br before:from-sky-400/5 before:to-transparent before:pointer-events-none
        after:absolute after:inset-0 after:rounded-lg 
        after:shadow-inner after:shadow-sky-900/20 after:pointer-events-none
        ${className || ''}`}
      {...props}
    >
      {/* 科技感装饰线条 */}
      <div className="absolute top-0 left-4 w-8 h-0.5 bg-gradient-to-r from-sky-400 to-transparent"></div>
      <div className="absolute top-0 right-4 w-8 h-0.5 bg-gradient-to-l from-sky-400 to-transparent"></div>
      <div className="absolute bottom-0 left-4 w-8 h-0.5 bg-gradient-to-r from-sky-400 to-transparent"></div>
      <div className="absolute bottom-0 right-4 w-8 h-0.5 bg-gradient-to-l from-sky-400 to-transparent"></div>
      
      {/* 角落装饰 */}
      <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-sky-400/60 rounded-tl-lg"></div>
      <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-sky-400/60 rounded-tr-lg"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-sky-400/60 rounded-bl-lg"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-sky-400/60 rounded-br-lg"></div>
      
      {/* 内容区域 */}
      <div className="relative z-10 flex flex-col h-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}