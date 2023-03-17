import ItalicExtension from '@tiptap/extension-italic'
import { markInputRule, markPasteRule } from '@tiptap/core'

const starInputRegex = /(?<!\w|\*)\*([^*]+)\*$/
const starPasteRegex = /(?<!\w|\*)\*([^*]+)\*/g
const underscoreInputRegex = /(?<!\w|_)_([^_]+)_$/
const underscorePasteRegex = /(?<!\w|_)_([^_]+)_/g

export const Italic = ItalicExtension.extend({
  addInputRules() {
    return [
      markInputRule({
        find: starInputRegex,
        type: this.type,
      }),
      markInputRule({
        find: underscoreInputRegex,
        type: this.type,
      }),
    ]
  },

  addPasteRules() {
    return [
      markPasteRule({
        find: starPasteRegex,
        type: this.type,
      }),
      markPasteRule({
        find: underscorePasteRegex,
        type: this.type,
      }),
    ]
  },
})
