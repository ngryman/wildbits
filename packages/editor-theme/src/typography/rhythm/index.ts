export * from './presets'

export type Rhythm = {
  baseSize: number
  baseLeading: number
  scaleRatio: number
}

export type RhythmRootStyle = {
  fontSize: string
  leading: string
}

export type RhythmStyle = {
  fontSize: string
}

export function getRhythmRootStyle(rhythm: Rhythm): RhythmRootStyle {
  return {
    fontSize: `${rhythm.baseSize}px`,
    leading: `${rhythm.baseLeading}`,
  }
}

export function getRhythmStyle(rhythm: Rhythm, level: number): RhythmStyle {
  const factor = computeSizeFactor(rhythm.scaleRatio, level)
  return {
    fontSize: `${factor}em`,
  }
}

function computeSizeFactor(ratio: number, level: number): number {
  let size = 1
  for (let i = 1; i < level; i++, size *= ratio);
  return Math.round(size * 100) / 100
}
