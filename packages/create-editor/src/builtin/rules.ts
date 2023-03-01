import { Extension, Plugin } from '@mindraft/editor-utils'
import {
  ellipsis,
  InputRule,
  inputRules,
  smartQuotes,
} from 'prosemirror-inputrules'

// Note: We're not using the one from `prosemirror-inputrules` because it would
// conflict with a markdown separator (`---`). Here we add the constraint that
// it needs to be preceded by a word with a space.
const emDash = new InputRule(/(?:\S+\s+)(--)$/, '—')

const builtinRules = [...smartQuotes, ellipsis, emDash]

export function createRulesPlugin(extensions: Extension[]): Plugin {
  const extRules = extensions
    .filter(ext => ext.createRules)
    .flatMap(ext => ext.createRules!())
  const rules = [...builtinRules, ...extRules]
  return inputRules({ rules })
}
