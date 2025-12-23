import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PuzzleSelector from './PuzzleSelector';

describe('PuzzleSelector', () => {
  it('renders the current puzzle name', () => {
    render(
      <PuzzleSelector
        currentPuzzleName="Quick Crossword 1"
        onNewPuzzle={() => {}}
        onSelectPuzzle={() => {}}
      />
    );

    expect(screen.getByText('Quick Crossword 1')).toBeInTheDocument();
  });

  it('renders fallback when no puzzle name provided', () => {
    render(
      <PuzzleSelector
        currentPuzzleName=""
        onNewPuzzle={() => {}}
        onSelectPuzzle={() => {}}
      />
    );

    expect(screen.getByText('Crossword')).toBeInTheDocument();
  });

  it('renders the New Puzzle button', () => {
    render(
      <PuzzleSelector
        currentPuzzleName="Quick Crossword 1"
        onNewPuzzle={() => {}}
        onSelectPuzzle={() => {}}
      />
    );

    expect(screen.getByRole('button', { name: /new puzzle/i })).toBeInTheDocument();
  });

  it('renders the History button', () => {
    render(
      <PuzzleSelector
        currentPuzzleName="Quick Crossword 1"
        onNewPuzzle={() => {}}
        onSelectPuzzle={() => {}}
      />
    );

    expect(screen.getByRole('button', { name: /history/i })).toBeInTheDocument();
  });

  it('calls onNewPuzzle when New Puzzle button is clicked', () => {
    const onNewPuzzle = vi.fn();
    render(
      <PuzzleSelector
        currentPuzzleName="Quick Crossword 1"
        onNewPuzzle={onNewPuzzle}
        onSelectPuzzle={() => {}}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /new puzzle/i }));

    expect(onNewPuzzle).toHaveBeenCalled();
  });
});
