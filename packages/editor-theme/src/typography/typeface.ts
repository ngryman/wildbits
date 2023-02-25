export type Font = {
  name: string
  style: 'normal' | 'bold' | 'italic'
}

export type Typeface = {
  paragraph: Font
  heading: Font
  bold: Font
  italic: Font
}
