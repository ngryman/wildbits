import {
  EditorTheme,
  TypographyStyles,
  createTypographyRootStyle,
  createTypographyStyles,
  getFontFamilies,
  loadFonts,
} from '@mindraft/editor-theme'
import { Ref } from 'solid-js'
import { styled } from 'solid-styled-components'

export type EditorContainerProps = {
  ref: Ref<HTMLDivElement>
}

export const EditorContainer = styled.div<EditorContainerProps>(props => {
  const theme = props.theme as EditorTheme
  const root = createTypographyRootStyle(theme.typography)
  const styles = createTypographyStyles(theme.typography)

  const fontFamilies = getFontFamilies(styles)
  loadFonts(fontFamilies)

  return `
    --font-size: ${root.fontSize};
    --line-height: ${root.leading};
    --line-length: ${root.lineLength};

    position: relative;
    margin: 0 auto;
    max-width: var(--line-length);
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

    blockquote {
      ${createCSSRules('p', styles)}

      p:first-of-type::before {
        content: "\\00AB\\00A0";
        opacity: 0.5;
      }

      p:last-of-type::after {
        content: "\\00A0\\00BB";
        opacity: 0.5;
      }
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
})

export function createCSSRules(
  tagName: keyof TypographyStyles,
  styles: TypographyStyles
): string {
  const style = styles[tagName]

  return `
    font: ${style.fontStyle} ${style.fontWeight} ${style.fontSize} "${style.fontFamily}";
    line-height: var(--line-height);
    letter-spacing: ${style.letterSpacing};
    color: ${style.color};
  `
}
