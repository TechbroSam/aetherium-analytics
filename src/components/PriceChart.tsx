// src/components/PriceChart.tsx
'use client';

import { useTheme } from 'next-themes';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface ChartData {
  date: string;
  price: number;
}

export default function PriceChart({ data }: { data: ChartData[] }) {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      notation: 'compact',
    }).format(value);
  };

  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ea580c" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
          <XAxis dataKey="date" tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
          <YAxis tickFormatter={formatPrice} tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
              borderColor: isDarkMode ? '#374151' : '#e5e7eb',
            }}
            formatter={(value: number) => [formatPrice(value), 'Price']}
          />
          <Area type="monotone" dataKey="price" stroke="#ea580c" fillOpacity={1} fill="url(#colorPrice)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}