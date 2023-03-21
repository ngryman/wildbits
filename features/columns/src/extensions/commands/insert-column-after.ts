import { Command, CommandProps } from '@tiptap/core'

import { findParentColumn } from '../utils'

export function insertColumnAfter(): Command {
  return ({ chain }) => chain().command(insertColumnAfterImpl).scrollIntoView().run()
}

function insertColumnAfterImpl({ dispatch, state, tr }: CommandProps): boolean {
  const foundColumn = findParentColumn(state.selection)
  if (!foundColumn) return false
  if (!dispatch) return true

  const { pos, node } = foundColumn

  tr.delete(pos, node.nodeSize)

  return true
}
