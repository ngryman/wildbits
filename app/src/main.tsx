import { render } from 'solid-js/web'
import { Router } from '@solidjs/router'
import { NotesProvider, StateProvider } from '@wildbits/model'

import App from './app'

// XXX: log webrtc messages for the MVP.
// localStorage.log = 'y-webrtc'

render(
  () => (
    <Router>
      <StateProvider>
        <NotesProvider>
          <App />
        </NotesProvider>
      </StateProvider>
    </Router>
  ),
  document.body
)
