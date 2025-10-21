// src/hooks/useCryptoData.ts
import useSWR from 'swr';

export interface CryptoData {
  id: number;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
}

// Define interfaces for the API response
interface CoinQuote {
  [currency: string]: {
    price: number;
    market_cap: number;
    percent_change_24h: number;
  };
}

interface CoinData {
  id: number;
  symbol: string;
  name: string;
  quote: CoinQuote;
}

interface ApiResponse {
  data: CoinData[];
}

const fetcher = (url: string): Promise<ApiResponse> => 
  fetch(url).then((res) => res.json());

export function useCryptoData(currency: 'gbp' | 'usd') {
  // SWR will automatically re-fetch when the currency changes
  const { data, error, isLoading } = useSWR<ApiResponse>(
    `/api/crypto?convert=${currency}`, 
    fetcher, 
    {
      refreshInterval: 300000,
    }
  );

  const currencyUpper = currency.toUpperCase();

  const mappedData: CryptoData[] | undefined = data?.data?.map((coin: CoinData) => ({
    id: coin.id,
    symbol: coin.symbol,
    name: coin.name,
    image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`,
    current_price: coin.quote[currencyUpper].price,
    market_cap: coin.quote[currencyUpper].market_cap,
    price_change_percentage_24h: coin.quote[currencyUpper].percent_change_24h,
  }));

  return {
    data: mappedData,
    isLoading,
    isError: error,
  };
}