import { mergeAttributes, Node } from '@tiptap/core'
import {
  createInlineInputAndPasteRegexps,
  createNodeView,
  nodeInputRule,
  nodePasteRule,
} from '@wildbits/utils'

import { Katex as KatexView } from './components'

export type KatexAttributes = {
  equation: string
  defaultShowPicker?: boolean
}

export type KatexOptions = {
  HTMLAttributes: Record<string, unknown>
}

const [inputRegex, pasteRegex] = createInlineInputAndPasteRegexps(['\\$([^$]+)\\$'])

export const Katex = Node.create<KatexOptions>({
  name: 'katex',
  atom: true,
  isolating: true,
  group: 'inline',
  inline: true,

  addOptions() {
    return { HTMLAttributes: { class: 'katex' } }
  },

  addAttributes() {
    return {
      equation: { default: '', parseHTML: element => element.dataset.equation },
    }
  },

  parseHTML() {
    return [{ tag: 'span.katex' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },

  addCommands() {
    return {
      setKatex:
        attrs =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs }),
    }
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: inputRegex,
        type: this.type,
        attributes: match => {
          const [, , equation] = match
          return { equation }
        },
      }),
    ]
  },

  addPasteRules() {
    return [
      nodePasteRule({
        find: pasteRegex,
        type: this.type,
        attributes: match => {
          const [, , equation] = match
          return { equation }
        },
      }),
    ]
  },

  addNodeView() {
    return createNodeView(KatexView)
  },
})
