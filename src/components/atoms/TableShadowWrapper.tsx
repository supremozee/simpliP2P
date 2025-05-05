import React, { useEffect, useRef } from 'react';

interface TableShadowWrapperProps {
  children: React.ReactNode;
  className?: string;
  maxHeight?: string;
}

const TableShadowWrapper: React.FC<TableShadowWrapperProps> = ({ 
  children, 
  className = "",
  maxHeight = "70vh" 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const leftShadowRef = useRef<HTMLDivElement>(null);
  const rightShadowRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current || !leftShadowRef.current || !rightShadowRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    
    leftShadowRef.current.style.opacity = scrollLeft > 0 ? '1' : '0';
    
    const isAtEnd = Math.abs(scrollWidth - clientWidth - scrollLeft) < 5;
    rightShadowRef.current.style.opacity = isAtEnd ? '0' : '1';
  };

  useEffect(() => {
    const checkOverflow = () => {
      if (scrollRef.current && rightShadowRef.current) {
        const { scrollWidth, clientWidth } = scrollRef.current;
        rightShadowRef.current.style.opacity = scrollWidth > clientWidth ? '1' : '0';
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [children]);

  return (
    <div className="relative">
      <div 
        ref={leftShadowRef}
        className="absolute left-0 top-0 bottom-0 w-[25%] z-50 pointer-events-none opacity-0 transition-opacity duration-300"
        style={{ 
          background: 'linear-gradient(to right, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)',
          boxShadow: 'inset 10px 0 8px -8px rgba(0,0,0,0.1)'
        }}
      />
      
      <div 
        ref={rightShadowRef}
        className="absolute right-0 top-0 bottom-0 w-[25%] z-50 pointer-events-none opacity-0 transition-opacity duration-300"
        style={{ 
          background: 'linear-gradient(to left, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)',
          boxShadow: 'inset -10px 0 8px -8px rgba(0,0,0,0.1)'
        }}
      />
      
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className={`overflow-x-auto relative z-10 bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}
        style={{ maxHeight }}
      >
        {children}
      </div>
    </div>
  );
};

export default TableShadowWrapper;