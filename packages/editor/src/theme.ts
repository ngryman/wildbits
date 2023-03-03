import { toCSSVars } from '@mindraft/utils'

export type Theme = {
  base: Font
  em: Font
  heading: Font
  strong: Font
}

export type Font = {
  color?: string
  family?: string
  style?: FontStyle
  tracking?: 'normal' | number
  weight?: FontWeight
}

export type FontStyle = 'normal' | 'italic'
export type FontWeight = 'normal' | 'bold'

export function createThemeCSSVars(theme: Theme): string {
  return (
    createFontCSSVars(theme, 'base') +
    createFontCSSVars(theme, 'em') +
    createFontCSSVars(theme, 'heading') +
    createFontCSSVars(theme, 'strong')
  )
}

function createFontCSSVars(theme: Theme, key: keyof Theme): string {
  const font = { ...theme.base, ...theme[key] }
  return toCSSVars({
    [`${key}FontColor`]: font.color || 'inherit',
    [`${key}FontFamily`]: font.family || 'sans-serif',
    [`${key}FontStyle`]: font.style || 'normal',
    [`${key}FontTracking`]: font.tracking || 'inherit',
    [`${key}FontWeight`]: font.weight || 'normal',
  })
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
  console.log(familyParam)
  fontsEl.href = `https://fonts.googleapis.com/css?family=${familyParam}&display=swap`
}

export function getFontFamilies(theme: Theme): string[] {
  return [
    ...new Set(
      Object.values(theme)
        .filter(font => font.family)
        .map(font => font.family!.replace(' ', '+') + ':wght@400;700')
    ),
  ]
}
