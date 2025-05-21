import React, { useState, useEffect } from 'react';
import Button from '../atoms/Button';
import { BsGridFill, BsChevronDown, BsCalendarDate, BsDownload } from "react-icons/bs";
import { RxHamburgerMenu } from 'react-icons/rx';
import { FaPlus } from 'react-icons/fa';
import { IoFilterOutline } from 'react-icons/io5';
import { FiSearch } from 'react-icons/fi';
import useStore from '@/store';
import useExportData from '@/hooks/useExportData';
import ExportingLoader from '../atoms/ExportingLoader';
import Tooltip from '../atoms/Tooltip';

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
  { value: 'excel', label: 'Excel' },

];

const ActionBar: React.FC<ActionBarTypes> = ({
  onSearch, showDate, buttonName, viewMode, toggleView, view, onClick, type, onFilter, filterOptions = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const { currentOrg, startDate, endDate, format, setEndDate, setStartDate, setFormat } = useStore();
  const { mutate: exportData, status, isError: isExportError } = useExportData({
    orgId: currentOrg, startDate, endDate, format, type
  });
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (onSearch) onSearch(searchQuery);
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, onSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.filter-menu') && !target.closest('.date-picker') && !target.closest('.export-menu')) {
        setIsFilterOpen(false);
        setIsDatePickerOpen(false);
        setIsExportMenuOpen(false);
        setActiveFilter(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
    setIsDatePickerOpen(false);
    setIsExportMenuOpen(false);
    setActiveFilter(null);
  };

  const toggleDatePicker = () => {
    setIsDatePickerOpen(!isDatePickerOpen);
    setIsFilterOpen(false);
    setIsExportMenuOpen(false);
  };

  const toggleExportMenu = () => {
    setIsExportMenuOpen(!isExportMenuOpen);
    setIsFilterOpen(false);
    setIsDatePickerOpen(false);
  };

  return (
    <>
      { status === "pending"&& <ExportingLoader />}
      
      <div className=" mb-4">
        <div className="flex items-center justify-between p-3 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-grow lg:flex-grow-0">
            {/* Left side with action button and search */}
            <div className="relative flex-grow max-w-[280px]">
              <div className="absolute inset-y-0 left-2 flex items-center">
                <FiSearch className="text-gray-400 w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder={`Search ${type}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-primary"
              />
            </div>

            {buttonName && (
              <Button 
                kind="default"
                padding="xxs" 
                radius="xs"
                className="flex items-center justify-center gap-1 text-white rounded"
                onClick={onClick}
              >
                <FaPlus className="w-3 h-3" />
                <span className="text-xs">{buttonName}</span>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Right side controls */}
            {showDate && (
              <div className="relative">
                <Tooltip content="Date Range">
                  <Button 
                    kind="white"
                    padding="xxs"
                    radius="xs"
                    className={`border ${isDatePickerOpen ? 'border-primary' : 'border-gray-200'} text-gray-600`}
                    onClick={toggleDatePicker}
                  >
                    <BsCalendarDate className="w-3.5 h-3.5" />
                  </Button>
                </Tooltip>
                
                {isDatePickerOpen && (
                  <div className="absolute right-0 mt-1 w-64 bg-white rounded shadow-md p-3 z-50 date-picker border border-gray-100">
                    <div className="flex gap-2 mb-2">
                      <div className="flex-1">
                        <label className="text-xs font-medium text-gray-600 mb-1 block">Start</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-200 rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs font-medium text-gray-600 mb-1 block">End</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-200 rounded"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={toggleDatePicker}
                      padding="xxs"
                      width="full"
                      className="text-white text-xs flex justify-center items-center mt-5"
                    >
                      Apply
                    </Button>
                  </div>
                )}
              </div>
            )}

            {filterOptions.length > 0 && (
              <div className="relative">
                <Tooltip content="Filter">
                  <Button
                    kind="white"
                    padding="xxs"
                    radius="xs"
                    className={`border ${isFilterOpen ? 'border-primary' : 'border-gray-200'} text-gray-600`}
                    onClick={toggleFilter}
                  >
                    <IoFilterOutline className="w-3.5 h-3.5" />
                  </Button>
                </Tooltip>

                {isFilterOpen && (
                  <div className="absolute right-1 mt-1 w-48 bg-white rounded shadow-md py-1 z-50 filter-menu border border-gray-100">
                    {filterOptions.map((filter) => (
                      <div key={filter.value} className="relative">
                        <button
                          className="w-full px-3 py-1.5 text-left text-xs hover:bg-gray-50 flex items-center justify-between"
                          onClick={() => setActiveFilter(activeFilter === filter.value ? null : filter.value)}
                        >
                          {filter.label}
                          <BsChevronDown className={`w-2 h-2 transition-transform ${activeFilter === filter.value ? 'rotate-180' : ''}`} />
                        </button>
                        {activeFilter === filter.value && (
                          <div className="absolute left-6 top-12 w-48 -ml-1 bg-white shadow-md rounded py-1 z-10 border border-gray-100">
                            {filter.options.map(option => (
                              <button
                                key={option.value}
                                className="w-full px-3 py-1.5 text-left text-xs hover:bg-gray-50"
                                onClick={() => {
                                  if (onFilter) onFilter(filter.value, option.value);
                                  setIsFilterOpen(false);
                                  setActiveFilter(null);
                                }}
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
            )}

           { showDate&& <div className="relative">
              <Tooltip content="Export">
                <Button
                  kind="white"
                  padding="xxs"
                  radius="xs"
                  className={`border ${isExportMenuOpen ? 'border-primary' : 'border-gray-200'} text-gray-600`}
                  onClick={toggleExportMenu}
                  disabled={status === 'pending'}
                >
                  <BsDownload className="w-3.5 h-3.5" />
                </Button>
              </Tooltip>

              {isExportMenuOpen && (
                <div className="absolute right-0 mt-1 w-36 bg-white rounded shadow-md py-1 z-50 export-menu border border-gray-100">
                  {exportFormats.map(fmt => (
                    <button
                      key={fmt.value}
                      className="w-full px-3 py-1.5 text-left text-xs hover:bg-gray-50 flex items-center"
                      onClick={() => {
                        setFormat(fmt.value);
                        exportData();
                        setIsExportMenuOpen(false);
                      }}
                    >
                      {fmt.label}
                      {format === fmt.value && <span className="ml-auto h-1.5 w-1.5 bg-primary rounded-full"></span>}
                    </button>
                  ))}
                </div>
              )}
            </div>}

            {viewMode && (
              <Tooltip content={view === "grid" ? "List View" : "Grid View"}>
                <Button
                  kind="white"
                  padding="xxs"
                  radius="xs"
                  className="border border-gray-200 text-gray-600"
                  onClick={toggleView}
                >
                  {view === "grid" ? 
                    <RxHamburgerMenu className="w-3.5 h-3.5" /> : 
                    <BsGridFill className="w-3.5 h-3.5" />
                  }
                </Button>
              </Tooltip>
            )}
          </div>
        </div>
        
        {(startDate || endDate) && (
          <div className="px-3 pb-2 flex items-center">
            <div className="text-xs px-2 py-0.5 bg-gray-100 rounded-full flex items-center">
              <span className="text-gray-600">
                {startDate ? new Date(startDate).toLocaleDateString() : "Any"} - {endDate ? new Date(endDate).toLocaleDateString() : "Any"}
              </span>
              <button 
                className="ml-2 text-gray-500 hover:text-red-500"
                onClick={() => { setStartDate(''); setEndDate(''); }}
              >
                ×
              </button>
            </div>
            {isExportError && (
              <div className="ml-3 text-xs text-red-500">
                Export failed
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ActionBar;