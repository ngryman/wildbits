import { findParentNode } from '@tiptap/core'

import { Column } from './column'
import { Columns } from './columns'

export const findParentColumn = findParentNode(node => node.type.name === Column.name)
export const findParentColumns = findParentNode(node => node.type.name === Columns.name)
