import {
  DecorationWithType,
  Editor,
  NodeView,
  NodeViewRenderer,
  NodeViewRendererProps,
} from '@tiptap/core'
import { DOMSerializer } from '@tiptap/pm/model'
import { EditorState } from '@tiptap/pm/state'
import { EditorView } from '@tiptap/pm/view'
import { Component, createRoot } from 'solid-js'
import { createStore, SetStoreFunction } from 'solid-js/store'
import { Portal } from 'solid-js/web'

export type NodeViewProps<Attributes> = {
  attrs: Attributes
  children: globalThis.Node | null
  decorations: DecorationWithType[]
  selected: boolean
  setAttributes: (attrs: Partial<Attributes>) => void
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
    // eslint-disable-next-line solid/reactivity
    this.setComponentProps(props => ({ ...props, attrs: { ...props.attrs, ...attrs } }))
  }

  destroy() {
    this.dispose()
  }
}

export function createNodeView<A>(component: Component<NodeViewProps<A>>): NodeViewRenderer {
  return (props: NodeViewRendererProps) => new SolidNodeView(component, props)
}

export type PluginViewProps<Options> = {
  editor: Editor
  options: Options
  state: EditorState
  setState: (state: Partial<EditorState>) => void
}

class SolidPluginView<Options> {
  dispose!: VoidFunction
  // domElement!: HTMLElement
  setComponentProps!: SetStoreFunction<PluginViewProps<Options>>

  constructor(component: Component<PluginViewProps<Options>>, options: Options, editor: Editor) {
    createRoot(dispose => {
      this.dispose = dispose

      const [componentProps, setComponentProps] = createStore<PluginViewProps<Options>>({
        editor: editor,
        options,
        state: editor.state,
        setState: state => setComponentProps(prevState => ({ ...prevState, ...state })),
      })
      this.setComponentProps = setComponentProps

      Portal({ children: [component(componentProps)] })

      // const factory = component(componentProps)
      // const domElement = (typeof factory === 'function' ? factory() : factory) as HTMLElement
      // editorView.dom.parentElement!.appendChild(domElement)
    })
  }

  update(view: EditorView) {
    this.setComponentProps({ state: view.state })
  }

  destroy() {
    this.dispose()
  }
}

export function createPluginView<Options>(
  component: Component<PluginViewProps<Options>>,
  options: Options,
  editor: Editor
): SolidPluginView<Options> {
  return new SolidPluginView(component, options, editor)
}
