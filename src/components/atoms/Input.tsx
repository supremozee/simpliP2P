"use client"
import React, { useState } from 'react';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';

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
    className={`w-full p-2 border border-[#BDBDBD] font-[400] rounded-md bg-transparent text-[#424242] transition-colors duration-300 placeholder-[#424242] focus:outline-none focus:border-[#BDBDBD] placeholder:pl-2 ${
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
  label: string;
  className?: string;
  dropdownOptions?: string[];
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
  ...props
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <InputContainer>
    <label className='text-[12px] text-[#424242] font-bold'>{label}</label>
        <Input
          name={name}
          type={type === 'password' && showPassword ? 'text' : type}
          placeholder={placeholder}
          className={className}
          readOnly={!!dropdownOptions}
          value={value}
          onChange={onChange}
          {...props}
        />
        {type === 'password' && (
          <VisibilityToggle onClick={togglePasswordVisibility}>
            {showPassword ? <IoEyeOutline size={20} />:<IoEyeOffOutline size={20} /> }
          </VisibilityToggle>
        )}
    </InputContainer>
  );
};

export default InputField;