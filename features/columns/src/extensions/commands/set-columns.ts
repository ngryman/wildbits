import { Command, CommandProps } from '@tiptap/core'
import { Node, NodeType, Schema } from '@tiptap/pm/model'
import { TextSelection } from '@tiptap/pm/state'

import { ColumnsAttributes } from '../columns'

const defaultColumnCount = 3

export function setColumns(attributes: ColumnsAttributes = {}): Command {
  const count = attributes.count || defaultColumnCount
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

function createColumns(schema: Schema, count: number, content: Node | null = null): Node {
  const columns = []
  for (let i = 0; i < count; i += 1) {
    columns.push(createColumn(schema.nodes.column, i, i === 0 ? content : null))
  }
  return schema.nodes.columns.createChecked({ count }, columns)
}

function createColumn(columnType: NodeType, index: number, content: Node | null = null): Node {
  return content
    ? columnType.createChecked({ index }, content)
    : columnType.createAndFill({ index })!
}
