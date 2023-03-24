import { Bold as BoldExtension } from '@tiptap/extension-bold'
import { markInputRule, markPasteRule } from '@tiptap/core'

const starInputRegex = /\*\*([^*]+)\*\*$/
const starPasteRegex = /\*\*([^*]+)\*\*/g
const underscoreInputRegex = /__([^_]+)__$/
const underscorePasteRegex = /__([^_]+)__/g

export const Bold = BoldExtension.extend({
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

export type { BoldOptions } from '@tiptap/extension-bold'
