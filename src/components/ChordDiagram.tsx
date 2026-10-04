import { useMemo } from 'react';
import type { ChordDiagramProps, StringStatus } from '../types';

const STRING_LABELS = ['E', 'A', 'D', 'G', 'B', 'e'];
const STRING_NUMBERS = [6, 5, 4, 3, 2, 1];

const STATUS_META: Record<Exclude<StringStatus, null>, { symbol: string; color: string; label: string }> = {
  clean: { symbol: '✓', color: 'var(--color-good)', label: 'Clean' },
  buzz: { symbol: '⚠', color: 'var(--color-warn)', label: 'Buzzing' },
  muted: { symbol: '✕', color: 'var(--color-bad)', label: 'Muted incorrectly' },
};

const SIZE_PX: Record<NonNullable<ChordDiagramProps['size']>, number> = {
  sm: 180,
  md: 280,
  lg: 380,
};

export default function ChordDiagram({
  chordName,
  frets,
  fingers,
  startFret,
  highlightedStrings = [],
  rootString,
  showFingerNumbers = true,
  interactive = false,
  barre,
  size = 'md',
  stringStatus,
  onStringClick,
  highlightFinger,
  showLegend = false,
  numFrets,
}: ChordDiagramProps) {
  const layout = useMemo(() => {
    const numericFrets = frets.filter((f): f is number => typeof f === 'number' && f > 0);
    const maxFret = numericFrets.length ? Math.max(...numericFrets) : 0;
    const resolvedStart =
      startFret ?? (maxFret <= 4 ? 1 : Math.min(...numericFrets));
    const resolvedFrets = numFrets ?? Math.max(4, maxFret - resolvedStart + 1);
    return { resolvedStart, resolvedFrets };
  }, [frets, startFret, numFrets]);

  const { resolvedStart, resolvedFrets } = layout;

  const colW = 40;
  const rowH = 44;
  const padTop = 54;
  const padBottom = 26;
  const padSide = 24;
  const width = colW * 5 + padSide * 2;
  const height = padTop + rowH * resolvedFrets + padBottom;

  const colX = (i: number) => padSide + i * colW;
  const rowY = (fretRow: number) => padTop + (fretRow - 0.5) * rowH;
  const fretLineY = (fretRow: number) => padTop + fretRow * rowH;

  const px = SIZE_PX[size];

  return (
    <div className="flex flex-col items-center gap-2" style={{ maxWidth: px }}>
      <div className="text-center">
        <div className="text-lg sm:text-xl font-bold text-white tracking-tight">{chordName}</div>
        {resolvedStart > 1 && (
          <div className="text-xs text-accent font-medium">starts at fret {resolvedStart}</div>
        )}
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        style={{ maxWidth: px }}
        className="select-none"
      >
        {/* Fret start number */}
        {resolvedStart > 1 && (
          <text
            x={padSide - 14}
            y={rowY(1)}
            fill="#8a8f9c"
            fontSize={14}
            fontWeight={700}
            textAnchor="end"
            dominantBaseline="middle"
          >
            {resolvedStart}fr
          </text>
        )}

        {/* Nut or top line */}
        {resolvedStart === 1 ? (
          <rect x={padSide} y={padTop} width={colW * 5} height={5} fill="#e9e8ea" rx={1} />
        ) : (
          <line
            x1={padSide}
            y1={padTop}
            x2={padSide + colW * 5}
            y2={padTop}
            stroke="#4a4e5a"
            strokeWidth={2}
          />
        )}

        {/* Fret lines */}
        {Array.from({ length: resolvedFrets }).map((_, i) => (
          <line
            key={`fretline-${i}`}
            x1={padSide}
            y1={fretLineY(i + 1)}
            x2={padSide + colW * 5}
            y2={fretLineY(i + 1)}
            stroke="#3a3d47"
            strokeWidth={1.5}
          />
        ))}

        {/* Strings (vertical) */}
        {STRING_NUMBERS.map((_, i) => {
          const isHighlighted = highlightedStrings.includes(i);
          return (
            <line
              key={`string-${i}`}
              x1={colX(i)}
              y1={padTop}
              x2={colX(i)}
              y2={padTop + rowH * resolvedFrets}
              stroke={isHighlighted ? 'var(--color-accent)' : '#5c6070'}
              strokeWidth={isHighlighted ? 3 : 1.5}
            />
          );
        })}

        {/* Barre bar */}
        {barre && (
          (() => {
            const fromCol = 6 - barre.fromString;
            const toCol = 6 - barre.toString;
            const row = barre.fret - resolvedStart + 1;
            if (row < 1 || row > resolvedFrets) return null;
            const x1 = colX(Math.min(fromCol, toCol));
            const x2 = colX(Math.max(fromCol, toCol));
            const isDimmed = highlightFinger != null && highlightFinger !== barre.finger;
            return (
              <g opacity={isDimmed ? 0.25 : 1}>
                <rect
                  x={x1 - 14}
                  y={rowY(row) - 13}
                  width={x2 - x1 + 28}
                  height={26}
                  rx={13}
                  fill="var(--color-accent)"
                  stroke="#dff0ff"
                  strokeWidth={highlightFinger === barre.finger ? 2 : 0}
                  className={highlightFinger === barre.finger ? 'pulse-ring' : ''}
                />
                <text
                  x={(x1 + x2) / 2}
                  y={rowY(row)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={13}
                  fontWeight={800}
                  fill="#06121f"
                >
                  {barre.finger}
                </text>
              </g>
            );
          })()
        )}

        {/* Open / muted markers above nut */}
        {frets.map((f, i) => {
          if (f !== 'o' && f !== 'x') return null;
          const isRoot = rootString === STRING_NUMBERS[i];
          return (
            <g key={`oxm-${i}`}>
              {f === 'o' ? (
                <circle
                  cx={colX(i)}
                  cy={padTop - 16}
                  r={8}
                  fill="none"
                  stroke={isRoot ? 'var(--color-gold)' : '#c9ccd4'}
                  strokeWidth={2.5}
                />
              ) : (
                <text
                  x={colX(i)}
                  y={padTop - 11}
                  textAnchor="middle"
                  fontSize={16}
                  fontWeight={800}
                  fill="var(--color-bad)"
                >
                  ✕
                </text>
              )}
            </g>
          );
        })}

        {/* Finger dots for fretted notes not covered by a full barre row already drawn generically */}
        {frets.map((f, i) => {
          if (typeof f !== 'number' || f === 0) return null;
          const row = f - resolvedStart + 1;
          if (row < 1 || row > resolvedFrets) return null;
          const finger = fingers?.[i] ?? null;
          const isBarredHere =
            barre && barre.fret === f && (() => {
              const colIdx = i;
              const fromCol = 6 - barre.fromString;
              const toCol = 6 - barre.toString;
              const lo = Math.min(fromCol, toCol);
              const hi = Math.max(fromCol, toCol);
              return colIdx >= lo && colIdx <= hi && finger === barre.finger;
            })();
          if (isBarredHere) return null; // already rendered as part of the barre bar
          const isRoot = rootString === STRING_NUMBERS[i];
          const isDimmed = highlightFinger != null && highlightFinger !== finger;
          return (
            <g key={`dot-${i}`} opacity={isDimmed ? 0.25 : 1}>
              <circle
                cx={colX(i)}
                cy={rowY(row)}
                r={13}
                fill={isRoot ? 'var(--color-gold)' : '#e9e8ea'}
                stroke={highlightFinger === finger ? 'var(--color-accent)' : 'none'}
                strokeWidth={3}
                className={highlightFinger === finger ? 'pulse-ring' : ''}
              />
              {showFingerNumbers && finger != null && (
                <text
                  x={colX(i)}
                  y={rowY(row) + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={13}
                  fontWeight={800}
                  fill="#06121f"
                >
                  {finger}
                </text>
              )}
            </g>
          );
        })}

        {/* Interactive string-check markers below the diagram */}
        {interactive && (
          <g>
            {STRING_NUMBERS.map((_, i) => {
              const status = stringStatus?.[i] ?? null;
              const meta = status ? STATUS_META[status] : null;
              return (
                <g
                  key={`check-${i}`}
                  transform={`translate(${colX(i)}, ${height - 8})`}
                  style={{ cursor: onStringClick ? 'pointer' : 'default' }}
                  onClick={() => onStringClick?.(i)}
                >
                  <circle r={11} fill={meta ? meta.color : '#2a2d36'} stroke="#52565f" strokeWidth={1} />
                  <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={12}
                    fontWeight={800}
                    fill="#06121f"
                    y={1}
                  >
                    {meta ? meta.symbol : ''}
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* String labels at bottom */}
        {STRING_LABELS.map((label, i) => (
          <text
            key={`label-${i}`}
            x={colX(i)}
            y={height - (interactive ? 30 : 8)}
            textAnchor="middle"
            fontSize={11}
            fill="#6d7280"
            fontWeight={600}
          >
            {label}
          </text>
        ))}
      </svg>

      {showLegend && (
        <div className="flex flex-wrap gap-3 justify-center text-[11px] text-[#9aa0ad] mt-1">
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full border-2 border-[#c9ccd4]" /> open
          </span>
          <span className="flex items-center gap-1">
            <span className="text-[var(--color-bad)] font-bold">✕</span> muted
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full bg-[#e9e8ea]" /> fretted (finger #)
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-4 h-2.5 rounded-full bg-[var(--color-accent)]" /> barre
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full bg-[var(--color-gold)]" /> root note
          </span>
        </div>
      )}
    </div>
  );
}
