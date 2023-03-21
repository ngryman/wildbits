import { findParentNode } from '@tiptap/core'
import { Node, Schema } from '@tiptap/pm/model'

import { Column } from './column'
import { Columns } from './columns'

export const findParentColumn = findParentNode(node => node.type.name === Column.name)
export const findParentColumns = findParentNode(node => node.type.name === Columns.name)

export function createColumns(schema: Schema, count: number, content: Node | null = null): Node {
  const columns = []
  for (let i = 0; i < count; i += 1) {
    columns.push(createColumn(schema, i, i === 0 ? content : null))
  }
  return schema.nodes.columns.createChecked({ count }, columns)
}

export function createColumn(schema: Schema, index: number, content: Node | null = null): Node {
  return content
    ? schema.nodes.column.createChecked({ index }, content)
    : schema.nodes.column.createAndFill({ index })!
}
