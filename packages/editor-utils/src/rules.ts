import { InputRule } from 'prosemirror-inputrules'

export type MarkRuleProps = {
  regexp: RegExp
  type: string
}

export function createMarkRule(props: MarkRuleProps) {
  return new InputRule(props.regexp, (state, match, start, end) => {
    const { tr, schema } = state

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

    const markType = schema.marks[props.type]
    return tr
      .addMark(start, tr.mapping.map(end), markType.create())
      .removeStoredMark(schema.marks[props.type])
  })
}
