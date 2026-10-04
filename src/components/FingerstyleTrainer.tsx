import { useState } from 'react';
import ChordDiagram from './ChordDiagram';
import Metronome from './Metronome';
import { useBeatClock } from '../hooks/useBeatClock';
import type { ChordData, FingerstylePattern } from '../types';

interface Props {
  pattern: FingerstylePattern;
  chords: ChordData[];
  initialBpm?: number;
  onBpmChange?: (bpm: number) => void;
}

const FINGER_LABELS: Record<'P' | 'i' | 'm' | 'a', string> = {
  P: 'Thumb',
  i: 'Index',
  m: 'Middle',
  a: 'Ring',
};

const STRING_NUMBER_TO_COL = (stringNum: number) => 6 - stringNum;

export default function FingerstyleTrainer({ pattern, chords, initialBpm = 60, onBpmChange }: Props) {
  const [bpm, setBpm] = useState(initialBpm);
  const [running, setRunning] = useState(false);
  const { beat, reset } = useBeatClock(bpm, running);

  const idx = beat % pattern.sequence.length;
  const chordIdx = Math.floor(beat / pattern.sequence.length) % chords.length;
  const currentFinger = pattern.sequence[idx];
  const currentString = pattern.stringForFinger[currentFinger];
  const highlightedCol = running ? [STRING_NUMBER_TO_COL(currentString)] : [];

  const handleBpm = (b: number) => {
    setBpm(b);
    onBpmChange?.(b);
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <div className="flex gap-3 flex-wrap justify-center">
        {pattern.sequence.map((finger, i) => {
          const active = running && i === idx;
          return (
            <div
              key={i}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                active ? 'bg-accent text-[#06121f] scale-110 shadow-[0_0_16px_var(--color-accent)]' : 'bg-white/8 text-white'
              }`}
            >
              <span className="text-xl font-black">{finger}</span>
              <span className="text-[10px] font-semibold opacity-80">{FINGER_LABELS[finger]}</span>
            </div>
          );
        })}
      </div>

      <div className={`rounded-2xl p-3 transition ${running ? 'bg-accent/10 ring-2 ring-accent' : 'bg-white/[0.02]'}`}>
        <ChordDiagram
          chordName={chords[chordIdx]?.name ?? ''}
          frets={chords[chordIdx]?.frets ?? []}
          fingers={chords[chordIdx]?.fingers}
          startFret={chords[chordIdx]?.startFret}
          rootString={chords[chordIdx]?.rootString}
          highlightedStrings={highlightedCol}
          size="md"
        />
      </div>

      <p className="text-sm text-[#b7bac2] text-center max-w-md">
        The highlighted string shows where <strong>{FINGER_LABELS[currentFinger]}</strong> ({currentFinger}) plucks
        right now. Keep your hand hovering in place — only the finger moves.
      </p>

      <Metronome bpm={bpm} onBpmChange={handleBpm} running={running} beatsPerCycle={pattern.sequence.length} />

      <div className="flex items-center gap-3">
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
          onClick={() => handleBpm(50)}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition ${
            bpm === 50 ? 'bg-gold text-[#2a1f00]' : 'bg-white/8 text-[#b7bac2] hover:bg-white/15'
          }`}
        >
          Slow 50 BPM Mode
        </button>
      </div>
    </div>
  );
}
