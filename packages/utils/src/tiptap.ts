import {
  callOrReturn,
  DecorationWithType,
  ExtendedRegExpMatchArray,
  InputRule,
  InputRuleFinder,
  NodeView,
  NodeViewRenderer,
  NodeViewRendererProps,
  PasteRule,
  Range,
} from '@tiptap/core'
import { Attrs, DOMSerializer, Mark, MarkType, Node, NodeType } from '@tiptap/pm/model'
import { EditorState } from '@tiptap/pm/state'
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

export type NodeRuleConfig<Attributes> = {
  find: InputRuleFinder
  type: NodeType | ((attrs?: Attributes) => Node)
  attributes?: Attributes | ((match: ExtendedRegExpMatchArray) => Attributes) | false | null
}

export function nodeInputRule<Attributes>(config: NodeRuleConfig<Attributes>) {
  return new InputRule({
    find: config.find,
    handler: ({ match, range, state }) => {
      const { selection, tr } = state
      const attrs = callOrReturn(config.attributes, undefined, match) || undefined
      const node =
        typeof config.type === 'function' ? config.type(attrs) : config.type.create(attrs)

      const shouldReplace = selection.$anchor.start() === range.from
      const pos = shouldReplace ? range.from - 1 : range.from

      tr.insert(pos, node).delete(tr.mapping.map(range.from), tr.mapping.map(range.to))
    },
  })
}

export type MarkRuleConfig<Attributes> = {
  find: RegExp
  type: MarkType | ((attrs?: Attributes) => Mark)
  capture?: string | ((match: ExtendedRegExpMatchArray) => string)
  attributes?: Attributes | ((match: ExtendedRegExpMatchArray) => Attributes) | false | null
}

export function markInputRule<Attributes>(config: MarkRuleConfig<Attributes>) {
  return new InputRule({
    find: config.find,
    handler: ({ range, state, match }) => handleMarkRule(config, range, state, match),
  })
}

export function markPasteRule<Attributes>(config: MarkRuleConfig<Attributes>) {
  return new PasteRule({
    find: config.find,
    handler: ({ range, state, match }) => handleMarkRule(config, range, state, match),
  })
}

function handleMarkRule<Attributes>(
  config: MarkRuleConfig<Attributes>,
  range: Range,
  state: EditorState,
  match: ExtendedRegExpMatchArray
) {
  const { tr } = state
  const attrs = callOrReturn(config.attributes, undefined, match) || undefined
  const capture = callOrReturn(config.capture, undefined, match) || ''
  const mark = typeof config.type === 'function' ? config.type(attrs) : config.type.create(attrs)

  const fullMatch = match[0]
  const captureGroup = capture

  const textStart = range.from + fullMatch.indexOf(captureGroup)
  if (textStart > range.from) {
    tr.delete(range.from, textStart)
  }

  const textEnd = textStart + captureGroup.length
  if (textEnd < range.to) {
    tr.delete(tr.mapping.map(textEnd), tr.mapping.map(range.to))
  }

  tr.addMark(range.from, tr.mapping.map(range.to), mark).removeStoredMark(mark)
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
