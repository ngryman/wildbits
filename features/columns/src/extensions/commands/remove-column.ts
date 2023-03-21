import { Command, CommandProps } from '@tiptap/core'

import { findParentColumn } from '../utils'

export function removeColumn(): Command {
  return ({ chain }) => chain().command(removeColumnImpl).scrollIntoView().run()
}

function removeColumnImpl({ dispatch, state, tr }: CommandProps): boolean {
  const foundRoot = findParentColumn(state.selection)
  if (!foundRoot) return false
  if (!dispatch) return true

  const { pos, node } = foundRoot

  tr.delete(pos, pos + node.nodeSize)

  return true
}
