import { useState } from 'react';
import {
  createBinarySearch,
  nextGuess,
  narrowRange,
  type BinarySearchState,
  type ComparisonResult,
} from './lib/binarySearch';

function App() {
  const [rangeSet, setRangeSet] = useState(false);
  const [low, setLow] = useState(1);
  const [high, setHigh] = useState(9999);
  const [state, setState] = useState<BinarySearchState | null>(null);

  const handleStart = () => {
    if (low >= high) return;
    let newState = createBinarySearch({ low, high });
    newState = nextGuess(newState);
    setState(newState);
    setRangeSet(true);
  };

  const handleResponse = (result: ComparisonResult) => {
    if (!state) return;
    const newState = narrowRange(state, result);
    if (newState.isComplete) {
      setState(newState);
    } else {
      setState(nextGuess(newState));
    }
  };

  const handleReset = () => {
    setRangeSet(false);
    setState(null);
  };

  if (!rangeSet) {
    return (
      <section id="center" className="flex flex-col items-center justify-center grow gap-8 p-8">
        <h1 className="text-5xl font-medium text-[var(--text-h)] m-0">TalesRunner Sphinx Juker</h1>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-base">
            Low:
            <input
              type="number"
              className="w-24 p-2 text-base rounded-md border-2 border-[var(--border)] bg-[var(--social-bg)] text-[var(--text)]"
              value={low}
              onChange={(e) => setLow(Number(e.target.value))}
            />
          </label>
          <label className="flex items-center gap-2 text-base">
            High:
            <input
              type="number"
              className="w-24 p-2 text-base rounded-md border-2 border-[var(--border)] bg-[var(--social-bg)] text-[var(--text)]"
              value={high}
              onChange={(e) => setHigh(Number(e.target.value))}
            />
          </label>
        </div>
        <button
          type="button"
          className="px-4 py-2 text-base rounded-md bg-[var(--accent-bg)] text-[var(--accent)] border-2 border-transparent hover:border-[var(--accent-border)] disabled:opacity-50"
          onClick={handleStart}
          disabled={low >= high}
        >
          Start Game
        </button>
      </section>
    );
  }

  if (!state) return null;

  if (state.isComplete) {
    return (
      <section id="center" className="flex flex-col items-center justify-center grow gap-8 p-8">
        <h1 className="text-5xl font-medium text-[var(--text-h)] m-0">The number is</h1>
        <p className="text-4xl font-bold text-[var(--accent)] m-0">{state.currentGuess}</p>
        <p className="text-sm text-[var(--text)]">Attempts: {state.attempts}</p>
        <button
          type="button"
          className="px-4 py-2 text-base rounded-md bg-[var(--accent-bg)] text-[var(--accent)] border-2 border-transparent hover:border-[var(--accent-border)]"
          onClick={handleReset}
        >
          Play Again
        </button>
      </section>
    );
  }

  return (
    <section id="center" className="flex flex-col items-center justify-center grow gap-6 p-8">
      <p className="text-sm text-[var(--text)]">Range: {state.low} - {state.high}</p>
      <p className="text-base text-[var(--text)]">Your guess:</p>
      <input
        type="number"
        className="w-48 p-4 text-4xl text-center rounded-lg border-2 border-[var(--accent-border)] bg-[var(--social-bg)] text-[var(--accent)]"
        value={state.currentGuess ?? ''}
        onChange={(e) => {
          const val = Number(e.target.value);
          if (!isNaN(val)) {
            setState((prev) =>
              prev ? { ...prev, currentGuess: val } : null
            );
          }
        }}
      />
      <p className="text-base text-[var(--text)]">Is your number higher or lower?</p>
      <div className="flex gap-3">
        <button
          type="button"
          className="px-6 py-3 text-lg rounded-lg bg-[var(--accent-bg)] text-[var(--accent)] border-2 border-[var(--accent-border)] hover:bg-[var(--accent)] hover:text-[var(--accent-bg)] transition-colors"
          onClick={() => handleResponse('higher')}
        >
          Higher
        </button>
        <button
          type="button"
          className="px-6 py-3 text-lg rounded-lg bg-[var(--accent-bg)] text-[var(--accent)] border-2 border-[var(--accent-border)] hover:bg-[var(--accent)] hover:text-[var(--accent-bg)] transition-colors"
          onClick={() => handleResponse('correct')}
        >
          Correct!
        </button>
        <button
          type="button"
          className="px-6 py-3 text-lg rounded-lg bg-[var(--accent-bg)] text-[var(--accent)] border-2 border-[var(--accent-border)] hover:bg-[var(--accent)] hover:text-[var(--accent-bg)] transition-colors"
          onClick={() => handleResponse('lower')}
        >
          Lower
        </button>
      </div>
      <p className="text-sm text-[var(--text)]">Attempts: {state.attempts}</p>
    </section>
  );
}

export default App;