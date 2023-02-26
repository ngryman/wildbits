import { Extension, Plugin } from '@mindraft/editor-utils'
import { baseKeymap, chainCommands } from 'prosemirror-commands'
import { keymap } from 'prosemirror-keymap'
import { splitListItem } from 'prosemirror-schema-list'

import { schema } from '../schema'

const builtinBindings = {
  ...baseKeymap,
  ['Enter']: chainCommands(
    splitListItem(schema.nodes.list_item),
    baseKeymap['Enter']
  ),
}

export function createBindingsPlugin(_extensions: Extension[]): Plugin {
  const bindings = { ...builtinBindings }
  return keymap(bindings)
}
