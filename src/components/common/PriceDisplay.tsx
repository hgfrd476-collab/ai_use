import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../utils/currency';

interface PriceDisplayProps {
  amountUSD: number;
  period?: 'night' | 'day' | 'hour' | 'total';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  strikeUSD?: number;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  amountUSD,
  period,
  size = 'md',
  className = '',
  strikeUSD,
}) => {
  const { currency, t } = useApp();

  const formatted = formatPrice(amountUSD, currency);
  const formattedStrike = strikeUSD ? formatPrice(strikeUSD, currency) : null;

  const sizeClasses = {
    sm: 'text-sm font-semibold',
    md: 'text-base font-bold',
    lg: 'text-xl font-extrabold',
    xl: 'text-2xl sm:text-3xl font-black',
  };

  const getPeriodLabel = () => {
    if (!period || period === 'total') return '';
    if (period === 'night') return ` / ${t.perNight.replace('per ', '')}`;
    if (period === 'day') return ` / ${t.perDay.replace('per ', '')}`;
    if (period === 'hour') return ` / ${t.perHour.replace('per ', '')}`;
    return '';
  };

  return (
    <div className={`inline-flex items-baseline gap-1.5 ${className}`}>
      {formattedStrike && (
        <span className="text-xs text-slate-400 line-through font-medium">
          {formattedStrike}
        </span>
      )}
      <span className={`text-slate-900 tracking-tight ${sizeClasses[size]}`}>
        {formatted}
      </span>
      {period && period !== 'total' && (
        <span className="text-xs font-medium text-slate-500">
          {getPeriodLabel()}
        </span>
      )}
    </div>
  );
};
