/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { Budget } from "@/types";
import { format_price } from "@/utils/helpers";

interface BudgetChartProps {
  budgetData: Budget;
  timeRange?: 'week' | 'month' | 'quarter' | 'year';
}

const COLORS = {
  available: "#10B981",
  reserved: "#F59E0B",
  used: "#EF4444",
};

const BudgetChart: React.FC<BudgetChartProps> = ({ budgetData, timeRange = 'month' }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);

  const parsedBudget = useMemo(() => {
    const allocated = parseFloat(budgetData.amount_allocated) || 0;
    const reserved = parseFloat(budgetData.amount_reserved) || 0;
    const balance = parseFloat(budgetData.balance) || 0;
    const used = Math.max(allocated - reserved - balance, 0); // Ensure no negatives

    return {
      allocated,
      reserved,
      balance,
      used,
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
        <div className="bg-white border rounded shadow-sm p-2">
          <p className="text-sm font-medium text-gray-700">{data.name}</p>
          <p className="text-xs text-gray-500">
            {parsedBudget.currency} {data.value.toFixed(2)} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderTimeLabel = useMemo(() => {
    const now = new Date();
    switch (selectedTimeRange) {
      case "week":
        return `Week of ${format(now, "MMM d, yyyy")}`;
      case "month":
        return format(now, "MMMM yyyy");
      case "quarter":
        return `Q${Math.floor((now.getMonth() + 3) / 3)} ${now.getFullYear()}`;
      case "year":
        return now.getFullYear().toString();
      default:
        return "";
    }
  }, [selectedTimeRange]);

  return (
    <div className="w-full bg-white rounded-xl shadow-sm p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {format_price(parsedBudget.allocated, parsedBudget.currency)}
          </h2>
          <p className="text-sm text-gray-500">Budget Allocation - {renderTimeLabel}</p>
        </div>
        <select
          className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
          value={selectedTimeRange}
          onChange={(e) => {
            const value = e.target.value as BudgetChartProps["timeRange"];
            if (value) setSelectedTimeRange(value);
          }}
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>

      <div className="h-[300px] w-full">
        {barChartData.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData}
             margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value"
              barSize={30}
              >
                {barChartData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No budget data available
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetChart;
