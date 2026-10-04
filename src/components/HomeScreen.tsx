import type { AppMode, GameState } from '../types';

interface Props {
  state: GameState;
  onSelect: (mode: AppMode) => void;
}

export default function HomeScreen({ state, onSelect }: Props) {
  return (
    <div className="flex-1 flex flex-col bg-stage">
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 flex flex-col gap-10">
        <div className="slide-up flex flex-col items-center text-center gap-3">
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            GUITAR <span className="text-accent">60</span>
          </h1>
          <p className="text-[#9aa0ad] max-w-lg">
            Open chords to barre chords, music theory, and quick daily reps — pick where you want to practice.
          </p>
          {state.xp > 0 && (
            <div className="flex items-center gap-4 mt-1 text-sm">
              <span className="text-gold font-black">Lv.{state.level} · {state.xp} XP</span>
              <span className="text-warn font-black">{state.streak}🔥 streak</span>
              <span className="text-[#9aa0ad]">{state.earnedBadges.size} badges</span>
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <ModeCard
            icon="🎸"
            title="60-Minute Session"
            description="The full structured course — warm-up, open chords, changes, strumming, barre chords, and fingerstyle."
            tag="60 min"
            onClick={() => onSelect('session')}
          />
          <ModeCard
            icon="🎼"
            title="Music Theory"
            description="Learn the fretboard, half/whole steps, the major scale, and how chords are actually built."
            tag="6 lessons"
            onClick={() => onSelect('theory')}
          />
          <ModeCard
            icon="⚡"
            title="Quick Practice"
            description="Short 5-minute drills for days you're short on time — chord flashcards or note-finding on the fretboard."
            tag="5 min"
            onClick={() => onSelect('quick-practice')}
          />
        </div>
      </main>
    </div>
  );
}

function ModeCard({
  icon,
  title,
  description,
  tag,
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  tag: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="slide-up text-left bg-surface/60 border border-white/5 hover:border-accent/50 rounded-3xl p-6 flex flex-col gap-3 transition group"
    >
      <div className="text-4xl">{icon}</div>
      <div className="text-xl font-black text-white group-hover:text-accent transition">{title}</div>
      <p className="text-sm text-[#9aa0ad] flex-1">{description}</p>
      <span className="text-xs font-bold text-accent uppercase tracking-wide">{tag}</span>
    </button>
  );
}
