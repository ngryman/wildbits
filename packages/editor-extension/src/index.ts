export * from '@mindraft/editor-utils'

import { InputRule } from 'prosemirror-inputrules'

export interface ExtensionSpec {
  createRules?(): InputRule[]
}

export class Extension implements ExtensionSpec {
  constructor(private spec: ExtensionSpec) {}

  createRules(): InputRule[] {
    return this.spec.createRules ? this.spec.createRules() : []
  }
}
