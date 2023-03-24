import { mergeAttributes, Node } from '@tiptap/core'
import { Plugin } from '@tiptap/pm/state'
import {
  createNodeView,
  nodeInputRule,
  createInlineInputAndPasteRegexps,
  createInlinePasteRegexp,
  OPENING_QUOTES,
  CLOSING_QUOTES,
  nodePasteRule,
} from '@wildbits/utils'

import * as commands from './commands'
import { ImageView } from './components'

import styles from './components/image.module.css'

export type ImageOptions = {
  HTMLAttributes: Record<string, unknown>
}

export type ImageAlign = 'left' | 'center' | 'right'

export type ImageAttributes = {
  align?: ImageAlign
  alt?: string
  src: string
  title?: string
}

/**
 * Regexps for Markdown images with title support, and multiple quotation marks
 * (required in case the `Typography` extension is being included).
 */
const [inputRegex, pasteRegex] = createInlineInputAndPasteRegexps([
  // alt
  `!\\[(\\S*)\\]`,
  // url & title
  `\\((\\S+)(?:\\s+[${OPENING_QUOTES}]([^${CLOSING_QUOTES}]+)[${CLOSING_QUOTES}])?\\)`,
])

const base64Regex = createInlinePasteRegexp([
  // prefix
  `data:`,
  // mime type
  `image\\/[\\w+]+`,
  // base64 prefix
  `;base64,`,
  // data
  `[\\w+/=]+`,
])

export const Image = Node.create<ImageOptions>({
  name: 'image',
  atom: true,
  draggable: true,
  selectable: true,
  group: 'block',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      align: {
        default: 'center',
        rendered: false,
      },
      alt: {
        default: null,
      },
      src: {
        default: null,
      },
      title: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [{ tag: 'img[src]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'img',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: styles.image,
      }),
    ]
  },

  addCommands() {
    return commands
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: inputRegex,
        type: this.type,
        attributes: match => {
          const [, , alt, src, title] = match
          return { src, alt, title }
        },
      }),
    ]
  },

  addPasteRules() {
    return [
      nodePasteRule({
        find: pasteRegex,
        type: this.type,
        attributes: match => {
          const [, , alt, src, title] = match
          return { src, alt, title }
        },
      }),
      nodePasteRule({
        find: base64Regex,
        type: this.type,
        attributes: match => ({ src: match.input }),
      }),
    ]
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            drop(view, event) {
              const hasFiles = event.dataTransfer?.files?.length ?? false
              if (!hasFiles) return

              const images = Array.from(event.dataTransfer!.files).filter(file =>
                file.type.startsWith('image')
              )
              if (images.length === 0) return

              event.preventDefault()

              const { schema } = view.state
              const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY })!

              for (const image of images) {
                const reader = new FileReader()

                reader.onload = e => {
                  const node = schema.nodes.image.create({
                    src: e.target!.result,
                  })
                  const transaction = view.state.tr.insert(coordinates.pos, node)
                  view.dispatch(transaction)
                }
                reader.readAsDataURL(image)
              }
            },
          },
        },
      }),
    ]
  },

  addNodeView() {
    return createNodeView(ImageView)
  },
})
