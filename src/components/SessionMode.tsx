import { useCallback, useEffect, useState } from 'react';
import TopBar from './TopBar';
import BottomControls from './BottomControls';
import ChordDiagram from './ChordDiagram';
import StringCheckExercise from './StringCheckExercise';
import ChordChangeExercise from './ChordChangeExercise';
import StrummingTrainer from './StrummingTrainer';
import BarreShapeViewer from './BarreShapeViewer';
import BarreChallengeGame from './BarreChallengeGame';
import FingerstyleTrainer from './FingerstyleTrainer';
import FinalChallenge from './FinalChallenge';
import CountdownExercise from './CountdownExercise';
import CompletionScreen from './CompletionScreen';
import { LESSON_STEPS, SECTION_NAMES } from '../data/lessons';
import { useLessonTimer } from '../hooks/useLessonTimer';
import type { GameActions } from '../hooks/useGameState';
import type { GameState, LessonStep } from '../types';

const TOTAL_SESSION_SECONDS = 3600;

const SECTION_BADGE: Record<string, string> = {
  'Open Chord Mastery': 'open-chord-starter',
  'Clean Chord Changes': 'clean-changer',
  'Strumming Training': 'rhythm-keeper',
  'Barre Chord Fundamentals': 'barre-beginner',
  'Barre Chord Practice Game': 'barre-builder',
  Fingerstyle: 'fingerstyle-starter',
};

const SHAPE_EXPLANATIONS: Record<string, string> = {
  'E-major':
    'E-shape major barre chords root on the thick 6th string. The open E major shape slides up the neck intact.',
  'E-minor':
    'E-shape minor barre chords also root on the 6th string, but use the simpler open-Em shape with fewer fretted notes.',
  'A-major':
    'A-shape major barre chords root on the 5th string. The 6th string is deliberately muted.',
  'A-minor':
    'A-shape minor barre chords root on the 5th string, using the open-Am shape as the template.',
};

function getMainStepIndex(steps: LessonStep[], i: number) {
  return Math.max(0, Math.min(i, steps.length - 1));
}

interface Props {
  state: GameState;
  actions: GameActions;
  lastXpGain: number | null;
  onExit: () => void;
}

export default function SessionMode({ state, actions, lastXpGain, onExit }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [restartTick, setRestartTick] = useState(0);
  const [markedComplete, setMarkedComplete] = useState<Set<string>>(new Set());

  const { remaining, reset: resetTimer } = useLessonTimer(TOTAL_SESSION_SECONDS, paused);

  const step = LESSON_STEPS[getMainStepIndex(LESSON_STEPS, currentIndex)];
  const isComplete = step.type === 'complete';
  const isLast = currentIndex === LESSON_STEPS.length - 2;

  const percentComplete = (currentIndex / (LESSON_STEPS.length - 1)) * 100;

  const handleXp = useCallback((amount: number) => actions.addXp(amount), [actions]);

  const goTo = useCallback(
    (nextIndex: number) => {
      const clamped = Math.max(0, Math.min(nextIndex, LESSON_STEPS.length - 1));
      const leaving = LESSON_STEPS[currentIndex];
      if (clamped > currentIndex) {
        actions.markStepComplete(leaving.id);
        if (leaving.xpReward) actions.addXp(leaving.xpReward);
        actions.bumpStreak();
        if (leaving.chord && leaving.type === 'chord') actions.markChordPracticed(leaving.chord.id);
        if (leaving.type === 'barre' && leaving.chord?.isBarre) actions.markBarreChordPracticed(leaving.chord.id);
        if (leaving.type === 'barre-game') leaving.chords?.forEach((c) => actions.markBarreChordPracticed(c.id));
        if (leaving.type === 'fingerstyle' && leaving.fingerstylePattern) {
          actions.markFingerstylePracticed(leaving.fingerstylePattern.id);
        }
        if (leaving.bpm) actions.setHighestBpm(leaving.bpm);
        const nextSection = LESSON_STEPS[clamped]?.section;
        if (nextSection !== leaving.section) {
          const badge = SECTION_BADGE[leaving.section];
          if (badge) actions.awardBadge(badge);
        }
        if (LESSON_STEPS[clamped]?.type === 'complete') {
          actions.awardBadge('60-minute-guitarist');
        }
        actions.completeExercise();
      }
      setCurrentIndex(clamped);
      setRestartTick((t) => t + 1);
    },
    [actions, currentIndex],
  );

  const handleNext = useCallback(() => goTo(currentIndex + 1), [goTo, currentIndex]);
  const handleBack = useCallback(() => goTo(currentIndex - 1), [goTo, currentIndex]);
  const handleRestartStep = useCallback(() => setRestartTick((t) => t + 1), []);
  const handlePauseToggle = useCallback(() => setPaused((p) => !p), []);

  const handleRestartSession = useCallback(() => {
    actions.reset();
    setCurrentIndex(0);
    setPaused(false);
    setMarkedComplete(new Set());
    resetTimer();
  }, [actions, resetTimer]);

  const handleFocusBarre = useCallback(() => {
    const barreStart = LESSON_STEPS.findIndex((s) => s.section === 'Barre Chord Fundamentals');
    actions.reset();
    setPaused(false);
    resetTimer();
    setCurrentIndex(barreStart >= 0 ? barreStart : 0);
  }, [actions, resetTimer]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === 'Space') {
        e.preventDefault();
        handlePauseToggle();
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handleBack();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handlePauseToggle, handleNext, handleBack]);

  const markComplete = (id: string) => setMarkedComplete((prev) => new Set(prev).add(id));

  const bodyKey = `${step.id}-${restartTick}`;

  function renderMain() {
    switch (step.type) {
      case 'lesson':
        return (
          <div className="flex flex-col items-center gap-6">
            {step.chord && (
              <ChordDiagram
                chordName={step.chord.name}
                frets={step.chord.frets}
                fingers={step.chord.fingers}
                rootString={step.chord.rootString}
                size="lg"
                showLegend
              />
            )}
            <InstructionList items={step.instructions} />
          </div>
        );

      case 'chord':
        return (
          <div className="flex flex-col items-center gap-6">
            {step.chord && (
              <ChordDiagram
                chordName={step.chord.name}
                frets={step.chord.frets}
                fingers={step.chord.fingers}
                startFret={step.chord.startFret}
                rootString={step.chord.rootString}
                barre={step.chord.barre}
                size="lg"
                showLegend
              />
            )}
            <InstructionList items={step.instructions} ordered />
          </div>
        );

      case 'exercise':
        if (step.title.includes('String Check') && step.chord) {
          return <StringCheckExercise chord={step.chord} onAllClean={() => handleXp(10)} />;
        }
        return (
          <div className="flex flex-col items-center gap-6">
            <InstructionList items={step.instructions} />
            {step.title === 'Warm-up Complete' && (
              <button
                onClick={() => {
                  markComplete(step.id);
                  handleXp(20);
                }}
                className="px-6 py-3 rounded-xl bg-good text-[#06240f] font-black hover:brightness-110 transition"
              >
                {markedComplete.has(step.id) ? '✓ Marked Complete' : 'Mark Complete'}
              </button>
            )}
          </div>
        );

      case 'timer':
        return (
          <div className="flex flex-col items-center gap-6">
            <InstructionList items={step.instructions} />
            <CountdownExercise seconds={step.durationSeconds} onDone={() => handleXp(15)} />
          </div>
        );

      case 'change':
        if (!step.chords || step.chords.length < 2) return null;
        return (
          <div className="flex flex-col items-center gap-6 w-full">
            <InstructionList items={step.instructions} />
            <ChordChangeExercise
              from={step.chords[0]}
              to={step.chords[1]}
              initialBpm={step.bpm}
              onRoundComplete={(pts) => handleXp(pts)}
              onBpmChange={(b) => actions.setHighestBpm(b)}
            />
          </div>
        );

      case 'strum':
        if (!step.pattern || !step.chords) return null;
        return (
          <div className="flex flex-col items-center gap-6 w-full">
            <InstructionList items={step.instructions} />
            <StrummingTrainer
              pattern={step.pattern}
              chords={step.chords}
              initialBpm={step.bpm}
              onPractice={() => handleXp(20)}
              onBpmChange={(b) => actions.setHighestBpm(b)}
            />
          </div>
        );

      case 'barre': {
        const shapeLabels: Record<string, string> = {
          'E-major': 'E-shape',
          'E-minor': 'E-shape minor',
          'A-major': 'A-shape',
          'A-minor': 'A-shape minor',
        };
        const shapesVary = step.chords && new Set(step.chords.map((c) => c.shape)).size > 1;
        const options = step.chords
          ? step.chords.map((c) => ({
              label: shapesVary && c.shape ? `${shapeLabels[c.shape]} (${c.name})` : c.name,
              chord: c,
            }))
          : step.chord
          ? [{ label: step.chord.name, chord: step.chord }]
          : [];
        return (
          <div className="flex flex-col items-center gap-6 w-full">
            <InstructionList items={step.instructions} />
            {options.length > 0 && (
              <BarreShapeViewer options={options} shapeExplanation={SHAPE_EXPLANATIONS} />
            )}
          </div>
        );
      }

      case 'barre-game':
        if (!step.chords) return null;
        return (
          <BarreChallengeGame
            chords={step.chords}
            initialBpm={step.bpm}
            onXp={handleXp}
            onRetry={() => {
              actions.addRetry();
              actions.resetStreak();
            }}
            onBpmChange={(b) => actions.setHighestBpm(b)}
            onChordPracticed={(id) => actions.markBarreChordPracticed(id)}
          />
        );

      case 'fingerstyle':
        if (!step.fingerstylePattern || !step.chords) return null;
        return (
          <div className="flex flex-col items-center gap-6 w-full">
            <InstructionList items={step.instructions} />
            <FingerstyleTrainer
              pattern={step.fingerstylePattern}
              chords={step.chords}
              initialBpm={step.bpm}
              onBpmChange={(b) => actions.setHighestBpm(b)}
            />
          </div>
        );

      case 'final':
        return (
          <div className="flex flex-col items-center gap-6 w-full">
            <InstructionList items={step.instructions} />
            <FinalChallenge
              initialBpm={step.bpm}
              onXp={handleXp}
              onComplete={(s) => actions.setHighestBpm(s.highestBpm)}
            />
          </div>
        );

      default:
        return null;
    }
  }

  if (isComplete) {
    return (
      <CompletionScreen
        state={state}
        onRestart={handleRestartSession}
        onFocusBarre={handleFocusBarre}
        onHome={onExit}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-stage">
      <TopBar
        remaining={remaining}
        percentComplete={percentComplete}
        xp={state.xp}
        level={state.level}
        streak={state.streak}
        section={step.section}
        sectionIndex={step.sectionIndex}
        totalSections={SECTION_NAMES.length}
        lastXpGain={lastXpGain}
        onExit={onExit}
      />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col gap-6">
        <div className="slide-up flex flex-col gap-1">
          <span className="text-xs font-bold uppercase tracking-wide text-accent">{step.section}</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{step.title}</h1>
        </div>

        <div key={bodyKey} className="slide-up bg-surface/60 border border-white/5 rounded-3xl p-4 sm:p-8 flex items-center justify-center min-h-[320px]">
          {renderMain()}
        </div>
      </main>

      <BottomControls
        onBack={handleBack}
        onNext={handleNext}
        onPauseToggle={handlePauseToggle}
        onRestartStep={handleRestartStep}
        paused={paused}
        canGoBack={currentIndex > 0}
        isLast={isLast}
        percentComplete={percentComplete}
      />
    </div>
  );
}

function InstructionList({ items, ordered = false }: { items: string[]; ordered?: boolean }) {
  if (items.length === 0) return null;
  const Tag = ordered ? 'ol' : 'ul';
  return (
    <Tag className={`w-full max-w-xl flex flex-col gap-2 ${ordered ? 'list-decimal list-inside' : 'list-none'}`}>
      {items.map((text, i) => (
        <li key={i} className="text-sm sm:text-base text-[#cfd1d6] leading-relaxed">
          {text}
        </li>
      ))}
    </Tag>
  );
}
