import { Accessor, createMemo } from 'solid-js'
import * as Y from 'yjs'

export function createDoc(id: Accessor<string>): Accessor<Y.Doc> {
  const doc = createMemo(() => new Y.Doc({ guid: id() }))
  return doc
}
