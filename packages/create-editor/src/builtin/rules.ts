import { Extension, Plugin } from '@mindraft/editor-utils'
import {
  ellipsis,
  emDash,
  inputRules,
  smartQuotes,
} from 'prosemirror-inputrules'

const builtinRules = [...smartQuotes, ellipsis, emDash]

export function createRulesPlugin(extensions: Extension[]): Plugin {
  const extRules = extensions
    .filter(ext => ext.createRules)
    .flatMap(ext => ext.createRules!())
  const rules = [...builtinRules, ...extRules]
  return inputRules({ rules })
}
