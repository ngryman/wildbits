describe('bold mark', () => {
  beforeEach(() => {
    cy.visitNewDocument()
  })

  describe('markdown', () => {
    it('supports the ** syntax', () => {
      cy.typeInEditor('**bold**')
        .first()
        .should('have.html', '<p><strong>bold</strong></p>')
    })

    it('supports the __ syntax', () => {
      cy.typeInEditor('__bold__')
        .first()
        .should('have.html', '<p><strong>bold</strong></p>')
    })
  })

  // TODO: selection doesn't work
  // https://github.com/decaporg/decap-cms/blob/a4b7481a99f58b9abe85ab5712d27593cde20096/cypress/support/commands.js
  describe.skip('shortcuts', () => {
    it('mod+b sets the selected text to bold')
  })

  describe('cursor', () => {
    it('puts the cursor after and outside', () => {
      cy.typeInEditor('**bold**🤘').should(
        'have.html',
        `<p><strong>bold</strong>🤘</p>`
      )
    })
  })

  describe('insert', () => {
    it('wraps another mark', () => {
      cy.typeInEditor('**_bold italic_**').should(
        'have.html',
        `<p><strong><em>bold italic</em></strong></p>`
      )
    })

    it('wraps another mark with a space', () => {
      cy.typeInEditor('** _bold italic_ **').should(
        'have.html',
        `<p><strong> <em>bold italic</em> </strong></p>`
      )
    })

    // NOTE: only works with space since `_` can be part of a word.
    it('wraps another mark in the middle with space', () => {
      cy.typeInEditor('**before _middle_ after**').should(
        'have.html',
        `<p><strong>before <em>middle</em> after</strong></p>`
      )
    })

    // NOTE: only works with space since `_` can be part of a word.
    it('wraps another mark at the beginning with space', () => {
      cy.typeInEditor('**_before_ after**').should(
        'have.html',
        `<p><strong><em>before</em> after</strong></p>`
      )
    })

    // NOTE: only works with space since `_` can be part of a word.
    it('wraps another mark at the end with space', () => {
      cy.typeInEditor('**before _after_**').should(
        'have.html',
        `<p><strong>before <em>after</em></strong></p>`
      )
    })
  })
})
