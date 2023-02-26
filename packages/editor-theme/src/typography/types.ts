import { Rhythm, RhythmRootStyle, RhythmStyle } from './rhythm'
import { Font, FontStyle } from './font'

export type Typography = {
  font: Partial<Font>
  rhythm: Rhythm
}

export type TypographyRootStyle = RhythmRootStyle

export type TypographyStyle = FontStyle & RhythmStyle

export type TypographyStyles = {
  h1: TypographyStyle
  h2: TypographyStyle
  h3: TypographyStyle
  body: TypographyStyle
  strong: TypographyStyle
  em: TypographyStyle
}
