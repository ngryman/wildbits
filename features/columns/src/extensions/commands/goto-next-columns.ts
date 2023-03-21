import { Command, CommandProps } from '@tiptap/core'
import { TextSelection } from '@tiptap/pm/state'
import { Columns } from '../columns'

export function gotoNextColumn(): Command {
  return ({ chain }) => chain().command(gotoNextColumnImpl).scrollIntoView().run()
}

function gotoNextColumnImpl({ state, view }: CommandProps): boolean {
  const { $anchor } = state.selection
  const columnsNode = $anchor.node(-2)
  if (!columnsNode || columnsNode.type.name !== Columns.name) return false

  const index = $anchor.indexAfter(-2)
  const [nextPos, bias] =
    index < columnsNode.childCount - 1
      ? [$anchor.posAtIndex(index + 1, -2), -1]
      : [$anchor.after(), 1]

  const tr = state.tr.setSelection(TextSelection.near(state.doc.resolve(nextPos), bias))
  view.dispatch(tr)

  return true
}
