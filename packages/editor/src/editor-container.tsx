import {
  Theme,
  TypographyStyles,
  createTypographyRootStyle,
  createTypographyStyles,
  useTheme,
} from '@mindraft/ui-theme'
import { Ref, createMemo } from 'solid-js'
import { css } from 'solid-styled-components'

export type EditorContainerProps = {
  ref: Ref<HTMLDivElement>
}

export function EditorContainer(props: EditorContainerProps) {
  const theme = useTheme()

  const rootStyles = createMemo(() =>
    createTypographyRootStyle(theme().editor.typography)
  )
  const styles = createMemo(() =>
    createTypographyStyles(theme().editor.typography)
  )

  return (
    <div
      ref={props.ref}
      class={css`
        --line-height: ${rootStyles().leading};

        position: relative;
        margin: 0 auto;
        max-width: ${rootStyles().lineLength};
        word-wrap: break-word;
        white-space: break-spaces;

        ${createCSSRules('body', styles(), theme())}

        h1 {
          ${createCSSRules('h1', styles(), theme())}
        }

        h2 {
          ${createCSSRules('h2', styles(), theme())}
        }

        h3 {
          ${createCSSRules('h3', styles(), theme())}
        }

        blockquote {
          p:first-of-type::before {
            content: '\\00AB\\00A0';
            opacity: 0.5;
          }

          p:last-of-type::after {
            content: '\\00A0\\00BB';
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
          ${createCSSRules('strong', styles(), theme())}
        }

        em,
        i {
          ${createCSSRules('em', styles(), theme())}
        }
      `}
    />
  )
}

export function createCSSRules(
  tagName: keyof TypographyStyles,
  styles: TypographyStyles,
  theme: Theme
): string {
  const style = styles[tagName]

  return `
    font: ${style.fontStyle} ${style.fontWeight} ${style.fontSize} "${
    style.fontFamily
  }";
    line-height: var(--line-height);
    letter-spacing: ${style.letterSpacing};
    color: ${style.color[theme.mode]};
  `
}
