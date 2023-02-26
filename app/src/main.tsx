import { RATIO_PERFECT_FIFTH } from '@mindraft/editor-theme'
import { render } from 'solid-js/web'
import { ThemeProvider } from 'solid-styled-components'

import { App } from './app'
import { GlobalStyles } from './global-styles'

const theme = {
  typography: {
    font: {
      paragraph: {
        // name: 'Ubuntu Mono',
        name: 'Droid Serif',
      },
      heading: {
        // name: 'Stint Ultra Expanded',
        // name: 'Press Start 2P',
        // name: 'Tilt Prism',
        // name: 'Droid Serif',
        name: 'Lobster',
      },
      em: {
        name: 'Mynerve',
      },
    },
    rhythm: {
      baseSize: 24,
      baseLineHeight: 1.6,
      ratio: RATIO_PERFECT_FIFTH,
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
