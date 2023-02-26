import { Extension, EditorState, Plugin } from '@mindraft/editor-utils'

import {
  createBindingsPlugin,
  createObserverPlugin,
  createPlaceholderPlugin,
  createRulesPlugin,
} from './builtin'
import { schema } from './schema'

export type CreateEditorOptions = {
  placeholder?: string
}

export type Editor = {
  state: EditorState
}

export const defaultOptions: CreateEditorOptions = {}

export function createEditor(
  extensions: Extension[],
  options: CreateEditorOptions = defaultOptions
): Editor {
  const plugins = createPlugins(extensions, options)
  const state = EditorState.create({ schema, plugins })
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
