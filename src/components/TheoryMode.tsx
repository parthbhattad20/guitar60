import { useState } from 'react';
import Fretboard from './Fretboard';
import ChordDiagram from './ChordDiagram';
import { THEORY_STEPS } from '../data/theory';
import { CHROMATIC, majorScaleFrom } from '../data/notes';
import { OPEN_CHORDS } from '../data/chords';
import { diffStrings } from '../utils/chordDiff';

const SCALE_ROOTS = ['C', 'G', 'D', 'A', 'E'];
const NO_SHARP_AFTER = new Set(['B', 'E']);

interface Props {
  xp: number;
  level: number;
  onXp: (amount: number) => void;
  onExit: () => void;
}

export default function TheoryMode({ xp, level, onXp, onExit }: Props) {
  const [index, setIndex] = useState(0);
  const [awarded, setAwarded] = useState<Set<string>>(new Set());
  const [scaleRoot, setScaleRoot] = useState('C');

  const step = THEORY_STEPS[index];
  const isLast = index === THEORY_STEPS.length - 1;
  const percent = ((index + 1) / THEORY_STEPS.length) * 100;

  const goNext = () => {
    if (step.xpReward && !awarded.has(step.id)) {
      onXp(step.xpReward);
      setAwarded((prev) => new Set(prev).add(step.id));
    }
    if (isLast) {
      onExit();
      return;
    }
    setIndex((i) => Math.min(THEORY_STEPS.length - 1, i + 1));
  };
  const goBack = () => setIndex((i) => Math.max(0, i - 1));

  const scale = majorScaleFrom(scaleRoot);
  const degreeLabels: Record<string, string> = {};
  scale.forEach((n, i) => {
    degreeLabels[n] = String(i + 1);
  });

  const triadNotes = ['C', 'E', 'G'];
  const triadDegrees: Record<string, string> = { C: '1 · Root', E: '3rd', G: '5th' };

  const { moving } = diffStrings(OPEN_CHORDS.E, OPEN_CHORDS.Em);

  return (
    <div className="flex-1 flex flex-col bg-stage">
      <div className="w-full bg-surface/90 backdrop-blur border-b border-white/10 px-4 sm:px-6 py-3 flex flex-col gap-2.5 sticky top-11 z-30">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-lg font-black tracking-tight text-white">Music Theory</span>
            <span className="hidden sm:inline text-xs text-[#6d7280] font-semibold">
              {index + 1}/{THEORY_STEPS.length}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-black text-gold">
              Lv.{level} · {xp} XP
            </span>
            <button onClick={onExit} className="text-xs text-[#9aa0ad] hover:text-white underline">
              Exit to Home
            </button>
          </div>
        </div>
        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent to-good transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col gap-6">
        <div className="slide-up flex flex-col gap-1">
          <span className="text-xs font-bold uppercase tracking-wide text-accent">Theory</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{step.title}</h1>
        </div>

        <div key={step.id} className="slide-up bg-surface/60 border border-white/5 rounded-3xl p-4 sm:p-8 flex flex-col items-center gap-6">
          <ul className="w-full max-w-xl flex flex-col gap-2">
            {step.instructions.map((text, i) => (
              <li key={i} className="text-sm sm:text-base text-[#cfd1d6] leading-relaxed list-none">
                {text}
              </li>
            ))}
          </ul>

          {step.render === 'alphabet' && (
            <div className="flex flex-wrap gap-2 justify-center max-w-xl">
              {CHROMATIC.map((note) => (
                <div key={note} className="flex items-center gap-2">
                  <div
                    className={`px-3 py-2 rounded-xl font-black text-sm ${
                      note.includes('#') ? 'bg-white/8 text-[#9aa0ad]' : 'bg-accent text-[#06121f]'
                    }`}
                  >
                    {note}
                  </div>
                  {NO_SHARP_AFTER.has(note) && <span className="text-[10px] text-warn font-bold">no sharp</span>}
                </div>
              ))}
            </div>
          )}

          {step.render === 'fretboard-all' && (
            <div className="w-full">
              <Fretboard numFrets={12} showAllNotes />
            </div>
          )}

          {step.render === 'half-steps' && (
            <div className="w-full">
              <Fretboard
                numFrets={6}
                activeString={0}
                highlightNotes={['E', 'F', 'F#', 'G', 'G#', 'A']}
              />
            </div>
          )}

          {step.render === 'scale-builder' && (
            <div className="w-full flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 bg-white/5 rounded-full p-1 flex-wrap justify-center">
                {SCALE_ROOTS.map((r) => (
                  <button
                    key={r}
                    onClick={() => setScaleRoot(r)}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition ${
                      scaleRoot === r ? 'bg-accent text-[#06121f]' : 'text-[#9aa0ad] hover:text-white'
                    }`}
                  >
                    {r} major
                  </button>
                ))}
              </div>
              <Fretboard numFrets={12} activeString={0} rootNote={scaleRoot} highlightNotes={scale} degreeLabels={degreeLabels} />
              <div className="text-sm text-[#9aa0ad]">
                {scaleRoot} major scale: <span className="text-white font-bold">{scale.join(' – ')}</span>
              </div>
            </div>
          )}

          {step.render === 'triad' && (
            <div className="w-full flex flex-col items-center gap-6">
              <Fretboard numFrets={8} activeString={0} rootNote="C" highlightNotes={triadNotes} degreeLabels={triadDegrees} />
              <ChordDiagram
                chordName={OPEN_CHORDS.C.name}
                frets={OPEN_CHORDS.C.frets}
                fingers={OPEN_CHORDS.C.fingers}
                rootString={OPEN_CHORDS.C.rootString}
                size="md"
                showLegend
              />
            </div>
          )}

          {step.render === 'major-minor' && (
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <ChordDiagram
                chordName={OPEN_CHORDS.E.name}
                frets={OPEN_CHORDS.E.frets}
                fingers={OPEN_CHORDS.E.fingers}
                rootString={OPEN_CHORDS.E.rootString}
                size="md"
              />
              <div className="text-2xl text-[#6d7280]">vs</div>
              <ChordDiagram
                chordName={OPEN_CHORDS.Em.name}
                frets={OPEN_CHORDS.Em.frets}
                fingers={OPEN_CHORDS.Em.fingers}
                rootString={OPEN_CHORDS.Em.rootString}
                highlightedStrings={moving}
                size="md"
              />
            </div>
          )}
        </div>
      </main>

      <div className="sticky bottom-0 z-30 w-full bg-surface/95 backdrop-blur border-t border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between gap-2">
        <button
          onClick={goBack}
          disabled={index === 0}
          className="px-4 sm:px-5 py-2.5 rounded-xl bg-white/8 text-white font-semibold hover:bg-white/15 transition disabled:opacity-30 disabled:cursor-not-allowed text-sm"
        >
          ← Back
        </button>
        <span className="text-xs text-[#6d7280] font-bold">{Math.round(percent)}% complete</span>
        <button
          onClick={goNext}
          className="px-5 sm:px-7 py-2.5 rounded-xl bg-accent text-[#06121f] font-black hover:brightness-110 transition shadow-lg shadow-accent/25 text-sm sm:text-base"
        >
          {isLast ? 'Finish ✓' : 'Next Step →'}
        </button>
      </div>
    </div>
  );
}
