export const CHROMATIC = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/** Index 0 = string 6 (low E) ... index 5 = string 1 (high e), matching ChordData.frets. */
export const OPEN_STRING_NOTES = ['E', 'A', 'D', 'G', 'B', 'E'];

export function noteAt(stringIndex: number, fret: number): string {
  const openIdx = CHROMATIC.indexOf(OPEN_STRING_NOTES[stringIndex]);
  return CHROMATIC[(openIdx + fret) % 12];
}

const MAJOR_SCALE_STEPS = [2, 2, 1, 2, 2, 2, 1]; // whole-whole-half-whole-whole-whole-half

/** Scale degree note names starting at `rootNote`, walking the chromatic circle. */
export function majorScaleFrom(rootNote: string): string[] {
  const startIdx = CHROMATIC.indexOf(rootNote);
  const notes = [rootNote];
  let idx = startIdx;
  for (const step of MAJOR_SCALE_STEPS.slice(0, 6)) {
    idx = (idx + step) % 12;
    notes.push(CHROMATIC[idx]);
  }
  return notes; // 7 notes, degrees 1-7
}

/** Fret (0-11) on a given string where `note` occurs, lowest position. */
export function fretForNote(stringIndex: number, note: string): number {
  const openIdx = CHROMATIC.indexOf(OPEN_STRING_NOTES[stringIndex]);
  const targetIdx = CHROMATIC.indexOf(note);
  return (targetIdx - openIdx + 12) % 12;
}
