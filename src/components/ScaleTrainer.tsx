import { useState } from 'react';
import Fretboard from './Fretboard';
import Metronome from './Metronome';
import { useBeatClock } from '../hooks/useBeatClock';
import type { ScalePattern } from '../types';

interface Props { pattern: ScalePattern; initialBpm?: number; onBpmChange?: (bpm: number) => void; }

export default function ScaleTrainer({ pattern, initialBpm = 60, onBpmChange }: Props) {
  const [bpm, setBpm] = useState(initialBpm);
  const [running, setRunning] = useState(false);
  const [descending, setDescending] = useState(false);
  const { beat, reset } = useBeatClock(bpm, running);
  const sequence = descending ? [...pattern.sequence].reverse() : pattern.sequence;
  const activeIndex = beat % sequence.length;
  const active = sequence[activeIndex];
  const degreeLabels = Object.fromEntries(pattern.notes.map((note, index) => [note, pattern.degrees[index]]));

  const changeBpm = (nextBpm: number) => { setBpm(nextBpm); onBpmChange?.(nextBpm); };
  const toggleDirection = () => { reset(); setDescending((value) => !value); };

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <div className="w-full">
        <Fretboard numFrets={pattern.id.includes('pentatonic') ? 8 : 5} rootNote={pattern.root}
          highlightNotes={pattern.notes} degreeLabels={degreeLabels} />
      </div>
      <div className="flex flex-wrap justify-center gap-2" aria-label={`${pattern.name} note sequence`}>
        {sequence.map((item, index) => (
          <div key={`${item.string}-${item.fret}-${index}`} className={`min-w-14 rounded-xl px-2.5 py-2 text-center transition-all ${
            running && index === activeIndex ? 'bg-accent text-[#06121f] scale-110 shadow-[0_0_16px_var(--color-accent)]'
              : item.note === pattern.root ? 'bg-gold/20 text-gold ring-1 ring-gold/50' : 'bg-white/8 text-white'}`}>
            <div className="font-black">{item.note}</div>
            <div className="text-[10px] font-semibold opacity-75">S{item.string} · F{item.fret}</div>
            <div className="text-[10px] opacity-60">{item.finger ? `finger ${item.finger}` : 'open'}</div>
          </div>
        ))}
      </div>
      <p className="text-sm text-[#b7bac2] text-center">
        {running ? `Play ${active.note} — string ${active.string}, fret ${active.fret}.` : 'Start slowly: one note per click, using alternate picking.'}
      </p>
      <Metronome bpm={bpm} onBpmChange={changeBpm} running={running}
        onToggle={() => setRunning((value) => !value)} beatsPerCycle={4} />
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button onClick={() => { reset(); setRunning((value) => !value); }}
          className="px-6 py-2.5 rounded-xl bg-accent text-[#06121f] font-bold hover:brightness-110 transition">
          {running ? 'Stop Scale' : 'Play Scale'}
        </button>
        <button onClick={toggleDirection}
          className="px-4 py-2.5 rounded-xl bg-white/8 text-[#b7bac2] hover:bg-white/15 text-sm font-bold transition">
          {descending ? '↓ Descending' : '↑ Ascending'}
        </button>
      </div>
    </div>
  );
}
