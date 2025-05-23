import React, { useState, useEffect } from 'react';
import Button from '../atoms/Button';
import { BsGridFill, BsChevronDown, BsCalendarDate, BsDownload } from "react-icons/bs";
import { RxHamburgerMenu } from 'react-icons/rx';
import { FaPlus } from 'react-icons/fa';
import { IoFilterOutline } from 'react-icons/io5';
import { FiSearch, FiX } from 'react-icons/fi';
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
  activeFilters?: Record<string, string>;
  onClearFilter?: (filterType: string) => void;
  onClearAllFilters?: () => void;
};

const exportFormats = [
  { value: 'csv', label: 'CSV' },
  { value: 'excel', label: 'Excel' },
];

const ActionBar: React.FC<ActionBarTypes> = ({
  onSearch, 
  showDate, 
  buttonName, 
  viewMode, 
  toggleView, 
  view, 
  onClick, 
  type, 
  onFilter, 
  filterOptions = [],
  activeFilters = {},
  onClearFilter,
  onClearAllFilters
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  const { currentOrg, startDate, endDate, format, setEndDate, setStartDate, setFormat } = useStore();
  const { mutate: exportData, status, isError: isExportError } = useExportData({
    orgId: currentOrg, startDate, endDate, format, type
  });

  // Count active filters
  const activeFilterCount = Object.keys(activeFilters).length + (startDate || endDate ? 1 : 0);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (onSearch) onSearch(searchQuery);
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, onSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.filter-menu') && 
          !target.closest('.date-picker') && 
          !target.closest('.export-menu') &&
          !target.closest('.advanced-filter-menu')) {
        setIsFilterOpen(false);
        setIsDatePickerOpen(false);
        setIsExportMenuOpen(false);
        setIsAdvancedFilterOpen(false);
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
    setIsAdvancedFilterOpen(false);
    setActiveFilter(null);
  };

  const toggleDatePicker = () => {
    setIsDatePickerOpen(!isDatePickerOpen);
    setIsFilterOpen(false);
    setIsExportMenuOpen(false);
    setIsAdvancedFilterOpen(false);
  };

  const toggleExportMenu = () => {
    setIsExportMenuOpen(!isExportMenuOpen);
    setIsFilterOpen(false);
    setIsDatePickerOpen(false);
    setIsAdvancedFilterOpen(false);
  };

  const toggleAdvancedFilter = () => {
    setIsAdvancedFilterOpen(!isAdvancedFilterOpen);
    setIsFilterOpen(false);
    setIsDatePickerOpen(false);
    setIsExportMenuOpen(false);
  };

  const handleClearFilter = (filterType: string) => {
    if (onClearFilter) {
      onClearFilter(filterType);
    } else if (onFilter) {
      onFilter(filterType, 'all');
    }
  };

  const handleClearAllFilters = () => {
    if (onClearAllFilters) {
      onClearAllFilters();
    } else {
      // Default implementation if onClearAllFilters not provided
      Object.keys(activeFilters).forEach(filterType => {
        if (onFilter) onFilter(filterType, 'all');
      });
      setStartDate('');
      setEndDate('');
    }
  };

  const handleApplyDateFilter = () => {
    toggleDatePicker();
    // You could trigger a refetch or refresh here if needed
  };

  return (
    <>
      {status === "pending" && <ExportingLoader />}
      
      <div className="mb-4">
        <div className="flex items-center justify-between p-3 flex-wrap gap-2 bg-white rounded-lg border border-gray-200 shadow-sm">
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
                className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              {searchQuery && (
                <button 
                  className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => {
                    setSearchQuery('');
                    if (onSearch) onSearch('');
                  }}
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
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
            {/* Filter controls */}
            {filterOptions.length > 0 && (
              <div className="relative">
                <Tooltip content={activeFilterCount > 0 ? `Filters (${activeFilterCount})` : "Filter"}>
                  <Button
                    kind="white"
                    padding="xxs"
                    radius="xs"
                    className={`border relative ${isFilterOpen ? 'border-primary bg-primary/5' : 'border-gray-200'} text-gray-600`}
                    onClick={toggleFilter}
                  >
                    <IoFilterOutline className="w-3.5 h-3.5" />
                    {activeFilterCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] rounded-full flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </Tooltip>

                {isFilterOpen && (
                  <div className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-md py-2 z-50 filter-menu border border-gray-200">
                    <div className="px-3 py-2 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="text-sm font-medium text-gray-700">Filter {type}</h3>
                      {activeFilterCount > 0 && (
                        <button 
                          className="text-xs text-primary hover:text-primary/80"
                          onClick={handleClearAllFilters}
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    {filterOptions.map((filter) => (
                      <div key={filter.value} className="relative px-3 py-2 hover:bg-gray-50">
                        <button
                          className="w-full text-left text-xs flex items-center justify-between"
                          onClick={() => setActiveFilter(activeFilter === filter.value ? null : filter.value)}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">{filter.label}</span>
                            {activeFilters[filter.value] && (
                              <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded">
                                {filter.options.find(o => o.value === activeFilters[filter.value])?.label || activeFilters[filter.value]}
                              </span>
                            )}
                          </div>
                          <BsChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${activeFilter === filter.value ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {activeFilter === filter.value && (
                          <div className="absolute left-20 top-0 w-56 bg-white shadow-lg rounded-lg py-2 -ml-2 z-50 border border-gray-200">
                            <div className="px-3 py-1 border-b border-gray-100">
                              <h4 className="text-xs font-medium text-gray-500">{filter.label}</h4>
                            </div>
                            <div className="max-h-60 overflow-y-auto py-1">
                              {filter.options.map(option => (
                                <button
                                  key={option.value}
                                  className={`w-full px-3 py-2 text-left text-xs hover:bg-gray-50 flex justify-between items-center ${activeFilters[filter.value] === option.value ? 'bg-primary/5 font-medium text-primary' : 'text-gray-700'}`}
                                  onClick={() => {
                                    if (onFilter) onFilter(filter.value, option.value);
                                    setIsFilterOpen(false);
                                    setActiveFilter(null);
                                  }}
                                >
                                  {option.label}
                                  {activeFilters[filter.value] === option.value && (
                                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {filterOptions.length > 3 && (
                      <div className="px-3 pt-2 border-t border-gray-100 mt-1">
                        <button 
                          className="w-full px-2 py-1.5 text-xs text-center text-primary hover:bg-primary/5 rounded-md border border-primary/20"
                          onClick={toggleAdvancedFilter}
                        >
                          Advanced Filter
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Date range picker */}
            {showDate && (
              <div className="relative">
                <Tooltip content={startDate || endDate ? "Edit Date Range" : "Date Range"}>
                  <Button 
                    kind="white"
                    padding="xxs"
                    radius="xs"
                    className={`border relative ${isDatePickerOpen ? 'border-primary bg-primary/5' : (startDate || endDate) ? 'border-primary/30 bg-primary/5' : 'border-gray-200'} text-gray-600`}
                    onClick={toggleDatePicker}
                  >
                    <BsCalendarDate className="w-3.5 h-3.5" />
                    {(startDate || endDate) && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
                    )}
                  </Button>
                </Tooltip>
                
                {isDatePickerOpen && (
                  <div className="absolute right-0 mt-1 w-72 bg-white rounded-lg shadow-md p-4 z-50 date-picker border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-medium text-gray-700">Date Range</h3>
                      {(startDate || endDate) && (
                        <button 
                          className="text-xs text-primary hover:text-primary/80"
                          onClick={() => { setStartDate(''); setEndDate(''); }}
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="flex gap-3 mb-3">
                      <div className="flex-1">
                        <label className="text-xs font-medium text-gray-600 mb-1 block">Start Date</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          max={endDate || undefined}
                          className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs font-medium text-gray-600 mb-1 block">End Date</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          min={startDate || undefined}
                          className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setIsDatePickerOpen(false)}
                        padding="xxs"
                        kind="white"
                        width="full"
                        className="text-gray-700 text-xs flex justify-center items-center border border-gray-300"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleApplyDateFilter}
                        padding="xxs"
                        width="full"
                        className="text-white text-xs flex justify-center items-center"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Export data */}
            {showDate && (
              <div className="relative">
                <Tooltip content="Export Data">
                  <Button
                    kind="white"
                    padding="xxs"
                    radius="xs"
                    className={`border ${isExportMenuOpen ? 'border-primary bg-primary/5' : 'border-gray-200'} text-gray-600`}
                    onClick={toggleExportMenu}
                    disabled={status === 'pending'}
                  >
                    <BsDownload className="w-3.5 h-3.5" />
                  </Button>
                </Tooltip>

                {isExportMenuOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-md py-2 z-50 export-menu border border-gray-200">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <h3 className="text-sm font-medium text-gray-700">Export {type}</h3>
                    </div>
                    {exportFormats.map(fmt => (
                      <button
                        key={fmt.value}
                        className="w-full px-3 py-2 text-left text-xs hover:bg-gray-50 flex items-center justify-between"
                        onClick={() => {
                          setFormat(fmt.value);
                          exportData();
                          setIsExportMenuOpen(false);
                        }}
                      >
                        <span className="text-gray-700">{fmt.label} format</span>
                        {format === fmt.value && (
                          <span className="w-2 h-2 bg-primary rounded-full"></span>
                        )}
                      </button>
                    ))}
                    <div className="px-3 pt-2 border-t border-gray-100 mt-1 text-xs text-gray-500">
                      Exports current filtered data
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* View toggle */}
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
        
        {/* Active filters display */}
        {(activeFilterCount > 0) && (
          <div className="px-3 py-2 flex items-center flex-wrap gap-2 mt-2">
            {Object.entries(activeFilters).map(([filterType, value]) => {
              const filterOption = filterOptions.find(f => f.value === filterType);
              const optionLabel = filterOption?.options.find(o => o.value === value)?.label || value;
              
              if (!filterOption || value === 'all') return null;
              
              return (
                <div key={filterType} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  <span className="font-medium">{filterOption.label}:</span> {optionLabel}
                  <button 
                    className="ml-1 text-primary/70 hover:text-primary"
                    onClick={() => handleClearFilter(filterType)}
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
            
            {(startDate || endDate) && (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                <span className="font-medium">Date:</span>
                {startDate ? new Date(startDate).toLocaleDateString() : "Any"} - {endDate ? new Date(endDate).toLocaleDateString() : "Any"}
                <button 
                  className="ml-1 text-primary/70 hover:text-primary"
                  onClick={() => { setStartDate(''); setEndDate(''); }}
                >
                  <FiX className="w-3 h-3" />
                </button>
              </div>
            )}
            
            <button 
              className="text-xs text-gray-500 hover:text-gray-700 underline ml-1"
              onClick={handleClearAllFilters}
            >
              Clear all filters
            </button>
            
            {isExportError && (
              <div className="ml-auto text-xs text-red-500 flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                Export failed
              </div>
            )}
          </div>
        )}
        
        {/* Advanced Filter Panel (shown when advanced filter button is clicked) */}
        {isAdvancedFilterOpen && (
          <div className="mt-2 p-4 bg-white rounded-lg border border-gray-200 shadow-sm advanced-filter-menu">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-700">Advanced Filters</h3>
              <button 
                className="text-xs text-gray-500 hover:underline"
                onClick={() => setIsAdvancedFilterOpen(false)}
              >
                Close
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterOptions.map(filter => (
                <div key={filter.value} className="mb-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {filter.label}
                  </label>
                  <select
                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    value={activeFilters[filter.value] || 'all'}
                    onChange={(e) => {
                      if (onFilter) {
                        onFilter(filter.value, e.target.value);
                      }
                    }}
                  >
                    {filter.options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              
              {showDate && (
                <div className="mb-3 col-span-full md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Date Range
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Start date"
                      />
                    </div>
                    <div className="flex items-center">-</div>
                    <div className="flex-1">
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="End date"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2 mt-2">
              <Button
                onClick={handleClearAllFilters}
                padding="xxs"
                kind="white"
                className="text-gray-700 text-xs flex justify-center items-center border border-gray-300"
              >
                Clear All
              </Button>
              <Button
                onClick={() => setIsAdvancedFilterOpen(false)}
                padding="xxs"
                className="text-white text-xs flex justify-center items-center"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ActionBar;