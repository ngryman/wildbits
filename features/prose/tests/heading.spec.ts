describe('heading node', () => {
  beforeEach(() => {
    cy.visitNewDocument()
  })

  it('supports the markdown syntax', () => {
    cy.typeInEditor('# h1\n## h2\n### h3')
    cy.editor().children('h1').first().should('have.text', 'h1')
    cy.editor().children('h2').first().should('have.text', 'h2')
    cy.editor().children('h3').first().should('have.text', 'h3')
  })

  it('preserves nodes around', () => {
    cy.typeInEditor('above\nbelow{uparrow}\n# 🥖').should(
      'matchHTML',
      `<p>above</p><h1>🥖</h1><p>below</p>`
    )
  })
})
