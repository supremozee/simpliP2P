import React from 'react'

const Tooltip = ({ content, children }: { content: string, children: React.ReactNode }) => (
  <div className="group relative inline-block">
    {children}
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap bg-gray-800 text-white text-xs rounded px-2 py-1 mb-1 z-50">
      {content}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-px border-4 border-transparent border-t-gray-800"></div>
    </div>
  </div>
);

export default Tooltip