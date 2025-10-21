// src/hooks/useCoinHistory.ts
import useSWR from 'swr';

type CoinHistoryData = {
  prices: [number, number][];
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useCoinHistory(coinId: string | null) {
  const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
  const days = '7'; // Hardcode to 7 days
  
  const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=gbp&days=${days}&interval=daily&x_cg_demo_api_key=${apiKey}`;

  // SWR will only fetch if coinId is not null
  const { data, error, isLoading } = useSWR<CoinHistoryData>(coinId ? url : null, fetcher);

  const formattedData = data?.prices.map(([timestamp, price]) => ({
    date: new Date(timestamp).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }),
    price: price,
  }));

  return {
    history: formattedData,
    isLoading,
    isError: error,
  };
}

export default useCoinHistory;