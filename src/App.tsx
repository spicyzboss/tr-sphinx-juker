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

  const handleGuessChange = (value: number) => {
    if (!state) return;
    setState({ ...state, currentGuess: value });
  };

  const handleReset = () => {
    setRangeSet(false);
    setState(null);
  };

  if (!rangeSet) {
    return (
      <main className="flex flex-col items-center justify-center grow gap-8 p-8">
        <h1 className="text-5xl font-medium text-foreground">
          TalesRunner Sphinx Juker
        </h1>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Set Your Range</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="input-low">Low</Label>
              <Input
                id="input-low"
                type="number"
                value={low}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLow(Number(e.target.value))}
              />
            </div>
            <div className="flex items-center gap-4">
              <Label htmlFor="input-high">High</Label>
              <Input
                id="input-high"
                type="number"
                value={high}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHigh(Number(e.target.value))}
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
      <main className="flex flex-col items-center justify-center grow gap-6 p-8">
        <h1 className="text-4xl font-medium text-foreground">
          Your number is
        </h1>
        <p className="text-6xl font-bold text-accent">
          {state.currentGuess}
        </p>
        <p className="text-sm text-muted-foreground">
          Found in {state.attempts} attempt{state.attempts !== 1 ? 's' : ''}
        </p>
        <Button onClick={handleReset}>Play Again</Button>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center grow gap-6 p-8">
      <p className="text-sm text-muted-foreground">
        Range: {state.low} - {state.high}
      </p>

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>My guess</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <p className="text-8xl font-bold text-accent">
            <Input
              type="number"
              className="w-64 text-center h-28"
              style={{ fontSize: '4rem' }}
              value={state.currentGuess ?? ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleGuessChange(Number(e.target.value))
              }
              min={state.low ?? undefined}
              max={state.high ?? undefined}
            />
          </p>
          <p className="text-sm text-muted-foreground">
            Is your number higher or lower?
          </p>
          <div className="flex gap-3" role="group">
            <Button
              onClick={() => handleResponse('lower')}
              variant="outline"
              disabled={state.currentGuess !== null && state.currentGuess <= state.low}
            >
              Lower
            </Button>
            <Button onClick={() => handleResponse('correct')}>
              Correct!
            </Button>
            <Button
              onClick={() => handleResponse('higher')}
              variant="outline"
              disabled={state.currentGuess !== null && state.currentGuess >= state.high}
            >
              Higher
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Attempt {state.attempts}
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

export default App;