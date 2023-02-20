import { baseKeymap, chainCommands } from 'prosemirror-commands'
import { keymap } from 'prosemirror-keymap'
import { Schema } from 'prosemirror-model'
import { splitListItem } from 'prosemirror-schema-list'
import { Plugin } from 'prosemirror-state'

export function keymaps(schema: Schema): Plugin {
  return keymap({
    ...baseKeymap,
    ['Enter']: chainCommands(
      splitListItem(schema.nodes.list_item),
      baseKeymap['Enter']
    ),
  })
}
