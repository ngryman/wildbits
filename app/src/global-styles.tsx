import { useTheme } from '@wildbits/theme'
import { createGlobalStyles } from 'solid-styled-components'

export const GlobalStyles = createGlobalStyles(() => {
  const theme = useTheme()

  return `
    html {
      box-sizing: border-box;
      font-size: ${theme().editor.typography.rhythm.baseSize}px;
      background: ${theme().mode === 'light' ? '#fafaf6' : '#272727'};
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
})
