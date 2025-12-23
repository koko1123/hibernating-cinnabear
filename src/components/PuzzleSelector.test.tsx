import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PuzzleSelector from './PuzzleSelector';

describe('PuzzleSelector', () => {
  it('renders the current puzzle name', () => {
    render(
      <PuzzleSelector
        currentPuzzleId="puzzle-1"
        onSelectPuzzle={() => {}}
      />
    );

    expect(screen.getByText('Quick Crossword 1')).toBeInTheDocument();
  });

  it('renders the New Puzzle button', () => {
    render(
      <PuzzleSelector
        currentPuzzleId="puzzle-1"
        onSelectPuzzle={() => {}}
      />
    );

    expect(screen.getByRole('button', { name: /new puzzle/i })).toBeInTheDocument();
  });

  it('calls onSelectPuzzle when New Puzzle button is clicked', () => {
    const onSelectPuzzle = vi.fn();
    render(
      <PuzzleSelector
        currentPuzzleId="puzzle-1"
        onSelectPuzzle={onSelectPuzzle}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /new puzzle/i }));

    expect(onSelectPuzzle).toHaveBeenCalled();
  });

  it('selects a different puzzle than the current one', () => {
    const onSelectPuzzle = vi.fn();
    render(
      <PuzzleSelector
        currentPuzzleId="puzzle-1"
        onSelectPuzzle={onSelectPuzzle}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /new puzzle/i }));

    const selectedPuzzleId = onSelectPuzzle.mock.calls[0][0];
    expect(selectedPuzzleId).not.toBe('puzzle-1');
  });
});
