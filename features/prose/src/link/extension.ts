import { Link as LinkExtension } from '@tiptap/extension-link'
import {
  CLOSING_QUOTES,
  createInlineInputAndPasteRegexps,
  markInputRule,
  markPasteRule,
  OPENING_QUOTES,
} from '@wildbits/utils'

/**
 * Regexps for Markdown link with support for multiple quotation marks (required
 * in case the `Typography` extension is being included).
 */
const [inputRegex, pasteRegex] = createInlineInputAndPasteRegexps([
  // text
  `\\[([^\\]]*)\\]`,
  // href & title
  `\\(([^)${OPENING_QUOTES}]+)(?:\\s+[${OPENING_QUOTES}]([^${CLOSING_QUOTES}]+)[${CLOSING_QUOTES}])?\\)`,
])

/**
 * Custom extension that extends the built-in `Link` extension to add additional
 * input/paste rules for converting the Markdown link syntax (i.e.
 * `[Wildbits](https://wildbits.app)`) into links, and also adds support for the
 * `title` attribute.
 */
export const Link = LinkExtension.extend({
  inclusive: false,

  addOptions() {
    return {
      ...this.parent?.(),
      linkOnPaste: false,
      openOnClick: false,
    }
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      title: { default: null },
    }
  },

  addInputRules() {
    return [
      markInputRule({
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
      markPasteRule({
        find: pasteRegex,
        type: this.type,
        capture: match => match[2] || match[3],
        attributes: match => {
          const [, , text, href, title] = match
          return { text, href, title }
        },
      }),
      ...(this.parent?.() || []),
    ]
  },
})

export type { LinkOptions } from '@tiptap/extension-link'
