import { Locator } from '@wildbits/note'
import { Accessor, createEffect } from 'solid-js'
import { IndexeddbPersistence } from 'y-indexeddb'
import { Doc } from 'yjs'

export type PersistenceOptions = {
  locator: Locator
  doc: Doc
}

export function createPersistence(locator: Accessor<Locator>, doc: Accessor<Doc>) {
  createEffect<IndexeddbPersistence>(persistence => {
    if (persistence) {
      persistence.destroy()
    }

    return new IndexeddbPersistence(locator().id, doc())
  })
}
