describe('blockquote node', () => {
  beforeEach(() => {
    cy.visitNewDocument()
  })

  describe('markdown', () => {
    it('supports the > syntax', () => {
      cy.typeInEditor('> 🥖').should('matchHTML', '<blockquote><p>🥖</p></blockquote>')
    })

    it('preserves nodes around', () => {
      cy.typeInEditor('above\nbelow{uparrow}\n> 🤘').should(
        'matchHTML',
        `<p>above</p><blockquote><p>🤘</p></blockquote><p>below</p>`
      )
    })
  })

  // TODO: `{moveToStart}` doesn't seem to work, add more when it does
  describe.skip('update', () => {
    it('wraps a paragraph', () => {
      cy.typeInEditor('paragraph{moveToStart}> ').should(
        'matchHTML',
        `<blockquote><p>paragraph</p></blockquote>`
      )
    })

    it('does not wrap a heading', () => {
      cy.typeInEditor('# heading{moveToStart}> ').should('matchHTML', `<h1>&gt; heading</h1>`)
    })
  })
})
