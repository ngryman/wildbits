import {
  ellipsis,
  emDash,
  inputRules,
  smartQuotes,
} from 'prosemirror-inputrules'

export function prose() {
  const rules = [...smartQuotes, ellipsis, emDash]
  return inputRules({ rules })
}
