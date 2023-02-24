import { render } from 'solid-js/web'
import { ThemeProvider } from 'solid-styled-components'

import { App } from './app'
import { GlobalStyles } from './global-styles'

const theme = {}

render(
  () => (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <App />
    </ThemeProvider>
  ),
  document.body
)
