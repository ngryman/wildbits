import { createPeers, createProvider, createUser, Peers } from '@wildbits/collaboration'
import { EditorView, createEditor } from '@wildbits/editor'
import { createDoc, createLocator, createNote, useNotes, useState } from '@wildbits/model'
import { useParams, useLocation } from '@solidjs/router'
import { createEffect, on } from 'solid-js'

import { Workspace } from '../layout'
import { createPersistence } from '../signals'
import welcomeContent from '../welcome.html?raw'

export default function EditorPage() {
  const notes = useNotes()
  const [user] = createUser()

  const [state, setState] = useState()
  const params = useParams()
  const location = useLocation()

  const locator = () => createLocator(params.id, location.hash.slice(1))
  const doc = createDoc(() => params.id)
  const persistence = createPersistence(locator, doc)

  const provider = createProvider({
    locator,
    doc,
    // TODO: create a config provider with all the env vars in there
    signalingServer: import.meta.env.VITE_COLLABORATION_SIGNALING_SERVER,
  })

  const editor = createEditor({ provider })
  const peers = createPeers({ provider })

  const updateNoteTitle = (title: string) => {
    const id = locator().id
    if (notes.has(id)) {
      notes.set(id, { ...notes.get(id)!, title })
    }
  }

  // NOTE: For some reason this is called when notes change so make sure we only are
  // interested in `locator` changes
  createEffect(
    on(locator, () => {
      setState('locator', locator())

      if (!notes.has(locator().id)) {
        notes.set(locator().id, createNote(locator()))
      }

      if (matchMedia('(max-width: 1200px)').matches) {
        setState('menuVisible', false)
      }
    })
  )

  createEffect(() => {
    editor().on('create', ({ editor }) => {
      editor.on('update', () => {
        updateNoteTitle(editor.storage.metadata.title)
      })

      persistence().once('synced', () => {
        if (editor.isEmpty && state.pristine && locator().id === 'welcome') {
          editor.commands.setContent(welcomeContent)
          // XXX: The update event doesn't get triggered so we manually change
          // the title
          updateNoteTitle('Welcome to Wildbits!')
        }

        setState('pristine', false)
      })
    })
  })

  createEffect(() => {
    editor().commands.updateUser(user())
  })

  const toggleMenu = () => {
    setState('menuVisible', menuVisible => !menuVisible)
  }

  return (
    <Workspace onToggleMenu={toggleMenu}>
      <EditorView editor={editor} />
      <Peers peers={peers} />
    </Workspace>
  )
}
