'use client';

import { useState, useEffect } from 'react';
import CrosswordGame from '@/components/CrosswordGame';
import type { CAPICrossword } from '@/types/crossword';

export default function TestPage() {
  const [puzzle, setPuzzle] = useState<CAPICrossword | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/test_puzzle.json')
      .then((res) => res.json())
      .then((data) => setPuzzle(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center p-4">
        <div className="text-red-500">Error: {error}</div>
      </main>
    );
  }

  if (!puzzle) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center p-4">
        <div className="text-gray-500">Loading test puzzle...</div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh flex flex-col items-center p-2 safe-area-top safe-area-bottom border-8 border-white">
      <div className="w-full max-w-lg flex flex-col items-center">
        <header className="text-center py-4">
          <h1 className="text-2xl font-bold text-amber-800">Test: {puzzle.name}</h1>
          <p className="text-sm text-gray-600">
            {puzzle.dimensions.cols}x{puzzle.dimensions.rows} grid, {puzzle.entries.length} entries
          </p>
        </header>

        <div className="flex-1 overflow-auto w-full">
          <CrosswordGame puzzle={puzzle} />
        </div>

        <div className="mt-4 text-xs text-gray-500">
          <p>Source: Crosshare.org (converted to CAPICrossword format)</p>
        </div>
      </div>
    </main>
  );
}
