import {
  EditorTheme,
  createTypographyStyles,
  TypographyStyles,
} from '@mindraft/editor-theme'
import { css } from 'solid-styled-components'

export function createStyle(theme: EditorTheme): string {
  const typographyStyles = createTypographyStyles(theme.typography)

  return css`
    --font-size: ${typographyStyles.root.fontSize}px;
    --line-height: ${typographyStyles.root.lineHeight};

    word-wrap: break-word;
    white-space: break-spaces;
    font-size: var(--font-size);
    line-height: var(--line-height);

    h1 {
      ${createCSSRules('h1', typographyStyles)}
    }

    h2 {
      ${createCSSRules('h2', typographyStyles)}
    }

    h3 {
      ${createCSSRules('h3', typographyStyles)}
    }

    h4 {
      ${createCSSRules('h4', typographyStyles)}
    }

    h5 {
      ${createCSSRules('h5', typographyStyles)}
    }

    h6 {
      ${createCSSRules('h6', typographyStyles)}
    }

    p {
      ${createCSSRules('p', typographyStyles)}
    }
  `
}

function createCSSRules(
  tagName: keyof TypographyStyles,
  typographyStyles: TypographyStyles
): string {
  const typographyStyle = typographyStyles[tagName]
  return `
    font-size: ${typographyStyle.fontSize};
  `
}
