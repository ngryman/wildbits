import {
  callOrReturn,
  Editor,
  ExtendedRegExpMatchArray,
  PasteRule,
  PasteRuleFinder,
} from '@tiptap/core'
import { BulletList as BulletListExtension } from '@tiptap/extension-bullet-list'
import { Node, NodeType } from '@tiptap/pm/model'
import { canJoin, findWrapping } from '@tiptap/pm/transform'

const pasteRegex = /^(\s*)([-+*])\s/g

export const BulletList = BulletListExtension.extend({
  addPasteRules() {
    return [
      wrappingPasteRule({
        find: pasteRegex,
        type: this.type,
      }),
    ]
  },
})

export type { BulletListOptions } from '@tiptap/extension-bullet-list'

function wrappingPasteRule(config: {
  find: PasteRuleFinder
  type: NodeType
  keepMarks?: boolean
  keepAttributes?: boolean
  editor?: Editor
  getAttributes?:
    | Record<string, unknown>
    | ((match: ExtendedRegExpMatchArray) => Record<string, unknown>)
    | false
    | null
  joinPredicate?: (match: ExtendedRegExpMatchArray, node: Node) => boolean
}) {
  return new PasteRule({
    find: config.find,
    handler: ({ state, range, match, chain }) => {
      const attributes = callOrReturn(config.getAttributes, undefined, match) || {}
      const tr = state.tr.delete(range.from, range.to)
      const $start = tr.doc.resolve(range.from)
      const blockRange = $start.blockRange()
      const wrapping = blockRange && findWrapping(blockRange, config.type, attributes)

      if (!wrapping) {
        return null
      }

      tr.wrap(blockRange, wrapping)

      if (config.keepMarks && config.editor) {
        const { selection, storedMarks } = state
        const { splittableMarks } = config.editor.extensionManager
        const marks = storedMarks || (selection.$to.parentOffset && selection.$from.marks())

        if (marks) {
          const filteredMarks = marks.filter(mark => splittableMarks.includes(mark.type.name))

          tr.ensureMarks(filteredMarks)
        }
      }
      if (config.keepAttributes) {
        // If the nodeType is `bulletList` or `orderedList` set the `nodeType` as `listItem`
        const nodeType =
          config.type.name === 'bulletList' || config.type.name === 'orderedList'
            ? 'listItem'
            : 'taskList'

        chain().updateAttributes(nodeType, attributes).run()
      }

      const before = tr.doc.resolve(range.from - 1).nodeBefore

      if (
        before &&
        before.type === config.type &&
        canJoin(tr.doc, range.from - 1) &&
        (!config.joinPredicate || config.joinPredicate(match, before))
      ) {
        tr.join(range.from - 1)
      }
    },
  })
}
