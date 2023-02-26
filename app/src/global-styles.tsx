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
    /* background: linear-gradient(90deg, #fefef6 1px, #fafaf6 1px); */
    /* background-size: 5px 5px; */
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
    outline: 0;
  }

  body {
    margin: 0;
  }

  ::selection {
    background: #f6e7c9;
  }
`
