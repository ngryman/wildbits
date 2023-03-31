import { nanoid } from 'nanoid'

Cypress.Commands.add('editor', () => {
  // NOTE: wait(0) is necessary in Firefox, otherwise the first letter is missing.
  // https://github.com/cypress-io/cypress/issues/3817
  cy.get('.ProseMirror').wait(0)
})

Cypress.Commands.add('typeInEditor', (text: string) => {
  cy.editor().type(text)
})

Cypress.Commands.add('pasteInEditor', (format: string, data: string) => {
  cy.editor().paste(format, data)
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
  const id = nanoid()
  const key = nanoid()
  cy.visit(`/${id}#${key}`)
})

declare global {
  namespace Cypress {
    interface Chainable {
      editor(): Chainable<Element>
      paste(format: string, data: string): Chainable<Element>
      pasteInEditor(format: string, data: string): Chainable<Element>
      typeInEditor(text: string): Chainable<Element>
      visitNewDocument(): Chainable<void>
    }
  }
}
