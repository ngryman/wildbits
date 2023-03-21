import { Command, CommandProps } from '@tiptap/core'
import { TextSelection } from '@tiptap/pm/state'

import { createColumn, findParentColumns } from '../utils'

export function insertColumnAfter(): Command {
  return ({ chain }) => chain().command(insertColumnAfterImpl).scrollIntoView().run()
}

function insertColumnAfterImpl({ dispatch, editor, state, tr }: CommandProps): boolean {
  const { $anchor } = state.selection
  const foundRoot = findParentColumns(state.selection)
  if (!foundRoot) return false
  if (!dispatch) return true

  const { depth } = foundRoot
  const index = $anchor.indexAfter(depth)
  const columnPos = $anchor.posAtIndex(index, depth)

  tr.insert(columnPos, createColumn(editor.schema)).setSelection(
    TextSelection.near(tr.doc.resolve(columnPos))
  )

  return true
}
