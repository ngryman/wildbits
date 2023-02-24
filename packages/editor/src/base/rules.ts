import { ellipsis, emDash, smartQuotes } from 'prosemirror-inputrules'

export function baseRules() {
  return [...smartQuotes, ellipsis, emDash]
}
