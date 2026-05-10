import { useState } from 'react';
import {
  createBinarySearch,
  nextGuess,
  narrowRange,
  type BinarySearchState,
  type ComparisonResult,
} from './lib/binarySearch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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
      <main
        id="center"
        className="flex flex-col items-center justify-center grow gap-8 p-8"
        aria-label="Game setup"
      >
        <h1 className="text-5xl font-medium text-[var(--text-h)] m-0">
          TalesRunner Sphinx Juker
        </h1>
        <Card className="w-auto">
          <CardHeader>
            <CardTitle className="text-center">Set Your Range</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex gap-4">
              <Label htmlFor="input-low">Low:</Label>
              <Input
                id="input-low"
                type="number"
                value={low}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLow(Number(e.target.value))}
                aria-describedby="low-desc"
              />
            </div>
            <div className="flex gap-4">
              <Label htmlFor="input-high">High:</Label>
              <Input
                id="input-high"
                type="number"
                value={high}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHigh(Number(e.target.value))}
                aria-describedby="high-desc"
              />
            </div>
            <Button onClick={handleStart} disabled={low >= high}>
              Start Game
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!state) return null;

  if (state.isComplete) {
    return (
      <main
        id="center"
        className="flex flex-col items-center justify-center grow gap-8 p-8"
        aria-label="Game complete"
      >
        <h1 className="text-5xl font-medium text-[var(--text-h)] m-0">
          The number is
        </h1>
        <p className="text-4xl font-bold text-[var(--accent)] m-0" aria-live="polite">
          {state.currentGuess}
        </p>
        <p className="text-sm text-[var(--text)]">Attempts: {state.attempts}</p>
        <Button onClick={handleReset}>Play Again</Button>
      </main>
    );
  }

  return (
    <main
      id="center"
      className="flex flex-col items-center justify-center grow gap-6 p-8"
      aria-label="Game in progress"
    >
      <p className="text-sm text-[var(--text)]" aria-live="polite">
        Range: {state.low} - {state.high}
      </p>
      <Card className="w-auto">
        <CardHeader>
          <CardTitle>Your guess:</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 items-center">
          <Input
            type="number"
            className="w-48 text-center text-2xl"
            value={state.currentGuess ?? ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const val = Number(e.target.value);
              if (!isNaN(val)) {
                setState((prev) =>
                  prev ? { ...prev, currentGuess: val } : null
                );
              }
            }}
            aria-label="Current guess"
          />
          <p className="text-base text-[var(--text-h)]">Is your number higher or lower?</p>
          <div className="flex gap-3" role="group" aria-label="Response buttons">
            <Button onClick={() => handleResponse('higher')}>Higher</Button>
            <Button onClick={() => handleResponse('correct')} variant="default">
              Correct!
            </Button>
            <Button onClick={() => handleResponse('lower')}>Lower</Button>
          </div>
          <p className="text-sm text-[var(--text)]" aria-live="polite">
            Attempts: {state.attempts}
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

export default App;