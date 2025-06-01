import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  loading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  change,
  className = '',
  loading = false,
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          {loading ? (
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mt-2" />
          ) : (
            <p className="text-2xl font-semibold text-gray-900 mt-2">{value}</p>
          )}
          {change && !loading && (
            <div className="flex items-center mt-2">
              <span
                className={`text-sm font-medium ${
                  change.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {change.isPositive ? '+' : ''}
                {change.value}%
              </span>
              <svg
                className={`h-4 w-4 ml-1 ${
                  change.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    change.isPositive
                      ? 'M5 15l7-7 7 7'
                      : 'M19 9l-7 7-7-7'
                  }
                />
              </svg>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-blue-100 rounded-full">
            <div className="text-blue-600">{icon}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard; 