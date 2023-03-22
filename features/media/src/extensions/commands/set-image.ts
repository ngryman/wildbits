import { Command, CommandProps } from '@tiptap/core'

import { ImageAttributes } from '../image'

export function setImage(attrs: ImageAttributes): Command {
  return ({ chain }) =>
    chain()
      .command(props => setImageImpl(props, attrs))
      .scrollIntoView()
      .run()
}

function setImageImpl(
  { dispatch, editor, state, tr }: CommandProps,
  attrs: ImageAttributes
): boolean {
  const { $anchor } = state.selection
  const range = $anchor.blockRange()

  if (range) {
    const image = editor.schema.nodes.image.create(attrs)
    if (dispatch) {
      tr.replaceWith(range.start, range.end, image)
    }
  } else {
    console.warn('cursor is outside a node')
    // tr.insert($anchor.pos - 1, image)
    // const columns = createColumns(editor.schema, count)
    // tr.delete($anchor.pos, $anchor.pos + 1).replaceSelectionWith(columns)
  }

  return true
}
