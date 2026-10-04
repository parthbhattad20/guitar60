import { useEffect, useRef, useState } from 'react';
import ChordDiagram from './ChordDiagram';
import Metronome from './Metronome';
import { useBeatClock } from '../hooks/useBeatClock';
import { diffStrings } from '../utils/chordDiff';
import type { ChordData } from '../types';

interface Props {
  chords: ChordData[];
  initialBpm?: number;
  onXp?: (amount: number) => void;
  onRetry?: () => void;
  onBpmChange?: (bpm: number) => void;
  onChordPracticed?: (id: string) => void;
}

type RepStage = 'idle' | 'form' | 'check' | 'hold' | 'release';

const STRING_LABELS = ['E', 'A', 'D', 'G', 'B', 'e'];

export default function BarreChallengeGame({
  chords,
  initialBpm = 40,
  onXp,
  onRetry,
  onBpmChange,
  onChordPracticed,
}: Props) {
  const [bpm, setBpm] = useState(initialBpm);
  const [running, setRunning] = useState(false);
  const { beat, reset } = useBeatClock(bpm, running);
  const beatsPerChord = 4;
  const cycleLength = beatsPerChord * chords.length;
  const posInCycle = beat % cycleLength;
  const currentIdx = Math.floor(posInCycle / beatsPerChord);
  const nextIdx = (currentIdx + 1) % chords.length;

  const current = chords[currentIdx];
  const next = chords[nextIdx];
  const { moving } = diffStrings(current, next);

  // Hold mini-game
  const [repStage, setRepStage] = useState<RepStage>('idle');
  const [checkedStrings, setCheckedStrings] = useState<boolean[]>(Array(6).fill(false));
  const [holdSeconds, setHoldSeconds] = useState(3);
  const [reps, setReps] = useState(0);
  const [lastResult, setLastResult] = useState<'clean' | null>(null);
  const holdTimer = useRef<number | null>(null);

  const miniGameChord = chords[0];

  useEffect(() => {
    return () => {
      if (holdTimer.current) window.clearInterval(holdTimer.current);
    };
  }, []);

  const startHold = () => {
    setRepStage('hold');
    let remaining = 3;
    setHoldSeconds(remaining);
    holdTimer.current = window.setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        window.clearInterval(holdTimer.current!);
        setHoldSeconds(0);
        setRepStage('release');
        setReps((r) => r + 1);
        setLastResult('clean');
        onXp?.(15);
        onChordPracticed?.(miniGameChord.id);
      } else {
        setHoldSeconds(remaining);
      }
    }, 1000);
  };

  const handleRetry = () => {
    if (holdTimer.current) window.clearInterval(holdTimer.current);
    setRepStage('idle');
    setCheckedStrings(Array(6).fill(false));
    setLastResult(null);
    onRetry?.();
  };

  const toggleCheck = (i: number) => {
    setCheckedStrings((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  const allChecked = checkedStrings.every(Boolean);

  const handleBpm = (b: number) => {
    setBpm(b);
    onBpmChange?.(b);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="w-full max-w-lg px-4 py-2.5 rounded-xl bg-warn/10 border border-warn/40 text-warn text-sm text-center font-medium">
        ⚠ Relax your hand between repetitions. Do not squeeze the neck continuously.
      </div>

      <div className="text-sm uppercase tracking-wide text-[#6d7280] font-bold">Sequence Playthrough</div>
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-accent font-bold uppercase">Current</span>
          <div className={`rounded-2xl p-3 transition ${running ? 'bg-accent/10 ring-2 ring-accent' : 'bg-white/[0.02]'}`}>
            <ChordDiagram
              chordName={current.name}
              frets={current.frets}
              fingers={current.fingers}
              startFret={current.startFret}
              rootString={current.rootString}
              barre={current.barre}
              size="md"
            />
          </div>
        </div>
        <div className="text-2xl text-[#6d7280]">→</div>
        <div className="flex flex-col items-center gap-1 opacity-70">
          <span className="text-xs text-[#9aa0ad] font-bold uppercase">Next</span>
          <div className="rounded-2xl p-3 bg-white/[0.02]">
            <ChordDiagram
              chordName={next.name}
              frets={next.frets}
              fingers={next.fingers}
              startFret={next.startFret}
              rootString={next.rootString}
              barre={next.barre}
              highlightedStrings={moving}
              size="md"
            />
          </div>
        </div>
      </div>

      <Metronome bpm={bpm} onBpmChange={handleBpm} running={running} beatsPerCycle={cycleLength > 16 ? beatsPerChord : cycleLength} />

      <button
        onClick={() => {
          reset();
          setRunning((r) => !r);
        }}
        className="px-6 py-2.5 rounded-xl bg-accent text-[#06121f] font-bold hover:brightness-110 transition"
      >
        {running ? 'Stop Sequence' : 'Start Sequence'}
      </button>

      <div className="w-full max-w-lg border-t border-white/10 pt-5 flex flex-col items-center gap-4">
        <div className="text-sm uppercase tracking-wide text-[#6d7280] font-bold">
          Barre Hold Mini-Game — {miniGameChord.name}
        </div>

        <div className="flex gap-2 text-xs font-bold">
          {(['form', 'check', 'hold', 'release'] as RepStage[]).map((s, i) => (
            <div
              key={s}
              className={`px-3 py-1 rounded-full transition ${
                repStage === s ? 'bg-accent text-[#06121f]' : 'bg-white/5 text-[#6d7280]'
              }`}
            >
              {i + 1}. {s[0].toUpperCase() + s.slice(1)}
            </div>
          ))}
        </div>

        {repStage === 'idle' && (
          <button
            onClick={() => setRepStage('form')}
            className="px-5 py-2.5 rounded-xl bg-white/8 text-white font-semibold hover:bg-white/15 transition"
          >
            1. Form the Barre
          </button>
        )}

        {repStage === 'form' && (
          <div className="flex flex-col items-center gap-3">
            <ChordDiagram
              chordName={miniGameChord.name}
              frets={miniGameChord.frets}
              fingers={miniGameChord.fingers}
              startFret={miniGameChord.startFret}
              rootString={miniGameChord.rootString}
              barre={miniGameChord.barre}
              size="md"
            />
            <button
              onClick={() => setRepStage('check')}
              className="px-5 py-2.5 rounded-xl bg-accent text-[#06121f] font-bold"
            >
              2. Check the Six Strings
            </button>
          </div>
        )}

        {repStage === 'check' && (
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-2">
              {STRING_LABELS.map((label, i) => (
                <button
                  key={i}
                  onClick={() => toggleCheck(i)}
                  className={`w-10 h-10 rounded-lg font-bold text-sm transition ${
                    checkedStrings[i] ? 'bg-good text-[#06240f]' : 'bg-white/8 text-[#b7bac2]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="text-xs text-[#9aa0ad]">Tap each string to confirm it rings clean.</p>
            <button
              disabled={!allChecked}
              onClick={startHold}
              className={`px-5 py-2.5 rounded-xl font-bold transition ${
                allChecked ? 'bg-accent text-[#06121f]' : 'bg-white/5 text-[#4a4e5a] cursor-not-allowed'
              }`}
            >
              3. Hold for 3 Seconds
            </button>
          </div>
        )}

        {repStage === 'hold' && (
          <div className="flex flex-col items-center gap-2">
            <div className="text-5xl font-black text-accent pulse-ring rounded-full w-20 h-20 flex items-center justify-center">
              {holdSeconds}
            </div>
            <p className="text-xs text-[#9aa0ad]">Hold the shape steady...</p>
          </div>
        )}

        {repStage === 'release' && (
          <div className="flex flex-col items-center gap-3 pop-in">
            {lastResult === 'clean' && (
              <div className="px-4 py-2 rounded-lg bg-good/15 border border-good/40 text-good font-bold">
                ✓ Clean Change! +15 XP
              </div>
            )}
            <p className="text-sm text-[#b7bac2]">4. Release and relax your hand fully.</p>
            <button
              onClick={() => setRepStage('idle')}
              className="px-5 py-2.5 rounded-xl bg-accent text-[#06121f] font-bold"
            >
              5. Reform the Chord
            </button>
          </div>
        )}

        <div className="flex items-center gap-4">
          <span className="text-gold font-bold text-sm">Reps completed: {reps}</span>
          <button onClick={handleRetry} className="text-xs text-[#9aa0ad] underline hover:text-white">
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}
