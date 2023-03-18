import { InputRule, markInputRule, markPasteRule, PasteRule } from '@tiptap/core'
import { Link as LinkExtension } from '@tiptap/extension-link'

/**
 * The input regex for Markdown links with title support, and multiple quotation
 * marks (required in case the `Typography` extension is being included).
 */
const inputRegex = /(?:^|\s)\[([^\]]*)?\]\((\S+)(?: ["“](.+)["”])?\)$/

/**
 * The paste regex for Markdown links with title support, and multiple quotation
 * marks (required in case the `Typography` extension is being included).
 */
const pasteRegex = /(?:^|\s)\[([^\]]*)?\]\((\S+)(?: ["“](.+)["”])?\)/g

/**
 * Input rule built specifically for the `Link` extension, which ignores the
 * auto-linked URL in parentheses (e.g., `(https://wildbits.app)`).
 *
 * @see https://github.com/ueberdosis/tiptap/discussions/1865
 */
function linkInputRule(config: Parameters<typeof markInputRule>[0]) {
  const defaultMarkInputRule = markInputRule(config)

  return new InputRule({
    find: config.find,
    handler(props) {
      const { tr } = props.state
      defaultMarkInputRule.handler(props)
      tr.setMeta('preventAutolink', true)
    },
  })
}

/**
 * Paste rule built specifically for the `Link` extension, which ignores the
 * auto-linked URL in parentheses (e.g., `(https://wildbits.app)`). This
 * extension was inspired from the multiple implementations found in a Tiptap
 * discussion at GitHub.
 *
 * @see https://github.com/ueberdosis/tiptap/discussions/1865
 */
function linkPasteRule(config: Parameters<typeof markPasteRule>[0]) {
  const defaultMarkInputRule = markPasteRule(config)

  return new PasteRule({
    find: config.find,
    handler(props) {
      const { tr } = props.state
      defaultMarkInputRule.handler(props)
      tr.setMeta('preventAutolink', true)
    },
  })
}

/**
 * Custom extension that extends the built-in `Link` extension to add additional
 * input/paste rules for converting the Markdown link syntax (i.e.
 * `[Wildbits](https://wildbits.app)`) into links, and also adds support for the
 * `title` attribute.
 */
export const Link = LinkExtension.extend({
  inclusive: false,
  addAttributes() {
    return {
      ...this.parent?.(),
      title: {
        default: null,
      },
    }
  },
  addInputRules() {
    return [
      linkInputRule({
        find: inputRegex,
        type: this.type,

        // We need to use `pop()` to remove the last capture groups from the
        // match to satisfy Tiptap's `markPasteRule` expectation of having the
        // content as the last capture group in the match (this makes the
        // attribute order important)
        getAttributes(match) {
          return {
            title: match.pop()?.trim(),
            href: match.pop()?.trim(),
          }
        },
      }),
    ]
  },
  addPasteRules() {
    return [
      linkPasteRule({
        find: pasteRegex,
        type: this.type,

        // We need to use `pop()` to remove the last capture groups from the
        // match to satisfy Tiptap's `markInputRule` expectation of having the
        // content as the last capture group in the match (this makes the
        // attribute order important)
        getAttributes(match) {
          return {
            title: match.pop()?.trim(),
            href: match.pop()?.trim(),
          }
        },
      }),
    ]
  },
})

export type { LinkOptions } from '@tiptap/extension-link'
