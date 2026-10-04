import { useEffect, useRef, useState } from 'react';
import { formatTime } from '../utils/time';

interface Props {
  seconds: number;
  onDone?: () => void;
}

export default function CountdownExercise({ seconds, onDone }: Props) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  const start = () => {
    setRunning(true);
    let remainingSeconds = seconds;
    setRemaining(remainingSeconds);
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      remainingSeconds -= 1;
      if (remainingSeconds <= 0) {
        window.clearInterval(intervalRef.current!);
        setRemaining(0);
        setRunning(false);
        onDone?.();
      } else {
        setRemaining(remainingSeconds);
      }
    }, 1000);
  };

  const pct = ((seconds - remaining) / seconds) * 100;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative w-40 h-40 sm:w-48 sm:h-48">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="44" fill="none" stroke="#2a2d36" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 44}`}
            strokeDashoffset={`${2 * Math.PI * 44 * (1 - pct / 100)}`}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-4xl font-black text-white tabular-nums">
          {formatTime(remaining)}
        </div>
      </div>
      <button
        onClick={start}
        disabled={running}
        className="px-6 py-2.5 rounded-xl bg-accent text-[#06121f] font-bold hover:brightness-110 transition disabled:opacity-50"
      >
        {running ? 'Running…' : remaining === 0 ? 'Restart Countdown' : 'Start Countdown'}
      </button>
    </div>
  );
}
