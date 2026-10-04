import { useState } from 'react';
import ModeNavBar from './components/ModeNavBar';
import HomeScreen from './components/HomeScreen';
import SessionMode from './components/SessionMode';
import TheoryMode from './components/TheoryMode';
import QuickPracticeHub from './components/QuickPracticeHub';
import { useGameState } from './hooks/useGameState';
import type { AppMode } from './types';

export default function App() {
  const [mode, setMode] = useState<AppMode>('home');
  const { state, actions, lastXpGain } = useGameState();

  return (
    <div className="min-h-screen flex flex-col bg-stage">
      <ModeNavBar mode={mode} onSelect={setMode} xp={state.xp} level={state.level} />

      {mode === 'home' && <HomeScreen state={state} onSelect={setMode} />}

      {mode === 'session' && (
        <SessionMode state={state} actions={actions} lastXpGain={lastXpGain} onExit={() => setMode('home')} />
      )}

      {mode === 'theory' && (
        <TheoryMode xp={state.xp} level={state.level} onXp={actions.addXp} onExit={() => setMode('home')} />
      )}

      {mode === 'quick-practice' && (
        <QuickPracticeHub
          xp={state.xp}
          level={state.level}
          onXp={actions.addXp}
          onChordPracticed={actions.markChordPracticed}
          onExit={() => setMode('home')}
        />
      )}
    </div>
  );
}
