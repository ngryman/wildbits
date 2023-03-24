import { createPeers, createProvider, createUser, Peers } from '@wildbits/collaboration'
import { EditorView, createEditor } from '@wildbits/editor'
import { createNotes, Locator } from '@wildbits/note'
import { useParams, useLocation, useNavigate } from '@solidjs/router'
import { Accessor, createEffect, createMemo, createRenderEffect, on } from 'solid-js'
import { Doc } from 'yjs'

import { Workspace } from '../layout'
import { createPersistence } from '../signals'

export default function EditorPage() {
  const [notes, { createNoteIfNotExists, deleteNote, updateNoteTitle }] = createNotes()
  const user = createUser()
  const params = useParams()
  const location = useLocation()
  const navigate = useNavigate()

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

  // NOTE: For some reason this is called when notes change so make sure we only are
  // interested in `locator` changes
  createEffect(on(locator, () => createNoteIfNotExists(locator())))

  createEffect(() => {
    editor().on('create', ({ editor }) => {
      editor.on('update', () => {
        updateNoteTitle(locator().noteId, editor.storage.metadata.title)
      })
    })
  })

  createEffect(() => {
    localStorage.setItem('user', JSON.stringify(user()))
    editor().commands.updateUser(user())
  })

  // createShortcut(['Control', 'T'], () => {
  //   editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: false }).run()
  // })

  function handleDeleteNote(noteId: string) {
    deleteNote(noteId)

    if (notes().length > 0) {
      navigate(notes()[notes().length - 1].path || '/')
    } else {
      navigate('/')
    }
  }

  return (
    <Workspace notes={notes()} onDeleteNote={handleDeleteNote}>
      <EditorView editor={editor} />
      <Peers peers={peers} />
    </Workspace>
  )
}
