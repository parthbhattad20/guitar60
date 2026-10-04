import { noteAt } from '../data/notes';

const STRING_LABELS = ['E', 'A', 'D', 'G', 'B', 'e']; // index 0 = string 6 ... 5 = string 1
const MARKER_FRETS = new Set([3, 5, 7, 9]);

export type CellStatus = 'correct' | 'wrong' | null;

interface FretboardProps {
  numFrets?: number;
  showAllNotes?: boolean;
  highlightNote?: string | null;
  highlightNotes?: string[];
  rootNote?: string | null;
  activeString?: number | null;
  interactive?: boolean;
  cellStatus?: Record<string, CellStatus>;
  onCellClick?: (stringIndex: number, fret: number) => void;
  degreeLabels?: Record<string, string>;
}

export default function Fretboard({
  numFrets = 12,
  showAllNotes = false,
  highlightNote = null,
  highlightNotes,
  rootNote = null,
  activeString = null,
  interactive = false,
  cellStatus,
  onCellClick,
  degreeLabels,
}: FretboardProps) {
  const highlightSet = new Set(highlightNotes ?? (highlightNote ? [highlightNote] : []));

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-full">
        <div className="flex">
          <div className="w-8 shrink-0" />
          {Array.from({ length: numFrets + 1 }).map((_, fret) => (
            <div
              key={fret}
              className="flex-1 min-w-9 text-center text-[11px] text-[#6d7280] font-bold pb-1"
            >
              {fret === 0 ? '' : fret}
              {MARKER_FRETS.has(fret) && <div className="w-1.5 h-1.5 rounded-full bg-white/15 mx-auto mt-0.5" />}
              {fret === 12 && (
                <div className="flex gap-0.5 justify-center mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/15" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/15" />
                </div>
              )}
            </div>
          ))}
        </div>
        {STRING_LABELS.map((label, stringIndex) => {
          const rowDimmed = activeString != null && activeString !== stringIndex;
          return (
            <div key={stringIndex} className={`flex items-stretch ${rowDimmed ? 'opacity-30' : ''}`}>
              <div className="w-8 shrink-0 flex items-center justify-center text-xs font-bold text-[#9aa0ad]">
                {label}
              </div>
              {Array.from({ length: numFrets + 1 }).map((_, fret) => {
                const note = noteAt(stringIndex, fret);
                const isHighlighted = highlightSet.has(note);
                const isRoot = rootNote != null && note === rootNote;
                const key = `${stringIndex}-${fret}`;
                const status = cellStatus?.[key] ?? null;
                const label2 = degreeLabels?.[note];

                const base =
                  'flex-1 min-w-9 h-9 sm:h-10 border-t border-r border-white/8 flex items-center justify-center text-[11px] sm:text-xs font-bold relative';
                let classes = base;
                if (fret === 0) classes += ' border-l-4 border-l-white/40';

                let content: string = '';
                if (showAllNotes || isHighlighted) content = label2 ?? note;

                let colorClasses = 'text-[#5c6070]';
                if (status === 'correct') colorClasses = 'bg-good/25 text-good';
                else if (status === 'wrong') colorClasses = 'bg-bad/25 text-bad';
                else if (isRoot) colorClasses = 'bg-gold/90 text-[#2a1f00]';
                else if (isHighlighted) colorClasses = 'bg-accent/80 text-[#06121f]';
                else if (showAllNotes) colorClasses = 'text-[#cfd1d6]';

                return (
                  <button
                    key={fret}
                    type="button"
                    disabled={!interactive}
                    onClick={() => onCellClick?.(stringIndex, fret)}
                    className={`${classes} ${colorClasses} ${interactive ? 'cursor-pointer hover:bg-white/10' : 'cursor-default'} transition-colors`}
                  >
                    {content}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
