import { MarkSpec, Schema } from 'prosemirror-model'
import { schema as basicSchema } from 'prosemirror-schema-basic'
import { addListNodes } from 'prosemirror-schema-list'

// Override basie schema code mark to:
//   1. exclude all other marks
//   2. disable spellcheck
const codeMark: MarkSpec = {
  excludes: '_', // exclude all other marks
  parseDOM: [{ tag: 'code' }],
  toDOM: () => ['code', { spellcheck: false }, 0],
}

const strikethroughMark: MarkSpec = {
  parseDOM: [{ tag: 's' }, { style: 'text-decoration=line-through' }],
  toDOM: () => ['s', 0],
}

export const schema = new Schema({
  nodes: addListNodes(basicSchema.spec.nodes, 'paragraph block*', 'block'),
  marks: basicSchema.spec.marks.append({
    code: codeMark,
    s: strikethroughMark,
  }),
})
