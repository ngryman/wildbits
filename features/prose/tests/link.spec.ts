const url = 'https://wildbits.app'

describe('link mark', () => {
  beforeEach(() => {
    cy.visitNewDocument()
  })

  describe('markdown', () => {
    it('supports the [](url) syntax', () => {
      cy.typeInEditor('[](https://wildbits.app)🥖').should(
        'matchHTML',
        '<p><a href="https://wildbits.app">https://wildbits.app</a>🥖</p>'
      )
    })

    it('supports the [text](url) syntax', () => {
      cy.typeInEditor('[Wildbits](https://wildbits.app)🥖').should(
        'matchHTML',
        '<p><a href="https://wildbits.app">Wildbits</a>🥖</p>'
      )
    })

    it('supports the [text](url "title") syntax', () => {
      cy.typeInEditor('[Wildbits](https://wildbits.app "Wildbits App")🥖').should(
        'matchHTML',
        '<p><a href="https://wildbits.app" title="Wildbits App">Wildbits</a>🥖</p>'
      )
    })

    it('supports the vanilla url syntax', () => {
      cy.typeInEditor('https://wildbits.app 🥖').should(
        'matchHTML',
        '<p><a href="https://wildbits.app">https://wildbits.app</a> 🥖</p>'
      )
    })

    it('creates a new mark after content', () => {
      cy.typeInEditor(`B [](${url})🥖`).should('matchHTML', `<p>B<a href="${url}">${url}</a>🥖</p>`)
    })

    it('creates a new mark before content', () => {
      cy.typeInEditor('A')
        .wait(200)
        .typeInEditor(`{leftarrow}[](${url})🥖`)
        .should('matchHTML', `<a href="${url}">${url}</a>🥖A</p>`)
    })

    it('creates a new mark between content', () => {
      cy.typeInEditor(`BA{leftarrow} [](${url})🥖`).should(
        'matchHTML',
        `<p>B<a href="${url}">${url}</a>🥖A</p>`
      )
    })

    it('creates a new mark below content', () => {
      cy.typeInEditor(`A\n[](${url})🥖`).should(
        'matchHTML',
        `<p>A</p><p><a href="${url}">${url}</a>🥖</p>`
      )
    })

    it('creates a new mark above content', () => {
      cy.typeInEditor('\nB')
        .wait(200)
        .typeInEditor(`{uparrow}[](${url})🥖`)
        .should('matchHTML', `<a href="${url}">${url}</a>🥖</p><p>B</p>`)
    })

    it.only('creates a new mark between content', () => {
      cy.typeInEditor(`A\n\nB{uparrow} [](${url})🥖`).should(
        'matchHTML',
        `<p>A</p><a href="${url}">${url}</a>🥖</p><p>B</p>`
      )
    })
  })

  // TODO: selection doesn't work
  // https://github.com/decaporg/decap-cms/blob/a4b7481a99f58b9abe85ab5712d27593cde20096/cypress/support/commands.js
  describe.skip('shortcuts', () => {
    it('mod+k sets the selected text to link')
  })
})
