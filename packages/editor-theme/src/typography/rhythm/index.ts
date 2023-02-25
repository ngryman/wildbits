export * from './presets'

export type Rhythm = {
  baseSize: number
  baseLineHeight: number
  ratio: number
}

export type RhythmRootStyle = {
  fontSize: string
  lineHeight: string
}

export type RhythmStyle = {
  fontSize: string
}

export function getRhythmRootStyle(rhythm: Rhythm): RhythmRootStyle {
  return {
    fontSize: `${rhythm.baseSize}px`,
    lineHeight: `${rhythm.baseLineHeight}`,
  }
}

export function getRhythmStyle(rhythm: Rhythm, level: number): RhythmStyle {
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
