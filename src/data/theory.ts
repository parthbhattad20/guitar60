import type { TheoryStep } from '../types';

export const THEORY_STEPS: TheoryStep[] = [
  {
    id: 'alphabet',
    title: 'The Musical Alphabet',
    render: 'alphabet',
    instructions: [
      'Music uses just 7 letter names: A B C D E F G, then it repeats.',
      'Between most letters sits a sharp note (#) — except between B→C and E→F, which are already right next to each other.',
      'A sharp (#) and the next letter\'s flat (♭) are often the same physical note — C# is the same pitch as D♭.',
      'Every fret on your guitar moves you one step through this alphabet, sharps included.',
    ],
  },
  {
    id: 'fretboard-notes',
    title: 'Notes on the Fretboard',
    render: 'fretboard-all',
    instructions: [
      'Each open string already has a name — low to high: E, A, D, G, B, e.',
      'Moving up one fret raises the pitch by one half step, following the musical alphabet.',
      'This full map shows every note name up to fret 12 — where the pattern repeats an octave higher.',
      'You don\'t need to memorize this instantly. Spend a minute finding all the "A" notes, then all the "C" notes.',
    ],
    xpReward: 10,
  },
  {
    id: 'half-steps',
    title: 'Half Steps & Whole Steps',
    render: 'half-steps',
    instructions: [
      'One fret = one half step. Two frets = one whole step. That\'s the entire distance system on a guitar neck.',
      'On the low E string: E (half step) F (whole step) G (whole step) A...',
      'Notice E→F is only a half step (no fret skipped) — same with B→C. Every other letter is a whole step apart unless sharped.',
      'This spacing is the foundation for every scale and chord shape you\'ll build next.',
    ],
    xpReward: 10,
  },
  {
    id: 'major-scale',
    title: 'Building the Major Scale',
    render: 'scale-builder',
    instructions: [
      'Every major scale follows the same recipe of steps: Whole – Whole – Half – Whole – Whole – Whole – Half.',
      'Pick a root note below and watch the scale build itself across the fretboard using that formula — the low E string is highlighted brightest.',
      'The highlighted frets are scale degrees 1 through 7 — degree 1 is the root, the note that names the key.',
      'This is the shape behind nearly every melody and solo you\'ll eventually play.',
    ],
    xpReward: 15,
  },
  {
    id: 'triads',
    title: 'How Chords Are Built — Triads',
    render: 'triad',
    instructions: [
      'A basic chord (a "triad") stacks three notes from the major scale: degree 1 (root), degree 3, and degree 5.',
      'For C major, that\'s C (root), E (3rd), and G (5th) — exactly the notes your open C chord diagram uses.',
      'Every open chord you learned in this course is really just a root-3rd-5th triad spread across six strings.',
      'The root note is the one that gives the chord its name and is usually its lowest note.',
    ],
    xpReward: 15,
  },
  {
    id: 'major-vs-minor',
    title: 'Major vs Minor',
    render: 'major-minor',
    instructions: [
      'The only difference between a major and minor chord is the 3rd — major uses the regular 3rd, minor lowers it by one half step (one fret).',
      'Compare E major and E minor below — same root and 5th, only the note on the G string changes by one fret.',
      'That single half-step shift is why minor chords sound darker — it\'s the same recipe with one ingredient changed.',
      'Try this on any major chord you know: find the 3rd and drop it one fret to hear it turn minor.',
    ],
    xpReward: 15,
  },
];
