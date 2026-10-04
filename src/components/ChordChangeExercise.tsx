import { useEffect, useMemo, useState } from 'react';
import ChordDiagram from './ChordDiagram';
import Metronome from './Metronome';
import { useBeatClock } from '../hooks/useBeatClock';
import { diffStrings } from '../utils/chordDiff';
import type { ChordData } from '../types';

interface Props {
  from: ChordData;
  to: ChordData;
  initialBpm?: number;
  onRoundComplete?: (points: number) => void;
  onBpmChange?: (bpm: number) => void;
}

const BEAT_STAGES = [4, 2, 1];

export default function ChordChangeExercise({ from, to, initialBpm = 60, onRoundComplete, onBpmChange }: Props) {
  const [bpm, setBpm] = useState(initialBpm);
  const [beatsPerChord, setBeatsPerChord] = useState(4);
  const [running, setRunning] = useState(false);
  const [rounds, setRounds] = useState(0);
  const { beat, reset } = useBeatClock(bpm, running);

  const cycleLength = beatsPerChord * 2;
  const posInCycle = beat % cycleLength;
  const onFrom = posInCycle < beatsPerChord;
  const cyclesDone = Math.floor(beat / cycleLength);

  useEffect(() => {
    if (cyclesDone > rounds) {
      setRounds(cyclesDone);
      onRoundComplete?.(10);
    }
  }, [cyclesDone, rounds, onRoundComplete]);

  const { moving } = useMemo(() => diffStrings(from, to), [from, to]);

  const handleBpm = (b: number) => {
    setBpm(b);
    onBpmChange?.(b);
  };

  const handleStart = () => {
    reset();
    setRounds(0);
    setRunning((r) => !r);
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <div className="flex items-center justify-center gap-4 w-full flex-wrap">
        <div className={`rounded-2xl p-3 transition ${onFrom && running ? 'bg-accent/10 ring-2 ring-accent' : 'bg-white/[0.02]'}`}>
          <ChordDiagram
            chordName={from.name}
            frets={from.frets}
            fingers={from.fingers}
            startFret={from.startFret}
            rootString={from.rootString}
            barre={from.barre}
            size="md"
          />
        </div>
        <div className="flex flex-col items-center gap-1 text-accent">
          <div className={`text-3xl transition-transform ${running ? (onFrom ? 'translate-x-0' : 'translate-x-6') : ''}`}>
            ➜
          </div>
          <span className="text-[11px] text-[#9aa0ad] font-semibold uppercase tracking-wide">change</span>
        </div>
        <div className={`rounded-2xl p-3 transition ${!onFrom && running ? 'bg-accent/10 ring-2 ring-accent' : 'bg-white/[0.02]'}`}>
          <ChordDiagram
            chordName={to.name}
            frets={to.frets}
            fingers={to.fingers}
            startFret={to.startFret}
            rootString={to.rootString}
            barre={to.barre}
            highlightedStrings={moving}
            size="md"
          />
        </div>
      </div>

      <div className="text-center text-sm text-[#b7bac2] max-w-md">
        Strings highlighted in blue on <strong>{to.name}</strong> need a finger to move. Everything else can stay
        relaxed. Keep your strumming hand swinging continuously through the change.
      </div>

      <div className="flex items-center gap-2 bg-white/5 rounded-full p-1">
        {BEAT_STAGES.map((b) => (
          <button
            key={b}
            onClick={() => {
              setBeatsPerChord(b);
              reset();
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
              beatsPerChord === b ? 'bg-accent text-[#06121f]' : 'text-[#9aa0ad] hover:text-white'
            }`}
          >
            {b} beat{b > 1 ? 's' : ''}/chord
          </button>
        ))}
      </div>

      <Metronome bpm={bpm} onBpmChange={handleBpm} running={running} beatsPerCycle={cycleLength} />

      <div className="flex items-center gap-4">
        <button
          onClick={handleStart}
          className="px-6 py-2.5 rounded-xl bg-accent text-[#06121f] font-bold hover:brightness-110 transition shadow-lg shadow-accent/20"
        >
          {running ? 'Stop Exercise' : 'Start Exercise'}
        </button>
        <div className="text-sm text-gold font-bold">Rounds: {rounds} · +{rounds * 10} pts</div>
      </div>
    </div>
  );
}
