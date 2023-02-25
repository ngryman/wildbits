import { Rhythm, RhythmRootStyle, RhythmStyle } from './rhythm'
import { Typeface } from './typeface'

export type Typography = {
  typeface: Typeface
  rhythm: Rhythm
}

export type TypographyRootStyle = RhythmRootStyle

export type TypographyStyle = RhythmStyle

export type TypographyStyles = {
  root: TypographyRootStyle
  p: TypographyStyle
  h1: TypographyStyle
  h2: TypographyStyle
  h3: TypographyStyle
  h4: TypographyStyle
  h5: TypographyStyle
  h6: TypographyStyle
}
