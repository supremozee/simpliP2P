"use client";
import React, { useState, useMemo, useEffect } from 'react';
import BudgetTable from '../organisms/BudgetTable';
import ActionBar from '../molecules/ActionBar';
import CreateBudgetModal from '../organisms/CreateBudgetModal';
import { motion } from "framer-motion";
import useFetchBudget from '@/hooks/useFetchBudget';
import useStore from '@/store';
import TableSkeleton from '../atoms/Skeleton/Table';
import BudgetSummarySkeleton from '../atoms/Skeleton/Budget';
import { format_price } from '@/utils/helpers';
import useExportSelected from '@/hooks/useExportSelected';
import SelectedItemForExport from '../organisms/SelectedItemForExport';
import { IoWalletOutline, IoAnalyticsOutline, IoBusinessOutline } from 'react-icons/io5';

type FilterType = {
  currency?: string;
  dateRange?: string;
  status?: string;
  amountRange?: string;
  department?: string;
};

const BudgetCentralPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterType>({});
  const { currentOrg, setType } = useStore();
  const { data, isLoading } = useFetchBudget(currentOrg);
  const { 
    selectedItems, 
    toggleSelectItem, 
    selectAll, 
    deselectAll, 
    isSelected, 
  } = useExportSelected();
  
  // Set export type for budgets
  useEffect(() => {
    setType('budgets');
  }, [setType]);

  // Filter options for the ActionBar
  const filterOptions = useMemo(() => {
    if (!data) return [];

    const currencies = [...new Set(data.map(budget => budget.currency))];
    
    const amountRanges = [
      { min: 0, max: 10000, label: '$0 - $10,000' },
      { min: 10001, max: 50000, label: '$10,001 - $50,000' },
      { min: 50001, max: 100000, label: '$50,001 - $100,000' },
      { min: 100001, max: Infinity, label: 'Above $100,000' }
    ];

    const dateRanges = [
      { label: 'Last 7 Days', value: '7' },
      { label: 'Last 30 Days', value: '30' },
      { label: 'Last 90 Days', value: '90' },
      { label: 'This Year', value: 'year' }
    ];

    const statuses = [
      { label: 'All Statuses', value: 'all' },
      { label: 'Active', value: 'active' },
      { label: 'Depleted', value: 'depleted' },
      { label: 'Reserved', value: 'reserved' }
    ];

    const departments = [
      { label: 'All Departments', value: 'all' },
      { label: 'Finance', value: 'Finance' },
      { label: 'Operations', value: 'Operations' },
      { label: 'IT', value: 'IT' },
      { label: 'Marketing', value: 'Marketing' }
    ];

    return [
      {
        label: "Currency",
        value: "currency",
        options: [
          { label: "All Currencies", value: "all" },
          ...currencies.map(currency => ({
            label: currency,
            value: currency
          }))
        ]
      },
      {
        label: "Amount Range",
        value: "amountRange",
        options: [
          { label: "All Amounts", value: "all" },
          ...amountRanges.map(range => ({
            label: range.label,
            value: `${range.min}-${range.max === Infinity ? '+' : range.max}`
          }))
        ]
      },
      {
        label: "Date Range",
        value: "dateRange",
        options: [
          { label: "All Time", value: "all" },
          ...dateRanges.map(range => ({
            label: range.label,
            value: range.value
          }))
        ]
      },
      {
        label: "Status",
        value: "status",
        options: statuses.map(status => ({
          label: status.label,
          value: status.value
        }))
      },
      {
        label: "Department",
        value: "department",
        options: departments.map(dept => ({
          label: dept.label,
          value: dept.value
        }))
      }
    ];
  }, [data]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (filterType: string, value: string) => {
    if (value === 'all') {
      const newFilters = { ...activeFilters };
      delete newFilters[filterType as keyof FilterType];
      setActiveFilters(newFilters);
    } else {
      setActiveFilters(prev => ({
        ...prev,
        [filterType]: value
      }));
    }
  };

  const handleSelectAll = () => {
    if (filteredBudgets && filteredBudgets.length > 0) {
      if (selectedItems.length === filteredBudgets.length) {
        deselectAll();
      } else {
        selectAll(filteredBudgets.map(budget => budget.id));
      }
    }
  };

  // Apply filters to budgets
  const filteredBudgets = useMemo(() => {
    if (!data) return [];
    
    let filtered = [...data];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(budget =>
        budget.name.toLowerCase().includes(query) ||
        budget.currency.toLowerCase().includes(query) ||
        budget.amount_allocated.toString().includes(query)
      );
    }

    // Apply active filters
    if (activeFilters.currency) {
      filtered = filtered.filter(budget => 
        budget.currency === activeFilters.currency
      );
    }

    if (activeFilters.amountRange) {
      const [minStr, maxStr] = activeFilters.amountRange.split('-');
      const min = Number(minStr);
      const max = maxStr === '+' ? Infinity : Number(maxStr);
      filtered = filtered.filter(budget => {
        const amount = parseFloat(budget.amount_allocated);
        return amount >= min && amount <= max;
      });
    }

    if (activeFilters.dateRange) {
      const days = parseInt(activeFilters.dateRange);
      const today = new Date();
      const startDate = activeFilters.dateRange === 'year'
        ? new Date(today.getFullYear(), 0, 1)
        : new Date(today.setDate(today.getDate() - days));

      filtered = filtered.filter(budget => {
        const budgetDate = new Date(budget.created_at);
        return budgetDate >= startDate;
      });
    }

    if (activeFilters.status) {
      filtered = filtered.filter(budget => {
        const available = parseFloat(budget.amount_available);
        const allocated = parseFloat(budget.amount_allocated);
        const reserved = parseFloat(budget.amount_reserved);
        const utilized = allocated - available - reserved;
        const utilizationRate = allocated > 0 ? (utilized / allocated) * 100 : 0;

        switch (activeFilters.status) {
          case 'depleted':
            return available === 0;
          case 'reserved':
            return reserved > 0;
          case 'active':
            return available > 0 && utilizationRate < 90;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [data, searchQuery, activeFilters]);

  // Calculate budget metrics
  const budgetMetrics = useMemo(() => {
    if (!filteredBudgets.length) return {
      totalBudget: 0,
      availableBudget: 0,
      reservedBudget: 0,
      utilizedBudget: 0,
      activeBudgets: 0,
      criticalBudgets: 0,
      currency: 'USD'
    };

    const totalBudget = filteredBudgets.reduce((sum, budget) => 
      sum + parseFloat(budget.amount_allocated), 0);
    
    const availableBudget = filteredBudgets.reduce((sum, budget) => 
      sum + parseFloat(budget.balance), 0);
    
    const reservedBudget = filteredBudgets.reduce((sum, budget) => 
      sum + parseFloat(budget.amount_reserved), 0);
    
    const utilizedBudget = totalBudget - availableBudget - reservedBudget;

    const activeBudgets = filteredBudgets.filter(budget => {
      const available = parseFloat(budget.amount_available);
      const allocated = parseFloat(budget.amount_allocated);
      return available > 0 && available / allocated > 0.1;
    }).length;

    // Use the most common currency (simplified approach)
    const currencyCounts = filteredBudgets.reduce((counts, budget) => {
      counts[budget.currency] = (counts[budget.currency] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
    
    const currency = Object.entries(currencyCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'USD';

    return {
      totalBudget,
      availableBudget,
      reservedBudget,
      utilizedBudget,
      activeBudgets,
      currency
    };
  }, [filteredBudgets]);

  if (isLoading) return (
    <div>
      <BudgetSummarySkeleton />
      <TableSkeleton />
    </div>
  );

  return (
    <main className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <IoWalletOutline className="text-primary" /> Budget Central
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor your organization&apos;s budgets
          </p>
        </div>
      </div>

      <ActionBar 
        onSearch={handleSearch}
        onFilter={handleFilter}
        filterOptions={filterOptions}
        type='budgets'
        showDate
        buttonName="Create Budget"
        onClick={handleOpenModal}
      />

      {selectedItems.length > 0 && (
        <SelectedItemForExport
          selectedItems={selectedItems}
          items={filteredBudgets}
          deselectAll={deselectAll}
          entityType="budgets"
        />
      )}

      {/* Budget Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          className="bg-white shadow-md rounded-xl p-5 border border-gray-200"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Budget</p>
              <h2 className="text-xl font-semibold text-gray-800">
                {format_price(budgetMetrics.totalBudget, budgetMetrics.currency)}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {filteredBudgets.length} active budget{filteredBudgets.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="p-2 bg-blue-50 rounded-full">
              <IoBusinessOutline className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white shadow-md rounded-xl p-5 border border-gray-200"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Available Budget</p>
              <h2 className="text-xl font-semibold text-green-600">
                {format_price(budgetMetrics.availableBudget, budgetMetrics.currency)}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {((budgetMetrics.availableBudget / budgetMetrics.totalBudget) * 100).toFixed(1)}% of total budget
              </p>
            </div>
            <div className="p-2 bg-green-50 rounded-full">
              <IoAnalyticsOutline className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="relative pt-3">
            <div className="overflow-hidden h-1.5 text-xs flex rounded bg-gray-100">
              <div
                style={{ width: `${(budgetMetrics.availableBudget / budgetMetrics.totalBudget) * 100}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-600"
              ></div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white shadow-md rounded-xl p-5 border border-gray-200"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Reserved Amount</p>
              <h2 className="text-xl font-semibold text-amber-600">
                {format_price(budgetMetrics.reservedBudget, budgetMetrics.currency)}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {((budgetMetrics.reservedBudget / budgetMetrics.totalBudget) * 100).toFixed(1)}% of total budget
              </p>
            </div>
            <div className="p-2 bg-amber-50 rounded-full">
              <IoAnalyticsOutline className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <div className="relative pt-3">
            <div className="overflow-hidden h-1.5 text-xs flex rounded bg-gray-100">
              <div
                style={{ width: `${(budgetMetrics.reservedBudget / budgetMetrics.totalBudget) * 100}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-500"
              ></div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Budget Table */}
      <div className="mt-4">
        <BudgetTable 
          budgets={filteredBudgets}
          selectedItems={selectedItems}
          toggleSelectItem={toggleSelectItem}
          isSelected={isSelected}
          handleSelectAll={handleSelectAll}
        />
      </div>

      {/* Create Budget Modal */}
      <CreateBudgetModal showModal={isModalOpen} setShowModal={setIsModalOpen} />
    </main>
  );
};

export default BudgetCentralPage;