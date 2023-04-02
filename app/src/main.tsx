import { render } from 'solid-js/web'
import { Router } from '@solidjs/router'
import { StateProvider } from '@wildbits/model'

import App from './app'

// XXX: log webrtc messages for the MVP.
// localStorage.log = 'y-webrtc'

render(
  () => (
    <Router>
      <StateProvider>
        <App />
      </StateProvider>
    </Router>
  ),
  document.body
)
