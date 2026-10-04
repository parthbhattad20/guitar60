import { useEffect, useRef, useState } from 'react';

/** Ticks a shared beat counter at the given BPM while `running` is true. */
export function useBeatClock(bpm: number, running: boolean) {
  const [beat, setBeat] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    const intervalMs = 60000 / bpm;
    timeoutRef.current = window.setInterval(() => {
      setBeat((b) => b + 1);
    }, intervalMs);
    return () => {
      if (timeoutRef.current) window.clearInterval(timeoutRef.current);
    };
  }, [bpm, running]);

  const reset = () => setBeat(0);

  return { beat, reset };
}
