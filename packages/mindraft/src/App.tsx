import { Show } from 'solid-js'
import { createShortcut } from '@solid-primitives/keyboard'
import { Presence } from '@motionone/solid'

import { atom } from 'utils'
import { Editor } from 'editor'
import { Pane, Workspace } from 'layout'

function App() {
  const isSplit = atom(false)

  createShortcut(['Control', 'E'], () => {
    isSplit(prev => !prev)
  })

  return (
    <Workspace isSplit={isSplit()}>
      <Pane>
        <Editor />
      </Pane>
      <Presence exitBeforeEnter>
        <Show when={isSplit()}>
          <Pane>
            <div style={{ width: '100%', height: '100%' }} />
          </Pane>
        </Show>
      </Presence>
    </Workspace>
  )
}

export default App
