import {
  Extension,
  createMarkRule,
  createNodeRule,
  createReplaceNodeRule,
} from '@mindraft/editor-extension'

const MAX_HEADING_LEVEL = 6

const markRules = [
  // Bold
  createMarkRule({
    regexp: /(?:\*\*|__)([^*_]+)(?:\*\*|__)$/,
    type: 'strong',
  }),
  // Italic
  createMarkRule({
    regexp: /(?<![*_])(?:[*_])([^*_]+)(?:[*_])$/,
    type: 'em',
  }),
  // Strikethrough
  createMarkRule({
    regexp: /(?:~~)([^~]+)(?:~~)$/,
    type: 's',
  }),
  // Code
  createMarkRule({
    regexp: /(?:`)([^`]+)(?:`)$/,
    type: 'code',
  }),
]

const blockRules = [
  // Heading
  createReplaceNodeRule({
    regexp: new RegExp(`^(#{1,${MAX_HEADING_LEVEL}})\\s$`),
    type: 'heading',
    attrs: match => ({ level: match[1].length }),
  }),
  // Bullet list
  createNodeRule({
    regexp: /^\s*([*+-])\s$/,
    type: 'bullet_list',
  }),
  // Ordered list
  createNodeRule({
    regexp: /^\s*(\d+)\.\s$/,
    type: 'ordered_list',
    attrs: match => ({ order: Number(match[1]) }),
    join: (match, node) =>
      node.childCount + (node.attrs.order as number) == +match[1],
  }),
  // Blockquote
  createNodeRule({
    regexp: /^\s*>\s$/,
    type: 'blockquote',
  }),
  // Code block
  // TODO: parse language and use the  `refractor` package for highlighting
  createReplaceNodeRule({
    regexp: /^\s*```(\w*)\s$/,
    type: 'code_block',
  }),
]

export function markdownExtension() {
  return new Extension({
    createRules() {
      return [...markRules, ...blockRules]
    },
  })
}
