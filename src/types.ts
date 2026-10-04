// Core domain types for Guitar 60

export type FretValue = number | 'x' | 'o';
export type FingerValue = 1 | 2 | 3 | 4 | null;

export interface BarreInfo {
  fret: number;
  fromString: number; // 1-6, string index where barre starts (high string count e.g. 6)
  toString: number; // string index where barre ends
  finger: 1 | 2 | 3 | 4;
}

export interface ChordData {
  id: string;
  name: string;
  /** Index 0 = string 6 (low E) ... index 5 = string 1 (high e) */
  frets: FretValue[];
  fingers?: FingerValue[];
  startFret?: number;
  rootString?: number; // 1-6
  barre?: BarreInfo;
  shape?: 'E-major' | 'E-minor' | 'A-major' | 'A-minor' | 'open';
  isBarre?: boolean;
  category?: 'open' | 'barre' | 'other';
}

export interface ChordDiagramProps {
  chordName: string;
  frets: FretValue[];
  fingers?: FingerValue[];
  startFret?: number;
  highlightedStrings?: number[];
  rootString?: number;
  showFingerNumbers?: boolean;
  interactive?: boolean;
  barre?: BarreInfo;
  size?: 'sm' | 'md' | 'lg';
  stringStatus?: StringStatus[];
  onStringClick?: (stringIndex: number) => void;
  highlightFinger?: FingerValue;
  showLegend?: boolean;
  numFrets?: number;
}

export type StringStatus = 'clean' | 'buzz' | 'muted' | null;

export type LessonStepType =
  | 'lesson'
  | 'chord'
  | 'exercise'
  | 'challenge'
  | 'timer'
  | 'change'
  | 'strum'
  | 'barre'
  | 'barre-game'
  | 'fingerstyle'
  | 'final'
  | 'complete';

export interface ChordChangePair {
  from: ChordData;
  to: ChordData;
  anchoredFingers?: string;
  movingFingers?: string;
}

export interface StrumPattern {
  id: string;
  name: string;
  beats: ('D' | 'U' | '-')[];
  counts: string[];
}

export interface FingerstylePattern {
  id: string;
  name: string;
  sequence: ('P' | 'i' | 'm' | 'a')[];
  stringForFinger: Record<'P' | 'i' | 'm' | 'a', number>;
}

export interface LessonStep {
  id: string;
  section: string;
  sectionIndex: number;
  title: string;
  durationSeconds: number;
  type: LessonStepType;
  instructions: string[];
  chord?: ChordData;
  chords?: ChordData[];
  pair?: ChordChangePair;
  pairs?: ChordChangePair[];
  bpm?: number;
  pattern?: StrumPattern;
  patterns?: StrumPattern[];
  fingerstylePattern?: FingerstylePattern;
  fingerstylePatterns?: FingerstylePattern[];
  badgeOnComplete?: string;
  xpReward?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface GameState {
  xp: number;
  level: number;
  streak: number;
  completedSteps: Set<string>;
  earnedBadges: Set<string>;
  chordsPracticed: Set<string>;
  barreChordsPracticed: Set<string>;
  fingerstylePatternsPracticed: Set<string>;
  highestBpm: number;
  totalRetries: number;
  exercisesCompleted: number;
}
