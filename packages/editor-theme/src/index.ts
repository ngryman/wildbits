import { Typography } from './typography'

export type EditorTheme = {
  typography: Typography
}

export * from './typography'

// function toHeadingCSSFont(font: Partial<Typeface>): string {
//   return toCSSFont({ ...defaultFont, ...font, size: 0 })
// }

// function toParagraphCSSFont(font: Partial<Typeface>): string {
//   return toCSSFont({ ...defaultFont, ...font })
// }

// function toCSSFont(font: Typeface): string {
//   const style = font.style === 'italic' ? 'italic' : ''
//   const weight = font.style === 'bold' ? 'bold' : ''
//   const size = font.size > 0 ? `${font.size}px` : 'inherit'
//   const lineHeight = font.lineSpacing
//   const family = font.name || font.fallback
//   return `${style} ${weight} ${size}/${lineHeight} "${family}"`
// }
