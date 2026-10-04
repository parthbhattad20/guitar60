import type { FingerstylePattern, StrumPattern } from '../types';

export const STRUM_PATTERNS: StrumPattern[] = [
  {
    id: 'strum-1',
    name: 'Pattern 1 — All Downs',
    beats: ['D', 'D', 'D', 'D'],
    counts: ['1', '2', '3', '4'],
  },
  {
    id: 'strum-2',
    name: 'Pattern 2 — Down Down Up Up Down Up',
    beats: ['D', 'D', 'U', 'U', 'D', 'U'],
    counts: ['1', '2', '2&', '3', '3&', '4'],
  },
  {
    id: 'strum-3',
    name: 'Pattern 3 — D – DU – UDU',
    beats: ['D', '-', 'D', 'U', '-', 'U', 'D', 'U'],
    counts: ['1', '1&', '2', '2&', '3', '3&', '4', '4&'],
  },
  {
    id: 'strum-4',
    name: 'Pattern 4 — Alternating 8ths',
    beats: ['D', 'U', 'D', 'U', 'D', 'U', 'D', 'U'],
    counts: ['1', '1&', '2', '2&', '3', '3&', '4', '4&'],
  },
];

export const FINGERSTYLE_PATTERNS: FingerstylePattern[] = [
  {
    id: 'fs-1',
    name: 'Pattern 1 — P i m a',
    sequence: ['P', 'i', 'm', 'a'],
    stringForFinger: { P: 5, i: 3, m: 2, a: 1 },
  },
  {
    id: 'fs-2',
    name: 'Pattern 2 — P i m a m i',
    sequence: ['P', 'i', 'm', 'a', 'm', 'i'],
    stringForFinger: { P: 5, i: 3, m: 2, a: 1 },
  },
  {
    id: 'fs-3',
    name: 'Pattern 3 — Bass → G → B → e → B → G',
    sequence: ['P', 'i', 'm', 'a', 'm', 'i'],
    stringForFinger: { P: 5, i: 3, m: 2, a: 1 },
  },
];
