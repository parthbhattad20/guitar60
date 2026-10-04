import type { LessonStep } from '../types';
import { OPEN_CHORDS, eShapeMajor, eShapeMinor, aShapeMajor, aShapeMinor, BARRE_CHORDS } from './chords';
import { STRUM_PATTERNS, FINGERSTYLE_PATTERNS } from './patterns';

const S1 = 'Warm-up & Finger Activation';
const S2 = 'Open Chord Mastery';
const S3 = 'Clean Chord Changes';
const S4 = 'Strumming Training';
const S5 = 'Barre Chord Fundamentals';
const S6 = 'Barre Chord Practice Game';
const S7 = 'Fingerstyle';
const S8 = 'Final Performance Challenge';

let counter = 0;
function id(prefix: string) {
  counter += 1;
  return `${prefix}-${counter}`;
}

const stage1: LessonStep[] = [
  {
    id: id('s1'),
    section: S1,
    sectionIndex: 1,
    title: 'Get Comfortable',
    durationSeconds: 30,
    type: 'lesson',
    instructions: [
      'Sit with your back straight, guitar resting on your right leg (or left, if classical style).',
      'The neck should angle slightly upward — not flat and not pointing at the floor.',
      'Keep your fretting-hand wrist relatively straight, thumb resting behind the neck like a hook.',
      'Relax your shoulders. Tension in your shoulders travels straight into your fretting hand.',
    ],
  },
  {
    id: id('s1'),
    section: S1,
    sectionIndex: 1,
    title: 'Meet the Six Strings',
    durationSeconds: 30,
    type: 'lesson',
    instructions: [
      'String 6 (thickest) = Low E',
      'String 5 = A',
      'String 4 = D',
      'String 3 = G',
      'String 2 = B',
      'String 1 (thinnest) = High e',
      'Strings are numbered thinnest-to-thickest: string 1 is closest to the floor, string 6 closest to the ceiling.',
    ],
    chord: { id: 'open-strings', name: 'Open Strings', frets: [0, 0, 0, 0, 0, 0], category: 'other' },
  },
  {
    id: id('s1'),
    section: S1,
    sectionIndex: 1,
    title: 'Meet Your Fingers',
    durationSeconds: 30,
    type: 'lesson',
    instructions: [
      'Finger 1 = Index',
      'Finger 2 = Middle',
      'Finger 3 = Ring',
      'Finger 4 = Little (pinky)',
      'Every diagram in this course labels dots with these numbers — memorize them now.',
    ],
  },
  {
    id: id('s1'),
    section: S1,
    sectionIndex: 1,
    title: 'Chromatic Warm-up — 1 2 3 4',
    durationSeconds: 60,
    type: 'exercise',
    instructions: [
      'On the low E string, place finger 1 on fret 1, finger 2 on fret 2, finger 3 on fret 3, finger 4 on fret 4.',
      'Play each fret one at a time, keeping unused fingers hovering close to the string.',
      'Move the same 1-2-3-4 pattern across strings A, D, G, B and high e.',
      'Go slowly — clean notes matter more than speed.',
    ],
    bpm: 60,
  },
  {
    id: id('s1'),
    section: S1,
    sectionIndex: 1,
    title: 'Chromatic Warm-up — Reverse 4 3 2 1',
    durationSeconds: 30,
    type: 'exercise',
    instructions: [
      'Now reverse it: finger 4 first, then 3, then 2, then 1, on each string.',
      'This builds independence in your pinky, which is usually your weakest finger.',
      'Cross all six strings in the same reverse order.',
    ],
    bpm: 60,
  },
  {
    id: id('s1'),
    section: S1,
    sectionIndex: 1,
    title: '60-Second Countdown Challenge',
    durationSeconds: 60,
    type: 'timer',
    instructions: [
      'Repeat the 1-2-3-4 and 4-3-2-1 pattern continuously for 60 seconds.',
      'Keep your fretting-hand thumb anchored behind the neck the whole time.',
      'Press Start and keep going until the countdown hits zero.',
    ],
  },
  {
    id: id('s1'),
    section: S1,
    sectionIndex: 1,
    title: 'Warm-up Complete',
    durationSeconds: 60,
    type: 'exercise',
    instructions: [
      'Shake your fretting hand out for a few seconds to release tension.',
      'Your fingers are now activated and ready for chord shapes.',
      'Click Mark Complete when you feel ready to move on.',
    ],
    badgeOnComplete: undefined,
    xpReward: 20,
  },
];

function chordMasterySteps(chordId: keyof typeof OPEN_CHORDS): LessonStep[] {
  const chord = OPEN_CHORDS[chordId];
  return [
    {
      id: id('s2'),
      section: S2,
      sectionIndex: 2,
      title: `${chord.name} — Learn the Shape`,
      durationSeconds: 30,
      type: 'chord',
      instructions: [
        'Place your fingers on the frets shown, one at a time.',
        'Check each string — press firmly just behind the fret wire.',
        'Strum slowly from the lowest playable string to the highest.',
        'Release your hand completely and shake it loose.',
        'Repeat the shape from scratch 5 times.',
      ],
      chord,
      xpReward: 15,
    },
    {
      id: id('s2'),
      section: S2,
      sectionIndex: 2,
      title: `${chord.name} — String Check`,
      durationSeconds: 45,
      type: 'exercise',
      instructions: [
        'Tap each string in the diagram below to mark it: Clean, Buzzing, or Muted.',
        'This is a visual self-assessment — listen closely to your own guitar as you strum each string individually.',
        'Aim for all six strings showing clean before moving on.',
      ],
      chord,
      xpReward: 15,
    },
  ];
}

const stage2: LessonStep[] = [
  'C', 'G', 'D', 'Em', 'Am', 'E', 'A', 'Dm',
].flatMap((c) => chordMasterySteps(c as keyof typeof OPEN_CHORDS));

function changeStep(fromId: string, toId: string, title: string): LessonStep {
  return {
    id: id('s3'),
    section: S3,
    sectionIndex: 3,
    title,
    durationSeconds: 75,
    type: 'change',
    instructions: [
      'Study both shapes, then look at which fingers are highlighted as "movers".',
      'Keep your strumming (right) hand moving in continuous, steady motion — never stop it to wait for your left hand.',
      'Start at 4 beats per chord, then tighten to 2 beats, then 1 beat per chord.',
      'Use the BPM selector to control tempo, and watch the metronome dot.',
    ],
    chords: [OPEN_CHORDS[fromId], OPEN_CHORDS[toId]],
    bpm: 60,
    xpReward: 25,
  };
}

const stage3: LessonStep[] = [
  changeStep('C', 'G', 'Change 1 — C to G'),
  changeStep('G', 'D', 'Change 2 — G to D'),
  changeStep('D', 'Em', 'Change 3 — D to Em'),
  changeStep('Em', 'C', 'Change 4 — Em to C'),
  changeStep('Am', 'C', 'Change 5 — Am to C'),
  changeStep('E', 'A', 'Change 6 — E to A'),
  changeStep('A', 'D', 'Change 7 — A to D'),
  changeStep('D', 'Am', 'Change 8 — D to Am'),
];

const stage4: LessonStep[] = STRUM_PATTERNS.map((pattern, i) => ({
  id: id('s4'),
  section: S4,
  sectionIndex: 4,
  title: pattern.name,
  durationSeconds: 120,
  type: 'strum',
  instructions: [
    'Watch the down/up arrows highlight in time with the beat.',
    'Your strumming hand should move continuously — even on counts you mute or skip, the hand keeps swinging.',
    'Silent strokes still require motion: "ghost" the strum rather than stopping your arm.',
    i === 3
      ? 'Apply this pattern to C → G → Am → F (use easy Fmaj7 for now — the full barre F comes later).'
      : 'Apply this pattern over the progression C → G → Am → F (easy Fmaj7 for now).',
  ],
  pattern,
  chords: [OPEN_CHORDS.C, OPEN_CHORDS.G, OPEN_CHORDS.Am, OPEN_CHORDS.Fmaj7],
  bpm: 70,
  xpReward: 20,
}));

const stage5: LessonStep[] = [
  {
    id: id('s5'),
    section: S5,
    sectionIndex: 5,
    title: 'What Is a Barre Chord?',
    durationSeconds: 60,
    type: 'lesson',
    instructions: [
      'A barre chord uses one finger — usually the index — to press multiple strings flat against a single fret.',
      'This lets you take an open-chord shape and slide it anywhere on the neck, playing the same shape in a new key.',
      'The biggest challenge is consistent pressure across the whole barre finger — any gap causes a dead or buzzing string.',
    ],
  },
  {
    id: id('s5'),
    section: S5,
    sectionIndex: 5,
    title: 'E-Shape Major Barre — F Major',
    durationSeconds: 90,
    type: 'barre',
    instructions: [
      'String 6 — fret 1 — index (part of the barre)',
      'String 5 — fret 3 — ring',
      'String 4 — fret 3 — little finger',
      'String 3 — fret 2 — middle',
      'String 2 — fret 1 — index (barre)',
      'String 1 — fret 1 — index (barre)',
      'The index finger lies flat across all six strings at fret 1 — that continuous bar is what makes this an "E-shape" barre chord.',
    ],
    chord: eShapeMajor(1),
    xpReward: 30,
  },
  {
    id: id('s5'),
    section: S5,
    sectionIndex: 5,
    title: 'Move the Shape — E-Shape Major',
    durationSeconds: 120,
    type: 'barre',
    instructions: [
      'Open E major is played: E–A–D–G–B–e = 0–2–2–1–0–0.',
      'Slide that exact shape up the neck and use your index finger as a barre instead of playing the open strings.',
      'Fret 1 = F major · Fret 2 = F# major · Fret 3 = G major · Fret 5 = A major.',
      'Pick a fret below and watch the diagram update — the shape never changes, only its position.',
    ],
    chords: [1, 2, 3, 5].map(eShapeMajor),
    xpReward: 25,
  },
  {
    id: id('s5'),
    section: S5,
    sectionIndex: 5,
    title: 'E-Shape Minor Barre',
    durationSeconds: 120,
    type: 'barre',
    instructions: [
      'Open E minor is played: E–A–D–G–B–e = 0–2–2–0–0–0 — simpler than the major shape because strings 3, 2 and 1 are all open.',
      'Barre that shape and the index now covers strings 6, 3, 2 and 1 at the same fret, with ring and pinky on string 5 and 4.',
      'Fret 1 = F minor · Fret 3 = G minor · Fret 5 = A minor.',
    ],
    chords: [1, 3, 5].map(eShapeMinor),
    xpReward: 25,
  },
  {
    id: id('s5'),
    section: S5,
    sectionIndex: 5,
    title: 'A-Shape Major Barre',
    durationSeconds: 120,
    type: 'barre',
    instructions: [
      'Open A major is played: x–0–2–2–2–0 — the 6th string is already muted in the open shape.',
      'When you barre this shape, the index covers strings 5 through 1 (6th string stays muted) and a flat ring-finger mini-barre covers the 4-3-2 string triad two frets higher.',
      'Fret 1 = Bb major · Fret 2 = B major · Fret 3 = C major · Fret 5 = D major.',
      'The root note for every A-shape barre chord lives on the 5th string.',
    ],
    chords: [1, 2, 3, 5].map(aShapeMajor),
    xpReward: 25,
  },
  {
    id: id('s5'),
    section: S5,
    sectionIndex: 5,
    title: 'A-Shape Minor Barre — B Minor',
    durationSeconds: 120,
    type: 'barre',
    instructions: [
      'Open A minor is played: x–0–2–2–1–0. Barring it at fret 2 gives you B minor — one of the most common barre chords in modern music.',
      'Index finger barres fret 2 (muting the 6th string deliberately), ring finger takes string 4, pinky takes string 3, middle finger takes string 2.',
      'The 5th string (fret 2) is the root — that is why A-shape chords are named from their 5th-string note.',
    ],
    chord: aShapeMinor(2),
    xpReward: 30,
  },
  {
    id: id('s5'),
    section: S5,
    sectionIndex: 5,
    title: 'E-Shape vs A-Shape',
    durationSeconds: 90,
    type: 'barre',
    instructions: [
      'E-shape barre chords root on the thick 6th string — the whole chord is built from the open E major/minor shape.',
      'A-shape barre chords root on the 5th string — built from the open A major/minor shape, with the 6th string muted.',
      'Toggle between the two shapes below and watch the diagram and explanation update.',
    ],
    chords: [eShapeMajor(1), aShapeMajor(1)],
  },
];

function barreChallenge(title: string, chordIds: string[]): LessonStep {
  return {
    id: id('s6'),
    section: S6,
    sectionIndex: 6,
    title,
    durationSeconds: 120,
    type: 'barre-game',
    instructions: [
      'Form the barre, then check all six strings mentally before you strum.',
      'Hold the shape cleanly for 3 seconds, release completely, then reform it from scratch.',
      'Relax your hand between repetitions — do not squeeze the neck continuously.',
      'Move through the sequence at 4 beats per chord, starting at 40 BPM.',
    ],
    chords: chordIds.map((c) => BARRE_CHORDS[c as keyof typeof BARRE_CHORDS]),
    bpm: 40,
    xpReward: 40,
  };
}

const stage6: LessonStep[] = [
  barreChallenge('Challenge 1 — F → G → A', ['F', 'G_barre', 'A_barre']),
  barreChallenge('Challenge 2 — Bm → Cm → Dm', ['Bm', 'Cm', 'Dm_barre']),
  barreChallenge('Challenge 3 — F → C → G', ['F', 'C_barre', 'G_barre']),
  barreChallenge('Challenge 4 — Am → Bm → C#m', ['Am_barre', 'Bm', 'C#m']),
];

const stage7: LessonStep[] = [
  {
    id: id('s7'),
    section: S7,
    sectionIndex: 7,
    title: 'Right-Hand Fingerstyle Roles',
    durationSeconds: 45,
    type: 'lesson',
    instructions: [
      'P (thumb) plays the bass strings — usually strings 6, 5 or 4 depending on the chord.',
      'i (index) plays the G string (3rd string).',
      'm (middle) plays the B string (2nd string).',
      'a (ring) plays the high e string (1st string).',
      'Each finger "owns" its string — resist the urge to let your thumb wander onto the treble strings.',
    ],
  },
  ...FINGERSTYLE_PATTERNS.map((p, i) => ({
    id: id('s7'),
    section: S7,
    sectionIndex: 7,
    title: p.name,
    durationSeconds: i === 2 ? 90 : 60,
    type: 'fingerstyle' as const,
    instructions:
      i === 2
        ? [
            'Play the bass note with your thumb, then walk up G → B → e and back down B → G.',
            'Apply this over C → Am → Em → G, changing chords every full pattern.',
            'Use the slow 50 BPM mode until the motion feels automatic.',
          ]
        : [
            'Watch which string lights up as each finger plays — thumb, then index, then middle, then ring.',
            'Keep your hand hovering in place; only the fingers move, not the whole hand.',
            'Loop the pattern slowly before increasing speed.',
          ],
    fingerstylePattern: p,
    chords: [OPEN_CHORDS.C, OPEN_CHORDS.Am, OPEN_CHORDS.Em, OPEN_CHORDS.G],
    bpm: i === 2 ? 50 : 60,
    xpReward: 20,
  })),
];

const stage8: LessonStep[] = [
  {
    id: id('s8'),
    section: S8,
    sectionIndex: 8,
    title: 'Final 2-Minute Performance Challenge',
    durationSeconds: 120,
    type: 'final',
    instructions: [
      'Choose your technique: strumming, fingerstyle, or barre chords.',
      'Play through C → G → Am → F, then G → D → Em → C.',
      'Keep going for the full 2 minutes — the progression loops automatically.',
      'This is a self-paced performance, not an audio-graded test.',
    ],
    chords: [OPEN_CHORDS.C, OPEN_CHORDS.G, OPEN_CHORDS.Am, OPEN_CHORDS.Fmaj7],
    bpm: 70,
    xpReward: 60,
  },
];

const complete: LessonStep = {
  id: 'complete',
  section: 'Complete',
  sectionIndex: 9,
  title: 'Session Complete',
  durationSeconds: 0,
  type: 'complete',
  instructions: [],
};

export const LESSON_STEPS: LessonStep[] = [
  ...stage1,
  ...stage2,
  ...stage3,
  ...stage4,
  ...stage5,
  ...stage6,
  ...stage7,
  ...stage8,
  complete,
];

export const TOTAL_PLANNED_SECONDS = LESSON_STEPS.reduce((sum, s) => sum + s.durationSeconds, 0);

export const SECTION_NAMES = [S1, S2, S3, S4, S5, S6, S7, S8];
