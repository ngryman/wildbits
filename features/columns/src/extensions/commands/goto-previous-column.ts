import { Command, CommandProps } from '@tiptap/core'
import { TextSelection } from '@tiptap/pm/state'

import { Columns } from '../columns'

export function gotoPreviousColumn(): Command {
  return ({ chain }) => chain().command(gotoPreviousColumnImpl).scrollIntoView().run()
}

export function gotoPreviousColumnImpl({ state, tr }: CommandProps): boolean {
  const { $anchor } = state.selection
  const columnsNode = $anchor.node(-2)
  if (!columnsNode || columnsNode.type.name !== Columns.name) return false

  const nextPos = $anchor.before()
  tr.setSelection(TextSelection.near(tr.doc.resolve(nextPos), -1))

  return true
}
