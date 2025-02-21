import React from 'react';
import { cn } from '@/utils/cn';

interface LoaderSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'gray';
  className?: string;
  fullScreen?: boolean;
  text?: string;
}

const LoaderSpinner: React.FC<LoaderSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className,
  fullScreen = false,
  text
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'text-primary',
    white: 'text-white',
    gray: 'text-gray-400'
  };

  const Spinner = () => (
    <div className="flex flex-col items-center justify-center">
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-current border-t-transparent',
          sizeClasses[size],
          colorClasses[color],
          className
        )}
      />
      {text && (
        <p className={cn(
          'mt-2 text-sm font-medium',
          colorClasses[color]
        )}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 shadow-xl">
          <Spinner />
        </div>
      </div>
    );
  }

  return <Spinner />;
};

export default LoaderSpinner; 