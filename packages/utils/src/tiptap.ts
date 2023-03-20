import { NodeView, NodeViewRenderer, NodeViewRendererProps } from '@tiptap/core'
import { DOMSerializer } from 'prosemirror-model'
import { Component } from 'solid-js'

class SolidNodeView<P> extends NodeView<Component<P>> {
  domElement!: HTMLElement

  constructor(component: Component<P>, props: NodeViewRendererProps) {
    super(component, props, {})

    const { toDOM } = this.node.type.spec
    const children = toDOM ? DOMSerializer.renderSpec(document, toDOM(this.node)).dom : null
    // @ts-ignore
    const factory = this.component({ children, ...props.node.attrs })
    this.domElement = (typeof factory === 'function' ? factory() : factory) as HTMLElement
  }

  get dom(): HTMLElement {
    return this.domElement
  }
}

export function createNodeView<P>(component: Component<P>): NodeViewRenderer {
  return (props: NodeViewRendererProps) => new SolidNodeView(component, props)
}
