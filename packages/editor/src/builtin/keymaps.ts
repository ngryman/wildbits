import { baseKeymap, chainCommands } from 'prosemirror-commands'
import { keymap } from 'prosemirror-keymap'
import { splitListItem } from 'prosemirror-schema-list'
import { Plugin } from 'prosemirror-state'

import { schema } from '../schema'

export function keymaps(): Plugin {
  return keymap({
    ...baseKeymap,
    ['Enter']: chainCommands(
      splitListItem(schema.nodes.list_item),
      baseKeymap['Enter']
    ),
  })
}
