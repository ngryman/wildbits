import { Typography } from '@mindraft/editor-theme'
import { createGlobalStyles } from 'solid-styled-components'

type Props = {
  theme?: {
    typography: Typography
  }
}

export const GlobalStyles = createGlobalStyles`
  html {
    box-sizing: border-box;
    font-size: ${(props: Props) => props.theme!.typography.rhythm.baseSize}px;
    background: #fafaf6;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
    outline: 0;
  }

  body {
    margin: 0;
    font: sans-serif;
    color: #2d2000;
  }

  ::selection {
    background: #f6e7c9;
  }
`
