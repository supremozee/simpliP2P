import React from 'react';
import { cn } from '@/utils/cn';

interface SpinnerProps {
  className?: string;
  size?: number; 
  thickness?: number; 
}

const Spinner: React.FC<SpinnerProps> = ({ className, size = 40, thickness = 4 }) => {
  return (
    <div
      className={cn(
        'inline-block animate-spin border-solid border-primary border-t-transparent rounded-full',
        className
      )}
      role="status"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderWidth: `${thickness}px`,
      }}
    ></div>
  );
};

export default Spinner;
