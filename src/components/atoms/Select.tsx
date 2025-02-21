import React, { useState, useEffect } from 'react';
import { Branch, Department, Requisition, Supplier } from '@/types';
import LoaderSpinner from './LoaderSpinner';

type Option = Branch | Department | Requisition | Supplier;

interface SelectProps {
  label: string;
  options: Option[];
  required?: boolean;
  error?: string;
  loading?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  component?: React.ReactNode;
  display?: "name" | "id";
  isError?: boolean;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const Select = ({
  label,
  options,
  required = false,
  error,
  loading,
  component,
  isError,
  value,
  defaultValue,
  placeholder = "Select an option",
  className,
  disabled,
  ...props
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const [selectedOption, setSelectedOption] = useState<string>(defaultValue || "");

  const getOptionName = (option: Option): string => {
    if ('name' in option) return option.name;
    if ('full_name' in option) return option.full_name;
    if ('requestor_name' in option) return option.requestor_name;
    return '';
  };

  useEffect(() => {
    const filtered = options.filter((option) =>
      getOptionName(option).toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchTerm, options]);

  useEffect(() => {
    if (options.length > 0) {
      let selected = options.find(option => option.id === value);
      
      if (!selected && defaultValue) {
        selected = options.find(option => getOptionName(option) === defaultValue);
      }
      
      if (selected) {
        setSelectedOption(getOptionName(selected));
      }
    }
  }, [value, defaultValue, options]);

  useEffect(() => {
    if (defaultValue) {
      setSelectedOption(defaultValue);
    }
  }, [defaultValue]);

  const handleSelect = (option: Option) => {
    const optionName = getOptionName(option);
    setSelectedOption(optionName);

    props.onChange?.({
      target: { value: option.id },
    } as unknown as React.ChangeEvent<HTMLInputElement>);
    
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.select-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isError) {
    return <p className="text-red-500 text-sm">Error occurred fetching {label}</p>;
  }

  return (
    <div className={`w-full relative select-container ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`w-full p-2.5 border ${error ? 'border-red-500' : 'border-gray-200'} 
          rounded-lg bg-white text-gray-700 ${!disabled ? 'cursor-pointer hover:border-gray-300' : 'cursor-not-allowed opacity-60 bg-gray-50'} 
          transition-colors duration-200 flex justify-between items-center`}
        onClick={handleClick}
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
          {selectedOption || placeholder}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && !disabled && (
        <div className="absolute w-full mt-1 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="sticky top-0 bg-white border-b border-gray-100 p-2 flex gap-2 items-center">
            <input
              type="text"
              placeholder={`Search ${label.toLowerCase()}`}
              className="w-full p-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-primary"
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              value={searchTerm}
            />
            {component}
          </div>
          
          {loading ? (
            <div className="p-4 flex justify-center">
              <LoaderSpinner size="sm" />
            </div>
          ) : filteredOptions.length > 0 ? (
            <div className="py-1">
              {filteredOptions.map((option) => (
              <div
                key={option.id}
                  className={`px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer
                    ${selectedOption === getOptionName(option) ? 'bg-primary/5 text-primary' : 'text-gray-700'}`}
                onClick={() => handleSelect(option)}
              >
                {getOptionName(option)}
              </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-sm text-gray-500 text-center">
              No options found
            </div>
          )}
        </div>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;