import {
  Node,
  mergeAttributes,
  InputRuleFinder,
  ExtendedRegExpMatchArray,
  InputRule,
  callOrReturn,
} from '@tiptap/core'
import { NodeType } from '@tiptap/pm/model'
import { TextSelection } from '@tiptap/pm/state'
import { createInlineInputRegexp } from '@wildbits/utils'

import * as commands from './commands'
import { Column } from './column'

import styles from '../components/columns.module.css'

export type ColumnsAttributes = {
  count?: number
}

const inputRegex = createInlineInputRegexp(['(\\|{2,})\\s'])

export const Columns = Node.create({
  name: 'columns',
  group: 'block',
  defining: true,
  isolating: true,
  content: 'column{2,}',

  addExtensions() {
    return [Column]
  },

  addAttributes() {
    return {
      count: {
        isRequired: true,
        parseHTML: element => element.dataset.columns,
        renderHTML: ({ count }) => ({ ['data-columns']: count }),
      },
    }
  },

  parseHTML() {
    return [{ tag: `div[data-columns]` }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: styles.root }), 0]
  },

  addCommands() {
    return commands
  },

  addInputRules() {
    return [
      patchedNodeInputRule({
        find: inputRegex,
        type: this.type,
        attributes: match => {
          const [, pipes] = match
          return { count: pipes.length }
        },
      }),
    ]
  },

  addKeyboardShortcuts() {
    return {
      ['Mod-Alt-x']: ({ editor }) => editor.commands.removeColumn(),
      ['Mod-Alt-|']: ({ editor }) => editor.commands.setColumns(),
      ['Mod-Alt-]']: ({ editor }) => editor.commands.insertColumnAfter(),
      ['Mod-Alt-[']: ({ editor }) => editor.commands.insertColumnBefore(),
      ['Tab']: ({ editor }) => editor.commands.gotoNextColumn(),
      ['Shift-Tab']: ({ editor }) => editor.commands.gotoPreviousColumn(),
    }
  },
})

/**
 * Build an input rule that calls the `setColumns` command and remove the content.
 *
 * @todo I might be able to generalize this across extensions in the future.
 */
function patchedNodeInputRule(config: {
  find: InputRuleFinder
  type: NodeType
  attributes?: (match: ExtendedRegExpMatchArray) => ColumnsAttributes
}) {
  return new InputRule({
    find: config.find,
    handler: ({ chain, match }) => {
      const attrs = callOrReturn(config.attributes, undefined, match) || {}
      if (!attrs) return

      chain()
        .setColumns(attrs)
        .command(({ dispatch, state, tr }) => {
          if (dispatch) {
            const range = state.selection.$anchor.blockRange()
            if (range) {
              tr.delete(range.start, range.end).setSelection(
                TextSelection.near(tr.doc.resolve(range.start))
              )
            }
          }
          return true
        })
        .run()
    },
  })
}
