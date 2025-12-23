'use client';

import { useRef, useEffect, useCallback } from 'react';
import { Crossword, type CrosswordProps } from '@guardian/react-crossword';
import type { CAPICrossword } from '@/types/crossword';

interface CrosswordGameProps {
  puzzle: CAPICrossword;
  progress?: Record<string, string>;
  onProgressChange?: (cells: Record<string, string>) => void;
  onComplete?: () => void;
}

// Debounce helper
function debounce<T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number
): (...args: T) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export default function CrosswordGame({
  puzzle,
  progress,
  onProgressChange,
  onComplete,
}: CrosswordGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastProgressRef = useRef<Record<string, string>>({});
  const hasCompletedRef = useRef(false);

  // Build solution map from puzzle entries
  const buildSolutionMap = useCallback((): Record<string, string> => {
    const solutionMap: Record<string, string> = {};
    for (const entry of puzzle.entries) {
      if (!entry.solution) continue;
      const { x, y } = entry.position;
      const dx = entry.direction === 'across' ? 1 : 0;
      const dy = entry.direction === 'down' ? 1 : 0;
      for (let i = 0; i < entry.solution.length; i++) {
        const cellX = x + i * dx;
        const cellY = y + i * dy;
        solutionMap[`${cellX},${cellY}`] = entry.solution[i].toUpperCase();
      }
    }
    return solutionMap;
  }, [puzzle.entries]);

  // Check if puzzle is complete
  const checkCompletion = useCallback(
    (currentProgress: Record<string, string>) => {
      if (hasCompletedRef.current) return;

      const solutionMap = buildSolutionMap();
      const solutionKeys = Object.keys(solutionMap);

      if (solutionKeys.length === 0) return;

      // Check if all cells are filled correctly
      const isComplete = solutionKeys.every((key) => {
        const userAnswer = currentProgress[key]?.toUpperCase();
        const correctAnswer = solutionMap[key];
        return userAnswer === correctAnswer;
      });

      if (isComplete) {
        hasCompletedRef.current = true;
        onComplete?.();
      }
    },
    [buildSolutionMap, onComplete]
  );

  // Convert progress object to 2D array format expected by Guardian Crossword
  const convertProgressToArray = (
    progressObj: Record<string, string> | undefined,
    cols: number,
    rows: number
  ): string[][] | undefined => {
    if (!progressObj || Object.keys(progressObj).length === 0) {
      return undefined;
    }
    const arr: string[][] = Array.from({ length: rows }, () =>
      Array(cols).fill('')
    );
    for (const [key, value] of Object.entries(progressObj)) {
      const [x, y] = key.split(',').map(Number);
      if (y < rows && x < cols) {
        arr[y][x] = value;
      }
    }
    return arr;
  };

  // Convert 2D array back to object format for API
  const convertArrayToProgress = (arr: string[][]): Record<string, string> => {
    const obj: Record<string, string> = {};
    for (let y = 0; y < arr.length; y++) {
      for (let x = 0; x < arr[y].length; x++) {
        if (arr[y][x]) {
          obj[`${x},${y}`] = arr[y][x];
        }
      }
    }
    return obj;
  };

  // Debounced progress save
  const debouncedSave = useCallback(
    debounce((cells: Record<string, string>) => {
      if (onProgressChange) {
        onProgressChange(cells);
      }
      checkCompletion(cells);
    }, 500),
    [onProgressChange, checkCompletion]
  );

  // Watch for DOM changes to detect cell updates (Guardian Crossword saves to localStorage)
  useEffect(() => {
    if (!containerRef.current) return;

    const storageKey = `crossword-state-${puzzle.id}`;

    const checkProgress = () => {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.progress) {
            const newProgress = convertArrayToProgress(parsed.progress);
            const newProgressStr = JSON.stringify(newProgress);
            const lastProgressStr = JSON.stringify(lastProgressRef.current);
            if (newProgressStr !== lastProgressStr) {
              lastProgressRef.current = newProgress;
              debouncedSave(newProgress);
            }
          }
        } catch {
          // Invalid JSON, ignore
        }
      }
    };

    // Check periodically for changes
    const interval = setInterval(checkProgress, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [puzzle.id, debouncedSave]);

  const progressArray = convertProgressToArray(
    progress,
    puzzle.dimensions.cols,
    puzzle.dimensions.rows
  );

  return (
    <div
      id="crossword-wrapper"
      ref={containerRef}
      className="crossword-container w-full flex flex-col items-center"
    >
      <Crossword
        data={puzzle as unknown as CrosswordProps['data']}
        progress={progressArray}
        gridBackgroundColor="#1A1A1D"
        gridForegroundColor="#fce7f3"
        gridTextColor="#333333"
        textColor="#ffffff"
        focusColor="#A64D79"
        selectedBackgroundColor="#6A1E55"
        connectedBackgroundColor="#3B1C32"
      />
    </div>
  );
}
