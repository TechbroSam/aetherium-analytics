// src/app/api/crypto/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest, 
 { params }: { params: Promise<{ id: string }> }
) {
  // Await the params to get the actual values
  const { id } = await params;

  const apiKey = process.env.COINMARKETCAP_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured.' }, { status: 500 });
  }



  // Get currency from URL, default to GBP
  const convert = request.nextUrl.searchParams.get('convert')?.toUpperCase() || 'GBP';

  try {
    const response = await fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${id}&convert=${convert}`, {
      headers: { 'X-CMC_PRO_API_KEY': apiKey },
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch coin details.' }, { status: 500 });
  }
}