// src/hooks/useCoinDetail.ts
import useSWR from 'swr';

export interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  image: { large: string };
  market_data: {
    current_price: { gbp: number };
    price_change_percentage_24h: number;
    market_cap: { gbp: number };
    total_volume: { gbp: number };
    circulating_supply: number;
  };
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useCoinDetail(coinId: string) {
  const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
  const url = `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&x_cg_demo_api_key=${apiKey}`;
  const { data, error, isLoading } = useSWR<CoinDetail>(coinId ? url : null, fetcher);

  return { coin: data, isLoading, isError: error };
}

