import { Extension } from '@mindraft/editor-utils'
import {
  ellipsis,
  emDash,
  inputRules,
  smartQuotes,
} from 'prosemirror-inputrules'
import { Plugin } from 'prosemirror-state'

const builtinRules = [...smartQuotes, ellipsis, emDash]

export function createRulesPlugin(extensions: Extension[]): Plugin {
  const extRules = extensions.flatMap(ext => ext.createRules())
  const rules = [...builtinRules, ...extRules]
  return inputRules({ rules })
}
