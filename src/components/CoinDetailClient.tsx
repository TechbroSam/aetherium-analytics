// src/components/CoinDetailClient.tsx
'use client';

import { useCoinDetail } from '@/hooks/useCoinDetail';
import { useCoinHistory } from '@/hooks/useCoinHistory';
import Image from 'next/image';
import Link from 'next/link';
import PriceChart from '@/components/PriceChart';
import AetheriumIndex from '@/components/AetheriumIndex';

export default function CoinDetailClient({ coinId }: { coinId: string }) {
  const { coin, isLoading: isLoadingDetail, isError: isErrorDetail } = useCoinDetail(coinId);
  const { history, isLoading: isLoadingHistory, isError: isErrorHistory } = useCoinHistory(coinId);

  const isLoading = isLoadingDetail || isLoadingHistory;
  const isError = isErrorDetail || isErrorHistory;

  if (isLoading) return <p className="text-center py-20">Loading coin data...</p>;
  if (isError) return <p className="text-center py-20 text-red-500">Failed to load data.</p>;
  if (!coin || !history) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12">
        <Link href="/" className="text-sm text-gray-500 hover:underline mb-6 inline-block">
          &larr; Back to Dashboard
        </Link>
        <div className="flex items-center gap-4">
          <Image src={coin.image.large} alt={coin.name} width={48} height={48} />
          <div>
            <h1 className="text-4xl font-bold">{coin.name}</h1>
            <span className="text-lg text-gray-500 dark:text-gray-400">{coin.symbol.toUpperCase()}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <main className="md:col-span-2 space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-lg mb-4">Price Chart (7 Days)</h2>
            <PriceChart data={history} />
          </div>
          <AetheriumIndex coinName={coin.name} />
        </main>

        <aside>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4">
              {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(coin.market_data.current_price.gbp)}
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">24h Change</span>
                <span className={coin.market_data.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'}>
                  {coin.market_data.price_change_percentage_24h.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Market Cap</span>
                <span>{new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', notation: 'compact' }).format(coin.market_data.market_cap.gbp)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Volume (24h)</span>
                <span>{new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', notation: 'compact' }).format(coin.market_data.total_volume.gbp)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Circulating Supply</span>
                <span>{coin.market_data.circulating_supply.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}