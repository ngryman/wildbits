import { Extension, Plugin } from '@mindraft/editor-utils'

export function createObserverPlugin(extensions: Extension[]): Plugin {
  const transactionHandlers = extensions
    .filter(ext => ext.onTransaction)
    .map(ext => ext.onTransaction!)

  const documentChangeHandlers = extensions
    .filter(ext => ext.onDocumentChange)
    .map(ext => ext.onDocumentChange!)

  return new Plugin({
    state: {
      init: () => undefined,
      apply(tr, _value, _oldState, newState) {
        transactionHandlers.forEach(h => h(tr))
        if (tr.docChanged) {
          documentChangeHandlers.forEach(h => h(newState.doc))
        }
        return undefined
      },
    },
  })
}
