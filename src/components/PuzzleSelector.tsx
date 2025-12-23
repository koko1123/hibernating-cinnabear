'use client';

import { puzzles } from '@/data/puzzles';

interface PuzzleSelectorProps {
  currentPuzzleId: string;
  onSelectPuzzle: (puzzleId: string) => void;
}

export default function PuzzleSelector({
  currentPuzzleId,
  onSelectPuzzle,
}: PuzzleSelectorProps) {
  const handleNewPuzzle = () => {
    const availablePuzzles = puzzles.filter((p) => p.id !== currentPuzzleId);
    if (availablePuzzles.length === 0) {
      return;
    }
    const randomIndex = Math.floor(Math.random() * availablePuzzles.length);
    onSelectPuzzle(availablePuzzles[randomIndex].id);
  };

  const currentPuzzle = puzzles.find((p) => p.id === currentPuzzleId);

  return (
    <div className="flex flex-col items-center gap-2 mb-4">
      <h2 className="text-lg font-medium text-gray-700">
        {currentPuzzle?.name || 'Crossword'}
      </h2>
      <button
        onClick={handleNewPuzzle}
        className="px-6 py-3 bg-amber-700 text-white font-medium rounded-lg
                   shadow-md hover:bg-amber-800 active:bg-amber-900
                   transition-colors duration-150 touch-manipulation"
      >
        New Puzzle
      </button>
    </div>
  );
}
