describe('horizontal rule node', () => {
  beforeEach(() => {
    cy.visitNewDocument()
  })

  describe('markdown', () => {
    it('supports the --- syntax', () => {
      cy.typeInEditor('---🥖').should('have.html', '<hr contenteditable="false"><p>🥖</p>')
    })

    it('supports the ___ syntax', () => {
      cy.typeInEditor('___ 🥖').should('include.html', '<hr contenteditable="false"><p>🥖</p>')
    })

    it('supports the *** syntax', () => {
      cy.typeInEditor('*** 🥖').should('include.html', '<hr contenteditable="false"><p>🥖</p>')
    })

    it('preserves nodes around', () => {
      cy.typeInEditor('above\nbelow{uparrow}\n---🥖').should(
        'have.html',
        `<p>above</p><hr contenteditable="false"><p>🥖</p><p>below</p>`
      )
    })
  })

  // TODO: `{moveToStart}` doesn't seem to work, add more when it does
  describe.skip('update', () => {
    it('wraps a paragraph', () => {
      cy.typeInEditor('paragraph{moveToStart}> ').should(
        'have.html',
        `<blockquote><p>paragraph</p></blockquote>`
      )
    })

    it('does not wrap a heading', () => {
      cy.typeInEditor('# heading{moveToStart}> ').should('have.html', `<h1>&gt; heading</h1>`)
    })
  })
})
