import { nanoid } from 'nanoid'

Cypress.Commands.add('typeInEditor', (text: string) => {
  cy.get('.ProseMirror').type(text)
})

Cypress.Commands.add('visitNewDocument', () => {
  const documentId = nanoid()
  cy.visit(`/${documentId}#PDHGcJDpEhQGKvUoIAUbNQ`)
})

declare global {
  namespace Cypress {
    interface Chainable {
      typeInEditor(text: string): Chainable<Element>
      visitNewDocument(): Chainable<void>
    }
  }
}
