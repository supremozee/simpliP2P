"use client"
import React, { useState } from 'react';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

const InputContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-2 relative font-roboto">{children}</div>
);

const Input = ({
  isDropdown,
  value,
  onChange,
  className,
  ...props
}: {
  isDropdown?: boolean;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  [key: string]: unknown;
}) => (
  <input
    onChange={onChange}
    value={value}
    {...props}
    className={`w-full   p-2 border border-[#dddada] font-[400] rounded-[12px] text-[17px] bg-transparent text-[#424242] transition-colors duration-300 placeholder-[#AAAAAA] focus:outline-none focus:border-[#BDBDBD] placeholder:text-[10px] placeholder:pl-2 ${
      isDropdown ? 'pr-10' : ''
    } ${className || ''}`}
  />
);

const VisibilityToggle = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="absolute right-2 top-12 transform -translate-y-1/2 bg-none border-none cursor-pointer p-0 flex items-center justify-center"
  >
    {children}
  </button>
);

interface Props {
  name: string;
  type: string;
  value?: string;
  placeholder: string;
  label?: string;
  className?: string;
  step?:string;
  dropdownOptions?: string[];
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?:boolean;
  onPaste?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  onFocus?: () => void;
  disabled?: boolean;
  ref?: React.Ref<HTMLInputElement>;
}

const InputField = ({
  name,
  type,
  placeholder,
  label,
  value,
  className,
  dropdownOptions,
  onChange,
  onPaste,
  step,
  required,
  onFocus,
  disabled,
  ref,
  ...props
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <InputContainer>
    <label className='text-[12px] text-[#424242] font-bold'>
      {label} {required && <span className="text-red-500">*</span>}
      </label>
        <Input
          name={name}
          disabled={disabled}
          type={type === 'password' && showPassword ? 'text' : type}
          placeholder={placeholder}
          className={className}
          readOnly={!!dropdownOptions}
          value={value}
          onChange={onChange}
          onPaste={onPaste}
          onFocus={onFocus}
          step={step}
          ref={ref}
          {...props}
        />
         {type === 'password' && value && (
        <PasswordStrengthIndicator password={value} />
      )}
        {type === 'password' && (
          <VisibilityToggle onClick={togglePasswordVisibility}>
            {showPassword ? <IoEyeOutline size={20} />:<IoEyeOffOutline size={20} /> }
          </VisibilityToggle>
        )}
    </InputContainer>
  );
};

export default InputField;