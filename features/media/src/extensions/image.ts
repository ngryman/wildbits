import {
  callOrReturn,
  mergeAttributes,
  nodePasteRule,
  ExtendedRegExpMatchArray,
  InputRule,
  InputRuleFinder,
  Node,
} from '@tiptap/core'
import { NodeType } from '@tiptap/pm/model'
import { Plugin } from '@tiptap/pm/state'

export interface ImageOptions {
  HTMLAttributes: Record<string, unknown>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      /**
       * Add an image
       */
      setImage: (options: { src: string; alt?: string; title?: string }) => ReturnType
    }
  }
}

/**
 * Build an input rule that adds a node when the matched text is typed into it.
 *
 * NOTE: This is a patched version of `@tiptap/core` that places the cursor
 * after the node.
 *
 * @todo Remove this function if we manage to get a generic working version merged.
 */
function patchedNodeInputRule(config: {
  find: InputRuleFinder
  type: NodeType
  getAttributes?:
    | Record<string, unknown>
    | ((match: ExtendedRegExpMatchArray) => Record<string, unknown>)
    | false
    | null
}) {
  return new InputRule({
    find: config.find,
    handler: ({ state, range, match }) => {
      const attributes = callOrReturn(config.getAttributes, undefined, match) || {}
      const { tr } = state

      tr.insert(range.from - 1, config.type.create(attributes)).delete(
        tr.mapping.map(range.from),
        tr.mapping.map(range.to)
      )
    },
  })
}

/**
 * The paste regex for Markdown images with title support, and multiple quotation
 * marks (required in case the `Typography` extension is being included).
 */
export const inputRegex = /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["“'](\S+)["”'])?\))$/

export const Image = Node.create<ImageOptions>({
  name: 'image',
  atom: true,
  draggable: true,
  group: 'block',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
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
    return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },

  addCommands() {
    return {
      setImage:
        options =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
    }
  },

  addInputRules() {
    return [
      patchedNodeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: match => {
          const [, , alt, src, title] = match
          return { src, alt, title }
        },
      }),
    ]
  },

  addPasteRules() {
    return [
      nodePasteRule({
        find: /^(data:image\/[\w+]+;base64,[\w+/=]*)$/g,
        type: this.type,
        getAttributes: match => ({ src: match.input }),
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

  /**
   * @todo Migrate to SolidJS.
   */
  addNodeView() {
    return ({ node }) => {
      const figure = document.createElement('figure')

      const img = document.createElement('img')
      img.src = node.attrs.src
      img.alt = node.attrs.alt || ''
      if (node.attrs.title) {
        img.title = node.attrs.title
      }
      figure.appendChild(img)

      if (node.attrs.title || node.attrs.alt) {
        const figCaption = document.createElement('figcaption')
        figCaption.innerText = node.attrs.title || node.attrs.alt
        figure.appendChild(figCaption)
      }

      return { dom: figure }
    }
  },
})
