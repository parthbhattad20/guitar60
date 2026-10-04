import { useState } from 'react';
import ChordFlashcards from './ChordFlashcards';
import NoteTrainer from './NoteTrainer';

type Drill = 'none' | 'chords' | 'notes';

interface Props {
  xp: number;
  level: number;
  onXp: (amount: number) => void;
  onChordPracticed: (id: string) => void;
  onExit: () => void;
}

export default function QuickPracticeHub({ xp, level, onXp, onChordPracticed, onExit }: Props) {
  const [drill, setDrill] = useState<Drill>('none');

  return (
    <div className="flex-1 flex flex-col bg-stage">
      <div className="w-full bg-surface/90 backdrop-blur border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 flex-wrap sticky top-11 z-30">
        <span className="text-lg font-black tracking-tight text-white">Quick Practice</span>
        <div className="flex items-center gap-4">
          <span className="text-sm font-black text-gold">
            Lv.{level} · {xp} XP
          </span>
          <button
            onClick={drill === 'none' ? onExit : () => setDrill('none')}
            className="text-xs text-[#9aa0ad] hover:text-white underline"
          >
            {drill === 'none' ? 'Exit to Home' : '← All Drills'}
          </button>
        </div>
      </div>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col gap-6">
        {drill === 'none' && (
          <>
            <div className="slide-up flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-wide text-accent">5-Minute Drills</span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Quick Practice</h1>
              <p className="text-sm text-[#9aa0ad] max-w-xl">
                Short, focused reps for days you don't have a full hour. Pick a drill below.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={() => setDrill('chords')}
                className="slide-up text-left bg-surface/60 border border-white/5 hover:border-accent/50 rounded-3xl p-6 flex flex-col gap-3 transition group"
              >
                <div className="text-4xl">🎸</div>
                <div className="text-xl font-black text-white group-hover:text-accent transition">Chord Flashcards</div>
                <p className="text-sm text-[#9aa0ad]">
                  Cycle through open chords at your own pace — form it, check it, move on.
                </p>
                <span className="text-xs font-bold text-accent uppercase tracking-wide">5 minutes</span>
              </button>

              <button
                onClick={() => setDrill('notes')}
                className="slide-up text-left bg-surface/60 border border-white/5 hover:border-accent/50 rounded-3xl p-6 flex flex-col gap-3 transition group"
              >
                <div className="text-4xl">🎯</div>
                <div className="text-xl font-black text-white group-hover:text-accent transition">Note Finder</div>
                <p className="text-sm text-[#9aa0ad]">
                  A target note appears — tap where it lives on the fretboard. Builds fretboard fluency.
                </p>
                <span className="text-xs font-bold text-accent uppercase tracking-wide">5 minutes</span>
              </button>
            </div>
          </>
        )}

        {drill === 'chords' && (
          <div className="slide-up bg-surface/60 border border-white/5 rounded-3xl p-4 sm:p-8 flex items-center justify-center min-h-[320px]">
            <ChordFlashcards onXp={onXp} onChordPracticed={onChordPracticed} onBack={() => setDrill('none')} />
          </div>
        )}

        {drill === 'notes' && (
          <div className="slide-up bg-surface/60 border border-white/5 rounded-3xl p-4 sm:p-8 flex items-center justify-center min-h-[320px]">
            <NoteTrainer onXp={onXp} onBack={() => setDrill('none')} />
          </div>
        )}
      </main>
    </div>
  );
}
