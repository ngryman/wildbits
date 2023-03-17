describe('italic mark', () => {
  beforeEach(() => {
    cy.visitNewDocument()
  })

  describe('markdown', () => {
    it('supports the * syntax', () => {
      cy.typeInEditor('*italic*')
        .first()
        .should('have.html', '<p><em>italic</em></p>')
    })

    it('supports the _ syntax', () => {
      cy.typeInEditor('_italic_')
        .first()
        .should('have.html', '<p><em>italic</em></p>')
    })
  })

  // TODO: selection doesn't work
  // https://github.com/decaporg/decap-cms/blob/a4b7481a99f58b9abe85ab5712d27593cde20096/cypress/support/commands.js
  describe.skip('shortcuts', () => {
    it('ctrl+i sets the selected text to italic')
  })

  describe('cursor', () => {
    it('puts the cursor after and outside', () => {
      cy.typeInEditor('*italic*🤘').should(
        'have.html',
        `<p><em>italic</em>🤘</p>`
      )
    })
  })

  describe('insert', () => {
    it('is wrapped by another mark', () => {
      cy.typeInEditor('_**italic bold**_').should(
        'have.html',
        `<p><strong><em>italic bold</em></strong></p>`
      )
    })

    it('is split across another mark with a space', () => {
      cy.typeInEditor('_ **italic bold** _').should(
        'have.html',
        `<p><em> </em><strong><em>italic bold</em></strong><em> </em></p>`
      )
    })

    it('is split across another mark in the middle', () => {
      cy.typeInEditor('_before**middle**after_').should(
        'have.html',
        `<p><em>before</em><strong><em>middle</em></strong><em>after</em></p>`
      )
    })

    it('is split across another mark in the middle with space', () => {
      cy.typeInEditor('_before **middle** after_').should(
        'have.html',
        `<p><em>before </em><strong><em>middle</em></strong><em> after</em></p>`
      )
    })

    it('is split across another mark at the beginning', () => {
      cy.typeInEditor('_**before**after_').should(
        'have.html',
        `<p><strong><em>before</em></strong><em>after</em></p>`
      )
    })

    it('wraps another mark at the beginning with space', () => {
      cy.typeInEditor('_**before** after_').should(
        'have.html',
        `<p><strong><em>before</em></strong><em> after</em></p>`
      )
    })

    it('wraps another mark at the end', () => {
      cy.typeInEditor('_before**after**_').should(
        'have.html',
        `<p><em>before</em><strong><em>after</em></strong></p>`
      )
    })

    it('wraps another mark at the end with space', () => {
      cy.typeInEditor('_before **after**_').should(
        'have.html',
        `<p><em>before </em><strong><em>after</em></strong></p>`
      )
    })
  })
})
