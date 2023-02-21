import { render } from 'solid-js/web'
import { ThemeProvider } from 'solid-styled-components'

import App from './App'
import GlobalStyles from './GlobalStyles'

const theme = {}

render(
  () => (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <App />
    </ThemeProvider>
  ),
  document.getElementById('root') as HTMLElement
)
