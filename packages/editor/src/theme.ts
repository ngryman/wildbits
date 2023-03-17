import { toCSSVars } from '@wildbits/utils'

export type Theme = {
  caret: Caret
  fonts: Fonts
  list: List
}

export type Caret = {
  color: string
}

export type Fonts = {
  base: Font
  code: Font
  em: Font
  heading: Font
  link: Font
  strong: Font
}

export type Font = {
  color?: string
  family?: string
  style?: FontStyle
  tracking?: 'normal' | number
  weight?: FontWeight
}

export type List = {
  markerColor: string
}

export type FontStyle = 'normal' | 'italic'
export type FontWeight = 'normal' | 'bold'

type FamilyWeights = Record<string, Set<FontWeight>>

const WEIGHT_VALUE: Record<FontWeight, number> = {
  normal: 400,
  bold: 700,
}

export function createThemeCSSVars(theme: Theme): string {
  return (
    createCaretCSSVars(theme.caret) +
    createFontCSSVars(theme.fonts, 'base') +
    createFontCSSVars(theme.fonts, 'code') +
    createFontCSSVars(theme.fonts, 'em') +
    createFontCSSVars(theme.fonts, 'heading') +
    createFontCSSVars(theme.fonts, 'link') +
    createFontCSSVars(theme.fonts, 'strong') +
    createListCSSVars(theme.list)
  )
}

function createCaretCSSVars(caret: Caret): string {
  return toCSSVars({
    caretColor: caret.color,
  })
}

function createFontCSSVars(fonts: Fonts, key: keyof Fonts): string {
  const font = { ...fonts.base, ...fonts[key] }
  return toCSSVars({
    [`${key}FontColor`]: font.color || 'inherit',
    [`${key}FontFamily`]: font.family || 'sans-serif',
    [`${key}FontStyle`]: font.style || 'normal',
    [`${key}FontTracking`]: font.tracking || 'inherit',
    [`${key}FontWeight`]: font.weight || 'normal',
  })
}

function createListCSSVars(list: List): string {
  return toCSSVars({
    listMarkerColor: list.markerColor,
  })
}

export function loadFonts(theme: Theme) {
  const familyWeights = getFamilyWeights(theme)
  const fontParam = getFontQueryParam(familyWeights)

  let fontsEl: HTMLLinkElement | null = document.head.querySelector('#fonts')
  if (!fontsEl) {
    fontsEl = document.createElement('link')
    fontsEl.id = 'fonts'
    fontsEl.rel = 'stylesheet'
    document.head.appendChild(fontsEl)
  }
  fontsEl.href = `https://fonts.googleapis.com/css?family=${fontParam}&display=swap`
}

function getFamilyWeights(theme: Theme): FamilyWeights {
  type FamilyWeightPair = [string, FontWeight]

  const mapper = (font: Font): FamilyWeightPair => [
    font.family || theme.fonts.base.family!,
    font.weight || theme.fonts.base.weight || 'normal',
  ]

  const reducer = (
    acc: FamilyWeights,
    [family, weight]: FamilyWeightPair
  ): Record<string, Set<FontWeight>> => {
    if (family) {
      acc[family] = acc[family] || new Set()
      acc[family].add(weight!)
    }
    return acc
  }

  return Object.values(theme.fonts).map(mapper).reduce(reducer, {})
}

function getFontQueryParam(familyWeights: FamilyWeights): string {
  type FamilyWeightEntry = [string, Set<FontWeight>]

  const mapper = ([family, weights]: FamilyWeightEntry): string => {
    const safeFamily = family.replace(' ', '+')
    const numericWeights = Array.from(weights.values())
      .map(weight => WEIGHT_VALUE[weight])
      .join(',')
    return `${safeFamily}:wght@${numericWeights}`
  }

  return Object.entries(familyWeights).map(mapper).join('|')
}
