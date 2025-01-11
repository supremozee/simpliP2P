'use client';
import React from 'react';
import classNames from 'classnames';

interface ButtonProps {
  radius?: 'none' | 'xs' | 'xxs' | 'full'| 'default';
  padding?: 'lg' | 'sm' | 'xs' | 'xxs' | 'default';
  width?: 'wide' | 'book' | 'full' | 'default';
  maxwidth?: 'wide' | 'default';
  kind?: 'tertiary' | 'secondary' | 'grey' | 'white'| 'default';
  fontSize?: string;
  hovercolor?: string;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?:'submit'|'reset';
}

const Button: React.FC<ButtonProps> = ({
  radius = 'default',
  padding = 'default',
  width = 'default',
  maxwidth = 'default',
  kind = 'default',
  fontSize = '1rem',
  hovercolor,
  disabled,
  className,
  children,
  onClick,
  type 
}) => {
  const radiusClasses = {
    none: 'rounded-none',
    full: 'rounded-full',
    xs: 'rounded-xs',
    xxs: 'rounded-xxs',
    default: 'rounded',
  };

  const paddingClasses = {
    lg: 'py-4 px-12',
    sm: 'py-6 px-6',
    xs: 'py-2 px-8',
    xxs: 'py-2 px-2',
    default: 'py-6 px-10',
  };

  const widthClasses = {
    wide: 'w-56',
    book: 'w-40',
    full: 'w-full',
    default: 'w-auto',
  };

  const maxwidthClasses = {
    wide: 'max-w-lg',
    default: 'max-w-full',
  };

  const kindClasses = {
    tertiary: 'bg-tertiary',
    secondary: 'bg-secondary',
    grey: 'bg-foreground',
    white: 'bg-white',
    default: 'bg-primary',
  };

  return (
    <button
    type={type}
    onClick={onClick}
      className={classNames(
        'focus:outline-none inline-flex items-center justify-center h-10 font-bold font-roboto z-10',
        radiusClasses[radius],
        paddingClasses[padding],
        widthClasses[width],
        maxwidthClasses[maxwidth],
        kindClasses[kind],
        {
          'cursor-not-allowed': disabled,
          'hover:bg-gray-': !disabled && !hovercolor,
          [`hover:${hovercolor}`]: hovercolor,
        },
        className
      )}
      style={{ fontSize }}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;