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

        /* .ProseMirror > p {
          &::first-letter {
            font-size: 2em;
          }
        } */

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

        hr {
          text-align: center;
          margin: 2rem 0;
          border: none;
          border-top: 1px solid
            ${theme().editor.typography.font.body!.color[theme().mode]}22;

          &::before {
            /* content: '\\2021'; */
            content: '\\00A7';
            position: absolute;
            translate: 0 -1.6rem 0;
            rotate: 90deg;
            font-family: serif;
            font-size: 2rem;
            opacity: 0.5;
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
