import { Command, CommandProps } from '@tiptap/core'
import { TextSelection } from '@tiptap/pm/state'

import { createColumn, findParentColumns } from '../utils'

export function insertColumnBefore(): Command {
  return ({ chain }) => chain().command(insertColumnBeforeImpl).scrollIntoView().run()
}

function insertColumnBeforeImpl({ dispatch, editor, state, tr }: CommandProps): boolean {
  const { $anchor } = state.selection
  const foundRoot = findParentColumns(state.selection)
  if (!foundRoot) return false
  if (!dispatch) return true

  const { depth } = foundRoot
  const index = $anchor.indexAfter(depth)
  const columnPos = $anchor.posAtIndex(index - 1, depth)

  tr.insert(columnPos, createColumn(editor.schema, index - 1)).setSelection(
    TextSelection.near(tr.doc.resolve(columnPos))
  )

  return true
}
