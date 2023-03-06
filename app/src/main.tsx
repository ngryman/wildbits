import { ThemeProvider } from '@wildbits/theme'
import { render } from 'solid-js/web'
import { Router } from '@solidjs/router'

import App from './app'
import { GlobalStyles } from './global-styles'

render(
  () => (
    <ThemeProvider>
      <GlobalStyles />
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  ),
  document.body
)
