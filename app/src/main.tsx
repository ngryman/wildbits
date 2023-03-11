import { render } from 'solid-js/web'
import { Router } from '@solidjs/router'

import App from './app'

// XXX: log webrtc messages for the MVP.
localStorage.log = 'y-webrtc'

render(
  () => (
    <Router>
      <App />
    </Router>
  ),
  document.body
)
