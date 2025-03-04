"use client";

import React, { useState } from "react";
import Modal from "../atoms/Modal";
import Button from "../atoms/Button";
import { GrView } from "react-icons/gr";
import useFetchBudgetById from "@/hooks/useFetchBudgetById";
import useStore from "@/store";
import BudgetDetailCard from '../molecules/BudgetDetailCard';
import { IoWallet, IoTrendingUp, IoTime, IoWarning } from 'react-icons/io5';
import BudgetChart from './BudgetChart';
import LoaderSpinner from "../atoms/LoaderSpinner";

interface OpenBudgetProps {
  budgetId: string;
}

const OpenBudget: React.FC<OpenBudgetProps> = ({ budgetId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentOrg } = useStore();
  const { data: budget, isLoading, isError, error } = useFetchBudgetById(currentOrg, budgetId);

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
      <Button
        type="button"
        className="text-white font-bold w-[30px] h-[30px] px-0 py-0 flex justify-center items-center rounded-full"
        onClick={handleClick}
      >
        <GrView />
      </Button>

      {isOpen && (
        <Modal 
          onClose={() => setIsOpen(false)} 
          isOpen={isOpen} 
          contentClassName="w-[1240px] p-10 h-[600px]"
        >
          {isLoading ? (
            <LoaderSpinner size="lg" text="Loading budget details..." />
          ) : isError ? (
            <div className="text-red-500">Error: {error?.message}</div>
          ) : budget ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Budget Details: {budget.name}</h2>
              
              <div className="flex flex-wrap md:grid-cols-2 lg:grid-cols-4 gap-6">
                <BudgetDetailCard
                  label="Total Budget"
                  value={metrics.allocated}
                  icon={<IoWallet className="w-6 h-6 text-blue-600" />}
                  trend="neutral"
                  percentage={100}
                  bgColor="bg-white"
                  textColor="text-blue-600"
                />

                <BudgetDetailCard
                  label="Available Balance"
                  value={metrics.balance}
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
                  icon={<IoTime className="w-6 h-6 text-yellow-600" />}
                  trend={metrics.reservationRate > 30 ? 'down' : 'neutral'}
                  percentage={metrics.reservationRate}
                  bgColor="bg-white"
                  textColor="text-yellow-600"
                />

                <BudgetDetailCard
                  label="Used Budget"
                  value={metrics.used}
                  previousValue={metrics.allocated}
                  icon={<IoWarning className="w-6 h-6 text-red-600" />}
                  trend={metrics.utilizationRate > 80 ? 'down' : 'up'}
                  percentage={metrics.utilizationRate}
                  bgColor="bg-white"
                  textColor="text-red-600"
                />
              </div>

              <div className="bg-white rounded-xl shadow-sm">
                <BudgetChart budgetData={budget} />
              </div>
            </div>
          ) : (
            <div className="text-gray-500">No budget data available</div>
          )}
        </Modal>
      )}
    </>
  );
};

export default OpenBudget;