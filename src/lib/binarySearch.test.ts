import { describe, it, expect } from 'vitest';
import {
  createBinarySearch,
  nextGuess,
  narrowRange,
  reset,
  type BinarySearchState,
  type ComparisonResult,
} from './binarySearch';

describe('createBinarySearch', () => {
  it('should create initial state with correct bounds', () => {
    const state = createBinarySearch({ low: 1, high: 100 });
    expect(state.low).toBe(1);
    expect(state.high).toBe(100);
    expect(state.currentGuess).toBe(null);
    expect(state.isComplete).toBe(false);
    expect(state.attempts).toBe(0);
  });

  it('should throw if low >= high', () => {
    expect(() => createBinarySearch({ low: 100, high: 100 })).toThrow();
    expect(() => createBinarySearch({ low: 100, high: 50 })).toThrow();
  });
});

describe('nextGuess', () => {
  it('should calculate midpoint as first guess', () => {
    const state = createBinarySearch({ low: 1, high: 100 });
    const afterGuess = nextGuess(state);
    expect(afterGuess.currentGuess).toBe(50);
    expect(afterGuess.attempts).toBe(1);
  });

  it('should return same state when complete', () => {
    const state: BinarySearchState = {
      low: 1,
      high: 100,
      currentGuess: 50,
      isComplete: true,
      attempts: 1,
    };
    const result = nextGuess(state);
    expect(result.isComplete).toBe(true);
  });
});

describe('narrowRange', () => {
  it('should narrow to upper half when result is "higher"', () => {
    const state: BinarySearchState = {
      low: 1,
      high: 100,
      currentGuess: 50,
      isComplete: false,
      attempts: 1,
    };
    const narrowed = narrowRange(state, 'higher');
    expect(narrowed.low).toBe(51);
    expect(narrowed.high).toBe(100);
    expect(narrowed.isComplete).toBe(false);
  });

  it('should narrow to lower half when result is "lower"', () => {
    const state: BinarySearchState = {
      low: 1,
      high: 100,
      currentGuess: 50,
      isComplete: false,
      attempts: 1,
    };
    const narrowed = narrowRange(state, 'lower');
    expect(narrowed.low).toBe(1);
    expect(narrowed.high).toBe(49);
  });

  it('should mark as complete when result is "correct"', () => {
    const state: BinarySearchState = {
      low: 1,
      high: 100,
      currentGuess: 50,
      isComplete: false,
      attempts: 1,
    };
    const narrowed = narrowRange(state, 'correct');
    expect(narrowed.isComplete).toBe(true);
  });

  it('should throw when narrowing without a guess', () => {
    const state: BinarySearchState = {
      low: 1,
      high: 100,
      currentGuess: null,
      isComplete: false,
      attempts: 0,
    };
    expect(() => narrowRange(state, 'higher')).toThrow();
  });
});

describe('full game simulation', () => {
  it('should find number 42 in range 1-100', () => {
    const secretNumber = 42;
    let state = createBinarySearch({ low: 1, high: 100 });

    const compare = (guess: number): ComparisonResult => {
      if (guess === secretNumber) return 'correct';
      if (guess < secretNumber) return 'higher';
      return 'lower';
    };

    while (!state.isComplete) {
      state = nextGuess(state);
      state = narrowRange(state, compare(state.currentGuess!));
    }

    expect(state.currentGuess).toBe(42);
    expect(state.attempts).toBeLessThanOrEqual(7);
  });

  it('should find number 1 in range 1-100', () => {
    const secretNumber = 1;
    let state = createBinarySearch({ low: 1, high: 100 });

    const compare = (guess: number): ComparisonResult => {
      if (guess === secretNumber) return 'correct';
      if (guess < secretNumber) return 'higher';
      return 'lower';
    };

    while (!state.isComplete) {
      state = nextGuess(state);
      state = narrowRange(state, compare(state.currentGuess!));
    }

    expect(state.currentGuess).toBe(1);
  });

  it('should find number 9999 in range 5000-9999', () => {
    const secretNumber = 9999;
    let state = createBinarySearch({ low: 5000, high: 9999 });

    const compare = (guess: number): ComparisonResult => {
      if (guess === secretNumber) return 'correct';
      if (guess < secretNumber) return 'higher';
      return 'lower';
    };

    while (!state.isComplete) {
      state = nextGuess(state);
      state = narrowRange(state, compare(state.currentGuess!));
    }

    expect(state.currentGuess).toBe(9999);
  });
});

describe('reset', () => {
  it('should reset state to new config', () => {
    const state: BinarySearchState = {
      low: 1,
      high: 100,
      currentGuess: 50,
      isComplete: true,
      attempts: 5,
    };
    const resetState = reset(state, { low: 200, high: 500 });
    expect(resetState.low).toBe(200);
    expect(resetState.high).toBe(500);
    expect(resetState.isComplete).toBe(false);
    expect(resetState.attempts).toBe(0);
  });
});