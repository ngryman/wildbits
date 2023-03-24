import { Command, CommandProps } from '@tiptap/core'
import { TextSelection } from '@tiptap/pm/state'

import { ColumnsAttributes } from '../extension'
import { createColumns } from '../utils'

const defaultColumnCount = 3

export function setColumns(attrs: ColumnsAttributes = {}): Command {
  const count = attrs.count || defaultColumnCount
  return ({ chain }) =>
    chain()
      .command(props => setColumnsImpl(props, count))
      .scrollIntoView()
      .run()
}

function setColumnsImpl({ dispatch, editor, state, tr }: CommandProps, count: number): boolean {
  const { $anchor } = state.selection
  const range = $anchor.blockRange()

  if (range) {
    const columns = createColumns(editor.schema, count, $anchor.parent)
    const selectionPos = $anchor.pos + $anchor.depth + 1
    if (dispatch) {
      tr.replaceWith(range.start, range.end, columns).setSelection(
        TextSelection.near(tr.doc.resolve(selectionPos))
      )
    }
  } else {
    console.warn('cursor is outside a node')
    // const columns = createColumns(editor.schema, count)
    // tr.delete($anchor.pos, $anchor.pos + 1).replaceSelectionWith(columns)
  }

  return true
}
