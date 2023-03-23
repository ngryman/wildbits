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

/**
 * Adapted version of Tiptap config for mark rules with the following
 * modifications:
 *
 * 1. Accepts a `capture` thunk to selectively specify which capture group
 *    should be considered as content. Tiptap uses the last one by default,
 *    which is not very handy in situations when the capture group position may
 *    vary.
 * 2. Accepts a `type` thunk to give the ability to dynamically create a mark.
 */
export type MarkRuleConfig<Attributes> = {
  find: RegExp
  type: MarkType | ((attrs?: Attributes) => Mark)
  capture?: string | ((match: ExtendedRegExpMatchArray) => string)
  attributes?: Attributes | ((match: ExtendedRegExpMatchArray) => Attributes) | false | null
}

/**
 * Adapted version of {@link @tiptap/core#markInputRule} `markInputRule` accepting a {@link MarkRuleConfig}.
 *
 * @see https://github.com/ueberdosis/tiptap/blob/903956711776c7c383a26833256a7c92ad38e01e/packages/core/src/inputRules/markInputRule.ts
 */
export function markInputRule<Attributes>(config: MarkRuleConfig<Attributes>) {
  return new InputRule({
    find: config.find,
    handler: ({ range, state, match }) => handleMarkRule(config, range, state, match),
  })
}

/**
 * Adapted version of {@link @tiptap/core#markPasteRule} accepting a {@link MarkRuleConfig}.
 */
export function markPasteRule<Attributes>(config: MarkRuleConfig<Attributes>) {
  return new PasteRule({
    find: config.find,
    handler: ({ range, state, match }) => handleMarkRule(config, range, state, match),
  })
}

/**
 * Adapted version of Tiptap `markInputRule` and `markPasteRule` with the
 * following modifications:
 *
 * 1. Accepts a `capture` thunk to selectively specify which capture group
 *    should be considered as content. Tiptap uses the last one by default,
 *    which is not very handy in situations when the capture group position may
 *    vary.
 * 2. Accepts a `type` thunk to give the ability to dynamically create a mark.
 *
 * @see
 * https://github.com/ueberdosis/tiptap/blob/52e1badd364c36e0a25bb66a864c592ddaa69bdb/packages/core/src/pasteRules/markPasteRule.ts
 */
function handleMarkRule<Attributes>(
  config: MarkRuleConfig<Attributes>,
  range: Range,
  state: EditorState,
  match: ExtendedRegExpMatchArray
) {
  const attrs = callOrReturn(config.attributes, undefined, match) || undefined
  const capture = callOrReturn(config.capture, undefined, match) || ''
  const mark = typeof config.type === 'function' ? config.type(attrs) : config.type.create(attrs)

  const { tr } = state
  const fullMatch = match[0]

  if (capture) {
    const startSpaces = fullMatch.search(/\S/)
    const textStart = range.from + fullMatch.indexOf(capture)
    const textEnd = textStart + capture.length
    const markStart = range.from + startSpaces

    if (textEnd < range.to) {
      tr.delete(textEnd, range.to)
    }

    if (textStart > range.from) {
      tr.delete(range.from + startSpaces, textStart)
    }

    tr.addMark(markStart, markStart + capture.length, mark).removeStoredMark(mark.type)
  }
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
