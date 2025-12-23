'use client';

import { useState, useEffect } from 'react';
import CrosswordGame from '@/components/CrosswordGame';
import PuzzleSelector from '@/components/PuzzleSelector';
import { puzzles, getPuzzleById } from '@/data/puzzles';
import type { CAPICrossword } from '@/types/crossword';

const CURRENT_PUZZLE_KEY = 'crossword-current-puzzle';

export default function Home() {
  const [currentPuzzle, setCurrentPuzzle] = useState<CAPICrossword | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedPuzzleId = localStorage.getItem(CURRENT_PUZZLE_KEY);
    if (savedPuzzleId) {
      const puzzle = getPuzzleById(savedPuzzleId);
      if (puzzle) {
        setCurrentPuzzle(puzzle);
        return;
      }
    }
    setCurrentPuzzle(puzzles[0]);
  }, []);

  const handleSelectPuzzle = (puzzleId: string) => {
    const puzzle = getPuzzleById(puzzleId);
    if (puzzle) {
      setCurrentPuzzle(puzzle);
      localStorage.setItem(CURRENT_PUZZLE_KEY, puzzleId);
    }
  };

  if (!mounted || !currentPuzzle) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center p-4 safe-area-top safe-area-bottom">
        <div className="text-gray-500">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh flex flex-col items-center p-2 safe-area-top safe-area-bottom">
      <div className="w-full max-w-lg flex flex-col items-center">
        <header className="text-center py-4">
          <h1 className="text-2xl font-bold text-amber-800">Cinnabear Crossword</h1>
        </header>

        <PuzzleSelector
          currentPuzzleId={currentPuzzle.id}
          onSelectPuzzle={handleSelectPuzzle}
        />

        <div className="flex-1 overflow-auto w-full">
          <CrosswordGame key={currentPuzzle.id} puzzle={currentPuzzle} />
        </div>
      </div>
    </main>
  );
}
