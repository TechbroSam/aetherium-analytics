// src/app/api/crypto/get-gecko-id/[symbol]/route.ts
import { NextRequest, NextResponse } from 'next/server';

// We'll cache this response to avoid hitting the API too often
let coinListCache: { id: string, symbol: string }[] | null = null;
let lastFetch: number = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> } // params is now a Promise
) {
  // Await the params to get the actual values
  const { symbol } = await params;
  const symbolLower = symbol.toLowerCase();
  const now = Date.now();

  // Refresh the coin list cache every hour
  if (!coinListCache || now - lastFetch > 3600000) {
    try {
      const res = await fetch('https://api.coingecko.com/api/v3/coins/list');
      coinListCache = await res.json();
      lastFetch = now;
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch coin list from CoinGecko.' }, { status: 500 });
    }
  }

  const coin = coinListCache?.find(c => c.symbol === symbolLower);

  if (coin) {
    return NextResponse.json({ id: coin.id });
  } else {
    return NextResponse.json({ error: `Coin with symbol ${symbol} not found on CoinGecko.` }, { status: 404 });
  }
}