import { createPeers, createProvider, createUser, Peers } from '@wildbits/collaboration'
import { EditorView, createEditor } from '@wildbits/editor'
import { createNotes, Note, Locator } from '@wildbits/note'
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

  const locator: Accessor<Locator> = () => ({ noteId: params.id, key: location.hash.slice(1) })
  const doc = createMemo(() => new Doc({ guid: params.id }))
  createPersistence(locator, doc)

  const provider = createProvider({
    locator,
    doc,
    // TODO: create a config provider with all the env vars in there
    signalingServer: import.meta.env.VITE_COLLABORATION_SIGNALING_SERVER,
  })

  const editor = createEditor({ debug: import.meta.env.DEV, provider })
  const peers = createPeers({ provider })

  createRenderEffect(() => user())

  createEffect(() => {
    editor().on('update', ({ editor }) => {
      notes.setTitle(locator().noteId, editor.storage.metadata.title)
    })
  })

  createEffect(() => {
    localStorage.setItem('user', JSON.stringify(user()))
    editor().commands.updateUser(user())
  })

  // createShortcut(['Control', 'T'], () => {
  //   editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: false }).run()
  // })

  function handleDeleteNote(note: Note) {
    notes.delete(note.id)
  }

  return (
    <Workspace notes={notes.all()} onDeleteNote={handleDeleteNote}>
      <EditorView editor={editor} />
      <Peers peers={peers} />
    </Workspace>
  )
}
