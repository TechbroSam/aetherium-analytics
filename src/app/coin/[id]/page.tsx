// src/app/coin/[id]/page.tsx
'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Image from 'next/image';
import Link from 'next/link';
import AetheriumIndex from '@/components/AetheriumIndex';
import SupplyChart from '@/components/SupplyChart';
import PriceChartContainer from '@/components/PriceChartContainer';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function CoinDetailPage({ params }: { params: { id: string } }) {
  const [currency, setCurrency] = useState<'gbp' | 'usd'>('gbp');
  
  // SWR re-fetches automatically when the URL (containing the currency) changes
  const { data: coinData, error: detailError } = useSWR(`/api/crypto/${params.id}?convert=${currency}`, fetcher);

  const coin = coinData?.data?.[params.id];
  const isLoading = !coinData && !detailError;

  const formatPrice = (price: number, curr: 'gbp' | 'usd') => {
    if (price < 0.01) {
      const symbol = curr === 'gbp' ? '£' : '$';
      return `${symbol}${price.toLocaleString('en-US', { maximumSignificantDigits: 4 })}`;
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: curr.toUpperCase() }).format(price);
  };

  if (isLoading) return <p className="text-center py-20">Loading coin data...</p>;
  if (detailError || !coin) return <p className="text-center py-20 text-red-500">Failed to load data.</p>;

  const quote = coin.quote[currency.toUpperCase()];

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12">
        <Link href="/" className="text-sm text-gray-500 hover:underline mb-6 inline-block">
          &larr; Back to Dashboard
        </Link>
        <div className="flex items-center gap-4">
          <Image 
            src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`} 
            alt={coin.name} 
            width={48} 
            height={48} 
          />
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
            <PriceChartContainer symbol={coin.symbol} />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-lg mb-4">Supply Distribution</h2>
            <SupplyChart 
              circulating={coin.circulating_supply} 
              total={coin.total_supply} 
              symbol={coin.symbol} 
            />
          </div>
          <AetheriumIndex coinName={coin.name} />
        </main>

        <aside>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 
              className="text-2xl font-bold mb-4 cursor-pointer"
              onClick={() => setCurrency(c => c === 'gbp' ? 'usd' : 'gbp')}
              title={`Click to switch to ${currency === 'gbp' ? 'USD' : 'GBP'}`}
            >
              {formatPrice(quote.price, currency)}
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">24h Change</span>
                <span className={quote.percent_change_24h > 0 ? 'text-green-500' : 'text-red-500'}>{quote.percent_change_24h.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Market Cap</span>
                <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase(), notation: 'compact' }).format(quote.market_cap)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Volume (24h)</span>
                <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase(), notation: 'compact' }).format(quote.volume_24h)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Circulating Supply</span>
                <span>{coin.circulating_supply.toLocaleString()} {coin.symbol}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}