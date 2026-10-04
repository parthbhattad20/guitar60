interface Props {
  onBack: () => void;
  onNext: () => void;
  onPauseToggle: () => void;
  onRestartStep: () => void;
  paused: boolean;
  canGoBack: boolean;
  isLast: boolean;
  percentComplete: number;
}

export default function BottomControls({
  onBack,
  onNext,
  onPauseToggle,
  onRestartStep,
  paused,
  canGoBack,
  isLast,
  percentComplete,
}: Props) {
  return (
    <div className="sticky bottom-0 z-30 w-full bg-surface/95 backdrop-blur border-t border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between gap-2">
      <button
        onClick={onBack}
        disabled={!canGoBack}
        className="px-4 sm:px-5 py-2.5 rounded-xl bg-white/8 text-white font-semibold hover:bg-white/15 transition disabled:opacity-30 disabled:cursor-not-allowed text-sm"
      >
        ← Back
      </button>

      <div className="flex items-center gap-2">
        <button
          onClick={onPauseToggle}
          className="px-3 sm:px-4 py-2.5 rounded-xl bg-white/8 text-white font-semibold hover:bg-white/15 transition text-sm"
          title="Space to toggle"
        >
          {paused ? '▶ Resume' : '⏸ Pause'}
        </button>
        <button
          onClick={onRestartStep}
          className="px-3 sm:px-4 py-2.5 rounded-xl bg-white/8 text-white font-semibold hover:bg-white/15 transition text-sm hidden sm:inline-block"
        >
          ↺ Restart Step
        </button>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden sm:inline text-xs text-[#6d7280] font-bold">
          {Math.round(percentComplete)}% complete
        </span>
        <button
          onClick={onNext}
          className="px-5 sm:px-7 py-2.5 rounded-xl bg-accent text-[#06121f] font-black hover:brightness-110 transition shadow-lg shadow-accent/25 text-sm sm:text-base"
        >
          {isLast ? 'Finish ✓' : 'Next Step →'}
        </button>
      </div>
    </div>
  );
}
