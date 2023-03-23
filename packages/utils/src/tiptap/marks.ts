import { callOrReturn, ExtendedRegExpMatchArray, InputRule, PasteRule, Range } from '@tiptap/core'
import { EditorState } from '@tiptap/pm/state'
import { Mark, MarkType } from 'prosemirror-model'

/**
 * Adapted version of Tiptap config for mark rules with the following
 * modifications:
 *
 * 1. Accepts a `capture` thunk to selectively specify which capture group
 *    should be considered as content. Tiptap uses the last one by default,
 *    which is not very handy in situations when the capture group position may
 *    vary.
 * 2. Accepts a `type` thunk to give the ability to dynamically create a mark.
 * 3. Renames `getAttributes` to `attributes`.
 */
export type MarkRuleConfig<Attributes> = {
  find: RegExp
  type: MarkType | ((attrs?: Attributes) => Mark)
  capture?: string | ((match: ExtendedRegExpMatchArray) => string)
  attributes?: Attributes | ((match: ExtendedRegExpMatchArray) => Attributes) | false | null
}

/**
 * Adapted version of {@link @tiptap/core#markInputRule} `markInputRule`
 * accepting a {@link MarkRuleConfig}.
 */
export function markInputRule<Attributes>(config: MarkRuleConfig<Attributes>) {
  return new InputRule({
    find: config.find,
    handler: ({ range, state, match }) => handleMarkRule(config, range, state, match),
  })
}

/**
 * Adapted version of {@link @tiptap/core#markPasteRule} accepting a
 * {@link MarkRuleConfig}.
 */
export function markPasteRule<Attributes>(config: MarkRuleConfig<Attributes>) {
  return new PasteRule({
    find: config.find,
    handler: ({ range, state, match }) => handleMarkRule(config, range, state, match),
  })
}

function handleMarkRule<Attributes>(
  config: MarkRuleConfig<Attributes>,
  range: Range,
  state: EditorState,
  match: ExtendedRegExpMatchArray
) {
  const attrs = callOrReturn(config.attributes, undefined, match) || undefined
  const capture = callOrReturn(config.capture, undefined, match) || ''
  const mark = typeof config.type === 'function' ? config.type(attrs) : config.type.create(attrs)

  const { tr } = state
  const fullMatch = match[0]

  if (capture) {
    const startSpaces = fullMatch.search(/\S/)
    const textStart = range.from + fullMatch.indexOf(capture)
    const textEnd = textStart + capture.length
    const markStart = range.from + startSpaces

    if (textEnd < range.to) {
      tr.delete(textEnd, range.to)
    }

    if (textStart > range.from) {
      tr.delete(range.from + startSpaces, textStart)
    }

    tr.addMark(markStart, markStart + capture.length, mark).removeStoredMark(mark.type)
  }
}
