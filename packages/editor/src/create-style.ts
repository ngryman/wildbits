import {
  EditorTheme,
  TypographyStyles,
  createTypographyStyles,
  createTypographyRootStyle,
} from '@mindraft/editor-theme'
import { css } from 'solid-styled-components'

export function createStyle(theme: EditorTheme): string {
  const root = createTypographyRootStyle(theme.typography)
  const styles = createTypographyStyles(theme.typography)

  loadFonts(styles)

  return css`
    --font-size: ${root.fontSize};
    --line-height: ${root.leading};

    word-wrap: break-word;
    white-space: break-spaces;
    font-size: var(--font-size);

    h1 {
      ${createCSSRules('h1', styles)}
    }

    h2 {
      ${createCSSRules('h2', styles)}
    }

    h3 {
      ${createCSSRules('h3', styles)}
    }

    h4 {
      ${createCSSRules('h4', styles)}
    }

    h5 {
      ${createCSSRules('h5', styles)}
    }

    h6 {
      ${createCSSRules('h6', styles)}
    }

    p {
      ${createCSSRules('p', styles)}
    }

    strong,
    b {
      ${createCSSRules('strong', styles)}
    }

    em,
    i {
      ${createCSSRules('em', styles)}
    }
  `
}

function loadFonts(styles: TypographyStyles) {
  const families = getFontFamilies(styles).join('|')

  let fontsEl: HTMLLinkElement | null = document.head.querySelector('#fonts')
  if (!fontsEl) {
    fontsEl = document.createElement('link')
    fontsEl.id = 'fonts'
    fontsEl.rel = 'stylesheet'
    document.head.appendChild(fontsEl)
  }
  fontsEl.href = `https://fonts.googleapis.com/css?family=${families}&display=swap`
}

function getFontFamilies(styles: TypographyStyles): string[] {
  return [
    ...new Set(
      Object.values(styles).map(
        style => style.fontFamily.replace(' ', '+') + ':wght@400;700'
      )
    ),
  ]
}

function createCSSRules(
  tagName: keyof TypographyStyles,
  styles: TypographyStyles
): string {
  const style = styles[tagName]

  return `
    font: ${style.fontStyle} ${style.fontWeight} ${style.fontSize} "${style.fontFamily}";
    line-height: var(--line-height);
    letter-spacing: ${style.letterSpacing};
  `
}
