import { Command, CommandProps } from '@tiptap/core'
import { TextSelection } from '@tiptap/pm/state'

import { findParentColumn } from '../utils'

export function gotoPreviousColumn(): Command {
  return ({ chain }) => chain().command(gotoPreviousColumnImpl).scrollIntoView().run()
}

export function gotoPreviousColumnImpl({ dispatch, state, tr }: CommandProps): boolean {
  const { $anchor } = state.selection
  const foundColumn = findParentColumn(state.selection)
  if (!foundColumn) return false

  const { depth } = foundColumn
  const nextPos = $anchor.before(depth)

  if (dispatch) {
    tr.setSelection(TextSelection.near(tr.doc.resolve(nextPos), -1))
  }

  return true
}
