import type { GameState } from '../types';
import { BADGES } from '../data/badges';

interface Props {
  state: GameState;
  onRestart: () => void;
  onFocusBarre: () => void;
}

export default function CompletionScreen({ state, onRestart, onFocusBarre }: Props) {
  const stats = [
    { label: 'XP Earned', value: state.xp },
    { label: 'Level Reached', value: state.level },
    { label: 'Chords Practiced', value: state.chordsPracticed.size },
    { label: 'Barre Chords Practiced', value: state.barreChordsPracticed.size },
    { label: 'Fingerstyle Patterns', value: state.fingerstylePatternsPracticed.size },
    { label: 'Highest BPM', value: state.highestBpm || 0 },
    { label: 'Exercises Completed', value: state.exercisesCompleted },
    { label: 'Practice Streak', value: state.streak },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-stage/98 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="pop-in max-w-2xl w-full bg-surface border border-white/10 rounded-3xl p-6 sm:p-10 flex flex-col items-center gap-6">
        <div className="text-5xl">🏆</div>
        <h1 className="text-3xl sm:text-4xl font-black text-white text-center tracking-tight">
          60 MINUTES COMPLETE
        </h1>
        <p className="text-[#9aa0ad] text-center">
          You've worked through open chords, clean changes, strumming, barre chords, and fingerstyle. Nice session.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
          {stats.map((s) => (
            <div key={s.label} className="bg-surface-2 rounded-xl p-3 flex flex-col items-center gap-1">
              <span className="text-2xl font-black text-accent">{s.value}</span>
              <span className="text-[11px] text-[#9aa0ad] text-center leading-tight">{s.label}</span>
            </div>
          ))}
        </div>

        {state.earnedBadges.size > 0 && (
          <div className="w-full">
            <div className="text-xs uppercase tracking-wide text-[#6d7280] font-bold mb-2 text-center">
              Badges Earned
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {Array.from(state.earnedBadges).map((id) => {
                const b = BADGES[id];
                if (!b) return null;
                return (
                  <div
                    key={id}
                    className="flex items-center gap-2 bg-gold/10 border border-gold/40 rounded-full px-3 py-1.5"
                  >
                    <span>{b.icon}</span>
                    <span className="text-sm font-bold text-gold">{b.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex gap-3 flex-wrap justify-center mt-2">
          <button
            onClick={onRestart}
            className="px-6 py-3 rounded-xl bg-accent text-[#06121f] font-bold hover:brightness-110 transition"
          >
            Practice Again
          </button>
          <button
            onClick={onFocusBarre}
            className="px-6 py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition"
          >
            Focus on Barre Chords
          </button>
        </div>
      </div>
    </div>
  );
}
