export type VerticalRhythm = {
  baseSize: number
  baseLineHeight: number
  ratio: number
}

export type VerticalRhythmRootStyle = {
  fontSize: string
  lineHeight: string
}

export type VerticalRhythmStyle = {
  fontSize: string
}

export function getVerticalRhythmRootStyle(
  rhythm: VerticalRhythm
): VerticalRhythmRootStyle {
  return {
    fontSize: `${rhythm.baseSize}px`,
    lineHeight: `${rhythm.baseLineHeight}`,
  }
}

export function getVerticalRhythmStyle(
  rhythm: VerticalRhythm,
  level: number
): VerticalRhythmStyle {
  const factor = computeSize(rhythm.ratio, level)
  return {
    fontSize: `${factor}em`,
  }
}

function computeSize(ratio: number, level: number): number {
  let size = 1
  for (let i = 1; i < level; i++, size *= ratio);
  return Math.round(size * 100) / 100
}
