import { Node, mergeAttributes } from '@tiptap/core'

import styles from '../components/column.module.css'

export const Column = Node.create({
  name: 'column',
  content: 'block+',
  isolating: true,

  addOptions() {
    return {
      HTMLAttributes: { class: styles.root },
    }
  },

  parseHTML() {
    return [{ tag: `div[data-column]` }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: styles.root, 'data-column': true }), 0]
  },
})
