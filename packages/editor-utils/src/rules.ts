import { InputRule } from 'prosemirror-inputrules'
import { Attrs, Node } from 'prosemirror-model'
import { canJoin, findWrapping } from 'prosemirror-transform'

export type RuleProps = {
  regexp: RegExp
  type: string
  // TODO: define a generic `Hunk` type in `utils`
  attrs?: Attrs | ((matches: RegExpMatchArray) => Attrs | null)
}

export function createMarkRule(props: RuleProps) {
  return new InputRule(props.regexp, (state, match, start, end) => {
    const { tr, schema } = state
    const markType = schema.marks[props.type]
    const attrs =
      props.attrs instanceof Function ? props.attrs(match) : props.attrs

    const fullMatch = match[0]
    const captureGroup = match[1]

    const textStart = start + fullMatch.indexOf(captureGroup)
    if (textStart > start) {
      tr.delete(start, textStart)
    }

    const textEnd = textStart + captureGroup.length
    if (textEnd < end) {
      tr.delete(tr.mapping.map(textEnd), tr.mapping.map(end))
    }

    return tr
      .addMark(start, tr.mapping.map(end), markType.create(attrs))
      .removeStoredMark(schema.marks[props.type])
  })
}

export type NodeRuleProps = RuleProps & {
  join?: (match: RegExpMatchArray, node: Node) => boolean
}

/// Inspired from `wrappingInputRule` but modified to search for the node type dynamically.
export function createNodeRule(props: NodeRuleProps) {
  return new InputRule(props.regexp, (state, match, start, end) => {
    const { tr, schema } = state
    const nodeType = schema.nodes[props.type]
    const attrs =
      props.attrs instanceof Function ? props.attrs(match) : props.attrs

    tr.delete(start, end)

    const range = tr.doc.resolve(start).blockRange()!
    const wrapping = range && findWrapping(range, nodeType, attrs)

    if (!wrapping) return null
    tr.wrap(range, wrapping)

    const before = tr.doc.resolve(start - 1).nodeBefore
    if (
      before &&
      before.type === nodeType &&
      canJoin(tr.doc, start - 1) &&
      (!props.join || props.join(match, before))
    ) {
      tr.join(start - 1)
    }

    return tr
  })
}

/// Inspired from `textblockTypeInputRule` but modified to search for the node type dynamically.
export function createReplaceNodeRule(props: RuleProps) {
  return new InputRule(props.regexp, (state, match, start, end) => {
    const { tr, schema } = state

    const nodeType = schema.nodes[props.type]
    const attrs =
      props.attrs instanceof Function ? props.attrs(match) : props.attrs

    const $start = state.doc.resolve(start)
    const isTextBlock = nodeType.inlineContent
    const canReplace = $start
      .node(-1)
      .canReplaceWith($start.index(-1), $start.indexAfter(-1), nodeType)

    tr.delete(start, end)

    return canReplace
      ? isTextBlock
        ? tr.setBlockType(start, start, nodeType, attrs)
        : tr.replaceRangeWith(start, start, nodeType.create(attrs))
      : null
  })
}
