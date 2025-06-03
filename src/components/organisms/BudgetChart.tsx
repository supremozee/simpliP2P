/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer, CartesianGrid } from "recharts";
// import { format } from "date-fns";
import { Budget } from "@/types";
import { format_price } from "@/utils/helpers";

interface BudgetChartProps {
  budgetData: Budget;
  timeRange?: 'week' | 'month' | 'quarter' | 'year';
}

const COLORS = {
  available: "#10B981", // Green
  reserved: "#F59E0B", // Amber
  used: "#EF4444",     // Red
};

const BudgetChart: React.FC<BudgetChartProps> = ({ budgetData}) => {

  const parsedBudget = useMemo(() => {
    const allocated = parseFloat(budgetData.amount_allocated) || 0;
    const reserved = parseFloat(budgetData.amount_reserved) || 0;
    const balance = parseFloat(budgetData.balance) || 0;
    // Calculate used based on allocated minus balance and reserved
    // If balance is negative, adjust the calculation to show correct usage
    const used = balance < 0 
      ? allocated + Math.abs(balance) - reserved 
      : allocated - balance - reserved;

    return {
      allocated,
      reserved,
      balance: balance < 0 ? 0 : balance, // Don't show negative balance in chart
      used: Math.max(used, 0), // Ensure no negative values
      currency: budgetData.currency,
    };
  }, [budgetData]);

  const barChartData = useMemo(() => {
    return [
      { name: "Available", value: parsedBudget.balance, fill: COLORS.available },
      { name: "Reserved", value: parsedBudget.reserved, fill: COLORS.reserved },
      { name: "Used", value: parsedBudget.used, fill: COLORS.used },
    ];
  }, [parsedBudget]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      const data = payload[0];
      const percentage = parsedBudget.allocated > 0
        ? ((data.value / parsedBudget.allocated) * 100).toFixed(1)
        : "0.0";

      return (
        <div className="bg-white border rounded-md shadow-md p-3">
          <p className="text-sm font-medium text-gray-700">{data.name}</p>
          <p className="text-sm mt-1">
            <span className="font-medium">{parsedBudget.currency} {format_price(data.value)}</span>
            <span className="text-gray-500 text-xs ml-2">({percentage}%)</span>
          </p>
        </div>
      );
    }
    return null;
  };


  const formatYAxis = (value: number): string => {
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
      return value.toString();
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {format_price(parsedBudget.allocated, parsedBudget.currency)}
          </h2>
          {/* <p className="text-sm text-gray-500 font-medium">Budget Allocation - {renderTimeLabel}</p> */}
          
          {/* Summary stats */}
          <div className="mt-2 grid grid-cols-3 gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">
                Available: <span className="font-medium">{format_price(parsedBudget.balance)}</span>
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">
                Reserved: <span className="font-medium">{format_price(parsedBudget.reserved)}</span>
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">
                Used: <span className="font-medium">{format_price(parsedBudget.used)}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[300px] w-full">
        {barChartData.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={barChartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                tickFormatter={formatYAxis} 
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
              <Bar 
                dataKey="value"
                barSize={100} // Wider bars
                radius={[4, 4, 0, 0]} // Rounded tops
              >
                {barChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <p>No budget data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetChart;