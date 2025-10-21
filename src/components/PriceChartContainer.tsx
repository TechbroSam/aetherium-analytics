// src/components/PriceChartContainer.tsx
'use client';

import { useState, useEffect } from 'react';
import { useCoinHistory } from '@/hooks/useCoinHistory';
import PriceChart from '@/components/PriceChart';

export default function PriceChartContainer({ symbol }: { symbol: string }) {
  const [geckoId, setGeckoId] = useState<string | null>(null);

  // 1. When the component loads, use the symbol to find the CoinGecko ID
  useEffect(() => {
    if (symbol) {
      const fetchGeckoId = async () => {
        const res = await fetch(`/api/crypto/get-gecko-id/${symbol}`);
        if (res.ok) {
          const data = await res.json();
          setGeckoId(data.id);
        }
      };
      fetchGeckoId();
    }
  }, [symbol]);

  // 2. Use the found ID to fetch the historical data
  const { history, isLoading, isError } = useCoinHistory(geckoId);

  if (isLoading) return <div className="h-96 flex items-center justify-center text-gray-400">Loading chart...</div>;
  if (isError || !history) return <div className="h-96 flex items-center justify-center text-red-500">Chart data unavailable.</div>;

  return <PriceChart data={history} />;
}