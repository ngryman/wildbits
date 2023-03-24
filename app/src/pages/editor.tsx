import { createPeers, createProvider, createUser, Peers } from '@wildbits/collaboration'
import { EditorView, createEditor } from '@wildbits/editor'
import { Note } from '@wildbits/note'
import { createAtom } from '@wildbits/utils'
import { Presence } from '@motionone/solid'
import { createShortcut } from '@solid-primitives/keyboard'
import { useParams, useLocation } from '@solidjs/router'
import { Accessor, createEffect, createMemo, createRenderEffect, Show } from 'solid-js'
import { Doc } from 'yjs'

import { Pane, Workspace } from '../layout'
import { Menu } from '../components'
import { createNotes, createPersistence } from '../signals'

export default function EditorPage() {
  const split = createAtom(false)
  const notes = createNotes()
  const user = createUser()
  const params = useParams()
  const location = useLocation()

  const note: Accessor<Note> = createMemo(() => ({
    id: params.id,
    key: location.hash.slice(1),
    doc: new Doc(),
  }))

  createPersistence(note)

  const provider = createProvider({
    note,
    // TODO: create a config provider with all the env vars in there
    signalingServer: import.meta.env.VITE_COLLABORATION_SIGNALING_SERVER,
  })

  const editor = createEditor({ debug: import.meta.env.DEV, provider })
  const peers = createPeers({ provider })

  createRenderEffect(() => user())

  createEffect(() => {
    editor().on('update', ({ editor }) => {
      notes.setTitle(note().id, editor.storage.metadata.title)
    })
  })

  createEffect(() => {
    localStorage.setItem('user', JSON.stringify(user()))
    editor().chain().focus().updateUser(user()).run()
  })

  createShortcut(['Control', 'E'], () => {
    split(prev => !prev)
  })

  // createShortcut(['Control', 'T'], () => {
  //   editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: false }).run()
  // })

  return (
    <Workspace>
      <Presence exitBeforeEnter>
        <Show when={split()}>
          <Menu notes={notes.all()} />
        </Show>
      </Presence>
      <Pane pushed={split()}>
        <EditorView editor={editor} />
        <Peers peers={peers} />
      </Pane>
    </Workspace>
  )
}
