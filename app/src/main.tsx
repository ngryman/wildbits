import { PersistenceProvider } from '@mindraft/editor-extension-persistence'
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
      body: {
        name: 'Droid Serif',
        weight: 'normal',
        style: 'normal',
        tracking: 'normal',
        color: '#2d2000',
      },
      heading: {
        name: 'Lobster',
      },
      strong: {
        name: 'Luckiest Guy',
        color: '#000',
      },
      em: {
        name: 'Mynerve',
        color: 'gray',
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
      <PersistenceProvider>
        <GlobalStyles />
        <App />
      </PersistenceProvider>
    </ThemeProvider>
  ),
  document.body
)
