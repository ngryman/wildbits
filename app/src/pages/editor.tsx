import { Peers, createPeers, createProvider, createUser } from '@wildbits/collaboration'
import { EditorView, createEditor } from '@wildbits/editor'
import { createAtom } from '@wildbits/utils'
import { Presence } from '@motionone/solid'
import { createShortcut } from '@solid-primitives/keyboard'
import { useParams, useLocation } from '@solidjs/router'
import { createEffect, createRenderEffect, Show } from 'solid-js'

import { Pane, Workspace } from '../layout'

export default function EditorPage() {
  const split = createAtom(false)
  const params = useParams()
  const location = useLocation()

  const cryptoKey = location.hash.slice(1)
  const provider = createProvider({
    cryptoKey,
    documentId: params.id,
    // TODO: create a config provider with all the env vars in there
    signalingServer: import.meta.env.VITE_COLLABORATION_SIGNALING_SERVER,
  })
  const user = createUser()
  const peers = createPeers(provider)
  const editor = createEditor({ provider })

  createRenderEffect(() => user())

  createEffect(() => {
    localStorage.setItem('user', JSON.stringify(user()))
    editor.chain().focus().updateUser(user()).run()
  })

  createShortcut(['Control', 'E'], () => {
    split(prev => !prev)
  })
  createShortcut(['Control', '2'], () => {
    editor.chain().focus().setGrid(2).run()
  })
  createShortcut(['Control', '3'], () => {
    editor.chain().focus().setGrid(3).run()
  })
  createShortcut(['Control', 'T'], () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: false }).run()
  })

  return (
    <Workspace split={split()}>
      <Pane>
        <EditorView editor={editor} />
        <Peers peers={peers()} />
      </Pane>
      <Presence exitBeforeEnter>
        <Show when={split()}>
          <Pane>
            <div style={{ width: '100%', height: '100%' }} />
          </Pane>
        </Show>
      </Presence>
    </Workspace>
  )
}
