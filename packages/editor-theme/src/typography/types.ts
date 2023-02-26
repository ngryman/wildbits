import { Rhythm, RhythmRootStyle, RhythmStyle } from './rhythm'
import { Font, FontStyle } from './font'

export type Typography = {
  font: Font
  rhythm: Rhythm
}

export type TypographyRootStyle = RhythmRootStyle

export type TypographyStyle = FontStyle & RhythmStyle

export type TypographyStyles = {
  h1: TypographyStyle
  h2: TypographyStyle
  h3: TypographyStyle
  h4: TypographyStyle
  h5: TypographyStyle
  h6: TypographyStyle
  p: TypographyStyle
  strong: TypographyStyle
  em: TypographyStyle
}
