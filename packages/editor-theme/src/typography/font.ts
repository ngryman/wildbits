import { TypographyStyles } from './types'

export type Typeface = {
  name: string
  weight: 'normal' | 'bold'
  style: 'normal' | 'italic'
  tracking: 'normal' | number
}

export type Font = {
  paragraph: Typeface
  heading: Partial<Typeface>
  strong: Partial<Typeface>
  em: Partial<Typeface>
}

export type FontStyle = {
  fontFamily: string
  fontStyle: string
  fontWeight: string
  letterSpacing: string
}

const defaultFont: Font = {
  paragraph: {
    name: 'Droid Serif',
    style: 'normal',
    weight: 'normal',
    tracking: 'normal',
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

export function getFontStyle(font: Partial<Font>, type: keyof Font): FontStyle {
  const typeface: Typeface = {
    ...defaultFont.paragraph,
    ...defaultFont[type],
    ...font.paragraph,
    ...font[type],
  }

  return {
    fontFamily: typeface.name,
    fontStyle: typeface.style,
    fontWeight: typeface.weight,
    letterSpacing:
      typeface.tracking !== 'normal'
        ? `${typeface.tracking}em`
        : typeface.tracking,
  }
}

export function loadFonts(families: string[]) {
  const familyParam = families.join('|')

  let fontsEl: HTMLLinkElement | null = document.head.querySelector('#fonts')
  if (!fontsEl) {
    fontsEl = document.createElement('link')
    fontsEl.id = 'fonts'
    fontsEl.rel = 'stylesheet'
    document.head.appendChild(fontsEl)
  }
  fontsEl.href = `https://fonts.googleapis.com/css?family=${familyParam}&display=swap`
}

export function getFontFamilies(styles: TypographyStyles): string[] {
  return [
    ...new Set(
      Object.values(styles).map(
        style => style.fontFamily.replace(' ', '+') + ':wght@400;700'
      )
    ),
  ]
}
