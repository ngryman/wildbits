export type Typeface = {
  name: string
  weight: 'normal' | 'bold'
  style: 'normal' | 'italic'
}

export type Font = {
  paragraph: Typeface
  heading?: Partial<Typeface>
  strong?: Partial<Typeface>
  em?: Partial<Typeface>
}

export type FontStyle = {
  fontFamily: string
  fontStyle: string
  fontWeight: string
}

const defaultFont: Font = {
  paragraph: {
    name: 'Ubuntu Mono',
    style: 'normal',
    weight: 'normal',
  },
  heading: {
    weight: 'bold',
  },
  strong: {
    weight: 'bold',
  },
  em: {
    style: 'italic',
  },
}

export function getFontStyle(typeface: Font, type: keyof Font): FontStyle {
  const name = typeface[type]?.name || typeface.paragraph.name
  const style =
    defaultFont[type]!.style ||
    typeface.paragraph.style ||
    defaultFont.paragraph.style
  const weight =
    defaultFont[type]!.weight ||
    typeface.paragraph.weight ||
    defaultFont.paragraph.weight

  return {
    fontFamily: name,
    fontStyle: style,
    fontWeight: weight,
  }
}
