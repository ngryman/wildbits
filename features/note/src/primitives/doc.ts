import { Accessor, createMemo } from 'solid-js'
import { Doc } from 'yjs'

export function createDoc(id: Accessor<string>): Accessor<Doc> {
  const doc = createMemo(() => new Doc({ guid: id() }))
  return doc
}
