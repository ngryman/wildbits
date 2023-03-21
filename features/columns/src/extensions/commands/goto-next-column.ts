import { Command, CommandProps } from '@tiptap/core'
import { TextSelection } from '@tiptap/pm/state'

import { findParentColumns } from '../utils'

export function gotoNextColumn(): Command {
  return ({ chain }) => chain().command(gotoNextColumnImpl).scrollIntoView().run()
}

function gotoNextColumnImpl({ dispatch, state, tr }: CommandProps): boolean {
  const { $anchor } = state.selection
  const foundRoot = findParentColumns(state.selection)
  if (!foundRoot) return false
  if (!dispatch) return true

  const { depth } = foundRoot
  const index = $anchor.indexAfter(depth)
  const [nextPos, bias] =
    index < foundRoot.node.childCount
      ? [$anchor.posAtIndex(index + 1, depth), -1]
      : [$anchor.after(depth), 1]

  tr.setSelection(TextSelection.near(tr.doc.resolve(nextPos), bias))

  return true
}
