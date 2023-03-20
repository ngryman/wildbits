import { DecorationWithType, NodeView, NodeViewRenderer, NodeViewRendererProps } from '@tiptap/core'
import { Attrs, DOMSerializer } from 'prosemirror-model'
import { Component, Setter, createRoot } from 'solid-js'
import { createStore } from 'solid-js/store'

export type NodeViewProps<Attributes> = {
  attributes: Attributes
  children: Node | null
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
