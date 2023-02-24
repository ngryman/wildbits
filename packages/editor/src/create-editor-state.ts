import { Node } from 'prosemirror-model'
import { EditorState, Plugin } from 'prosemirror-state'

import { Document } from './types'
import { schema } from './schema'

export function createEditorState(
  doc: Document,
  plugins: Plugin[]
): EditorState {
  const docNode = Node.fromJSON(schema, doc)
  return EditorState.create({ schema, doc: docNode, plugins })
}
