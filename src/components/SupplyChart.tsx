// src/components/SupplyChart.tsx
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface SupplyChartProps {
  circulating: number;
  total: number | null;
  symbol: string;
}

const COLORS = ['#ea580c', '#e5e7eb']; // Orange for circulating, Gray for remaining

export default function SupplyChart({ circulating, total, symbol }: SupplyChartProps) {
  // If there's no max supply (like Ethereum), we can't show a chart.
  if (!total) {
    return (
      <div className="h-96 w-full flex flex-col items-center justify-center text-center">
        <h3 className="font-semibold">Circulating Supply</h3>
        <p className="text-3xl font-bold mt-2">
          {circulating.toLocaleString()} {symbol}
        </p>
        <p className="text-xs text-gray-500 mt-1">(No maximum supply)</p>
      </div>
    );
  }

  const remaining = total - circulating;
  const data = [
    { name: 'Circulating', value: circulating },
    { name: 'Remaining', value: remaining },
  ];

  const circulatingPercent = ((circulating / total) * 100).toFixed(1);

  return (
    <div className="h-96 w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry) => (
              <span className="text-gray-600 dark:text-gray-300 ml-2">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-bold">{circulatingPercent}%</span>
        <span className="text-sm text-gray-500">in circulation</span>
      </div>
    </div>
  );
}