import { useBeatClock } from '../hooks/useBeatClock';

const BPM_OPTIONS = [40, 50, 60, 70, 80];

interface MetronomeProps {
  bpm: number;
  onBpmChange?: (bpm: number) => void;
  running: boolean;
  onToggle?: () => void;
  beatsPerCycle?: number;
  compact?: boolean;
}

export default function Metronome({
  bpm,
  onBpmChange,
  running,
  onToggle,
  beatsPerCycle = 4,
  compact = false,
}: MetronomeProps) {
  const { beat } = useBeatClock(bpm, running);
  const current = beat % beatsPerCycle;

  return (
    <div className={`flex items-center gap-4 ${compact ? '' : 'flex-wrap'}`}>
      <button
        onClick={onToggle}
        className="w-10 h-10 rounded-full bg-surface-3 border border-white/10 flex items-center justify-center text-accent hover:bg-white/10 transition"
        aria-label={running ? 'Pause metronome' : 'Start metronome'}
      >
        {running ? '⏸' : '▶'}
      </button>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: beatsPerCycle }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-100 ${
              running && current === i
                ? 'bg-accent scale-125 shadow-[0_0_10px_var(--color-accent)]'
                : 'bg-white/15'
            }`}
          />
        ))}
      </div>
      {onBpmChange && (
        <div className="flex items-center gap-1">
          {BPM_OPTIONS.map((b) => (
            <button
              key={b}
              onClick={() => onBpmChange(b)}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition ${
                bpm === b
                  ? 'bg-accent text-[#06121f]'
                  : 'bg-white/5 text-[#b7bac2] hover:bg-white/10'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      )}
      <span className="text-sm text-[#9aa0ad] font-semibold">{bpm} BPM</span>
    </div>
  );
}
