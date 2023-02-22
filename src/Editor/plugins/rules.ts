import {
  ellipsis,
  emDash,
  InputRule,
  inputRules,
  smartQuotes,
  textblockTypeInputRule,
  wrappingInputRule,
} from 'prosemirror-inputrules'
import { NodeType, Schema } from 'prosemirror-model'
import { Plugin } from 'prosemirror-state'

/// Create block types using markdown conventions.
export function rules(schema: Schema): Plugin {
  const rules = [...proseRules(), ...markdownRules(schema)]
  return inputRules({ rules })
}

/// Create rules for prose.
function proseRules() {
  return [...smartQuotes, ellipsis, emDash]
}

/// Create rules for markdown-like formatting
function markdownRules(schema: Schema) {
  return [
    blockQuoteRule(schema.nodes.blockquote),
    bulletListRule(schema.nodes.bullet_list),
    codeBlockRule(schema.nodes.code_block),
    headingRule(schema.nodes.heading, 6),
    orderedListRule(schema.nodes.ordered_list),
    strongRule(schema),
    emRule(schema),
  ]
}

/// Given a blockquote node type, returns an input rule that turns `"> "`
/// at the start of a textblock into a blockquote.
function blockQuoteRule(nodeType: NodeType) {
  return wrappingInputRule(/^\s*>\s$/, nodeType)
}

/// Given a list node type, returns an input rule that turns a bullet
/// (dash, plush, or asterisk) at the start of a textblock into a
/// bullet list.
function bulletListRule(nodeType: NodeType) {
  return wrappingInputRule(/^\s*([-+*])\s$/, nodeType)
}

/// Given a code block node type, returns an input rule that turns a
/// textblock starting with three backticks into a code block.
function codeBlockRule(nodeType: NodeType) {
  return textblockTypeInputRule(/^```$/, nodeType)
}

/// Given a node type and a maximum level, creates an input rule that
/// turns up to that number of `#` characters followed by a space at
/// the start of a textblock into a heading whose level corresponds to
/// the number of `#` signs.
function headingRule(nodeType: NodeType, maxLevel: number) {
  return textblockTypeInputRule(
    new RegExp(`^(#{1,${maxLevel}})\\s$`),
    nodeType,
    match => ({ level: match[1].length })
  )
}

/// Return an input rule that turns a number followed by a dot at the start
/// of a textblock into an ordered list.
function orderedListRule(nodeType: NodeType) {
  return wrappingInputRule(
    /^(\d+)\.\s$/,
    nodeType,
    match => ({ order: +match[1] }),
    (match, node) => node.childCount + (node.attrs.order as number) == +match[1]
  )
}

/// Return an input rule that turns words surrounded by double asterisks
/// or underscores into a strong mark.
function strongRule(schema: Schema) {
  return new InputRule(
    /(?:\*\*|__)([^*]+)(?:\*\*|__)/,
    (state, _match, start, end) => {
      const tr = state.tr
      return tr
        .addMark(start + 2, end - 1, schema.marks.strong.create())
        .delete(start, start + 2)
        .delete(tr.mapping.map(end - 1), tr.mapping.map(end))
    }
  )
}

/// Return an input rule that turns words surrounded by an asterisk
/// or an underscore into a em mark.
function emRule(schema: Schema) {
  return new InputRule(
    /(?:\*|_)([^*]+)(?:\*|_)/,
    (state, _match, start, end) => {
      const tr = state.tr
      return tr
        .addMark(start + 1, end, schema.marks.em.create())
        .delete(start, start + 1)
    }
  )
}
