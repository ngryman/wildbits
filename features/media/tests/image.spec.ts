const imageUrl = 'https://images.unsplash.com/photo-1615963244664-5b845b2025ee?h=100'
// const base64Image = 'data:image/gif;base64,R0lGODlhAQABAAAAACw='
const imageData =
  'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='
const clipboardImage = `<img src="${imageData}">`

describe('image node', () => {
  beforeEach(() => {
    cy.visitNewDocument()
  })

  describe('markdown', () => {
    it('supports the ![](url) syntax', () => {
      cy.typeInEditor(`![](${imageUrl})🥖`).should(
        'have.html',
        `<img src="${imageUrl}" alt="" contenteditable="false" draggable="true"><p>🥖</p>`
      )
    })

    it('supports the ![title](url) syntax', () => {
      cy.typeInEditor(`![Roar](${imageUrl})🥖`).should(
        'have.html',
        `<img src="${imageUrl}" alt="Roar" contenteditable="false" draggable="true"><p>🥖</p>`
      )
    })

    it.only('preserves nodes around', () => {
      cy.typeInEditor(`above\nbelow{uparrow}\n![](${imageUrl})🥖`).should(
        'have.html',
        `<p>above</p><img src="${imageUrl}" alt="" contenteditable="false" draggable="true"><p>🥖</p><p>below</p>`
      )
    })
  })

  describe('clipboard', () => {
    // TODO: it should place the cursor after on paste
    it('supports pasting as base64 image', () => {
      cy.pasteInEditor('text/html', clipboardImage)
        .type('\n🥖')
        .should(
          'have.html',
          `<img src="${imageData}" contenteditable="false" draggable="true" class=""><p>🥖</p>`
        )
    })
  })

  // TODO: selection doesn't work
  // https://github.com/decaporg/decap-cms/blob/a4b7481a99f58b9abe85ab5712d27593cde20096/cypress/support/commands.js
  describe.skip('shortcuts', () => {
    it('mod+k sets the selected text to link')
  })
})
