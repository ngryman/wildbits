import { ThemeProvider } from '@mindraft/theme'
import { render } from 'solid-js/web'

import { App } from './app'
import { GlobalStyles } from './global-styles'

render(
  () => (
    <ThemeProvider>
      <GlobalStyles />
      <App />
    </ThemeProvider>
  ),
  document.body
)
