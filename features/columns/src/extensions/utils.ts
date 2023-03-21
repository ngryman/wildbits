import { Editor, findParentNode } from '@tiptap/core'
import { Node, NodeType, Schema } from '@tiptap/pm/model'
import { EditorState, Selection } from '@tiptap/pm/state'

import { Column } from './column'
import { Columns } from './columns'

export function createColumns(schema: Schema, count: number, content: Node): Node {
  const columns = []
  for (let i = 0; i < count; i += 1) {
    columns.push(createColumn(schema.nodes.column, i, i === 0 ? content : null))
  }
  return schema.nodes.columns.createChecked({ count }, columns)
}

export function createColumn(
  columnType: NodeType,
  index: number,
  content: Node | null = null
): Node {
  return content ? columnType.createChecked({ index }, content) : columnType.create({ index })!
}

export function addOrDeleteCol({
  state,
  dispatch,
  type,
}: {
  state: EditorState
  dispatch: any
  type: 'addBefore' | 'addAfter' | 'delete'
}) {
  const maybeColumns = findParentNode((node: Node) => node.type.name === Columns.name)(
    state.selection
  )
  const maybeColumn = findParentNode((node: Node) => node.type.name === Column.name)(
    state.selection
  )

  if (dispatch && maybeColumns && maybeColumn) {
    const cols = maybeColumns.node
    const colIndex = maybeColumn.node.attrs.index
    const colsJSON = cols.toJSON()

    let nextIndex = colIndex

    if (type === 'delete') {
      nextIndex = colIndex - 1
      colsJSON.content.splice(colIndex, 1)
    } else {
      nextIndex = type === 'addBefore' ? colIndex : colIndex + 1
      colsJSON.content.splice(nextIndex, 0, {
        type: 'column',
        attrs: {
          index: colIndex,
        },
        content: [
          {
            type: 'paragraph',
          },
        ],
      })
    }

    colsJSON.attrs.count = colsJSON.content.length

    colsJSON.content.forEach((colJSON, index) => {
      colJSON.attrs.index = index
    })

    const nextCols = Node.fromJSON(state.schema, colsJSON)

    let nextSelectPos = maybeColumns.pos
    nextCols.content.forEach((col, pos, index) => {
      if (index < nextIndex) {
        nextSelectPos += col.nodeSize
      }
    })

    const tr = state.tr.setTime(Date.now())

    tr.replaceWith(
      maybeColumns.pos,
      maybeColumns.pos + maybeColumns.node.nodeSize,
      nextCols
    ).setSelection(Selection.near(tr.doc.resolve(nextSelectPos)))

    dispatch(tr)
  }

  return true
}

export function gotoNextColumn(editor: Editor): boolean {
  const { state, view } = editor
  const columnsNode = state.selection.$anchor.node(-2)
  if (!columnsNode || columnsNode.type.name !== Columns.name) return false

  const index = state.selection.$anchor.indexAfter(-2)
  const [nextPos, bias] =
    index < columnsNode.childCount
      ? [state.selection.$anchor.posAtIndex(index + 1, -2) - 1]
      : [state.selection.$anchor.after(), 1]

  const tr = state.tr.setSelection(Selection.near(state.doc.resolve(nextPos), bias))
  view.dispatch(tr)
  return true
}

export function gotoPrevColumn(editor: Editor): boolean {
  const { state, view } = editor
  const columnsNode = state.selection.$anchor.node(-2)
  if (!columnsNode || columnsNode.type.name !== Columns.name) return false

  const nextPos = state.selection.$anchor.before()
  const tr = state.tr.setSelection(Selection.near(state.doc.resolve(nextPos), -1))
  view.dispatch(tr)
  return true
}
