import { Extension } from '@tiptap/core'
import { Attrs } from '@tiptap/pm/model'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { getChangesRange, isChangeOrigin } from '@wildbits/utils'
import { nanoid } from 'nanoid'

export type UniqueIdOptions = {
  types: string[]
}

export const UniqueId = Extension.create<UniqueIdOptions>({
  name: 'unique-id',

  addOptions() {
    return {
      types: [],
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          id: {
            default: null,
            parseHTML: (element: HTMLElement) => element.dataset.id,
            renderHTML: (attrs: Attrs) => (attrs.id ? { ['data-id']: attrs.id } : {}),
          },
        },
      },
    ]
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey(this.name),
        appendTransaction: (transactions, __, state) => {
          const { tr } = state
          const { types } = this.options

          const changedTransactions = transactions.filter(
            // Ignore transaction produce by yjs, otherwise it leads to empty
            // paragraph being created
            // https://github.com/ueberdosis/tiptap/issues/2400
            transaction => transaction.docChanged && !isChangeOrigin(transaction)
          )

          // Bail out if there is no transaction of interest left
          if (changedTransactions.length === 0) return

          // For each transaction, add the `id` attribute to every node that is
          // in between the affected range.
          changedTransactions.forEach(transaction => {
            const existingIds: string[] = []
            const range = getChangesRange(transaction)

            // Discard ranges that are not creating nodes. A node has at least a
            // size of 2.
            if (range.to - range.from < 2) return

            // In the post-document, get all nodes within the change range and
            // ensure they have the `id` attribute.
            tr.doc.nodesBetween(
              Math.max(range.from, 0),
              Math.min(range.to, tr.doc.content.size),
              (node, pos) => {
                // Bail out if the node shouldn't have an `id` attribute.
                if (!types.includes(node.type.name)) return

                // New nodes can be created with the same id of the previous
                // (e.g. paragraphs). We make sure to store existing ids and
                // store them. If a new has no ID, or if its ID is part of
                // existing id, we generate a new ID.
                if (node.attrs.id && !existingIds.includes(node.attrs.id)) {
                  existingIds.push(node.attrs.id)
                  return
                }

                tr.setNodeAttribute(pos, 'id', nanoid())
              }
            )
          })

          return tr.steps.length > 0 ? tr : undefined
        },
      }),
    ]
  },
})
