"use client"
import React from 'react';

const TextAreaContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-2 relative font-roboto">{children}</div>
);

const TextArea = ({
  value,
  onChange,
  className,
  rows,
  disabled,
  ...props
}: {
  value?: string;
  rows?: number;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  disabled?: boolean;
  [key: string]: unknown;
}) => (
  <textarea
    onChange={onChange}
    rows={rows}
    value={value}
    disabled={disabled}
    {...props}
    className={`w-full p-2 border border-[#BDBDBD] font-[400] rounded-md bg-transparent text-[#424242] transition-colors duration-300 placeholder-[#AAAAAA] focus:outline-none focus:border-[#BDBDBD] placeholder:text-[10px] placeholder:pl-2 ${disabled ? 'cursor-not-allowed opacity-60 bg-gray-50' : ''} ${className || ''}`}
  />
);

interface Props {
  name?: string;
  value?: string;
  placeholder: string;
  label: string;
  className?: string;
  rows?: number;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextAreaField = ({
  name,
  placeholder,
  label,
  value,
  className,
  rows,
  onChange,
  required,
  readOnly,
  disabled,
  ...props
}: Props) => {
  return (
    <TextAreaContainer>
      <label className='text-[12px] text-[#424242] font-bold'>{label} {required && <span className="text-red-500">*</span>}</label>
      <TextArea
        name={name}
        placeholder={placeholder}
        className={className}
        rows={rows}
        value={value}
        readOnly={readOnly}
        disabled={disabled}
        onChange={onChange}
        {...props}
      />
    </TextAreaContainer>
  );
};

export default TextAreaField;