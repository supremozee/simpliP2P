import React from 'react';
import { cn } from '@/utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: ()=>void
  selected?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className, onClick, selected }) => {
  return (
    <div
      className={cn(
        "w-[350px] h-[150px] gap-[4px] rounded-[15px] bg-white shadow-[0px_8px_8px_0px_#C7CDDB33]",
        className,
        selected && "border-[2px_solid_blue]"
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;