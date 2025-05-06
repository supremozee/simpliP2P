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
import Button from '../atoms/Button';
import SelectedItemForExport from '../organisms/SelectedItemForExport';

type FilterType = {
  currency?: string;
  dateRange?: string;
  status?: string;
  amountRange?: string;
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
      { label: 'Active', value: 'active' },
      { label: 'Depleted', value: 'depleted' },
      { label: 'Reserved', value: 'reserved' }
    ];

    return [
      {
        label: "Currency",
        value: "currency",
        options: currencies.map(currency => ({
          label: currency,
          value: currency
        }))
      },
      {
        label: "Amount Range",
        value: "amountRange",
        options: amountRanges.map(range => ({
          label: range.label,
          value: `${range.min}-${range.max === Infinity ? '+' : range.max}`
        }))
      },
      {
        label: "Date Range",
        value: "dateRange",
        options: dateRanges.map(range => ({
          label: range.label,
          value: range.value
        }))
      },
      {
        label: "Status",
        value: "status",
        options: statuses.map(status => ({
          label: status.label,
          value: status.value
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
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
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
        const reserved = parseFloat(budget.amount_reserved);

        switch (activeFilters.status) {
          case 'depleted':
            return available === 0;
          case 'reserved':
            return reserved > 0;
          case 'active':
            return available > 0;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [data, searchQuery, activeFilters]);

  // Summary calculations for the cards
  const summaryMetrics = useMemo(() => {
    if (!filteredBudgets.length) return [];

    return filteredBudgets.map(budget => ({
      id: budget.id,
      name: budget.name,
      currency: budget.currency,
      allocated: parseFloat(budget.amount_allocated),
      available: parseFloat(budget.amount_available),
      reserved: parseFloat(budget.amount_reserved),
      balance: parseFloat(budget.balance)
    }));
  }, [filteredBudgets]);

  if (isLoading) return (
    <div>
      <BudgetSummarySkeleton />
      <TableSkeleton />
    </div>
  );

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Budget Central</h1>
          <p className="text-gray-600 mt-1">
            All your organization&apos;s budgets in one space.
          </p>
        </div>
        <Button
          onClick={handleOpenModal}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          Create Budget
        </Button>
      </div>

      <ActionBar 
        onSearch={handleSearch}
        onFilter={handleFilter}
        filterOptions={filterOptions}
        type='budgets'
        showDate
      />

      {selectedItems.length > 0 && (
        <div className="mb-4">
          <SelectedItemForExport
            selectedItems={selectedItems}
            items={filteredBudgets}
            deselectAll={deselectAll}
            entityType="budgets"
          />
        </div>
      )}

      {/* Budget Summary Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.2 }}
      >
        {summaryMetrics.map((budget) => (
          <motion.div
            key={budget.id}
            className="bg-white shadow-md rounded-xl p-5 border border-gray-200"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p className="text-gray-500">{budget.name} ({budget.currency})</p>
            <h2 className="text-lg font-semibold text-gray-700">
               {format_price(budget.allocated, budget.currency)}
            </h2>
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>Available: {format_price(budget.available, budget.currency)}</span>
              <span>Reserved: {format_price(budget.reserved, budget.currency)}</span>
            </div>
            <div className="relative pt-2">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
                <div
                  style={{ width: `${(budget.balance / budget.allocated) * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                ></div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Budget Table */}
      <BudgetTable 
        budgets={filteredBudgets}
        selectedItems={selectedItems}
        toggleSelectItem={toggleSelectItem}
        isSelected={isSelected}
        handleSelectAll={handleSelectAll}
      />

      {/* Create Budget Modal */}
      <CreateBudgetModal showModal={isModalOpen} setShowModal={setIsModalOpen} />
    </main>
  );
};

export default BudgetCentralPage;