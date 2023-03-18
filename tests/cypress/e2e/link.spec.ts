describe('link mark', () => {
  beforeEach(() => {
    cy.visitNewDocument()
  })

  describe('markdown', () => {
    it('supports the [title](url) syntax', () => {
      cy.typeInEditor('[Wildbits](https://wildbits.app)🥖').should(
        'have.html',
        '<p><a target="_blank" rel="noopener noreferrer nofollow" href="https://wildbits.app">Wildbits</a>🥖</p>'
      )
    })

    it('supports the vanilla url syntax', () => {
      cy.typeInEditor('https://wildbits.app 🥖').should(
        'have.html',
        '<p><a target="_blank" rel="noopener noreferrer nofollow" href="https://wildbits.app">https://wildbits.app</a> 🥖</p>'
      )
    })
  })

  // TODO: selection doesn't work
  // https://github.com/decaporg/decap-cms/blob/a4b7481a99f58b9abe85ab5712d27593cde20096/cypress/support/commands.js
  describe.skip('shortcuts', () => {
    it('mod+k sets the selected text to link')
  })

  describe('insert', () => {})
})
