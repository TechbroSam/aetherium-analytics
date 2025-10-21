// src/app/api/crypto/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const apiKey = process.env.COINMARKETCAP_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key is not configured.' }, { status: 500 });
  }

  // Get the currency from the URL query, defaulting to GBP
  const convert = request.nextUrl.searchParams.get('convert')?.toUpperCase() || 'GBP';

  try {
    const response = await fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=50&convert=${convert}`, {
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
    return NextResponse.json({ error: 'Failed to fetch data from CoinMarketCap.' }, { status: 500 });
  }
}