import { toCSSVars } from '@wildbits/utils'

export type Typography = {
  rhythm: Rhythm
}

export type Rhythm = {
  baseSize: number
  leading: number
  lineLength: number
  scaleRatio: number
}

export function createTypographyCSSVars(typography: Typography): string {
  return toCSSVars({
    baseSize: `${typography.rhythm.baseSize}px`,
    leading: `${typography.rhythm.leading}em`,
    lineLength: `${typography.rhythm.lineLength}ch`,
    scaleRatio: typography.rhythm.scaleRatio,
  })
}
