"use client";

import React, { useState } from "react";
import Modal from "../atoms/Modal";
import Button from "../atoms/Button";
import { IoEyeOutline, IoWallet, IoTrendingUp, IoTime, IoWarning } from 'react-icons/io5';
import useFetchBudgetById from "@/hooks/useFetchBudgetById";
import useStore from "@/store";
import BudgetDetailCard from '../molecules/BudgetDetailCard';
import BudgetChart from './BudgetChart';
import LoaderSpinner from "../atoms/LoaderSpinner";
import Tooltip from "../atoms/Tooltip";
import { format_price } from "@/utils/helpers";

interface OpenBudgetProps {
  budgetId: string;
}

const OpenBudget: React.FC<OpenBudgetProps> = ({ budgetId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentOrg } = useStore();
  const { data: budget, isLoading, isError, error } = useFetchBudgetById(currentOrg, budgetId);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'history' | 'related'>('overview');

  const calculateMetrics = () => {
    if (!budget) {
      return {
        allocated: 0,
        balance: 0,
        reserved: 0,
        used: 0,
        utilizationRate: 0,
        reservationRate: 0,
        availabilityRate: 0
      };
    }

    const allocated = parseFloat(budget.amount_allocated) || 0;
    const balance = parseFloat(budget.balance) || 0;
    const reserved = parseFloat(budget.amount_reserved) || 0;
    const used = allocated - balance - reserved;
    
    const utilizationRate = allocated > 0 ? (used / allocated) * 100 : 0;
    const reservationRate = allocated > 0 ? (reserved / allocated) * 100 : 0;
    const availabilityRate = allocated > 0 ? (balance/ allocated) * 100 : 0;

    return {
      allocated,
      balance,
      reserved,
      used,
      utilizationRate,
      reservationRate,
      availabilityRate
    };
  };

  const handleClick = () => {
    setIsOpen(true);
  };

  const metrics = calculateMetrics();

  return (
    <>
      <Tooltip content="View Budget Details">
        <Button
          type="button"
          className="p-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-full transition-colors flex items-center justify-center"
          onClick={handleClick}
        >
          <IoEyeOutline size={18} />
        </Button>
      </Tooltip>

      {isOpen && (
        <Modal 
          onClose={() => setIsOpen(false)} 
          isOpen={isOpen} 
          title={`Budget: ${budget?.name || 'Loading...'}`}
          contentClassName="max-w-6xl"
        >
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <LoaderSpinner size="lg" text="Loading budget details..." />
            </div>
          ) : isError ? (
            <div className="p-6 bg-red-50 text-red-700 rounded-lg">
              <h3 className="font-semibold mb-2">Error Loading Budget</h3>
              <p>{error?.message || "An unknown error occurred"}</p>
            </div>
          ) : budget ? (
            <div className="p-6">
              {/* Budget Overview Header */}
              <div className="flex flex-wrap justify-between items-center mb-6 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Currency: {budget.currency}</span>
                  </div>
                </div>

              {/* Tabs Navigation */}
              <div className="flex mb-6">
                <button
                  className={`py-2 px-4 text-sm font-medium ${selectedTab === 'overview' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setSelectedTab('overview')}
                >
                  Overview
                </button>
              </div>

              {selectedTab === 'overview' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <BudgetDetailCard
                      label="Total Budget"
                      value={metrics.allocated}
                      currency={budget.currency}
                      icon={<IoWallet className="w-6 h-6 text-blue-600" />}
                      trend="neutral"
                      percentage={100}
                      bgColor="bg-white"
                      textColor="text-blue-600"
                    />

                    <BudgetDetailCard
                      label="Available Balance"
                      value={metrics.balance}
                      currency={budget.currency}
                      previousValue={metrics.allocated}
                      icon={<IoTrendingUp className="w-6 h-6 text-green-600" />}
                      trend={metrics.availabilityRate > 50 ? 'up' : 'down'}
                      percentage={metrics.availabilityRate}
                      bgColor="bg-white"
                      textColor="text-green-600"
                    />

                    <BudgetDetailCard
                      label="Reserved Amount"
                      value={metrics.reserved}
                      currency={budget.currency}
                      icon={<IoTime className="w-6 h-6 text-yellow-600" />}
                      trend={metrics.reservationRate > 30 ? 'down' : 'neutral'}
                      percentage={metrics.reservationRate}
                      bgColor="bg-white"
                      textColor="text-yellow-600"
                    />

                    <BudgetDetailCard
                      label="Used Budget"
                      value={metrics.used}
                      currency={budget.currency}
                      previousValue={metrics.allocated}
                      icon={<IoWarning className="w-6 h-6 text-red-600" />}
                      trend={metrics.utilizationRate > 80 ? 'down' : 'up'}
                      percentage={metrics.utilizationRate}
                      bgColor="bg-white"
                      textColor="text-red-600"
                    />
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <BudgetChart budgetData={budget} />
                  </div>

                  {/* Additional Budget Details */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                      <h3 className="text-lg font-medium mb-4">Budget Details</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Budget Name</span>
                          <span className="font-medium">{budget.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Currency</span>
                          <span className="font-medium">{budget.currency}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                      <h3 className="text-lg font-medium mb-4">Budget Allocation</h3>
                      <div className="mb-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-500">Available</span>
                          <span className="text-sm font-medium">{format_price(metrics.balance, budget.currency)} ({metrics.availabilityRate.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${metrics.availabilityRate}%` }}></div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-500">Reserved</span>
                          <span className="text-sm font-medium">{format_price(metrics.reserved, budget.currency)} ({metrics.reservationRate.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${metrics.reservationRate}%` }}></div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-500">Used</span>
                          <span className="text-sm font-medium">{format_price(metrics.used, budget.currency)} ({metrics.utilizationRate.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${metrics.utilizationRate}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {selectedTab === 'history' && (
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-medium mb-4">Transaction History</h3>
                  <p className="text-gray-500 text-center py-6">Transaction history will be displayed here when available.</p>
                </div>
              )}

              {selectedTab === 'related' && (
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-medium mb-4">Related Purchase Requisitions</h3>
                  <p className="text-gray-500 text-center py-6">Related requisitions will be displayed here when available.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-500 p-6 text-center">No budget data available</div>
          )}
        </Modal>
      )}
    </>
  );
};

export default OpenBudget;