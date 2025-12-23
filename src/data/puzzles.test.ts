import { describe, it, expect } from 'vitest';
import { puzzles, getRandomPuzzle, getPuzzleById } from './puzzles';

describe('puzzles data', () => {
  it('should have at least one puzzle', () => {
    expect(puzzles.length).toBeGreaterThan(0);
  });

  it('each puzzle should have required fields', () => {
    puzzles.forEach((puzzle) => {
      expect(puzzle.id).toBeDefined();
      expect(puzzle.name).toBeDefined();
      expect(puzzle.dimensions).toBeDefined();
      expect(puzzle.dimensions.cols).toBeGreaterThan(0);
      expect(puzzle.dimensions.rows).toBeGreaterThan(0);
      expect(puzzle.entries.length).toBeGreaterThan(0);
    });
  });

  it('each entry should have required fields', () => {
    puzzles.forEach((puzzle) => {
      puzzle.entries.forEach((entry) => {
        expect(entry.id).toBeDefined();
        expect(entry.clue).toBeDefined();
        expect(entry.direction).toMatch(/^(across|down)$/);
        expect(entry.length).toBeGreaterThan(0);
        expect(entry.position).toBeDefined();
        expect(entry.position.x).toBeGreaterThanOrEqual(0);
        expect(entry.position.y).toBeGreaterThanOrEqual(0);
      });
    });
  });
});

describe('getRandomPuzzle', () => {
  it('should return a valid puzzle', () => {
    const puzzle = getRandomPuzzle();
    expect(puzzle).toBeDefined();
    expect(puzzle.id).toBeDefined();
    expect(puzzles).toContainEqual(puzzle);
  });
});

describe('getPuzzleById', () => {
  it('should return the correct puzzle when id exists', () => {
    const firstPuzzle = puzzles[0];
    const found = getPuzzleById(firstPuzzle.id);
    expect(found).toEqual(firstPuzzle);
  });

  it('should return undefined for non-existent id', () => {
    const found = getPuzzleById('non-existent-id');
    expect(found).toBeUndefined();
  });
});
