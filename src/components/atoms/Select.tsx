import React, { useState, useEffect, useRef } from "react";
import { Branch, Department, Requisition, Supplier } from "@/types";
import LoaderSpinner from "./LoaderSpinner";
import { IoChevronDownSharp, IoClose, IoSearch } from "react-icons/io5";
import { useClickOutside } from "@/hooks/useClickOutside";

type Option =
  | Branch
  | Department
  | Requisition
  | Supplier
  | { id: string; name: string; value?: string };

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
  maxHeight?: string;
}

const CustomSelect: React.FC<SelectProps> = ({
  label,
  options,
  required = false,
  error,
  loading,
  onChange,
  value,
  placeholder = "Select an option",
  className,
  disabled,
  component,
  maxHeight = "240px",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [position, setPosition] = useState<"top" | "bottom">("bottom");
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle click outside to close dropdown
  useClickOutside(
    dropdownRef,
    () => {
      if (isOpen) setIsOpen(false);
    },
    [selectRef]
  );

  // Determine option label based on option type
  const getOptionLabel = (option: Option): string => {
    if (!option) return "";

    return "name" in option
      ? option.name
      : "full_name" in option
      ? option.full_name
      : "requestor_name" in option
      ? option.requestor_name
      : "value" in option && typeof option === "string"
      ? option
      : "";
  };

  // Get selected option display value
  const getSelectedOptionLabel = (): string => {
    if (!value) return placeholder;

    const selectedOption = options.find((opt) => opt.id === value);
    return selectedOption ? getOptionLabel(selectedOption) : placeholder;
  };

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    getOptionLabel(option).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle option selection
  const handleSelect = (selectedValue: string) => {
    setIsOpen(false);
    setSearchTerm("");
    if (onChange) {
      onChange(selectedValue);
    }
  };

  // Calculate dropdown position when opening
  useEffect(() => {
    if (isOpen && selectRef.current && dropdownRef.current) {
      // Focus search input when dropdown opens
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 10);

      // Calculate if dropdown should appear above or below
      const selectRect = selectRef.current.getBoundingClientRect();
      const dropdownHeight = dropdownRef.current.offsetHeight;
      const windowHeight = window.innerHeight;

      // If not enough space below, show dropdown above
      if (
        selectRect.bottom + dropdownHeight > windowHeight &&
        selectRect.top > dropdownHeight
      ) {
        setPosition("top");
      } else {
        setPosition("bottom");
      }
    }
  }, [isOpen]);

  return (
    <div
      className={`w-full flex flex-col relative ${className}`}
      ref={selectRef}
    >
      <label className="block text-sm font-medium #181819 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center p-2 border rounded-md bg-gray-50">
          <LoaderSpinner size="sm" />
        </div>
      ) : (
        // Select trigger
        <div
          className={`border p-2 rounded-md cursor-pointer bg-white flex justify-between items-center transition-all hover:border-primary/70 ${
            disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : ""
          } ${isOpen ? "border-primary ring-1 ring-primary/30" : ""}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          role="combobox"
        >
          <span
            className={`truncate ${!value ? "text-gray-400" : "text-primary"}`}
          >
            {getSelectedOptionLabel()}
          </span>
          <IoChevronDownSharp
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      )}

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div
          // ref={dropdownRef}
          className={`absolute z-50 w-full bg-white border rounded-md shadow-lg 
            ${position === "top" ? "bottom-full mb-1" : "top-full mt-1"}`}
          style={{ maxHeight, minWidth: "100%" }}
        >
          {/* Search and controls header */}
          <div className="flex justify-between items-center p-2 border-b sticky top-0 bg-white z-10">
            <div className="relative flex-grow">
              <IoSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search options..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:border-primary"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <div className="flex items-center gap-1 ml-2">
              {component && (
                <div onClick={(e) => e.stopPropagation()}>{component}</div>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsOpen(false);
                  setSearchTerm("");
                }}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <IoClose className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Options list */}
          <div
            className="overflow-y-auto"
            style={{ maxHeight: `calc(${maxHeight} - 48px)` }}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.id}
                  className={`p-2.5 cursor-pointer hover:bg-gray-50 transition-colors text-sm ${
                    option.id === value ? "bg-primary/10 font-medium" : ""
                  }`}
                  onClick={() => option?.id && handleSelect(option.id)}
                  role="option"
                  aria-selected={option.id === value}
                >
                  {getOptionLabel(option)}
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-gray-500 text-sm">
                No options match your search
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error message */}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default CustomSelect;
