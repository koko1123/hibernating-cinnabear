'use client';

import { useState } from 'react';
import PuzzleHistory from './PuzzleHistory';

interface PuzzleSelectorProps {
  currentPuzzleName: string;
  onNewPuzzle: () => void;
  onSelectPuzzle: (puzzleId: string) => void;
}

export default function PuzzleSelector({
  currentPuzzleName,
  onNewPuzzle,
  onSelectPuzzle,
}: PuzzleSelectorProps) {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center gap-2 mb-4">
        <h2 className="text-lg font-medium text-pink-200">
          {currentPuzzleName || 'Crossword'}
        </h2>
        <div className="flex gap-3">
          <button
            onClick={onNewPuzzle}
            className="px-8 py-4 bg-[#6A1E55] text-white font-medium rounded-lg
                       border-2 border-[#A64D79] shadow-md hover:bg-[#A64D79]
                       transition-colors duration-150 touch-manipulation"
          >
            New Puzzle
          </button>
          <button
            onClick={() => setShowHistory(true)}
            className="px-8 py-4 bg-[#3B1C32] text-white font-medium rounded-lg
                       border-2 border-[#6A1E55] shadow-md hover:bg-[#6A1E55]
                       transition-colors duration-150 touch-manipulation"
          >
            History
          </button>
        </div>
      </div>

      {showHistory && (
        <PuzzleHistory
          onSelectPuzzle={(id) => {
            onSelectPuzzle(id);
            setShowHistory(false);
          }}
          onClose={() => setShowHistory(false)}
        />
      )}
    </>
  );
}
