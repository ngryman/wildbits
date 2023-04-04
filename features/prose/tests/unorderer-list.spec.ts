describe('unordered list node', () => {
  beforeEach(() => {
    cy.visitNewDocument()
  })

  describe('markdown', () => {
    it('supports the * syntax', () => {
      cy.typeInEditor('* item').should('matchHTML', '<ul><li><p>item</p></li></ul>')
    })

    it('supports the - syntax', () => {
      cy.typeInEditor('- item').should('matchHTML', '<ul><li><p>item</p></li></ul>')
    })

    it('supports the + syntax', () => {
      cy.typeInEditor('+ item').should('matchHTML', '<ul><li><p>item</p></li></ul>')
    })

    it('preserves nodes around', () => {
      cy.typeInEditor('above\nbelow{uparrow}\n* 🥖').should(
        'matchHTML',
        `<p>above</p><ul><li><p>🥖</p></li></ul><p>below</p>`
      )
    })
  })

  // TODO: `{moveToStart}` doesn't seem to work, add more when it does
  describe.skip('update', () => {
    it('wraps a paragraph', () => {
      cy.typeInEditor('paragraph{moveToStart}* ').should(
        'matchHTML',
        `<ul><li><p>paragraph</p></li></ul>`
      )
    })

    it('does not wrap a heading', () => {
      cy.typeInEditor('# heading{moveToStart}* ').should('matchHTML', `<h1>&gt; heading</h1>`)
    })
  })
})
