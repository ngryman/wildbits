import { getRhythmRootStyle, getRhythmStyle } from './rhythm'
import { getFontStyle, Font } from './font'
import {
  Typography,
  TypographyRootStyle,
  TypographyStyle,
  TypographyStyles,
} from './types'

export function createTypographyRootStyle(
  typography: Typography
): TypographyRootStyle {
  return {
    ...getRhythmRootStyle(typography.rhythm),
  }
}

export function createTypographyStyles(
  typography: Typography
): TypographyStyles {
  return {
    h1: getTypographyStyle(typography, 'heading', 3),
    h2: getTypographyStyle(typography, 'heading', 2),
    h3: getTypographyStyle(typography, 'heading', 1),
    h4: getTypographyStyle(typography, 'heading', 1),
    h5: getTypographyStyle(typography, 'heading', 1),
    h6: getTypographyStyle(typography, 'heading', 1),
    p: getTypographyStyle(typography, 'paragraph', 1),
    strong: getTypographyStyle(typography, 'strong', 1),
    em: getTypographyStyle(typography, 'em', 1),
  }
}

export function getTypographyStyle(
  typography: Typography,
  type: keyof Font,
  level: number
): TypographyStyle {
  return {
    ...getFontStyle(typography.font, type),
    ...getRhythmStyle(typography.rhythm, level),
  }
}

export * from './types'
export * from './font'
export * from './rhythm'
