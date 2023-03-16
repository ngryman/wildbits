import { Locator } from '@wildbits/model'
import { Accessor, createMemo } from 'solid-js'
import { IndexeddbPersistence } from 'y-indexeddb'
import { Doc as YDoc } from 'yjs'

export type PersistenceOptions = {
  locator: Locator
  doc: YDoc
}

export function createPersistence(
  locator: Accessor<Locator>,
  doc: Accessor<Y.Doc>
): Accessor<IndexeddbPersistence> {
  const persistence = createMemo<IndexeddbPersistence>(prevPersistence => {
    if (prevPersistence) {
      prevPersistence.destroy()
    }
    return new IndexeddbPersistence(locator().id, doc())
  })
  return persistence
}
