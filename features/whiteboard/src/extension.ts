import { CommandProps, JSONContent, mergeAttributes, Node } from '@tiptap/core'
import { createNodeView, getChangesRange, isChangeOrigin, nodeInputRule } from '@wildbits/utils'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Array as YArray, Doc as YDoc } from 'yjs'

import { Whiteboard as WhiteboardView } from './components'
import { Point } from './types'

import styles from './components/whiteboard.module.css'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    whiteboard: {
      setWhiteboard: () => ReturnType
    }
  }
}

export const Whiteboard = Node.create({
  name: 'whiteboard',
  group: 'block',
  atom: true,
  defining: true,
  isolating: true,
  selectable: false,

  parseHTML() {
    return [
      {
        tag: 'svg[data-whiteboard]',
        namespace: 'http://www.w3.org/2000/svg',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'http://www.w3.org/2000/svg svg',
      mergeAttributes(HTMLAttributes, {
        class: styles.root,
        ['data-whiteboard']: true,
      }),
    ]
  },

  addCommands() {
    const setWhiteboard =
      () =>
      ({ tr, dispatch }: CommandProps) => {
        if (!dispatch) return
        const { doc } = tr

        const whiteboardContent: JSONContent = { type: 'whiteboard' }
        const whiteboardNode = doc.type.schema.nodeFromJSON(whiteboardContent)
        tr = tr.replaceSelectionWith(whiteboardNode, false)
        return dispatch(tr)
      }

    return { setWhiteboard }
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: /\/w\s/,
        type: this.type,
      }),
    ]
  },

  addNodeView() {
    return createNodeView(WhiteboardView)
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey(this.name),
        appendTransaction: (transactions, prevState, state) => {
          const { tr } = state

          const changedTransactions = transactions.filter(
            // Ignore transaction produce by yjs as the doc is synchronized automatically.
            transaction => transaction.docChanged && !isChangeOrigin(transaction)
          )

          // Bail out if there is no transaction of interest left
          if (changedTransactions.length === 0) return

          const doc: YDoc = this.editor.storage.collaboration.provider.doc
          const boards = doc.getMap<YArray<YArray<Point>>>('boards')

          // For each transaction, check for addition or removal of a whiteboard
          // node.
          changedTransactions.forEach(transaction => {
            const range = getChangesRange(transaction)

            // If it's an addition
            if (range.to - range.from >= 2) {
              // In the post-document, get all the whiteboard nodes within the
              // change range and create the appropriate board in the YDoc
              tr.doc.nodesBetween(
                Math.max(range.from, 0),
                Math.min(range.to, tr.doc.content.size),
                node => {
                  // Bail out if the node is not a whiteboard
                  if (node.type.name !== this.name) return

                  if (!boards.has(node.attrs.id)) {
                    boards.set(node.attrs.id, new YArray())
                  }
                }
              )
            }
            // If it's a deletion
            else if (range.prevTo > range.to) {
              // In the pre-document, get all the whiteboard nodes within the
              // change range and delete the associated board in the YDoc
              prevState.doc.nodesBetween(
                Math.max(range.prevFrom, 0),
                Math.min(range.prevTo, prevState.doc.content.size),
                node => {
                  // Bail out if the node is not a whiteboard
                  if (node.type.name !== this.name) return

                  if (boards.has(node.attrs.id)) {
                    boards.delete(node.attrs.id)
                  }
                }
              )
            }

            // if (range.to - range.from < 2) return

            // // In the post-document, get all nodes within the change range and
            // // ensure they have the `id` attribute.
            // tr.doc.nodesBetween(
            //   Math.max(range.from, 0),
            //   Math.min(range.to, tr.doc.content.size),
            //   (node, pos) => {
            //     // Bail out if the node shouldn't have an `id` attribute.
            //     if (!types.includes(node.type.name)) return

            //     // New nodes can be created with the same id of the previous
            //     // (e.g. paragraphs). We make sure to store existing ids and
            //     // store them. If a new has no ID, or if its ID is part of
            //     // existing id, we generate a new ID.
            //     if (node.attrs.id && !existingIds.includes(node.attrs.id)) {
            //       existingIds.push(node.attrs.id)
            //       return
            //     }

            //     tr.setNodeAttribute(pos, 'id', nanoid())
            //   }
            // )
          })

          return tr.steps.length > 0 ? tr : undefined
        },
      }),
    ]
  },
})
