import React, { useState } from 'react';
import { Branch, Department, Requisition, Supplier } from '@/types';
import LoaderSpinner from './LoaderSpinner';
import { IoChevronDownSharp } from 'react-icons/io5';

type Option = Branch | Department | Requisition | Supplier;

interface SelectProps {
  label: string;
  options: Option[];
  required?: boolean;
  error?: string;
  loading?: boolean;
  onChange?: (selectedValue: string) => void;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  component?: React.ReactNode;
}

const CustomSelect: React.FC<SelectProps> = ({
  label,
  options,
  required = false,
  error,
  loading,
  onChange,
  value,
  placeholder = 'Select an option',
  className,
  disabled,
  component,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const getOptionLabel = (option: Option): string => {
    return 'name' in option
      ? option.name
      : 'full_name' in option
      ? option.full_name
      : 'requestor_name' in option
      ? option.requestor_name
      : '';
  };

  const filteredOptions = options.filter((option) =>
    getOptionLabel(option).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (selectedValue: string) => {
    setIsOpen(false);
    setSearchTerm('');
    if (onChange) {
      onChange(selectedValue);
    }
  };

  return (
    <div className={`w-full flex flex-col relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {loading ? (
        <div className="flex justify-center p-2">
          <LoaderSpinner size="sm" />
        </div>
      ) : (
        <div
          className={`border p-2 rounded-md cursor-pointer bg-white flex justify-between items-center ${disabled ? 'opacity-50' : ''}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <span>{value ? getOptionLabel(options.find(opt => opt.id === value) || options[0]) : placeholder}</span>
          <IoChevronDownSharp />
        </div>
      )}
      {isOpen && !disabled && (
        <div className="absolute top-full mt-1 w-full bg-white border rounded-md shadow-lg z-50">
          <div className='flex justify-between items-center p-2 border-b'>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[70%] py-1 border-b rounded-full"
          />
            {component && <div className="">{component}</div>}
          </div>
          <div className="max-h-40 overflow-y-auto">
            {filteredOptions.map((option) => (
              <div
                key={option.id}
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => option?.id && handleSelect(option.id)}
              >
                {getOptionLabel(option)}
              </div>
            ))}
          </div>
        </div>
      )}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default CustomSelect;
