import React from 'react';
import { IoTrendingUp, IoTrendingDown } from 'react-icons/io5';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/utils/cn';

interface BudgetDetailCardProps {
  label: string;
  value: number;
  previousValue?: number;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
  percentage: number;
  bgColor?: string;
  textColor?: string;
}

const BudgetDetailCard: React.FC<BudgetDetailCardProps> = ({
  label,
  value,
  icon,
  trend,
  percentage,
  bgColor = 'bg-white',
  textColor = 'text-gray-900'
}) => {
  const getTrendIcon = () => {
    if (trend === 'up') return <IoTrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <IoTrendingDown className="w-4 h-4 text-red-500" />;
    return null;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-500';
    if (trend === 'down') return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <div className={cn(
      'rounded-xl p-6 shadow-sm transition-all duration-200 hover:shadow-md',
      bgColor
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          <span className="text-sm text-gray-500">{label}</span>
          <div className="flex items-baseline gap-2">
            <span className={cn('text-2xl font-semibold', textColor)}>
              {formatCurrency(value)}
            </span>
            {trend !== 'neutral' && (
              <div className="flex items-center gap-1">
                {getTrendIcon()}
                <span className={cn('text-sm font-medium', getTrendColor())}>
                  {percentage}%
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default BudgetDetailCard;