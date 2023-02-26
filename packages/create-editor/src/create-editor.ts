import { Extension, EditorState, Plugin } from '@mindraft/editor-utils'

import {
  createBindingsPlugin,
  createObserverPlugin,
  createPlaceholderPlugin,
  createRulesPlugin,
} from './builtin'
import { schema } from './schema'
import { Document } from './types'

export type CreateEditorOptions = {
  placeholder?: string
}

export type Editor = {
  state: EditorState
}

export const defaultOptions: CreateEditorOptions = {}

export function createEditor(
  content: Document,
  extensions: Extension[],
  options: CreateEditorOptions = defaultOptions
): Editor {
  const doc = Node.fromJSON(schema, content)
  const plugins = createPlugins(extensions, options)
  const state = EditorState.create({ schema, doc, plugins })
  return { state }
}

function createPlugins(
  extensions: Extension[],
  options: CreateEditorOptions
): Plugin[] {
  return [
    createBindingsPlugin(extensions),
    createObserverPlugin(extensions),
    createRulesPlugin(extensions),
    options.placeholder
      ? createPlaceholderPlugin(options.placeholder)
      : undefined,
  ].filter(Boolean) as Plugin[]
}
