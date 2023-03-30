import { Node, mergeAttributes, textblockTypeInputRule } from '@tiptap/core'
import { createActionCommand, createActionShortcut } from '@wildbits/utils'

import * as actions from './actions'

export type CodeBlockOptions = {
  /**
   * Custom HTML attributes that should be added to the rendered HTML tag.
   */
  HTMLAttributes: Record<string, unknown>
}

export type CodeBlockAttributes = undefined

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    codeBlock: {
      setCodeBlock: (attrs?: CodeBlockAttributes) => ReturnType
      toggleCodeBlock: (attrs?: CodeBlockAttributes) => ReturnType
    }
  }
}

export const inputRegex = /^```([a-z]+)?[\s\n]$/

export const CodeBlock = Node.create<CodeBlockOptions>({
  name: 'codeBlock',
  content: 'text*',
  marks: '',
  group: 'block',
  code: true,
  defining: true,

  addOptions() {
    return { HTMLAttributes: {} }
  },

  parseHTML() {
    return [{ tag: 'pre', preserveWhitespace: 'full' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['pre', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), ['code', 0]]
  },

  addCommands() {
    return {
      setCodeBlock: params => createActionCommand(this, actions.setCodeBlock, params),
      toggleCodeBlock: params => createActionCommand(this, actions.toggleCodeBlock, params),
    }
  },

  addKeyboardShortcuts() {
    return {
      ['Mod-Alt-c']: createActionShortcut(this, actions.toggleCodeBlock),
      ['Enter']: createActionShortcut(this, actions.exitOnTripleEnter),
      ['ArrowDown']: createActionShortcut(this, actions.exitOnArrowDown),
    }
  },

  addInputRules() {
    return [
      textblockTypeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: match => ({
          language: match[1],
        }),
      }),
    ]
  },
})
