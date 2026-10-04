import { useState } from 'react';
import ChordDiagram from './ChordDiagram';
import type { ChordData, FingerValue } from '../types';

interface Option {
  label: string;
  chord: ChordData;
}

interface Props {
  options: Option[];
  shapeExplanation?: Record<string, string>;
}

const EXPLAIN_STEPS: { label: string; finger: FingerValue; caption: string }[] = [
  { label: 'Root', finger: 1, caption: 'This note names the chord — the root.' },
  { label: 'Index Barre', finger: 1, caption: 'Index finger lies flat across the strings at this fret.' },
  { label: 'Middle', finger: 2, caption: 'Middle finger fills in the shape.' },
  { label: 'Ring', finger: 3, caption: 'Ring finger adds another note of the shape.' },
  { label: 'Little', finger: 4, caption: 'Pinky completes the shape, if the shape needs it.' },
  { label: 'Full Chord', finger: null, caption: 'Everything together — the complete barre chord.' },
];

export default function BarreShapeViewer({ options, shapeExplanation }: Props) {
  const [selected, setSelected] = useState(0);
  const [explainStep, setExplainStep] = useState<number | null>(null);
  const current = options[selected];

  const activeFinger = explainStep != null ? EXPLAIN_STEPS[explainStep].finger : null;

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {options.length > 1 && (
        <div className="flex items-center gap-2 bg-white/5 rounded-full p-1 flex-wrap justify-center">
          {options.map((o, i) => (
            <button
              key={o.label}
              onClick={() => {
                setSelected(i);
                setExplainStep(null);
              }}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition ${
                selected === i ? 'bg-accent text-[#06121f]' : 'text-[#9aa0ad] hover:text-white'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}

      <div className="pop-in">
        <ChordDiagram
          chordName={current.chord.name}
          frets={current.chord.frets}
          fingers={current.chord.fingers}
          startFret={current.chord.startFret}
          rootString={current.chord.rootString}
          barre={current.chord.barre}
          highlightFinger={activeFinger}
          size="lg"
          showLegend
        />
      </div>

      {shapeExplanation?.[current.chord.shape ?? ''] && (
        <p className="text-sm text-[#b7bac2] text-center max-w-md">
          {shapeExplanation[current.chord.shape ?? '']}
        </p>
      )}

      <div className="flex flex-col items-center gap-3">
        <button
          onClick={() => setExplainStep((s) => (s == null ? 0 : (s + 1) % EXPLAIN_STEPS.length))}
          className="px-5 py-2.5 rounded-xl bg-accent/90 text-[#06121f] font-bold hover:brightness-110 transition"
        >
          Explain This Shape {explainStep != null ? `(${explainStep + 1}/${EXPLAIN_STEPS.length})` : ''}
        </button>
        {explainStep != null && (
          <div className="slide-up text-center">
            <div className="text-gold font-bold text-sm">{EXPLAIN_STEPS[explainStep].label}</div>
            <div className="text-[#b7bac2] text-sm">{EXPLAIN_STEPS[explainStep].caption}</div>
          </div>
        )}
      </div>
    </div>
  );
}
