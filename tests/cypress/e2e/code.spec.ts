describe('code mark', () => {
  beforeEach(() => {
    cy.visitNewDocument()
  })

  describe('markdown', () => {
    it('supports the ` syntax', () => {
      cy.typeInEditor('`code`🥖').should('have.html', '<p><code>code</code>🥖</p>')
    })

    it('excludes another mark', () => {
      cy.typeInEditor('`_code_`').should('have.html', `<p><code>code</code></p>`)
    })

    it('excludes another mark with a space', () => {
      cy.typeInEditor('` _code_ `').should('have.html', `<p><code> code </code></p>`)
    })

    it('excludes another mark in the middle', () => {
      cy.typeInEditor('`1**2**3`').should('have.html', `<p><code>123</code></p>`)
    })

    it('excludes another mark in the middle with space', () => {
      cy.typeInEditor('`1 **2** 3`').should('have.html', `<p><code>1 2 3</code></p>`)
    })

    it('excludes another mark at the beginning', () => {
      cy.typeInEditor('`**1**2`').should('have.html', `<p><code>12</code></p>`)
    })

    it('excludes another mark at the beginning with space', () => {
      cy.typeInEditor('`**1** 2`').should('have.html', `<p><code>1 2</code></p>`)
    })

    it('excludes another mark at the end', () => {
      cy.typeInEditor('`1**2**`').should('have.html', `<p><code>12</code></p>`)
    })

    it('excludes another mark at the end with space', () => {
      cy.typeInEditor('`1 **2**`').should('have.html', `<p><code>1 2</code></p>`)
    })
  })

  // TODO: selection doesn't work
  // https://github.com/decaporg/decap-cms/blob/a4b7481a99f58b9abe85ab5712d27593cde20096/cypress/support/commands.js
  describe.skip('shortcuts', () => {
    it('mod+e sets the selected text to code')
  })
})
