import { createPeers, createProvider, createUser, Peers } from '@wildbits/collaboration'
import { EditorView, createEditor } from '@wildbits/editor'
import { createNotes, Note } from '@wildbits/note'
import { useParams, useLocation } from '@solidjs/router'
import { Accessor, createEffect, createMemo, createRenderEffect } from 'solid-js'
import { Doc } from 'yjs'

import { Workspace } from '../layout'
import { createPersistence } from '../signals'

export default function EditorPage() {
  const notes = createNotes()
  const user = createUser()
  const params = useParams()
  const location = useLocation()

  const note: Accessor<Note> = createMemo(
    () => new Note(params.id, location.hash.slice(1), 'A new beginning', new Doc())
  )

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

  // createShortcut(['Control', 'T'], () => {
  //   editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: false }).run()
  // })

  return (
    <Workspace notes={notes.all()}>
      <EditorView editor={editor} />
      <Peers peers={peers} />
    </Workspace>
  )
}
