import { findParentNode } from '@tiptap/core'
import { Node, Schema } from '@tiptap/pm/model'

import { Column } from './extensions/column'
import { Columns } from './extension'

export const findParentColumn = findParentNode(node => node.type.name === Column.name)
export const findParentColumns = findParentNode(node => node.type.name === Columns.name)

export function createColumns(schema: Schema, count: number, content: Node | null = null): Node {
  const columns = []
  for (let i = 0; i < count; i += 1) {
    columns.push(createColumn(schema, i === 0 ? content : null))
  }
  return schema.nodes.columns.createChecked({ count }, columns)
}

export function createColumn(schema: Schema, content: Node | null = null): Node {
  return content
    ? schema.nodes.column.createChecked(null, content)
    : schema.nodes.column.createAndFill(null)!
}
