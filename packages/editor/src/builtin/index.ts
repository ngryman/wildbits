import { Plugin } from 'prosemirror-state'

import { keymaps } from './keymaps'
import { prose } from './prose'

export function builtin(): Plugin[] {
  return [prose(), keymaps()]
}
