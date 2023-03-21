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

  addAttributes() {
    return {
      index: {
        isRequired: true,
        parseHTML: element => element.dataset.index,
        renderHTML: ({ index }) => ({ ['data-index']: index }),
      },
    }
  },

  parseHTML() {
    return [{ tag: `div[data-index]` }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: styles.root }), 0]
  },
})
