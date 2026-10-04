import type { ChordData } from '../types';

// Index 0 = string 6 (low E) ... index 5 = string 1 (high e)

export const OPEN_CHORDS: Record<string, ChordData> = {
  C: {
    id: 'C',
    name: 'C major',
    frets: ['x', 3, 2, 'o', 1, 'o'],
    fingers: [null, 3, 2, null, 1, null],
    rootString: 5,
    category: 'open',
  },
  G: {
    id: 'G',
    name: 'G major',
    frets: [3, 2, 'o', 'o', 'o', 3],
    fingers: [2, 1, null, null, null, 3],
    rootString: 6,
    category: 'open',
  },
  D: {
    id: 'D',
    name: 'D major',
    frets: ['x', 'o', 'o', 2, 3, 2],
    fingers: [null, null, null, 1, 3, 2],
    rootString: 5,
    category: 'open',
  },
  Em: {
    id: 'Em',
    name: 'E minor',
    frets: [0, 2, 2, 0, 0, 0],
    fingers: [null, 2, 3, null, null, null],
    rootString: 6,
    category: 'open',
  },
  Am: {
    id: 'Am',
    name: 'A minor',
    frets: ['x', 0, 2, 2, 1, 0],
    fingers: [null, null, 2, 3, 1, null],
    rootString: 5,
    category: 'open',
  },
  E: {
    id: 'E',
    name: 'E major',
    frets: [0, 2, 2, 1, 0, 0],
    fingers: [null, 2, 3, 1, null, null],
    rootString: 6,
    category: 'open',
  },
  A: {
    id: 'A',
    name: 'A major',
    frets: ['x', 0, 2, 2, 2, 0],
    fingers: [null, null, 1, 2, 3, null],
    rootString: 5,
    category: 'open',
  },
  Dm: {
    id: 'Dm',
    name: 'D minor',
    frets: ['x', 0, 0, 2, 3, 1],
    fingers: [null, null, null, 2, 3, 1],
    rootString: 5,
    category: 'open',
  },
  Fmaj7: {
    id: 'Fmaj7',
    name: 'F major 7 (easy F)',
    frets: ['x', 'x', 3, 2, 1, 0],
    fingers: [null, null, 3, 2, 1, null],
    rootString: 4,
    category: 'open',
  },
};

/** E-shape major barre, root on string 6. Classic fingering: index barre, ring (5), pinky (4), middle (3). */
export function eShapeMajor(fret: number): ChordData {
  const name =
    { 1: 'F', 2: 'F#', 3: 'G', 4: 'G#', 5: 'A', 6: 'A#', 7: 'B', 8: 'C' }[fret] ?? `E-shape @${fret}`;
  return {
    id: `E-major-${fret}`,
    name: `${name} major`,
    frets: [fret, fret + 2, fret + 2, fret + 1, fret, fret],
    fingers: [1, 3, 4, 2, 1, 1],
    startFret: fret,
    rootString: 6,
    shape: 'E-major',
    isBarre: true,
    category: 'barre',
    barre: { fret, fromString: 6, toString: 1, finger: 1 },
  };
}

/** E-shape minor barre, root on string 6. Index barre, ring (5), pinky (4). */
export function eShapeMinor(fret: number): ChordData {
  const name =
    { 1: 'Fm', 2: 'F#m', 3: 'Gm', 4: 'G#m', 5: 'Am', 6: 'A#m', 7: 'Bm', 8: 'Cm' }[fret] ?? `Em-shape @${fret}`;
  return {
    id: `E-minor-${fret}`,
    name,
    frets: [fret, fret + 2, fret + 2, fret, fret, fret],
    fingers: [1, 3, 4, 1, 1, 1],
    startFret: fret,
    rootString: 6,
    shape: 'E-minor',
    isBarre: true,
    category: 'barre',
    barre: { fret, fromString: 6, toString: 1, finger: 1 },
  };
}

/** A-shape major barre, root on string 5. 6th string muted. Index barre + ring mini-barre on 4-3-2. */
export function aShapeMajor(fret: number): ChordData {
  const name =
    { 1: 'Bb', 2: 'B', 3: 'C', 4: 'C#', 5: 'D', 6: 'D#', 7: 'E', 8: 'F' }[fret] ?? `A-shape @${fret}`;
  return {
    id: `A-major-${fret}`,
    name: `${name} major`,
    frets: ['x', fret, fret + 2, fret + 2, fret + 2, fret],
    fingers: [null, 1, 3, 3, 3, 1],
    startFret: fret,
    rootString: 5,
    shape: 'A-major',
    isBarre: true,
    category: 'barre',
    barre: { fret, fromString: 5, toString: 1, finger: 1 },
  };
}

/** A-shape minor barre, root on string 5. 6th string muted. */
export function aShapeMinor(fret: number): ChordData {
  const name =
    { 1: 'Bbm', 2: 'Bm', 3: 'Cm', 4: 'C#m', 5: 'Dm', 6: 'D#m', 7: 'Em', 8: 'Fm' }[fret] ?? `Am-shape @${fret}`;
  return {
    id: `A-minor-${fret}`,
    name,
    frets: ['x', fret, fret + 2, fret + 2, fret + 1, fret],
    fingers: [null, 1, 3, 4, 2, 1],
    startFret: fret,
    rootString: 5,
    shape: 'A-minor',
    isBarre: true,
    category: 'barre',
    barre: { fret, fromString: 5, toString: 1, finger: 1 },
  };
}

export const BARRE_CHORDS = {
  F: eShapeMajor(1),
  'F#': eShapeMajor(2),
  G_barre: eShapeMajor(3),
  A_barre: eShapeMajor(5),
  Fm: eShapeMinor(1),
  Gm: eShapeMinor(3),
  Am_barre: eShapeMinor(5),
  Bb: aShapeMajor(1),
  B: aShapeMajor(2),
  C_barre: aShapeMajor(3),
  D_barre: aShapeMajor(5),
  Bm: aShapeMinor(2),
  Cm: aShapeMinor(3),
  Dm_barre: aShapeMinor(5),
  'C#m': aShapeMinor(4),
};

export function getChord(id: string): ChordData {
  if (id in OPEN_CHORDS) return OPEN_CHORDS[id];
  if (id in BARRE_CHORDS) return BARRE_CHORDS[id as keyof typeof BARRE_CHORDS];
  throw new Error(`Unknown chord: ${id}`);
}
