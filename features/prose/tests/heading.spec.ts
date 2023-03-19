describe('heading node', () => {
  beforeEach(() => {
    cy.visitNewDocument()
  })

  it('supports the markdown syntax', () => {
    const editor = cy.typeInEditor('# h1\n## h2\n### h3')
    editor.get('h1').first().should('have.text', 'h1')
    editor.get('h2').first().should('have.text', 'h2')
    editor.get('h3').first().should('have.text', 'h3')
  })

  it('preserves nodes around', () => {
    cy.typeInEditor('above\nbelow{uparrow}\n# 🥖').should(
      'have.html',
      `<p>above</p><h1>🥖</h1><p>below</p>`
    )
  })
})
