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
        'matchHTML',
        `<figure><img alt="" src="${imageUrl}"></figure><p>🥖</p>`
      )
    })

    it('supports the ![alt](url) syntax', () => {
      cy.typeInEditor(`![Roar](${imageUrl})🥖`).should(
        'matchHTML',
        `<figure><img alt="Roar" src="${imageUrl}"><figcaption>Roar</figcaption></figure><p>🥖</p>`
      )
    })

    it('supports the ![alt](url "title") syntax', () => {
      cy.typeInEditor(`![Tiger](${imageUrl} "Roar")🥖`).should(
        'matchHTML',
        `<figure><img alt="Tiger" src="${imageUrl}" title="Roar"><figcaption>Roar</figcaption></figure><p>🥖</p>`
      )
    })

    it('replaces an empty block', () => {
      cy.typeInEditor(`![](${imageUrl})🥖`).should(
        'matchHTML',
        `<figure><img src="${imageUrl}"></figure><p>🥖</p>`
      )
    })

    it('creates a new block after content', () => {
      cy.typeInEditor(`B ![](${imageUrl})🥖`).should(
        'matchHTML',
        `<p>B</p><figure><img src="${imageUrl}"></figure><p>🥖</p>`
      )
    })

    it('creates a new block before content', () => {
      cy.typeInEditor('A')
        .wait(200)
        .typeInEditor(`{leftarrow}![](${imageUrl})🥖`)
        .should('matchHTML', `<figure><img src="${imageUrl}"></figure><p>🥖A</p>`)
    })

    it('creates a new block between content', () => {
      cy.typeInEditor(`B\nA{leftarrow}![](${imageUrl})🥖`).should(
        'matchHTML',
        `<p>B</p><figure><img src="${imageUrl}"></figure><p>🥖A</p>`
      )
    })

    it('creates a new block below content', () => {
      cy.typeInEditor(`A\n![](${imageUrl})🥖`).should(
        'matchHTML',
        `<p>A</p><figure><img src="${imageUrl}"></figure><p>🥖</p>`
      )
    })

    it('creates a new block above content', () => {
      cy.typeInEditor('\nB')
        .wait(200)
        .typeInEditor(`{uparrow}![](${imageUrl})🥖`)
        .should('matchHTML', `<figure><img src="${imageUrl}"></figure><p>🥖</p><p>B</p>`)
    })

    it('creates a new block between content', () => {
      cy.typeInEditor(`A\nB{uparrow} ![](${imageUrl})🥖`).should(
        'matchHTML',
        `<p>A</p><figure><img src="${imageUrl}"></figure><p>🥖</p><p>B</p>`
      )
    })
  })

  describe('clipboard', () => {
    it('supports pasting image html tag', () => {
      cy.pasteInEditor('text/html', imageTag).should(
        'matchHTML',
        `<figure><img src="${imageBase64}"></figure>`
      )
    })

    it('supports pasting base64 image data', () => {
      cy.pasteInEditor('text/plain', imageBase64).should(
        'matchHTML',
        `<figure><img src="${imageBase64}"></figure>`
      )
    })

    // TODO: test the cursor, it should place the cursor after on paste
  })

  // TODO: selection doesn't work
  // https://github.com/decaporg/decap-cms/blob/a4b7481a99f58b9abe85ab5712d27593cde20096/cypress/support/commands.js
  describe.skip('shortcuts', () => {
    it('mod+k sets the selected text to link')
  })
})
