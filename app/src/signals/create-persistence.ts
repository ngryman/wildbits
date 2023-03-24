import { Note } from '@wildbits/core'
import { Accessor, createEffect } from 'solid-js'
import { IndexeddbPersistence } from 'y-indexeddb'

export function createPersistence(note: Accessor<Note>) {
  createEffect<IndexeddbPersistence>(persistence => {
    if (persistence) {
      persistence.destroy()
    }

    const { id, doc } = note()
    console.log('persistence', doc.guid)
    return new IndexeddbPersistence(id, doc)
  })
}
