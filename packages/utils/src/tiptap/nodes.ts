import { callOrReturn, ExtendedRegExpMatchArray, InputRule, PasteRule, Range } from '@tiptap/core'
import { EditorState } from '@tiptap/pm/state'
import { Node, NodeType } from 'prosemirror-model'

/**
 * Adapted version of Tiptap config for node rules with the following
 * modifications:
 *
 * 1. Accepts a `type` thunk to give the ability to dynamically create a mark.
 * 2. Renames `getAttributes` to `attributes`.
 */
export type NodeRuleConfig<Attributes> = {
  find: RegExp
  type: NodeType | ((attrs?: Attributes) => Node)
  attributes?: Attributes | ((match: ExtendedRegExpMatchArray) => Attributes) | false | null
}

/**
 * Adapted version of {@link @tiptap/core#nodeInputRule} `markInputRule`
 * accepting a {@link NodeRuleConfig}.
 */
export function nodeInputRule<Attributes>(config: NodeRuleConfig<Attributes>) {
  return new InputRule({
    find: config.find,
    handler: ({ range, state, match }) => handleNodeRule(config, range, state, match),
  })
}

/**
 * Adapted version of {@link @tiptap/core#nodePasteRule} accepting a
 * {@link NodeRuleConfig}.
 */
export function nodePasteRule<Attributes>(config: NodeRuleConfig<Attributes>) {
  return new PasteRule({
    find: config.find,
    handler: ({ range, state, match }) => handleNodeRule(config, range, state, match),
  })
}

export function handleNodeRule<Attributes>(
  config: NodeRuleConfig<Attributes>,
  range: Range,
  state: EditorState,
  match: ExtendedRegExpMatchArray
) {
  const { selection, tr } = state
  const attrs = callOrReturn(config.attributes, undefined, match) || undefined
  const node = typeof config.type === 'function' ? config.type(attrs) : config.type.create(attrs)

  const shouldReplace = selection.$anchor.start() === range.from
  const pos = shouldReplace ? range.from - 1 : range.from

  tr.insert(pos, node).delete(tr.mapping.map(range.from), tr.mapping.map(range.to))
}
