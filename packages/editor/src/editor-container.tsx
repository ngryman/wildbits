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
    --line-height: ${root.leading};

    position: relative;
    margin: 0 auto;
    max-width: ${root.lineLength};
    word-wrap: break-word;
    white-space: break-spaces;
    
    ${createCSSRules('body', styles)}

    h1 {
      ${createCSSRules('h1', styles)}
    }

    h2 {
      ${createCSSRules('h2', styles)}
    }

    h3 {
      ${createCSSRules('h3', styles)}
    }

    blockquote {
      p:first-of-type::before {
        content: "\\00AB\\00A0";
        opacity: 0.5;
      }

      p:last-of-type::after {
        content: "\\00A0\\00BB";
        opacity: 0.5;
      }
    }

    li {
      &::marker {
        opacity: 0.5;
      }

      p {
        margin: 0;
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
