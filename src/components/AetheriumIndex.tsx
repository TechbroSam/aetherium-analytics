// src/components/AetheriumIndex.tsx
'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';

export default function AetheriumIndex({ coinName }: { coinName: string }) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateAnalysis = async () => {
    setIsGenerating(true);
    setError(null);
    setAnalysis(null);

    try {
      const res = await fetch('/api/ai/analyze-coin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coinName }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to get analysis from the server.');
      }

      const data = await res.json();
      
      // Ensure the 'analysis' property exists before setting the state
      if (data.analysis) {
        setAnalysis(data.analysis);
      } else {
        throw new Error("Received an empty analysis from the server.");
      }

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Aetherium Index (AI Analysis)</h2>
        {analysis && (
           <button
              onClick={handleGenerateAnalysis}
              disabled={isGenerating}
              className="flex items-center gap-1 text-xs text-orange-600 hover:underline disabled:opacity-50"
           >
              <Sparkles size={14} />
              Regenerate
           </button>
        )}
      </div>
      
      {/* Initial state with button */}
      {!analysis && !isGenerating && !error && (
         <button
            onClick={handleGenerateAnalysis}
            className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
         >
            <Sparkles size={16} />
            Generate Real-Time Insight
         </button>
      )}

      {isGenerating && <p className="text-center text-gray-500 animate-pulse">Generating analysis...</p>}
      {error && <p className="text-center text-red-500 text-sm">{error}</p>}

      {/* Analysis display */}
      {analysis && (
        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-4 whitespace-pre-wrap">
          {analysis}
        </div>
      )}
    </div>
  );
}