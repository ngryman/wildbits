import {
  callOrReturn,
  ExtendedRegExpMatchArray,
  mergeAttributes,
  Node,
  PasteRule,
  PasteRuleFinder,
  textblockTypeInputRule,
} from '@tiptap/core'
import { NodeType } from '@tiptap/pm/model'
import { createInlineInputAndPasteRegexps, foldTimes, times } from '@wildbits/utils'

export type Level = 1 | 2 | 3 | 4

export type HeadingOptions = {
  HTMLAttributes: Record<string, unknown>
}

const MAX_LEVEL = 4

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    heading: {
      /**
       * Set a heading node
       */
      setHeading: (attrs: { level: Level }) => ReturnType
      /**
       * Toggle a heading node
       */
      toggleHeading: (attrs: { level: Level }) => ReturnType
    }
  }
}

const [inputRegex, pasteRegex] = createInlineInputAndPasteRegexps([`(#{1,${MAX_LEVEL}})\\s`])

export const Heading = Node.create<HeadingOptions>({
  name: 'heading',
  content: 'inline*',
  group: 'block',
  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      level: {
        default: 1,
        rendered: false,
      },
    }
  },

  parseHTML() {
    return times(MAX_LEVEL, level => ({ tag: `h${level}`, attrs: { level } }))
  },

  renderHTML({ node, HTMLAttributes }) {
    const level = node.attrs.level
    return [`h${level}`, mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addCommands() {
    return {
      setHeading:
        attrs =>
        ({ commands }) => {
          if (attrs.level > MAX_LEVEL) return false
          return commands.setNode(this.name, attrs)
        },
      toggleHeading:
        attrs =>
        ({ commands }) => {
          if (attrs.level > MAX_LEVEL) return false
          return commands.toggleNode(this.name, 'paragraph', attrs)
        },
    }
  },

  addKeyboardShortcuts() {
    return foldTimes(
      MAX_LEVEL,
      (shortcuts, level) => ({
        ...shortcuts,
        [`Mod-Alt-${level}`]: () => this.editor.commands.toggleHeading({ level: level as Level }),
      }),
      {}
    )
  },

  addInputRules() {
    return [
      textblockTypeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: match => {
          const [, , sharps] = match
          return { level: sharps.length }
        },
      }),
    ]
  },

  addPasteRules() {
    return [
      textblockTypePasteRule({
        find: pasteRegex,
        type: this.type,
        getAttributes: match => {
          const [, , sharps] = match
          return { level: sharps.length }
        },
      }),
    ]
  },
})

export function textblockTypePasteRule(config: {
  find: PasteRuleFinder
  type: NodeType
  getAttributes?:
    | Record<string, unknown>
    | ((match: ExtendedRegExpMatchArray) => Record<string, unknown>)
    | false
    | null
}) {
  return new PasteRule({
    find: config.find,
    handler: ({ state, range, match }) => {
      const $start = state.doc.resolve(range.from)
      const attributes = callOrReturn(config.getAttributes, undefined, match) || {}

      if (!$start.node(-1).canReplaceWith($start.index(-1), $start.indexAfter(-1), config.type)) {
        return null
      }

      state.tr
        .delete(range.from, range.to)
        .setBlockType(range.from, range.from, config.type, attributes)
    },
  })
}
