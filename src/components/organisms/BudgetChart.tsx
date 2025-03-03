"use client";

import { Budget } from "@/types";
import { format_price } from "@/utils/helpers";
import React from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  TooltipProps,
  Area,
  AreaChart
} from "recharts";

interface BudgetChartProps {
  budgetData: Budget;
  timeRange?: 'week' | 'month' | 'quarter' | 'year';
}

const BudgetChart: React.FC<BudgetChartProps> = ({ budgetData, timeRange = 'month' }) => {
  // Generate mock data for demonstration
  const generateTrendData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    const baseAllocation = parseFloat(budgetData.amount_allocated) / 8;
    const baseSpending = parseFloat(budgetData.amount_available) / 8;

    return months.map((month, index) => ({
      name: month,
      allocation: baseAllocation + Math.sin(index / 2) * (baseAllocation * 0.2),
      spending: baseSpending + Math.sin((index + 1) / 2) * (baseSpending * 0.3)
    }));
  };

  const trendData = generateTrendData();
  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          {payload.map((entry, index) => (
            <p 
              key={index} 
              className="text-sm" 
              style={{ 
                color: entry.dataKey === 'allocation' ? '#4F46E5' : '#F87171'
              }}
            >
              {entry.dataKey === 'allocation' ? 'Budget Allocation' : 'Actual Spending'}: {budgetData.currency + " " + (entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[400px] bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
          {format_price(Number(budgetData.amount_allocated), budgetData.currency)}
          </h2>
          <p className="text-sm text-gray-500">Budget Allocation</p>
        </div>
        <select 
          className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
          defaultValue={timeRange}
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={trendData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorAllocation" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0}/>
            </linearGradient>
            <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F87171" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#F87171" stopOpacity={0.0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
          />
          <YAxis 
            tickFormatter={(value) => (budgetData.currency + parseFloat(value))}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
          />
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="#E5E7EB" 
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="allocation"
            stroke="#4F46E5"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorAllocation)"
          />
          <Area
            type="monotone"
            dataKey="spending"
            stroke="#F87171"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorSpending)"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex items-center justify-center gap-8 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
          <span className="text-sm text-gray-600">Budget Allocation</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <span className="text-sm text-gray-600">Actual Spending</span>
        </div>
      </div>
    </div>
  );
};

export default BudgetChart;