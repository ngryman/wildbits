import { InputRule } from 'prosemirror-inputrules'
import { Node } from 'prosemirror-model'
import { Transaction } from 'prosemirror-state'

export type Extension = {
  createRules?(): InputRule[]
  onDocumentChange?(doc: Node): void | Promise<void>
  onTransaction?(tr: Transaction): void | Promise<void>
}
