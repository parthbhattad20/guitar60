import { useEffect, useRef, useState } from 'react';
import Fretboard, { type CellStatus } from './Fretboard';
import { formatTime } from '../utils/time';
import { noteAt } from '../data/notes';

const DRILL_SECONDS = 300;
const MAX_FRET = 7;
const STRING_NAMES = ['low E', 'A', 'D', 'G', 'B', 'high e'];

function randomTarget() {
  const stringIndex = Math.floor(Math.random() * 6);
  const fret = Math.floor(Math.random() * (MAX_FRET + 1));
  return { stringIndex, fret, note: noteAt(stringIndex, fret) };
}

interface Props {
  onXp: (amount: number) => void;
  onBack: () => void;
}

export default function NoteTrainer({ onXp, onBack }: Props) {
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DRILL_SECONDS);
  const [finished, setFinished] = useState(false);
  const [target, setTarget] = useState(randomTarget());
  const [cellStatus, setCellStatus] = useState<Record<string, CellStatus>>({});
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const advanceTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    };
  }, []);

  const start = () => {
    setRunning(true);
    setFinished(false);
    setCorrectCount(0);
    setAttempts(0);
    setAnswered(false);
    setCellStatus({});
    setTarget(randomTarget());
    let secondsLeft = DRILL_SECONDS;
    setTimeLeft(secondsLeft);
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      secondsLeft -= 1;
      if (secondsLeft <= 0) {
        window.clearInterval(intervalRef.current!);
        if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
        setTimeLeft(0);
        setRunning(false);
        setFinished(true);
      } else {
        setTimeLeft(secondsLeft);
      }
    }, 1000);
  };

  const handleCellClick = (stringIndex: number, fret: number) => {
    if (!running || answered) return;
    setAnswered(true);
    setAttempts((a) => a + 1);
    const isCorrect = stringIndex === target.stringIndex && fret === target.fret;
    const key = `${stringIndex}-${fret}`;
    const targetKey = `${target.stringIndex}-${target.fret}`;
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      onXp(10);
      setCellStatus({ [key]: 'correct' });
    } else {
      onXp(2);
      setCellStatus({ [key]: 'wrong', [targetKey]: 'correct' });
    }
    advanceTimer.current = window.setTimeout(() => {
      setCellStatus({});
      setAnswered(false);
      setTarget(randomTarget());
    }, 900);
  };

  if (finished) {
    const accuracy = attempts > 0 ? Math.round((correctCount / attempts) * 100) : 0;
    return (
      <div className="pop-in flex flex-col items-center gap-5 text-center">
        <div className="text-4xl">🎯</div>
        <h2 className="text-2xl font-black text-white">5 Minutes Done!</h2>
        <div className="flex gap-6 flex-wrap justify-center">
          <Stat label="Notes Found" value={attempts} />
          <Stat label="Accuracy" value={`${accuracy}%`} />
          <Stat label="XP Earned" value={correctCount * 10 + (attempts - correctCount) * 2} />
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
        {running && (
          <span className="text-sm text-gold font-bold">
            {correctCount}/{attempts} correct
          </span>
        )}
      </div>

      {!running ? (
        <button onClick={start} className="px-8 py-3 rounded-xl bg-accent text-[#06121f] font-black text-lg hover:brightness-110 transition shadow-lg shadow-accent/30">
          Start 5-Minute Note Finder
        </button>
      ) : (
        <>
          <div className="text-center">
            <div className="text-sm text-[#9aa0ad] mb-1">Find the note</div>
            <div className="text-4xl font-black text-white">
              {target.note} <span className="text-base font-semibold text-[#9aa0ad]">on the {STRING_NAMES[target.stringIndex]} string</span>
            </div>
          </div>
          <div className="w-full max-w-xl">
            <Fretboard
              numFrets={MAX_FRET}
              activeString={target.stringIndex}
              interactive
              cellStatus={cellStatus}
              onCellClick={handleCellClick}
            />
          </div>
          <p className="text-xs text-[#6d7280]">Tap the fret on the highlighted string where that note lives.</p>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-3xl font-black text-accent">{value}</span>
      <span className="text-xs text-[#9aa0ad]">{label}</span>
    </div>
  );
}
