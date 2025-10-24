// src/app/api/crypto/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> } // params is now a Promise
) {
  const apiKey = process.env.COINMARKETCAP_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured.' }, { status: 500 });
  }

  try {
    // Use the awaited id
    const response = await fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${id}&convert=GBP`, {
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`CoinMarketCap API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch coin details.' }, { status: 500 });
  }
}