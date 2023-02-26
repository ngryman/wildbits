import { Document, Extension, Node } from '@mindraft/editor-utils'

import { Persistence } from './types'

export type { Persistence }

export * from './context'

export function persistenceExtension(
  saveDocument: Persistence['saveDocument']
): Extension {
  return {
    async onDocumentChange(doc: Node) {
      await saveDocument('main', doc as unknown as Document)
    },
  }
}
