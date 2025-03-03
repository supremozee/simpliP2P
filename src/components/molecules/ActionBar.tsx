import React, { useState, useEffect } from 'react';
import Button from '../atoms/Button';
import { BsGridFill, BsChevronDown } from "react-icons/bs";
import { RxHamburgerMenu } from 'react-icons/rx';
import { TbFileExport } from "react-icons/tb";
import { FaPlus } from 'react-icons/fa';
import { IoFilterOutline } from 'react-icons/io5';
import { FiSearch } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import useStore from '@/store';
import useExportData from '@/hooks/useExportData';

type FilterOption = {
  label: string;
  value: string;
  options: { label: string; value: string }[];
};

type ActionBarTypes = {
  onSearch?: (query: string) => void;
  showDate?: boolean;
  exportId?: string;
  buttonName?: string;
  viewMode?: boolean;
  toggleView?: () => void;
  view?: 'grid' | 'list';
  onClick?: () => void;
  type: string;
  filterOptions?: FilterOption[];
  onFilter?: (filterType: string, value: string) => void;
};

const exportFormats = [
  { value: 'csv', label: 'CSV' },
  { value: 'pdf', label: 'PDF' },
  { value: 'excel', label: 'Excel' },
  { value: 'word', label: 'Word' },
];

const LoadingModal = () => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4 min-w-[200px]">
      <AiOutlineLoading3Quarters className="w-8 h-8 text-primary animate-spin" />
      <p className="text-sm font-medium text-gray-700">Processing Export...</p>
    </div>
  </div>
);

const ActionBar: React.FC<ActionBarTypes> = ({
  onSearch,
  showDate,
  buttonName,
  viewMode,
  toggleView,
  view,
  onClick,
  type,
  filterOptions = [],
  onFilter
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const { currentOrg, startDate, endDate, format, setEndDate, setStartDate, setFormat } = useStore();
  const { refetch: exportData, isLoading: isExportLoading, isError: isExportError } = useExportData({
    orgId: currentOrg,
    startDate,
    endDate,
    format,
    type
  });

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (onSearch) {
        onSearch(searchQuery);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, onSearch]);

  const handleExport = () => {
    exportData();
  };

  const handleFilterClick = () => {
    setIsFilterOpen(!isFilterOpen);
    setActiveFilter(null);
  };

  const handleFilterSelect = (filterType: string) => {
    setActiveFilter(activeFilter === filterType ? null : filterType);
  };

  const handleFilterOptionSelect = (filterType: string, value: string) => {
    if (onFilter) {
      onFilter(filterType, value);
    }
    setIsFilterOpen(false);
    setActiveFilter(null);
  };

  return (
    <>
      {isExportLoading && <LoadingModal />}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-4 p-2 rounded-xl shadow-sm">
       <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto">
       {buttonName&&buttonName?.length > 0 &&  <Button
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-lg px-5 py-2.5 transition-all min-w-[160px]"
            onClick={onClick}
          >
            <FaPlus className="w-4 h-4" />
            <span className="text-sm font-medium">{buttonName}</span>
          </Button>
}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {showDate && (
            <div className="flex items-center rounded-lg p-2">
              <div className="relative group">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
                  className="appearance-none bg-transparent border-none py-1.5 text-sm focus:outline-none cursor-pointer"
                  placeholder="Start Date"
                />
              </div>
              <div className="relative group">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
                  className="appearance-none bg-transparent border-none py-1.5 text-sm focus:outline-none cursor-pointer"
                  placeholder="End Date"
                />
              </div>
              <div className="relative">
                <select 
                  value={format}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormat(e.target.value)}
                  className="appearance-none rounded-md px-3 py-1.5 text-sm focus:outline-none cursor-pointer pr-8 border border-gray-200"
                >
                  {exportFormats.map((fmt) => (
                    <option key={fmt.value} value={fmt.value}>
                      {fmt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <Button
            className="bg-gray-50 hover:bg-gray-100 flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleExport}
            disabled={isExportLoading}
          >
            <span className="text-sm font-medium">
              {isExportLoading ? 'Exporting...' : 'Export'}
            </span>
            <TbFileExport className="w-4 h-4" />
          </Button>

          {viewMode && (
            <button
              type="button"
              className="bg-gray-50 hover:bg-gray-100 rounded-lg w-10 h-10 flex items-center justify-center transition-all text-gray-700"
              onClick={toggleView}
            >
              {view === "grid" ? 
                <BsGridFill className="w-4 h-4" /> : 
                <RxHamburgerMenu className="w-4 h-4" />
              }
            </button>
          )}

          <div className="relative">
            <button 
              type="button"
              className="bg-gray-50 hover:bg-gray-100 rounded-lg w-10 h-10 flex items-center justify-center transition-all text-gray-700"
              onClick={handleFilterClick}
              aria-label="Filter"
            >
              <IoFilterOutline className="w-4 h-4" />
            </button>

            {isFilterOpen && filterOptions.length > 0 && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                {filterOptions.map((filter) => (
                  <div key={filter.value} className="relative">
                    <button
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between"
                      onClick={() => handleFilterSelect(filter.value)}
                    >
                      {filter.label}
                      <BsChevronDown className={`w-3 h-3 transition-transform ${activeFilter === filter.value ? 'rotate-180' : ''}`} />
                    </button>
                    {activeFilter === filter.value && (
                      <div className="bg-white shadow-lg rounded-lg py-1 absolute left-full top-0 w-48 -ml-1">
                        {filter.options.map((option) => (
                          <button
                            key={option.value}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                            onClick={() => handleFilterOptionSelect(filter.value, option.value)}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative flex-1 md:max-w-[320px]">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400 w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search by Order ID, Supplier, or Item Name"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="w-full pl-10 py-1.5 text-[10px] bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>
        {isExportError && (
          <p className="text-red-500 text-sm mt-2 absolute bottom-[-24px] left-4">
            Error exporting data
          </p>
        )}
      </div>
    </>
  );
};

export default ActionBar;