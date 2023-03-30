import { Locator } from '@wildbits/note'
import { Accessor, createMemo } from 'solid-js'
import { IndexeddbPersistence } from 'y-indexeddb'
import { Doc } from 'yjs'

export type PersistenceOptions = {
  locator: Locator
  doc: Doc
}

export function createPersistence(
  locator: Accessor<Locator>,
  doc: Accessor<Doc>
): Accessor<IndexeddbPersistence> {
  const persistence = createMemo<IndexeddbPersistence>(prevPersistence => {
    if (prevPersistence) {
      prevPersistence.destroy()
    }
    return new IndexeddbPersistence(locator().id, doc())
  })
  return persistence
}
