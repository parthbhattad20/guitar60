import { useEffect, useRef, useState } from 'react';
import ChordDiagram from './ChordDiagram';
import { formatTime } from '../utils/time';
import { OPEN_CHORDS } from '../data/chords';

const DRILL_SECONDS = 300;
const CHORD_IDS = Object.keys(OPEN_CHORDS);

function randomChordId(excludeId?: string) {
  let id = CHORD_IDS[Math.floor(Math.random() * CHORD_IDS.length)];
  while (id === excludeId && CHORD_IDS.length > 1) {
    id = CHORD_IDS[Math.floor(Math.random() * CHORD_IDS.length)];
  }
  return id;
}

interface Props {
  onXp: (amount: number) => void;
  onChordPracticed: (id: string) => void;
  onBack: () => void;
}

export default function ChordFlashcards({ onXp, onChordPracticed, onBack }: Props) {
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DRILL_SECONDS);
  const [currentId, setCurrentId] = useState(randomChordId());
  const [reviewed, setReviewed] = useState(0);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  const start = () => {
    setRunning(true);
    setFinished(false);
    setReviewed(0);
    let secondsLeft = DRILL_SECONDS;
    setTimeLeft(secondsLeft);
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      secondsLeft -= 1;
      if (secondsLeft <= 0) {
        window.clearInterval(intervalRef.current!);
        setTimeLeft(0);
        setRunning(false);
        setFinished(true);
      } else {
        setTimeLeft(secondsLeft);
      }
    }, 1000);
  };

  const nextChord = () => {
    onXp(5);
    onChordPracticed(currentId);
    setReviewed((r) => r + 1);
    setCurrentId((prev) => randomChordId(prev));
  };

  const chord = OPEN_CHORDS[currentId];

  if (finished) {
    return (
      <div className="pop-in flex flex-col items-center gap-5 text-center">
        <div className="text-4xl">🎸</div>
        <h2 className="text-2xl font-black text-white">5 Minutes Done!</h2>
        <div className="flex gap-6">
          <Stat label="Chords Reviewed" value={reviewed} />
          <Stat label="XP Earned" value={reviewed * 5} />
        </div>
        <div className="flex gap-3">
          <button onClick={start} className="px-6 py-3 rounded-xl bg-accent text-[#06121f] font-bold hover:brightness-110 transition">
            Practice Again
          </button>
          <button onClick={onBack} className="px-6 py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition">
            Back to Quick Practice
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="flex items-center gap-4">
        <div className="text-4xl font-black tabular-nums text-accent">{formatTime(timeLeft)}</div>
        {running && <span className="text-sm text-gold font-bold">{reviewed} reviewed</span>}
      </div>

      {!running ? (
        <button onClick={start} className="px-8 py-3 rounded-xl bg-accent text-[#06121f] font-black text-lg hover:brightness-110 transition shadow-lg shadow-accent/30">
          Start 5-Minute Chord Practice
        </button>
      ) : (
        <>
          <div key={currentId} className="pop-in">
            <ChordDiagram
              chordName={chord.name}
              frets={chord.frets}
              fingers={chord.fingers}
              rootString={chord.rootString}
              size="lg"
              showLegend
            />
          </div>
          <p className="text-sm text-[#9aa0ad] text-center max-w-sm">
            Form the chord, strum it slowly, check every string rings clean, then move on.
          </p>
          <button
            onClick={nextChord}
            className="px-6 py-3 rounded-xl bg-good text-[#06240f] font-black hover:brightness-110 transition"
          >
            Got It → Next Chord
          </button>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-3xl font-black text-accent">{value}</span>
      <span className="text-xs text-[#9aa0ad]">{label}</span>
    </div>
  );
}
