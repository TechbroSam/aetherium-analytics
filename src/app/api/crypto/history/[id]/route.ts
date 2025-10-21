// src/app/api/crypto/history/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> } // params is now a Promise
) {
  // Await the params to get the actual values
  const { id } = await params;
  
  const apiKey = process.env.COINMARKETCAP_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured.' }, { status: 500 });
  }

  // Get the timeframe from the URL query (e.g., ?timeframe=7d)
  const timeframe = request.nextUrl.searchParams.get('timeframe') || '7d';

  try {
    const response = await fetch(`https://pro-api.coinmarketcap.com/v3/cryptocurrency/quotes/historical?id=${id}&convert=GBP&interval=24h&time_end=now&time_start=${getStartDate(timeframe)}`, {
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
    return NextResponse.json({ error: 'Failed to fetch historical data.' }, { status: 500 });
  }
}

// Helper function to calculate the start date based on the timeframe
function getStartDate(timeframe: string): string {
    const now = new Date();
    switch (timeframe) {
        case '1d':
            now.setDate(now.getDate() - 1);
            break;
        case '7d':
            now.setDate(now.getDate() - 7);
            break;
        case '1m':
            now.setMonth(now.getMonth() - 1);
            break;
        case '1y':
            now.setFullYear(now.getFullYear() - 1);
            break;
        default:
            now.setDate(now.getDate() - 7); // Default to 7 days
    }
    return now.toISOString();
}