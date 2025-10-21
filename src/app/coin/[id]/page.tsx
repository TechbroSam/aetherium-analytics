// src/app/coin/[id]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import AetheriumIndex from '@/components/AetheriumIndex';
import SupplyChart from '@/components/SupplyChart';
import PriceChartContainer from '@/components/PriceChartContainer'; // Import our new container

// This function fetches data directly on the server from CoinMarketCap
async function getCoinDetail(coinId: string) {
  const apiKey = process.env.COINMARKETCAP_API_KEY;
  try {
    const res = await fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${coinId}&convert=GBP`, {
      headers: { 'X-CMC_PRO_API_KEY': apiKey! },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data[coinId];
  } catch (error) {
    console.error("Failed to fetch coin detail:", error);
    return null;
  }
}

export default async function CoinDetailPage({ params }: { params: { id: string } }) {
  const coin = await getCoinDetail(params.id);

  if (!coin) {
    return <p className="text-center py-20 text-red-500">Failed to load data or coin not found.</p>;
  }

  const quote = coin.quote.GBP;

  const formatPrice = (price: number) => {
    if (price < 0.01) {
      return `£${price.toLocaleString('en-GB', { maximumSignificantDigits: 4 })}`;
    }
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(price);
  };

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
          {/* The Price Chart is now rendered via its own client component */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-lg mb-4">Price Chart (7 Days)</h2>
            <PriceChartContainer symbol={coin.symbol} />
          </div>

          {/* The Supply Chart is rendered with server data */}
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
            <h2 className="text-2xl font-bold mb-4">{formatPrice(quote.price)}</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">24h Change</span>
                <span className={quote.percent_change_24h > 0 ? 'text-green-500' : 'text-red-500'}>{quote.percent_change_24h.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Market Cap</span>
                <span>{new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', notation: 'compact' }).format(quote.market_cap)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Volume (24h)</span>
                <span>{new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', notation: 'compact' }).format(quote.volume_24h)}</span>
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