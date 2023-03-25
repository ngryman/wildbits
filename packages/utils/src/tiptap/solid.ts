import { DecorationWithType, NodeView, NodeViewRenderer, NodeViewRendererProps } from '@tiptap/core'
import { DOMSerializer } from '@tiptap/pm/model'
import { Component, createRoot } from 'solid-js'
import { createStore, SetStoreFunction } from 'solid-js/store'

export type NodeViewProps<Attributes> = {
  attrs: Attributes
  children: globalThis.Node | null
  decorations: DecorationWithType[]
  selected: boolean
  setAttributes: (attributes: Partial<Attributes>) => void
  deleteNode: VoidFunction
}

class SolidNodeView<Attributes> extends NodeView<Component<NodeViewProps<Attributes>>> {
  dispose!: VoidFunction
  domElement!: HTMLElement
  setComponentProps!: SetStoreFunction<NodeViewProps<Attributes>>

  constructor(component: Component<NodeViewProps<Attributes>>, props: NodeViewRendererProps) {
    super(component, props, {})

    const { toDOM } = this.node.type.spec
    const children = toDOM ? DOMSerializer.renderSpec(document, toDOM(this.node)).dom : null

    createRoot(dispose => {
      this.dispose = dispose

      const [componentProps, setComponentProps] = createStore<NodeViewProps<Attributes>>({
        attrs: this.node.attrs as Attributes,
        children,
        decorations: this.decorations,
        selected: false,
        setAttributes: attrs => this.updateAttributes(attrs),
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

  /**
   * Prevents PM to re-create the underlying DOM node when attributes are
   * updated.
   */
  update() {
    return true
  }

  updateAttributes(attrs: Partial<Attributes>) {
    super.updateAttributes(attrs as Record<string, unknown>)
    this.setComponentProps(props => ({ ...props, attrs: { ...props.attrs, ...attrs } }))
  }

  destroy() {
    this.dispose()
  }
}

export function createNodeView<A>(component: Component<NodeViewProps<A>>): NodeViewRenderer {
  return (props: NodeViewRendererProps) => new SolidNodeView(component, props)
}
