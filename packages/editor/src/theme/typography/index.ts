import { getVerticalRhythmRootStyle, getVerticalRhythmStyle } from './rhythm'
import {
  Typography,
  TypographyRootStyle,
  TypographyStyle,
  TypographyStyles,
} from './types'

export function createTypographyStyles(
  typography: Typography
): TypographyStyles {
  return {
    root: getTypographyRootStyle(typography),
    p: getTypographyStyle(typography, 1),
    h6: getTypographyStyle(typography, 1),
    h5: getTypographyStyle(typography, 1),
    h4: getTypographyStyle(typography, 1),
    h3: getTypographyStyle(typography, 1),
    h2: getTypographyStyle(typography, 2),
    h1: getTypographyStyle(typography, 3),
  }
}

export function getTypographyRootStyle(
  typography: Typography
): TypographyRootStyle {
  return {
    ...getVerticalRhythmRootStyle(typography.verticalRhythm),
  }
}

export function getTypographyStyle(
  typography: Typography,
  level: number
): TypographyStyle {
  return {
    ...getVerticalRhythmStyle(typography.verticalRhythm, level),
  }
}

export * from './types'
export * from './presets'
