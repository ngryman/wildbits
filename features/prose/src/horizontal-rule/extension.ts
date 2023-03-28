import { HorizontalRule as HorizontalRuleExtension } from '@tiptap/extension-horizontal-rule'
import { nodeInputRule } from './utils'

export const HorizontalRule = HorizontalRuleExtension.extend({
  selectable: false,

  addInputRules() {
    return [
      nodeInputRule({
        find: /^---|—-|___\s|\*\*\*\s$/,
        type: this.type,
      }),
    ]
  },
})

export type { HorizontalRuleOptions } from '@tiptap/extension-horizontal-rule'
