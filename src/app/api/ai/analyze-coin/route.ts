import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Validate environment variable
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY in environment variables.');
}

// Initialize the AI client
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const { coinName } = await request.json();
    if (!coinName || typeof coinName !== 'string') {
      return NextResponse.json({ error: 'Valid coin name is required' }, { status: 400 });
    }

    const prompt = `
      You are a neutral crypto data analyst. Summarize publicly available data for "${coinName}" without providing financial advice or price predictions. Structure the response in three markdown sections, keeping each section concise (max 100 words):

      1. **Technical Data Summary:**
         - Summarize current technical indicators (e.g., RSI, MACD, moving averages) using specific values if available.
         - Example: "RSI (14-day) at 55, neutral. Price above 50-day MA, indicating short-term bullish trend."

      2. **Fundamental Summary:**
         - Summarize the project's purpose in 1-2 sentences based on its whitepaper or official website.
         - Include one recent news item or development update (e.g., GitHub activity, partnerships).

      3. **Aetherium Index Score:**
         - Calculate a score (0-100) based only on the above data (technical indicators, project purpose, recent developments).
         - Format exactly as: "**Aetherium Index Score: [score]/100**".

      If insufficient data is available, return only: "No analysis available for ${coinName}."
    `;

    // Generate content using the latest API method
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        maxOutputTokens: 5048, // Increased for robust analysis
        temperature: 0.7,
      },
    });

    // Log the full response for debugging
    console.log('API Response:', JSON.stringify(response, null, 2));

    // Extract text from response
    let text = '';
    if (
      response.candidates &&
      response.candidates[0] &&
      response.candidates[0].content &&
      response.candidates[0].content.parts &&
      response.candidates[0].content.parts[0]
    ) {
      text = response.candidates[0].content.parts[0].text || '';
    }

    // Handle MAX_TOKENS case
    if (response.candidates?.[0]?.finishReason === 'MAX_TOKENS')  {
      console.warn(`Response truncated for coin: ${coinName} due to MAX_TOKENS`);
      text = text || `Partial analysis for ${coinName} due to token limit. Try a less data-intensive coin or contact support.`;
    }

    // Check if response is empty
    if (!text || text.trim() === '') {
      console.warn(`Empty response for coin: ${coinName}`);
      text = `No analysis available for ${coinName}.`;
    }

    return NextResponse.json({ analysis: text }, { status: 200 });
  } catch (error: unknown) {
    console.error('AI generation failed:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      {
        error: 'Failed to generate AI analysis',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

export const config = {
  runtime: 'edge',
};

export default POST;
// export const runtime = 'edge';
