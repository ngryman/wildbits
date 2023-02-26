import { RATIO_PERFECT_FIFTH, Typography } from '@mindraft/editor-theme'
import { render } from 'solid-js/web'
import { ThemeProvider } from 'solid-styled-components'

import { App } from './app'
import { GlobalStyles } from './global-styles'

type Theme = {
  typography: Typography
}

const theme: Theme = {
  typography: {
    font: {
      paragraph: {
        name: 'Droid Serif',
        weight: 'normal',
        style: 'normal',
        tracking: 'normal',
      },
      heading: {
        name: 'Lobster',
      },
      em: {
        name: 'Mynerve',
      },
    },
    rhythm: {
      baseSize: 24,
      baseLeading: 1.6,
      scaleRatio: RATIO_PERFECT_FIFTH,
      lineLength: 60,
    },
  },
}

render(
  () => (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <App />
    </ThemeProvider>
  ),
  document.body
)
