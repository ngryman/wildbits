import { baseKeymap, chainCommands } from 'prosemirror-commands'
import { splitListItem } from 'prosemirror-schema-list'

import { schema } from '../schema'
import { Bindings } from '../types'

export function baseBindings(): Bindings {
  return {
    ...baseKeymap,
    ['Enter']: chainCommands(
      splitListItem(schema.nodes.list_item),
      baseKeymap['Enter']
    ),
  }
}
