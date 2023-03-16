import { Editor } from '@tiptap/core'
import { Doc as YDoc } from 'yjs'

import { Provider } from './primitives'

export function getAwareness(editor: Editor): Provider['awareness'] {
  const awareness = editor.storage.collaboration.provider.awareness
  return awareness
}

export function getDoc(editor: Editor): YDoc {
  const doc = editor.storage.collaboration.provider.doc
  return doc
}
