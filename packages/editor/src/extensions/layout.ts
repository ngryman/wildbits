import {
  CommandProps,
  Extension,
  JSONContent,
  mergeAttributes,
  Node,
} from '@tiptap/core'
import { times } from '@wildbits/utils'

import styles from './layout.module.css'

export const Layout = Extension.create({
  name: 'layout',

  addExtensions() {
    return [Column, Grid]
  },
})

const Column = Node.create({
  name: 'column',
  group: 'layout',
  content: '(paragraph|block)*',
  isolating: true,
  selectable: false,

  renderHTML({ HTMLAttributes }) {
    const attrs = mergeAttributes(HTMLAttributes, { class: styles.column })
    return ['div', attrs, 0]
  },
})

export const Grid = Node.create({
  name: 'grid',
  group: 'block',
  content: 'column{2,}',
  isolating: true,
  selectable: true,

  renderHTML({ HTMLAttributes }) {
    const attrs = mergeAttributes(HTMLAttributes, { class: styles.grid })
    return ['div', attrs, 0]
  },

  addCommands() {
    const setGrid =
      (columns: number) =>
      ({ tr, dispatch }: CommandProps) => {
        if (!dispatch) return
        const { doc } = tr

        const columnsContent: JSONContent[] = times(columns, () => ({
          type: 'column',
          content: [{ type: 'paragraph' }],
        }))
        const gridContent: JSONContent = {
          type: 'grid',
          content: columnsContent,
        }

        const gridNode = doc.type.schema.nodeFromJSON(gridContent)
        tr = tr.replaceSelectionWith(gridNode, false)
        return dispatch(tr)
      }

    return { setGrid }
  },
})

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    grid: {
      setGrid: (columns: number) => ReturnType
    }
  }
}
