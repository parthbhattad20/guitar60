import { useEffect, useRef, useState } from 'react';
import ChordDiagram from './ChordDiagram';
import Metronome from './Metronome';
import { useBeatClock } from '../hooks/useBeatClock';
import { formatTime } from '../utils/time';
import type { ChordData, StrumPattern } from '../types';

interface Props {
  pattern: StrumPattern;
  chords: ChordData[];
  initialBpm?: number;
  onPractice?: (seconds: number) => void;
  onBpmChange?: (bpm: number) => void;
}

export default function StrummingTrainer({ pattern, chords, initialBpm = 70, onPractice, onBpmChange }: Props) {
  const [bpm, setBpm] = useState(initialBpm);
  const [running, setRunning] = useState(false);
  const [practiceRemaining, setPracticeRemaining] = useState<number | null>(null);
  const { beat, reset } = useBeatClock(bpm, running);
  const practiceTimer = useRef<number | null>(null);

  const idx = beat % pattern.beats.length;
  const chordIdx = Math.floor(beat / pattern.beats.length) % chords.length;

  const handleBpm = (b: number) => {
    setBpm(b);
    onBpmChange?.(b);
  };

  const startPractice = (seconds: number) => {
    reset();
    setRunning(true);
    let remaining = seconds;
    setPracticeRemaining(remaining);
    if (practiceTimer.current) window.clearInterval(practiceTimer.current);
    practiceTimer.current = window.setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        window.clearInterval(practiceTimer.current!);
        setPracticeRemaining(null);
        setRunning(false);
        onPractice?.(seconds);
      } else {
        setPracticeRemaining(remaining);
      }
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (practiceTimer.current) window.clearInterval(practiceTimer.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <div className="flex gap-3 overflow-x-auto max-w-full pb-1">
        {pattern.beats.map((b, i) => {
          const active = running && i === idx;
          return (
            <div key={i} className="flex flex-col items-center gap-1 min-w-10">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black transition-all duration-150 ${
                  active
                    ? 'bg-accent text-[#06121f] scale-110 shadow-[0_0_16px_var(--color-accent)]'
                    : b === '-'
                    ? 'bg-white/[0.03] text-[#4a4e5a] border border-dashed border-white/10'
                    : 'bg-white/8 text-white'
                }`}
              >
                {b === 'D' ? '↓' : b === 'U' ? '↑' : '·'}
              </div>
              <span className={`text-[11px] font-bold ${active ? 'text-accent' : 'text-[#6d7280]'}`}>
                {pattern.counts[i]}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-sm text-[#b7bac2] text-center max-w-md">
        Downstrokes (↓) and upstrokes (↑) follow your hand's natural swing. On a muted dash (·) your hand still
        moves through the motion — it just doesn't strike the strings.
      </p>

      <div className={`rounded-2xl p-3 transition ${running ? 'bg-accent/10 ring-2 ring-accent' : 'bg-white/[0.02]'}`}>
        <ChordDiagram
          chordName={chords[chordIdx]?.name ?? ''}
          frets={chords[chordIdx]?.frets ?? []}
          fingers={chords[chordIdx]?.fingers}
          startFret={chords[chordIdx]?.startFret}
          rootString={chords[chordIdx]?.rootString}
          barre={chords[chordIdx]?.barre}
          size="md"
        />
      </div>

      <Metronome bpm={bpm} onBpmChange={handleBpm} running={running} beatsPerCycle={pattern.beats.length} />

      <div className="flex items-center gap-3 flex-wrap justify-center">
        <button
          onClick={() => {
            reset();
            setRunning((r) => !r);
          }}
          className="px-6 py-2.5 rounded-xl bg-accent text-[#06121f] font-bold hover:brightness-110 transition"
        >
          {running ? 'Stop' : 'Play Pattern'}
        </button>
        <button
          onClick={() => startPractice(30)}
          className="px-5 py-2.5 rounded-xl bg-white/8 text-white font-semibold hover:bg-white/15 transition"
        >
          Practice 30 sec
        </button>
        <button
          onClick={() => startPractice(60)}
          className="px-5 py-2.5 rounded-xl bg-white/8 text-white font-semibold hover:bg-white/15 transition"
        >
          Practice 60 sec
        </button>
        {practiceRemaining != null && (
          <span className="text-gold font-bold text-lg">{formatTime(practiceRemaining)}</span>
        )}
      </div>
    </div>
  );
}
