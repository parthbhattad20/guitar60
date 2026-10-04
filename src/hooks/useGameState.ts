import { useCallback, useMemo, useState } from 'react';
import type { GameState } from '../types';

const initialState: GameState = {
  xp: 0,
  level: 1,
  streak: 0,
  completedSteps: new Set(),
  earnedBadges: new Set(),
  chordsPracticed: new Set(),
  barreChordsPracticed: new Set(),
  fingerstylePatternsPracticed: new Set(),
  highestBpm: 0,
  totalRetries: 0,
  exercisesCompleted: 0,
};

export function useGameState() {
  const [state, setState] = useState<GameState>(initialState);
  const [lastXpGain, setLastXpGain] = useState<number | null>(null);

  const addXp = useCallback((amount: number) => {
    setState((prev) => {
      const xp = prev.xp + amount;
      return { ...prev, xp, level: Math.floor(xp / 150) + 1 };
    });
    setLastXpGain(amount);
    window.setTimeout(() => setLastXpGain(null), 900);
  }, []);

  const bumpStreak = useCallback(() => {
    setState((prev) => ({ ...prev, streak: prev.streak + 1 }));
  }, []);

  const resetStreak = useCallback(() => {
    setState((prev) => ({ ...prev, streak: 0 }));
  }, []);

  const markChordPracticed = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      chordsPracticed: new Set(prev.chordsPracticed).add(id),
    }));
  }, []);

  const markBarreChordPracticed = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      barreChordsPracticed: new Set(prev.barreChordsPracticed).add(id),
    }));
  }, []);

  const markFingerstylePracticed = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      fingerstylePatternsPracticed: new Set(prev.fingerstylePatternsPracticed).add(id),
    }));
  }, []);

  const setHighestBpm = useCallback((bpm: number) => {
    setState((prev) => ({ ...prev, highestBpm: Math.max(prev.highestBpm, bpm) }));
  }, []);

  const addRetry = useCallback(() => {
    setState((prev) => ({ ...prev, totalRetries: prev.totalRetries + 1 }));
  }, []);

  const completeExercise = useCallback(() => {
    setState((prev) => ({ ...prev, exercisesCompleted: prev.exercisesCompleted + 1 }));
  }, []);

  const awardBadge = useCallback((id: string) => {
    setState((prev) => {
      if (prev.earnedBadges.has(id)) return prev;
      return { ...prev, earnedBadges: new Set(prev.earnedBadges).add(id) };
    });
  }, []);

  const markStepComplete = useCallback((id: string) => {
    setState((prev) => {
      if (prev.completedSteps.has(id)) return prev;
      return { ...prev, completedSteps: new Set(prev.completedSteps).add(id) };
    });
  }, []);

  const reset = useCallback(() => setState(initialState), []);

  const actions = useMemo(
    () => ({
      addXp,
      bumpStreak,
      resetStreak,
      markChordPracticed,
      markBarreChordPracticed,
      markFingerstylePracticed,
      setHighestBpm,
      addRetry,
      completeExercise,
      awardBadge,
      markStepComplete,
      reset,
    }),
    [
      addXp,
      bumpStreak,
      resetStreak,
      markChordPracticed,
      markBarreChordPracticed,
      markFingerstylePracticed,
      setHighestBpm,
      addRetry,
      completeExercise,
      awardBadge,
      markStepComplete,
      reset,
    ],
  );

  return { state, actions, lastXpGain };
}

export type GameActions = ReturnType<typeof useGameState>['actions'];
