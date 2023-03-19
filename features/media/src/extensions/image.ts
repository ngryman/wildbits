import { callOrReturn, ExtendedRegExpMatchArray, InputRule, InputRuleFinder } from '@tiptap/core'
import { Image as ImageExtension } from '@tiptap/extension-image'
import { NodeType } from '@tiptap/pm/model'

/**
 * Build an input rule that adds a node when the matched text is typed into it.
 *
 * NOTE: This is a patched version of `@tiptap/core` that places the cursor
 * after the node.
 * TODO: Remove this function if we manage to get a generic working version merged.
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

      tr.insert(range.from - 1, config.type.create(attributes)).delete(
        tr.mapping.map(range.from),
        tr.mapping.map(range.to)
      )
    },
  })
}

export const inputRegex = /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/

export const Image = ImageExtension.extend({
  addInputRules() {
    return [
      patchedNodeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: match => {
          const [, , alt, src, title] = match
          return { src, alt, title }
        },
      }),
    ]
  },
})

export type { ImageOptions } from '@tiptap/extension-image'
