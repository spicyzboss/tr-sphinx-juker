export type ComparisonResult = 'higher' | 'lower' | 'correct';

export interface BinarySearchState {
  low: number;
  high: number;
  currentGuess: number | null;
  isComplete: boolean;
  attempts: number;
}

export interface BinarySearchConfig {
  low: number;
  high: number;
}

export function createBinarySearch(config: BinarySearchConfig): BinarySearchState {
  if (config.low >= config.high) {
    throw new Error('low must be less than high');
  }
  return {
    low: config.low,
    high: config.high,
    currentGuess: null,
    isComplete: false,
    attempts: 0,
  };
}

export function nextGuess(state: BinarySearchState): BinarySearchState {
  if (state.isComplete) {
    return state;
  }

  const mid = Math.floor((state.low + state.high) / 2);

  return {
    ...state,
    currentGuess: mid,
    attempts: state.attempts + 1,
  };
}

export function narrowRange(
  state: BinarySearchState,
  result: ComparisonResult
): BinarySearchState {
  if (state.isComplete) {
    return state;
  }

  if (result === 'correct') {
    return {
      ...state,
      isComplete: true,
    };
  }

  if (result === 'higher') {
    if (state.currentGuess === null) {
      throw new Error('No current guess to compare against');
    }
    return {
      ...state,
      low: state.currentGuess + 1,
    };
  }

  if (result === 'lower') {
    if (state.currentGuess === null) {
      throw new Error('No current guess to compare against');
    }
    return {
      ...state,
      high: state.currentGuess - 1,
    };
  }

  throw new Error(`Invalid comparison result: ${result}`);
}

export function reset(_state: BinarySearchState, config: BinarySearchConfig): BinarySearchState {
  return createBinarySearch(config);
}