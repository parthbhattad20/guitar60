import { useEffect, useRef, useState } from 'react';
import ChordDiagram from './ChordDiagram';
import { useBeatClock } from '../hooks/useBeatClock';
import { formatTime } from '../utils/time';
import { OPEN_CHORDS, eShapeMajor } from '../data/chords';
import { STRUM_PATTERNS, FINGERSTYLE_PATTERNS } from '../data/patterns';
import type { ChordData } from '../types';

type Mode = 'strum' | 'fingerstyle' | 'barre';

interface Props {
  initialBpm?: number;
  onComplete?: (stats: { score: number; highestBpm: number }) => void;
  onXp?: (amount: number) => void;
}

const PHASE_1 = ['C', 'G', 'Am', 'F'];
const PHASE_2 = ['G', 'D', 'Em', 'C'];
const PROGRESSION = [...PHASE_1, ...PHASE_2];

function chordFor(name: string, mode: Mode): ChordData {
  if (name === 'F' && mode === 'barre') return eShapeMajor(1);
  if (name === 'F') return OPEN_CHORDS.Fmaj7;
  return OPEN_CHORDS[name];
}

export default function FinalChallenge({ initialBpm = 70, onComplete, onXp }: Props) {
  const [mode, setMode] = useState<Mode>('strum');
  const [bpm, setBpm] = useState(initialBpm);
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [score, setScore] = useState(0);
  const { beat } = useBeatClock(bpm, running);
  const countdownRef = useRef<number | null>(null);
  const finishedRef = useRef(false);
  const scoreRef = useRef(0);

  const beatsPerChord = 4;
  const idx = Math.floor(beat / beatsPerChord) % PROGRESSION.length;
  const nextIdx = (idx + 1) % PROGRESSION.length;
  const current = chordFor(PROGRESSION[idx], mode);
  const next = chordFor(PROGRESSION[nextIdx], mode);

  const strumBeat = STRUM_PATTERNS[1].beats[beat % STRUM_PATTERNS[1].beats.length];
  const fsFinger = FINGERSTYLE_PATTERNS[0].sequence[beat % FINGERSTYLE_PATTERNS[0].sequence.length];

  useEffect(() => {
    if (!running) return;
    const scoreTick = window.setInterval(() => {
      scoreRef.current += 2;
      setScore(scoreRef.current);
    }, 1000);
    return () => window.clearInterval(scoreTick);
  }, [running]);

  const start = () => {
    setRunning(true);
    let secondsLeft = 120;
    setTimeLeft(secondsLeft);
    scoreRef.current = 0;
    setScore(0);
    finishedRef.current = false;
    if (countdownRef.current) window.clearInterval(countdownRef.current);
    countdownRef.current = window.setInterval(() => {
      secondsLeft -= 1;
      if (secondsLeft <= 0) {
        window.clearInterval(countdownRef.current!);
        setTimeLeft(0);
        setRunning(false);
        if (!finishedRef.current) {
          finishedRef.current = true;
          onXp?.(100);
          onComplete?.({ score: scoreRef.current, highestBpm: bpm });
        }
      } else {
        setTimeLeft(secondsLeft);
      }
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (countdownRef.current) window.clearInterval(countdownRef.current);
    };
  }, []);

  const progressPct = ((120 - timeLeft) / 120) * 100;

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="flex items-center gap-2 bg-white/5 rounded-full p-1">
        {(['strum', 'fingerstyle', 'barre'] as Mode[]).map((m) => (
          <button
            key={m}
            disabled={running}
            onClick={() => setMode(m)}
            className={`px-4 py-1.5 rounded-full text-sm font-bold capitalize transition ${
              mode === m ? 'bg-accent text-[#06121f]' : 'text-[#9aa0ad] hover:text-white disabled:opacity-40'
            }`}
          >
            {m === 'strum' ? 'Strumming' : m === 'fingerstyle' ? 'Fingerstyle' : 'Barre chords'}
          </button>
        ))}
      </div>

      <div className="text-6xl font-black tabular-nums text-accent">{formatTime(timeLeft)}</div>

      <div className="w-full max-w-md h-2 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full bg-accent transition-all" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="flex items-center justify-center gap-4 flex-wrap">
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-accent font-bold uppercase">Now</span>
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
        <div className="text-2xl text-[#6d7280]">→</div>
        <div className="flex flex-col items-center gap-1 opacity-60">
          <span className="text-xs text-[#9aa0ad] font-bold uppercase">Next</span>
          <ChordDiagram
            chordName={next.name}
            frets={next.frets}
            fingers={next.fingers}
            startFret={next.startFret}
            rootString={next.rootString}
            barre={next.barre}
            size="sm"
          />
        </div>
      </div>

      {mode === 'strum' && (
        <div className="text-4xl font-black text-accent">{strumBeat === 'D' ? '↓' : '↑'}</div>
      )}
      {mode === 'fingerstyle' && <div className="text-4xl font-black text-accent">{fsFinger}</div>}
      {mode === 'barre' && <div className="text-sm text-[#9aa0ad]">Keep the index barre flat and relaxed.</div>}

      <div className="flex items-center gap-6">
        <div className="text-sm text-[#9aa0ad]">
          BPM: <span className="text-white font-bold">{bpm}</span>
        </div>
        <div className="flex gap-1">
          {[60, 70, 80, 90, 100].map((b) => (
            <button
              key={b}
              disabled={running}
              onClick={() => setBpm(b)}
              className={`px-2 py-1 rounded text-xs font-bold transition disabled:opacity-40 ${
                bpm === b ? 'bg-accent text-[#06121f]' : 'bg-white/8 text-[#b7bac2]'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
        <div className="text-sm text-gold font-bold">Score: {score}</div>
      </div>

      {!running && (
        <button
          onClick={start}
          className="px-8 py-3 rounded-xl bg-accent text-[#06121f] font-black text-lg hover:brightness-110 transition shadow-lg shadow-accent/30"
        >
          {timeLeft === 120 ? 'Start Performance' : 'Play Again'}
        </button>
      )}
    </div>
  );
}
