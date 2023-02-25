import {
  VerticalRhythm,
  VerticalRhythmRootStyle,
  VerticalRhythmStyle,
} from './rhythm'

export type Typography = {
  verticalRhythm: VerticalRhythm
}

export type TypographyRootStyle = VerticalRhythmRootStyle

export type TypographyStyle = VerticalRhythmStyle

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
