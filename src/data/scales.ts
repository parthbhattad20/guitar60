import type { ScalePattern } from '../types';

export const C_MAJOR_OPEN: ScalePattern = {
  id: 'c-major-open', name: 'C Major — Open Position', root: 'C',
  notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  degrees: ['1', '2', '3', '4', '5', '6', '7'],
  sequence: [
    { note: 'C', string: 5, fret: 3, finger: 3 }, { note: 'D', string: 4, fret: 0 },
    { note: 'E', string: 4, fret: 2, finger: 2 }, { note: 'F', string: 4, fret: 3, finger: 3 },
    { note: 'G', string: 3, fret: 0 }, { note: 'A', string: 3, fret: 2, finger: 2 },
    { note: 'B', string: 2, fret: 0 }, { note: 'C', string: 2, fret: 1, finger: 1 },
  ],
};

export const G_MAJOR_OPEN: ScalePattern = {
  id: 'g-major-open', name: 'G Major — Open Position', root: 'G',
  notes: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
  degrees: ['1', '2', '3', '4', '5', '6', '7'],
  sequence: [
    { note: 'G', string: 6, fret: 3, finger: 3 }, { note: 'A', string: 5, fret: 0 },
    { note: 'B', string: 5, fret: 2, finger: 2 }, { note: 'C', string: 5, fret: 3, finger: 3 },
    { note: 'D', string: 4, fret: 0 }, { note: 'E', string: 4, fret: 2, finger: 2 },
    { note: 'F#', string: 4, fret: 4, finger: 4 }, { note: 'G', string: 3, fret: 0 },
  ],
};

export const A_MINOR_PENTATONIC: ScalePattern = {
  id: 'a-minor-pentatonic-box-1', name: 'A Minor Pentatonic — Box 1', root: 'A',
  notes: ['A', 'C', 'D', 'E', 'G'],
  degrees: ['1', '♭3', '4', '5', '♭7'],
  sequence: [
    { note: 'A', string: 6, fret: 5, finger: 1 }, { note: 'C', string: 6, fret: 8, finger: 4 },
    { note: 'D', string: 5, fret: 5, finger: 1 }, { note: 'E', string: 5, fret: 7, finger: 3 },
    { note: 'G', string: 4, fret: 5, finger: 1 }, { note: 'A', string: 4, fret: 7, finger: 3 },
    { note: 'C', string: 3, fret: 5, finger: 1 }, { note: 'D', string: 3, fret: 7, finger: 3 },
    { note: 'E', string: 2, fret: 5, finger: 1 }, { note: 'G', string: 2, fret: 8, finger: 4 },
    { note: 'A', string: 1, fret: 5, finger: 1 }, { note: 'C', string: 1, fret: 8, finger: 4 },
  ],
};

export const SCALE_PATTERNS = [C_MAJOR_OPEN, G_MAJOR_OPEN, A_MINOR_PENTATONIC];
