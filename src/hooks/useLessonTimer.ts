import { useCallback, useEffect, useRef, useState } from 'react';

export function useLessonTimer(totalSeconds: number, paused: boolean) {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (paused) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    intervalRef.current = window.setInterval(() => {
      setElapsed((prev) => Math.min(totalSeconds, prev + 1));
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [paused, totalSeconds]);

  const reset = useCallback(() => setElapsed(0), []);

  return {
    elapsed,
    remaining: Math.max(0, totalSeconds - elapsed),
    reset,
  };
}
