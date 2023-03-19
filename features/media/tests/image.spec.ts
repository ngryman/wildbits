const imageUrl = 'https://images.unsplash.com/photo-1615963244664-5b845b2025ee?h=100'
const imageBase64 =
  'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='
const imageTag = `<img src="${imageBase64}">`

describe('image node', () => {
  beforeEach(() => {
    cy.visitNewDocument()
  })

  describe('markdown', () => {
    it('supports the ![](url) syntax', () => {
      cy.typeInEditor(`![](${imageUrl})🥖`).should(
        'have.html',
        `<figure contenteditable="false" draggable="true"><img src="${imageUrl}" alt=""></figure><p>🥖</p>`
      )
    })

    it('supports the ![alt](url) syntax', () => {
      cy.typeInEditor(`![Roar](${imageUrl})🥖`).should(
        'have.html',
        `<figure contenteditable="false" draggable="true"><img src="${imageUrl}" alt="Roar"><figcaption>Roar</figcaption></figure><p>🥖</p>`
      )
    })

    it('supports the ![alt](url "title") syntax', () => {
      cy.typeInEditor(`![Tiger](${imageUrl} "Roar")🥖`).should(
        'have.html',
        `<figure contenteditable="false" draggable="true"><img src="${imageUrl}" alt="Tiger" title="Roar"><figcaption>Roar</figcaption></figure><p>🥖</p>`
      )
    })

    it('preserves nodes around', () => {
      cy.typeInEditor(`above\nbelow{uparrow}\n![](${imageUrl})🥖`).should(
        'have.html',
        `<p>above</p><figure contenteditable="false" draggable="true"><img src="${imageUrl}" alt=""></figure><p>🥖</p><p>below</p>`
      )
    })
  })

  // TODO: it should place the cursor after on paste
  describe('clipboard', () => {
    it('supports pasting image html tag', () => {
      cy.pasteInEditor('text/html', imageTag)
        .type('\n🥖')
        .should(
          'have.html',
          `<figure contenteditable="false" draggable="true" class=""><img src="${imageBase64}" alt=""></figure><p>🥖</p>`
        )
    })

    it('supports pasting base64 image data', () => {
      cy.pasteInEditor('text/plain', imageBase64)
        .type('\n🥖')
        .should(
          'have.html',
          `<figure contenteditable="false" draggable="true" class=""><img src="${imageBase64}" alt=""></figure><p>🥖</p>`
        )
    })
  })

  // TODO: selection doesn't work
  // https://github.com/decaporg/decap-cms/blob/a4b7481a99f58b9abe85ab5712d27593cde20096/cypress/support/commands.js
  describe.skip('shortcuts', () => {
    it('mod+k sets the selected text to link')
  })
})
