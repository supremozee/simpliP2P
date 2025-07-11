import React, { useState } from "react";
import { IoChevronDownSharp, IoCloseCircle } from "react-icons/io5";

export interface MultiSelectOption<T = string> {
  label: string;
  value: T;
  description?: string;
  options?: MultiSelectOption<T>[];
}

interface MultiSelectProps<T = string> {
  label: string;
  options: MultiSelectOption<T>[];
  value: MultiSelectOption<T>[];
  onChange: (value: MultiSelectOption<T>[]) => void;
  error?: string;
  placeholder?: string;
  className?: string;
  customOptionComponent?: React.FC<{
    data: MultiSelectOption<T>;
    isSelected: boolean;
  }>;
  isMulti?: boolean;
}

function MultiSelect<T = string>({
  label,
  options,
  value,
  onChange,
  error,
  placeholder = "Select options...",
  className,
  customOptionComponent: CustomOption,
  isMulti = false,
}: MultiSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const isSelected = (option: MultiSelectOption<T>) =>
    value.some((v) => v.value === option.value);

  const toggleOption = (option: MultiSelectOption<T>) => {
    if (isMulti) {
      const newValue = isSelected(option)
        ? value.filter((v) => v.value !== option.value)
        : [...value, option];
      onChange(newValue);
    } else {
      onChange([option]);
      setIsOpen(false);
    }
  };

  const removeOption = (
    optionToRemove: MultiSelectOption<T>,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    const newValue = value.filter((v) => v.value !== optionToRemove.value);
    onChange(newValue);
  };

  const filteredOptions = options.filter(
    (option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.options?.some((subOption) =>
        subOption.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const renderOption = (option: MultiSelectOption<T>) => {
    const selected = isSelected(option);

    if (CustomOption) {
      return (
        <div
          key={String(option.value)}
          className="cursor-pointer hover:bg-gray-50"
          onClick={() => toggleOption(option)}
        >
          <CustomOption data={option} isSelected={selected} />
        </div>
      );
    }

    return (
      <div
        key={String(option.value)}
        className="p-2 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
        onClick={() => toggleOption(option)}
      >
        <div>
          <div className="font-medium">{option.label}</div>
          {option.description && (
            <div className="text-sm text-gray-500">{option.description}</div>
          )}
        </div>
        {selected && <span className="text-primary">✓</span>}
      </div>
    );
  };

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium #181819 mb-1">{label}</label>
      <div
        className="border rounded-lg p-2 min-h-[38px] bg-white cursor-pointer flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1">
          {value.length > 0 ? (
            value.map((v) => (
              <span
                key={String(v.value)}
                className="bg-gray-100 px-2 py-1 rounded-md text-sm flex items-center gap-1 group"
              >
                {v.label}
                <IoCloseCircle
                  className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-500 transition-colors"
                  onClick={(e) => removeOption(v, e)}
                />
              </span>
            ))
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        <IoChevronDownSharp
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-2">
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="p-1">
            {filteredOptions.map((option) => (
              <React.Fragment key={String(option.value)}>
                {renderOption(option)}
                {option.options?.map((subOption) => (
                  <div key={String(subOption.value)} className="ml-4">
                    {renderOption(subOption)}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MultiSelect;
