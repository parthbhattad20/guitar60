import type { AppMode } from '../types';

const ITEMS: { mode: AppMode; label: string }[] = [
  { mode: 'home', label: 'Home' },
  { mode: 'session', label: '60-Min Session' },
  { mode: 'theory', label: 'Music Theory' },
  { mode: 'quick-practice', label: 'Quick Practice' },
];

interface Props {
  mode: AppMode;
  onSelect: (mode: AppMode) => void;
  xp: number;
  level: number;
}

export default function ModeNavBar({ mode, onSelect, xp, level }: Props) {
  return (
    <nav className="sticky top-0 z-40 w-full h-11 bg-surface-2/95 backdrop-blur border-b border-white/10 px-3 sm:px-6 flex items-center justify-between gap-2">
      <div className="flex items-center gap-1 overflow-x-auto flex-1 min-w-0">
        <span className="text-sm font-black tracking-tight text-white pr-2 shrink-0">
          GUITAR <span className="text-accent">60</span>
        </span>
        {ITEMS.map((item) => (
          <button
            key={item.mode}
            onClick={() => onSelect(item.mode)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              mode === item.mode ? 'bg-accent text-[#06121f]' : 'text-[#9aa0ad] hover:text-white hover:bg-white/5'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <span className="shrink-0 text-xs font-black text-gold">
        Lv.{level} · {xp} XP
      </span>
    </nav>
  );
}
