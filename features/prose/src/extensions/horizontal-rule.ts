import { HorizontalRule as HorizontalRuleExtension } from '@tiptap/extension-horizontal-rule'
import { callOrReturn, ExtendedRegExpMatchArray, InputRule, InputRuleFinder } from '@tiptap/core'
import { NodeType } from '@tiptap/pm/model'

/**
 * Build an input rule that adds a node when the matched text is typed into it.
 *
 * NOTE: This is a patched version of `@tiptap/core` that fixes a bug for the
 * horizontal rule.
 * TODO: Remove this hole extension when
 * https://github.com/ueberdosis/tiptap/pull/3859 is merged.
 */
function patchedNodeInputRule(config: {
  find: InputRuleFinder
  type: NodeType
  getAttributes?:
    | Record<string, unknown>
    | ((match: ExtendedRegExpMatchArray) => Record<string, unknown>)
    | false
    | null
}) {
  return new InputRule({
    find: config.find,
    handler: ({ state, range, match }) => {
      const attributes = callOrReturn(config.getAttributes, undefined, match) || {}

      const { tr } = state
      const captureGroup = match[1]
      const fullMatch = match[0]
      const start = range.from
      let end = range.to

      if (captureGroup) {
        const offset = fullMatch.lastIndexOf(captureGroup)
        let matchStart = start + offset

        if (matchStart > end) {
          matchStart = end
        } else {
          end = matchStart + captureGroup.length
        }

        // insert last typed character
        const lastChar = fullMatch[fullMatch.length - 1]

        tr.insertText(lastChar, start + fullMatch.length - 1)

        // insert node from input rule
        tr.replaceWith(matchStart, end, config.type.create(attributes))
      } else if (fullMatch) {
        tr.insert(start - 1, config.type.create(attributes)).delete(
          tr.mapping.map(start),
          tr.mapping.map(end)
        )
      }
    },
  })
}

export const HorizontalRule = HorizontalRuleExtension.extend({
  addInputRules() {
    return [
      patchedNodeInputRule({
        find: /^---|—-|___\s|\*\*\*\s$/,
        type: this.type,
      }),
    ]
  },
})

export type { HorizontalRuleOptions } from '@tiptap/extension-horizontal-rule'
