import { useState } from 'react';
import ChordDiagram from './ChordDiagram';
import type { ChordData, StringStatus } from '../types';

const CYCLE: StringStatus[] = ['clean', 'buzz', 'muted'];

interface Props {
  chord: ChordData;
  onAllClean?: () => void;
}

export default function StringCheckExercise({ chord, onAllClean }: Props) {
  const [status, setStatus] = useState<StringStatus[]>(Array(6).fill(null));
  const [celebrated, setCelebrated] = useState(false);

  const playableStrings = chord.frets
    .map((f, i) => (f !== 'x' ? i : -1))
    .filter((i) => i >= 0);

  const handleClick = (i: number) => {
    if (!playableStrings.includes(i)) return;
    setStatus((prev) => {
      const next = [...prev];
      const cur = next[i];
      const idx = cur ? CYCLE.indexOf(cur) : -1;
      next[i] = CYCLE[(idx + 1) % CYCLE.length];
      const allChecked = playableStrings.every((pi) => next[pi]);
      const allClean = playableStrings.every((pi) => next[pi] === 'clean');
      if (allChecked && allClean && !celebrated) {
        setCelebrated(true);
        onAllClean?.();
      }
      return next;
    });
  };

  const allClean = playableStrings.every((pi) => status[pi] === 'clean');
  const checkedCount = playableStrings.filter((pi) => status[pi]).length;

  return (
    <div className="flex flex-col items-center gap-4">
      <ChordDiagram
        chordName={chord.name}
        frets={chord.frets}
        fingers={chord.fingers}
        startFret={chord.startFret}
        rootString={chord.rootString}
        barre={chord.barre}
        interactive
        stringStatus={status}
        onStringClick={handleClick}
        size="lg"
        showLegend
      />
      <div className="text-sm text-[#9aa0ad]">
        Tap each playable string below the diagram to cycle: Clean → Buzzing → Muted.
      </div>
      <div className="text-xs text-[#6d7280]">
        {checkedCount}/{playableStrings.length} strings checked
      </div>
      {allClean && checkedCount === playableStrings.length && (
        <div className="pop-in px-4 py-2 rounded-lg bg-good/15 border border-good/40 text-good font-bold text-sm">
          ✓ All strings clean — great fretting!
        </div>
      )}
    </div>
  );
}
