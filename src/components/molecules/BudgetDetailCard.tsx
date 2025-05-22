import React from 'react';
import { format_price } from '@/utils/helpers';

interface BudgetDetailCardProps {
  label: string;
  value: number;
  currency: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  percentage?: number;
  previousValue?: number;
  bgColor?: string;
  textColor?: string;
}

const BudgetDetailCard: React.FC<BudgetDetailCardProps> = ({
  label,
  value,
  currency,
  icon,
  trend = 'neutral',
  percentage = 0,
  previousValue,
  bgColor = 'bg-white',
  textColor = 'text-gray-800'
}) => {
  const renderTrendIndicator = () => {
    if (trend === 'up') {
      return (
        <div className="flex items-center text-green-600">
          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          <span className="text-xs">{percentage.toFixed(1)}%</span>
        </div>
      );
    } else if (trend === 'down') {
      return (
        <div className="flex items-center text-red-600">
          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          <span className="text-xs">{percentage.toFixed(1)}%</span>
        </div>
      );
    } else {
      return percentage ? (
        <span className="text-xs text-gray-500">{percentage.toFixed(1)}%</span>
      ) : null;
    }
  };

  return (
    <div className={`${bgColor} rounded-xl border border-gray-200 p-4 shadow-sm`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <h3 className={`text-xl font-bold ${textColor}`}>
            {format_price(value, currency)}
          </h3>
          
          {previousValue && (
            <div className="flex items-center mt-1 gap-2">
              {renderTrendIndicator()}
              <p className="text-xs text-gray-500">
                of {format_price(previousValue, currency)}
              </p>
            </div>
          )}
        </div>
        <div className="p-2 rounded-full bg-gray-100">
          {icon}
        </div>
      </div>
      
      {percentage > 0 && !previousValue && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full ${
                trend === 'up' ? 'bg-green-600' : 
                trend === 'down' ? 'bg-red-600' : 
                'bg-blue-600'
              }`} 
              style={{ width: `${percentage > 100 ? 100 : percentage}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetDetailCard;