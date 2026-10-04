import type { ChordData } from '../types';

export function diffStrings(a: ChordData, b: ChordData) {
  const moving: number[] = [];
  const anchored: number[] = [];
  for (let i = 0; i < 6; i++) {
    const fa = a.frets[i];
    const fb = b.frets[i];
    const ga = a.fingers?.[i] ?? null;
    const gb = b.fingers?.[i] ?? null;
    if (fa === fb && ga === gb) anchored.push(i);
    else moving.push(i);
  }
  return { moving, anchored };
}
