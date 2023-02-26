import { Document } from '@mindraft/editor-utils'
import { AceBase } from 'acebase'
import { createContext, ParentProps, useContext } from 'solid-js'

import { Persistence } from './types'

const PersistenceContext = createContext<Persistence>()

export function PersistenceProvider(props: ParentProps) {
  const db = createDB()

  async function loadDocument(id: string): Promise<Document> {
    console.time('load')
    // await new Promise(resolve => setTimeout(resolve, 3000))
    const snapshot = await db.ref(`documents/${id}`).get()
    console.timeEnd('load')
    // XXX: for some reason, the `creator` mapping is not called
    return JSON.parse(snapshot.val())
  }

  async function saveDocument(id: string, doc: Document): Promise<void> {
    console.time('save')
    const ref = await db.ref(`documents/${id}`).set(doc)
    console.timeEnd('save')
    console.log(`"${ref.path}" was saved!`)
  }

  const persistence: Persistence = {
    loadDocument,
    saveDocument,
  }

  return (
    <PersistenceContext.Provider value={persistence}>
      {props.children}
    </PersistenceContext.Provider>
  )
}

export function usePersistence() {
  return useContext(PersistenceContext)!
}

function createDB(): AceBase {
  const db = AceBase.WithIndexedDB('mindraft', {
    sponsor: true,
    logLevel: 'error',
  })

  db.types.bind('documents', Object, {
    serializer: (_ref, doc) => JSON.stringify(doc),
    creator: snapshot => JSON.parse(snapshot.val()),
  })

  return db
}
