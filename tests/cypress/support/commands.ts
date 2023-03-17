import { nanoid } from 'nanoid'

Cypress.Commands.add('typeInEditor', (text: string) => {
  // NOTE: wait(0) is necessary in Firefox, otherwise the first letter is missing.
  // https://github.com/cypress-io/cypress/issues/3817
  cy.get('.ProseMirror').focus().wait(0).type(text)
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
