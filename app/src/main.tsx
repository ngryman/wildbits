import { RATIO_PERFECT_FOURTH } from '@mindraft/editor'
import { render } from 'solid-js/web'
import { ThemeProvider } from 'solid-styled-components'

import { App } from './app'
import { GlobalStyles } from './global-styles'

const theme = {
  typography: {
    verticalRhythm: {
      baseSize: 26,
      baseLineHeight: 1.6,
      ratio: RATIO_PERFECT_FOURTH,
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
