'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import CrosswordGame from '@/components/CrosswordGame';
import PuzzleSelector from '@/components/PuzzleSelector';
import LoginScreen from '@/components/LoginScreen';
import { Confetti, type ConfettiRef } from '@/components/ui/confetti';
import { isAuthenticated } from '@/lib/auth';
import { apiClient } from '@/lib/api';
import type { CAPICrossword } from '@/types/crossword';

export default function Home() {
  const [currentPuzzle, setCurrentPuzzle] = useState<CAPICrossword | null>(null);
  const [progress, setProgress] = useState<Record<string, string> | undefined>(undefined);
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const confettiRef = useRef<ConfettiRef>(null);

  useEffect(() => {
    setMounted(true);
    setIsLoggedIn(isAuthenticated());
  }, []);

  const loadPuzzle = useCallback(async (puzzleId?: string) => {
    setLoading(true);
    setError(null);
    try {
      let puzzle: CAPICrossword & { progress?: Record<string, string> };
      if (puzzleId) {
        puzzle = await apiClient.getPuzzle(puzzleId);
      } else {
        puzzle = await apiClient.getNextPuzzle();
      }
      setCurrentPuzzle(puzzle);
      setProgress(puzzle.progress);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load puzzle');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mounted && isLoggedIn) {
      loadPuzzle();
    } else if (mounted && !isLoggedIn) {
      setLoading(false);
    }
  }, [mounted, isLoggedIn, loadPuzzle]);

  const handleNewPuzzle = async () => {
    setLoading(true);
    setError(null);
    try {
      const puzzle = await apiClient.getNextPuzzle();
      setCurrentPuzzle(puzzle);
      setProgress(puzzle.progress);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load puzzle');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPuzzle = (puzzleId: string) => {
    loadPuzzle(puzzleId);
  };

  const handleProgressChange = useCallback(
    async (cells: Record<string, string>) => {
      if (!currentPuzzle) return;
      setProgress(cells);
      try {
        await apiClient.updateProgress(currentPuzzle.id, cells);
      } catch {
        // Silent fail - progress will sync on next load
      }
    },
    [currentPuzzle]
  );

  const handlePuzzleComplete = useCallback(async () => {
    if (!currentPuzzle) return;

    // Fire confetti celebration
    confettiRef.current?.fire({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
    });

    // Mark puzzle as complete on backend
    try {
      await apiClient.completePuzzle(currentPuzzle.id);
    } catch {
      // Silent fail
    }
  }, [currentPuzzle]);

  if (!mounted) {
    return null;
  }

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  if (loading) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center p-4 safe-area-top safe-area-bottom border-8 border-[#3B1C32]">
        <div className="loader" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center p-4 safe-area-top safe-area-bottom border-8 border-[#3B1C32]">
        <div className="text-center">
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={() => loadPuzzle()}
            className="px-6 py-3 bg-[#6A1E55] text-white font-medium rounded-lg hover:bg-[#A64D79]"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (!currentPuzzle) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center p-4 safe-area-top safe-area-bottom border-8 border-[#3B1C32]">
        <div className="text-pink-200">No puzzle available</div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh flex flex-col items-center p-2 safe-area-top safe-area-bottom border-8 border-[#3B1C32] relative">
      <Confetti
        ref={confettiRef}
        className="absolute inset-0 z-50 pointer-events-none"
        manualstart
      />
      <div className="w-full max-w-lg flex flex-col items-center">
        <header className="text-center py-4">
          <h1 className="text-2xl font-bold text-pink-200">Cinnabear Crossword</h1>
        </header>

        <PuzzleSelector
          currentPuzzleName={currentPuzzle.name}
          onNewPuzzle={handleNewPuzzle}
          onSelectPuzzle={handleSelectPuzzle}
        />

        <div className="flex-1 overflow-auto w-full">
          <CrosswordGame
            key={currentPuzzle.id}
            puzzle={currentPuzzle}
            progress={progress}
            onProgressChange={handleProgressChange}
            onComplete={handlePuzzleComplete}
          />
        </div>
      </div>
    </main>
  );
}
