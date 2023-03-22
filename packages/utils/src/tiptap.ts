import {
  callOrReturn,
  DecorationWithType,
  ExtendedRegExpMatchArray,
  InputRule,
  InputRuleFinder,
  NodeView,
  NodeViewRenderer,
  NodeViewRendererProps,
} from '@tiptap/core'
import { Attrs, DOMSerializer, Node, NodeType } from '@tiptap/pm/model'
import { Component, Setter, createRoot } from 'solid-js'
import { createStore } from 'solid-js/store'
import { START_OR_SPACE } from './constants'

export type NodeViewProps<Attributes> = {
  attributes: Attributes
  children: globalThis.Node | null
  decorations: DecorationWithType[]
  selected: boolean
  setAttributes: (attributes: Partial<Attributes>) => void
  deleteNode: VoidFunction
}

class SolidNodeView<A> extends NodeView<Component<NodeViewProps<A>>> {
  dispose!: VoidFunction
  domElement!: HTMLElement
  setComponentProps!: Setter<Partial<NodeViewProps<A>>>

  constructor(component: Component<NodeViewProps<A>>, props: NodeViewRendererProps) {
    super(component, props, {})

    const { toDOM } = this.node.type.spec
    const children = toDOM ? DOMSerializer.renderSpec(document, toDOM(this.node)).dom : null

    createRoot(dispose => {
      this.dispose = dispose

      const [componentProps, setComponentProps] = createStore<NodeViewProps<A>>({
        attributes: this.node.attrs as A,
        children,
        decorations: this.decorations,
        selected: false,
        setAttributes: attributes => this.updateAttributes(attributes as Attrs),
        deleteNode: () => this.deleteNode(),
      })
      this.setComponentProps = setComponentProps

      // @ts-ignore
      const factory = this.component(componentProps)
      this.domElement = (typeof factory === 'function' ? factory() : factory) as HTMLElement
    })
  }

  get dom(): HTMLElement {
    return this.domElement
  }

  selectNode() {
    this.setComponentProps({ selected: true })
  }

  deselectNode() {
    this.setComponentProps({ selected: false })
  }

  destroy() {
    this.dispose()
  }
}

export function createNodeView<A>(component: Component<NodeViewProps<A>>): NodeViewRenderer {
  return (props: NodeViewRendererProps) => new SolidNodeView(component, props)
}

export function nodeInputRule<Attributes>(config: {
  find: InputRuleFinder
  type: NodeType | ((attrs?: Attributes) => Node)
  getAttributes?: Attributes | ((match: ExtendedRegExpMatchArray) => Attributes) | false | null
}) {
  return new InputRule({
    find: config.find,
    handler: ({ state, range, match }) => {
      const attrs = callOrReturn(config.getAttributes, undefined, match) || undefined
      const node =
        typeof config.type === 'function' ? config.type(attrs) : config.type.create(attrs)

      if (node) {
        const { selection, tr } = state
        const shouldReplace = selection.$anchor.start() === range.from
        const pos = shouldReplace ? range.from - 1 : range.from

        tr.insert(pos, node).delete(tr.mapping.map(range.from), tr.mapping.map(range.to))
      }
    },
  })
}

export function createMarkRegexp(parts: string[], flags?: string): RegExp {
  return new RegExp([START_OR_SPACE, '(', ...parts, ')'].join(''), flags)
}

export function createMarkInputRegexp(parts: string[]): RegExp {
  return createMarkRegexp([...parts, '$'])
}

export function createMarkPasteRegexp(parts: string[]): RegExp {
  return createMarkRegexp(parts, 'g')
}

export function createMarkInputAndPasteRegexps(parts: string[]): [RegExp, RegExp] {
  return [createMarkInputRegexp(parts), createMarkPasteRegexp(parts)]
}
