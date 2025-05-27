/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import Modal from "../atoms/Modal";
import Button from "../atoms/Button";
import { IoEyeOutline, IoWallet, IoTrendingUp, IoTime, IoWarning } from 'react-icons/io5';
import useFetchBudgetById from "@/hooks/useFetchBudgetById";
import useStore from "@/store";
import BudgetDetailCard from '../molecules/BudgetDetailCard';
import LoaderSpinner from "../atoms/LoaderSpinner";
import Tooltip from "../atoms/Tooltip";
import BudgetChart  from "./BudgetChart";

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
                </>
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