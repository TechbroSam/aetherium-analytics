// src/app/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { useCryptoData, CryptoData } from '@/hooks/useCryptoData';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ParallaxHero from '@/components/ParallaxHero';

export default function HomePage() {
  const [currency, setCurrency] = useState<'gbp' | 'usd'>('gbp');
  const [sortConfig, setSortConfig] = useState({ key: 'market_cap', direction: 'desc' as 'asc' | 'desc' });
  const { data: coins, isLoading, isError } = useCryptoData(currency);
  const router = useRouter();

  const currencySymbol = currency === 'gbp' ? '£' : '$';

  const sortedCoins = useMemo(() => {
    if (!coins) return [];
    const sortableCoins = [...coins];
    sortableCoins.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof CryptoData];
      const bValue = b[sortConfig.key as keyof CryptoData];
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sortableCoins;
  }, [coins, sortConfig]);

const handleSort = (key: keyof CryptoData) => {
  let newDirection: 'asc' | 'desc' = 'asc';

  // If we are clicking the same column that is already sorted...
  if (sortConfig.key === key) {
    // Toggle direction: asc -> desc, desc -> asc
    newDirection = sortConfig.direction === 'asc' ? 'desc' : 'asc';
  } else {
    // If it's a new column, default to descending for market_cap, ascending for others
    newDirection = key === 'market_cap' ? 'desc' : 'asc';
  }

  setSortConfig({ key, direction: newDirection });
};


  const formatPrice = (price: number) => {
    if (price < 0.01) {
      return `${currencySymbol}${price.toLocaleString('en-GB', { maximumSignificantDigits: 4 })}`;
    }
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: currency.toUpperCase() }).format(price);
  };

  return (
    <div>
      <ParallaxHero />
      <div className="container mx-auto px-4 py-8 relative z-20 bg-gray-50 dark:bg-gray-900">
        <main>
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
            <table className="min-w-full divide-y-2 divide-gray-200 dark:divide-gray-800 text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">#</th>
                  <th className="px-4 py-3 text-left font-medium">Coin</th>
                  <th
                    className="px-4 py-3 text-left font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={() => setCurrency(c => c === 'gbp' ? 'usd' : 'gbp')}
                    onContextMenu={(e) => { e.preventDefault(); handleSort('current_price'); }}
                  >
                    Price ({currency.toUpperCase()}) {sortConfig.key === 'current_price' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                  </th>
                  <th
                    className="px-4 py-3 text-left font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={() => handleSort('price_change_percentage_24h')}
                  >
                    24h % {sortConfig.key === 'price_change_percentage_24h' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                  </th>
                  <th
                    className="px-4 py-3 text-left font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={() => handleSort('market_cap')}
                  >
                    Market Cap {sortConfig.key === 'market_cap' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {isLoading && ( <tr><td colSpan={5} className="text-center py-10">Loading live data...</td></tr> )}
                {isError && ( <tr><td colSpan={5} className="text-center py-10 text-red-500">Failed to load data.</td></tr> )}
                {sortedCoins?.map((coin, index) => (
                  <tr 
                    key={coin.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                    onClick={() => router.push(`/coin/${coin.id}`)}
                  >
                    <td className="px-4 py-3 font-medium">{index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Image src={coin.image} alt={coin.name} width={24} height={24} />
                        <div>
                          <span className="font-bold">{coin.name}</span>
                          <span className="block text-xs text-gray-500 dark:text-gray-400">{coin.symbol.toUpperCase()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{formatPrice(coin.current_price)}</td>
                    <td className={`px-4 py-3 ${coin.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3">
                      {new Intl.NumberFormat('en-GB', { style: 'currency', currency: currency.toUpperCase(), notation: 'compact' }).format(coin.market_cap)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}