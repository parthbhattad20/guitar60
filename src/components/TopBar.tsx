import { formatTime } from '../utils/time';

interface Props {
  remaining: number;
  percentComplete: number;
  xp: number;
  level: number;
  streak: number;
  section: string;
  sectionIndex: number;
  totalSections: number;
  lastXpGain: number | null;
  onExit?: () => void;
}

export default function TopBar({
  remaining,
  percentComplete,
  xp,
  level,
  streak,
  section,
  sectionIndex,
  totalSections,
  lastXpGain,
  onExit,
}: Props) {
  return (
    <div className="w-full bg-surface/90 backdrop-blur border-b border-white/10 px-4 sm:px-6 py-3 flex flex-col gap-2.5 sticky top-11 z-30">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-lg sm:text-xl font-black tracking-tight text-white">60-Minute Session</span>
          <span className="hidden sm:inline text-xs text-[#6d7280] font-semibold">
            Section {sectionIndex}/{totalSections} · {section}
          </span>
          {onExit && (
            <button onClick={onExit} className="text-xs text-[#9aa0ad] hover:text-white underline">
              Exit to Home
            </button>
          )}
        </div>
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-[#6d7280] font-bold uppercase">Streak</span>
            <span className="text-sm font-black text-warn">{streak}🔥</span>
          </div>
          <div className="relative flex items-center gap-1.5">
            <span className="text-[11px] text-[#6d7280] font-bold uppercase">Lv.{level}</span>
            <span className="text-sm font-black text-gold">{xp} XP</span>
            {lastXpGain != null && (
              <span className="xp-float absolute -top-3 right-0 text-xs font-black text-good">
                +{lastXpGain}
              </span>
            )}
          </div>
          <div className="text-lg sm:text-2xl font-black tabular-nums text-accent">{formatTime(remaining)}</div>
        </div>
      </div>
      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent to-good transition-all duration-500"
          style={{ width: `${Math.min(100, percentComplete)}%` }}
        />
      </div>
      <div className="flex sm:hidden justify-between text-[11px] text-[#6d7280] font-semibold">
        <span>
          Section {sectionIndex}/{totalSections}
        </span>
        <span>{Math.round(percentComplete)}%</span>
      </div>
    </div>
  );
}
