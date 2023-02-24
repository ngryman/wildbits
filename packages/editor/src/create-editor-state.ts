import { Extension } from '@mindraft/editor-extension'
import { Node } from 'prosemirror-model'
import { InputRule, inputRules } from 'prosemirror-inputrules'
import { keymap } from 'prosemirror-keymap'
import { EditorState, Plugin } from 'prosemirror-state'

import { Bindings, Document } from './types'
import { schema } from './schema'
import { baseBindings, baseRules } from './base'

export function createEditorState(
  doc: Document,
  extensions: Extension[],
  plugins: Plugin[]
): EditorState {
  const docNode = Node.fromJSON(schema, doc)

  const bindings = { ...baseBindings(), ...collectBindings(extensions) }
  const rules = [...baseRules(), ...collectRules(extensions)]

  return EditorState.create({
    schema,
    doc: docNode,
    plugins: [keymap(bindings), inputRules({ rules }), ...plugins],
  })
}

function collectBindings(extensions: Extension[]): Bindings {
  return {}
}

function collectRules(extensions: Extension[]): InputRule[] {
  return extensions.flatMap(ext => ext.createRules())
}
