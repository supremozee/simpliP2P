"use client";

import { Budget } from "@/types";
import { format_price } from "@/utils/helpers";
import React, { useMemo, useState } from "react";
import {
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
  Cell,
  PieChart,
  Pie,
  Sector
} from "recharts";

interface BudgetChartProps {
  budgetData: Budget;
  timeRange?: 'week' | 'month' | 'quarter' | 'year';
}

const BudgetChart: React.FC<BudgetChartProps> = ({ budgetData, timeRange = 'month' }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Generate summary data for pie chart - fix calculation of used amount
  const summaryData = useMemo(() => {
    const allocated = parseFloat(budgetData.amount_allocated) || 0;
    const balance = parseFloat(budgetData.balance) || 0;
    const reserved = parseFloat(budgetData.amount_reserved) || 0;
    const used = allocated - balance - reserved; // Fix: subtract reserved as well
    
    return [
      { name: 'Available', value: balance, color: '#10B981' },
      { name: 'Reserved', value: reserved, color: '#F59E0B' },
      { name: 'Used', value: used > 0 ? used : 0, color: '#EF4444' } // Ensure no negative values
    ].filter(item => item.value > 0); 
  }, [budgetData]);

  // Custom tooltip for better data presentation
  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const allocated = parseFloat(budgetData.amount_allocated) || 0;
      // Avoid division by zero
      const percentage = allocated > 0 ? (((Number(data.value) ?? 0) / allocated) * 100).toFixed(1) : '0.0';
      
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
          <p className="text-sm font-medium text-gray-600">{data.name}</p>
          <p 
            className="text-sm font-medium"
            style={{ color: data.color }}
          >
            {budgetData.currency} {(data.value ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
            ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;
    const allocated = parseFloat(budgetData.amount_allocated) || 0;
    // Avoid division by zero
    const percentage = allocated > 0 ? ((payload.value / allocated) * 100).toFixed(1) : '0.0';
    
    return (
      <g>
        <text x={cx} y={cy - 15} dy={8} textAnchor="middle" fill="#333" fontSize={14}>
          {payload.name}
        </text>
        <text x={cx} y={cy + 15} dy={8} textAnchor="middle" fill={fill} fontWeight="bold" fontSize={16}>
          {percentage}%
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  // Handle case where summaryData might be empty
  const hasData = summaryData.length > 0;

  return (
    <div className="w-full bg-white rounded-xl shadow-sm p-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {format_price(Number(budgetData.amount_allocated) || 0, budgetData.currency)}
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

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pie chart section */}
        <div className="h-[300px] flex flex-col justify-center">
          <h3 className="text-sm font-medium text-gray-500 mb-2 text-center">Budget Utilization</h3>
          <ResponsiveContainer width="100%" height={280}>
            {hasData ? (
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={summaryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                >
                  {summaryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-500">No budget data available</p>
              </div>
            )}
          </ResponsiveContainer>
        </div>

        {/* Budget details section */}
        <div className="flex flex-col h-[300px]">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Budget Summary</h3>
          
          {/* Budget summary stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="border border-gray-100 rounded-lg p-4 bg-indigo-50">
              <p className="text-xs text-gray-500">Total Budget</p>
              <p className="text-lg font-medium text-indigo-700">
                {format_price(Number(budgetData.amount_allocated) || 0, budgetData.currency)}
              </p>
            </div>
            <div className="border border-gray-100 rounded-lg p-4 bg-green-50">
              <p className="text-xs text-gray-500">Available</p>
              <p className="text-lg font-medium text-green-700">
                {format_price(Number(budgetData.balance) || 0, budgetData.currency)}
              </p>
              <p className="text-xs text-gray-500">
                {calculatePercentage(budgetData.balance, budgetData.amount_allocated)}
              </p>
            </div>
            <div className="border border-gray-100 rounded-lg p-4 bg-amber-50">
              <p className="text-xs text-gray-500">Reserved</p>
              <p className="text-lg font-medium text-amber-700">
                {format_price(Number(budgetData.amount_reserved) || 0, budgetData.currency)}
              </p>
              <p className="text-xs text-gray-500">
                {calculatePercentage(budgetData.amount_reserved, budgetData.amount_allocated)}
              </p>
            </div>
            <div className="border border-gray-100 rounded-lg p-4 bg-red-50">
              <p className="text-xs text-gray-500">Used</p>
              <p className="text-lg font-medium text-red-700">
                {format_price(
                  Math.max(0, Number(budgetData.amount_allocated) - Number(budgetData.balance) - Number(budgetData.amount_reserved)), 
                  budgetData.currency
                )}
              </p>
              <p className="text-xs text-gray-500">
                {calculateUsedPercentage(budgetData)}
              </p>
            </div>
          </div>
          
          {/* Budget timeline info */}
          <div className="mt-auto border-t border-gray-100 pt-4 text-sm text-gray-500">
            <p>Budget: <span className="font-medium text-gray-700">{budgetData.name}</span></p>
            <p>Created: <span className="font-medium text-gray-700">
              {formatDate(budgetData.created_at)}
            </span></p>
            <p>Department: <span className="font-medium text-gray-700">
              {budgetData.department?.name || "N/A"}
            </span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

const calculatePercentage = (value: string, total: string): string => {
  const valueNum = parseFloat(value) || 0;
  const totalNum = parseFloat(total) || 0;
  
  if (totalNum === 0) return "(0.0%)";
  return `(${((valueNum / totalNum) * 100).toFixed(1)}%)`;
};

const calculateUsedPercentage = (budget: Budget): string => {
  const allocated = parseFloat(budget.amount_allocated) || 0;
  const balance = parseFloat(budget.balance) || 0;
  const reserved = parseFloat(budget.amount_reserved) || 0;
  const used = Math.max(0, allocated - balance - reserved);
  
  if (allocated === 0) return "(0.0%)";
  return `(${((used / allocated) * 100).toFixed(1)}%)`;
};

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  } catch {
    return "Invalid date";
  }
};

export default BudgetChart;