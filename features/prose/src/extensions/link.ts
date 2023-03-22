import { InputRule, markPasteRule, PasteRule } from '@tiptap/core'
import { Link as LinkExtension } from '@tiptap/extension-link'
import {
  CLOSING_QUOTES,
  createMarkInputAndPasteRegexps,
  markInputRule,
  MarkInputRuleConfig,
  OPENING_QUOTES,
} from '@wildbits/utils'

type LinkAttributes = {
  href: string
  text: string
  title: string
}

/**
 * Regexps for Markdown link with support for multiple quotation marks (required
 * in case the `Typography` extension is being included).
 */
const [inputRegex, pasteRegex] = createMarkInputAndPasteRegexps([
  // text
  `\\[(\\S*)\\]`,
  // href & title
  `\\((\\S+)(?:\\s+[${OPENING_QUOTES}]([^${CLOSING_QUOTES}]+)[${CLOSING_QUOTES}])?\\)`,
])

/**
 * Input rule built specifically for the `Link` extension, which ignores the
 * auto-linked URL in parentheses (e.g., `(https://wildbits.app)`).
 *
 * @see https://github.com/ueberdosis/tiptap/discussions/1865
 */
function linkInputRule(config: MarkInputRuleConfig<LinkAttributes>) {
  const defaultMarkInputRule = markInputRule(config)

  return new InputRule({
    find: config.find,
    handler(props) {
      defaultMarkInputRule.handler(props)
      props.state.tr.setMeta('preventAutolink', true)
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
      defaultMarkInputRule.handler(props)
      props.state.tr.setMeta('preventAutolink', true)
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
        capture: match => match[2] || match[3],
        attributes: match => {
          const [, , text, href, title] = match
          return { text, href, title }
        },
      }),
    ]
  },
  addPasteRules() {
    return [
      linkPasteRule({
        find: pasteRegex,
        type: this.type,
        attributes: match => {
          const [, , text, href, title] = match
          return { text, href, title }
        },
      }),
    ]
  },
})

export type { LinkOptions } from '@tiptap/extension-link'
