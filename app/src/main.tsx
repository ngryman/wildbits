import { PersistenceProvider } from '@mindraft/editor-extension-persistence'
import { ThemeProvider } from '@mindraft/ui-theme'
import { render } from 'solid-js/web'

import { App } from './app'
import { GlobalStyles } from './global-styles'

render(
  () => (
    <PersistenceProvider>
      <ThemeProvider>
        <GlobalStyles />
        <App />
      </ThemeProvider>
    </PersistenceProvider>
  ),
  document.body
)
