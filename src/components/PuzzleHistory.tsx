'use client';

import { useState, useEffect } from 'react';
import { apiClient, type ProgressHistoryItem } from '@/lib/api';

interface PuzzleHistoryProps {
  onSelectPuzzle: (puzzleId: string) => void;
  onClose: () => void;
}

export default function PuzzleHistory({
  onSelectPuzzle,
  onClose,
}: PuzzleHistoryProps) {
  const [history, setHistory] = useState<ProgressHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await apiClient.getProgress();
        setHistory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load history');
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1A1A1D] border-2 border-[#3B1C32] rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-[#3B1C32]">
          <h2 className="text-lg font-bold text-pink-200">Puzzle History</h2>
          <button
            onClick={onClose}
            className="p-2 text-pink-300 hover:text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {loading && (
            <div className="text-center text-pink-200 py-8">Loading...</div>
          )}

          {error && (
            <div className="text-center text-red-300 py-8">{error}</div>
          )}

          {!loading && !error && history.length === 0 && (
            <div className="text-center text-pink-200 py-8">
              No puzzles started yet
            </div>
          )}

          {!loading && !error && history.length > 0 && (
            <ul className="space-y-2">
              {history.map((item) => (
                <li key={item.puzzle_id}>
                  <button
                    onClick={() => onSelectPuzzle(item.puzzle_id)}
                    className="w-full text-left p-3 rounded-lg border border-[#3B1C32] hover:bg-[#3B1C32]
                               transition-colors duration-150"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white">
                        {item.puzzle_name}
                      </span>
                      {item.status === 'completed' ? (
                        <span className="text-xs px-2 py-1 bg-green-900 text-green-200 rounded-full">
                          Complete
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 bg-[#6A1E55] text-white rounded-full">
                          {item.completion_percentage}%
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-pink-300 mt-1">
                      Started {formatDate(item.started_at)}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
