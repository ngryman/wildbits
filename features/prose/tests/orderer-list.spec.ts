describe('ordered list node', () => {
  beforeEach(() => {
    cy.visitNewDocument()
  })

  describe('markdown', () => {
    it('supports the 1. syntax', () => {
      cy.typeInEditor('1. item').should('matchHTML', '<ol><li><p>item</p></li></ol>')
    })

    it('preserves nodes around', () => {
      cy.typeInEditor('above\nbelow{uparrow}\n1. 🥖').should(
        'matchHTML',
        `<p>above</p><ol><li><p>🥖</p></li></ol><p>below</p>`
      )
    })
  })

  // TODO: `{moveToStart}` doesn't seem to work, add more when it does
  describe.skip('update', () => {
    it('wraps a paragraph', () => {
      cy.typeInEditor('paragraph{moveToStart}1. ').should(
        'matchHTML',
        `<ol><li><p>paragraph</p></li></ol>`
      )
    })

    it('does not wrap a heading', () => {
      cy.typeInEditor('# heading{moveToStart}1. ').should('matchHTML', `<h1>&gt; heading</h1>`)
    })
  })
})
