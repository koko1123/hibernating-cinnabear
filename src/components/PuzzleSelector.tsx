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
        <h2 className="text-lg font-medium text-gray-700">
          {currentPuzzleName || 'Crossword'}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onNewPuzzle}
            className="px-6 py-3 bg-amber-700 text-white font-medium rounded-lg
                       shadow-md hover:bg-amber-800 active:bg-amber-900
                       transition-colors duration-150 touch-manipulation"
          >
            New Puzzle
          </button>
          <button
            onClick={() => setShowHistory(true)}
            className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg
                       shadow-md hover:bg-gray-300 active:bg-gray-400
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
