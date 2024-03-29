describe('bold mark', () => {
  beforeEach(() => {
    cy.visitNewDocument()
  })

  describe('markdown', () => {
    it('supports the ** syntax', () => {
      cy.typeInEditor('**bold**🥖').should('matchHTML', '<p><strong>bold</strong>🥖</p>')
    })

    it('supports the __ syntax', () => {
      cy.typeInEditor('__bold__🥖').should('matchHTML', '<p><strong>bold</strong>🥖</p>')
    })
  })

  // TODO: selection doesn't work
  // https://github.com/decaporg/decap-cms/blob/a4b7481a99f58b9abe85ab5712d27593cde20096/cypress/support/commands.js
  describe.skip('shortcuts', () => {
    it('mod+b sets the selected text to bold')
  })

  describe('wrapping', () => {
    it('wraps another mark', () => {
      cy.typeInEditor('**_bold italic_**').should(
        'matchHTML',
        `<p><strong><em>bold italic</em></strong></p>`
      )
    })

    it('wraps another mark with a space', () => {
      cy.typeInEditor('** _bold italic_ **').should(
        'matchHTML',
        `<p><strong> <em>bold italic</em> </strong></p>`
      )
    })

    // NOTE: only works with space since `_` can be part of a word.
    it('wraps another mark in the middle with space', () => {
      cy.typeInEditor('**1 _2_ 3**').should('matchHTML', `<p><strong>1 <em>2</em> 3</strong></p>`)
    })

    // NOTE: only works with space since `_` can be part of a word.
    it('wraps another mark at the beginning with space', () => {
      cy.typeInEditor('**_1_ 3**').should('matchHTML', `<p><strong><em>1</em> 3</strong></p>`)
    })

    // NOTE: only works with space since `_` can be part of a word.
    it('wraps another mark at the end with space', () => {
      cy.typeInEditor('**1 _3_**').should('matchHTML', `<p><strong>1 <em>3</em></strong></p>`)
    })
  })
})
