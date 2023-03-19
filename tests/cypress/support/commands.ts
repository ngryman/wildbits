import { nanoid } from 'nanoid'

Cypress.Commands.add('typeInEditor', (text: string) => {
  // NOTE: wait(0) is necessary in Firefox, otherwise the first letter is missing.
  // https://github.com/cypress-io/cypress/issues/3817
  cy.get('.ProseMirror').wait(0).type(text)
})

Cypress.Commands.add('pasteInEditor', (format: string, data: string) => {
  cy.get('.ProseMirror').wait(0).paste(format, data)
})

Cypress.Commands.add('paste', { prevSubject: true }, (target, type: string, data: string) => {
  const clipboardData = new DataTransfer()

  if (type.startsWith('image')) {
    const file = new File([data], 'image', { type })
    clipboardData.items.add(file)
  } else {
    clipboardData.setData(type, data)
  }

  const pasteEvent = new ClipboardEvent('paste', {
    bubbles: true,
    cancelable: true,
    clipboardData,
  })

  target[0].dispatchEvent(pasteEvent)
  return target
})

Cypress.Commands.add('visitNewDocument', () => {
  const documentId = nanoid()
  cy.visit(`/${documentId}#PDHGcJDpEhQGKvUoIAUbNQ`)
})

declare global {
  namespace Cypress {
    interface Chainable {
      paste(format: string, data: string): Chainable<Element>
      pasteInEditor(format: string, data: string): Chainable<Element>
      typeInEditor(text: string): Chainable<Element>
      visitNewDocument(): Chainable<void>
    }
  }
}
