describe('columns node', () => {
  beforeEach(() => {
    cy.visitNewDocument()
  })

  // describe('markdown', () => {
  //   it('supports the ** syntax', () => {
  //     cy.typeInEditor('**columns**🥖').should('have.html', '<p><strong>columns</strong>🥖</p>')
  //   })

  //   it('supports the __ syntax', () => {
  //     cy.typeInEditor('__bold__🥖').should('have.html', '<p><strong>columns</strong>🥖</p>')
  //   })
  // })

  describe('commands', () => {
    describe('setColumns', () => {
      it('set the current paragraph in the first column', () => {
        const editor = cy.typeInEditor('Hi{control}{2}')
        editor.get('[data-index=0]').should('have.text', 'Hi')
        editor.get('[data-index=1]').should('have.text', '')
      })

      it('set the cursor in the first column when there is no content', () => {
        const editor = cy.typeInEditor('{control}{2}🥖')
        editor.get('[data-index=0]').should('have.text', '🥖')
        editor.get('[data-index=1]').should('have.text', '')
      })

      it('maintain the cursor position at the beginning', () => {
        const editor = cy
          .typeInEditor('[]{leftarrow}')
          .wait(100)
          .typeInEditor('{leftarrow}{control}{2}🥖')
        editor.get('[data-index=0]').should('have.text', '🥖[]')
        editor.get('[data-index=1]').should('have.text', '')
      })

      it('maintain the cursor position in the middle', () => {
        const editor = cy.typeInEditor('[]{leftarrow}{control}{2}🥖')
        editor.get('[data-index=0]').should('have.text', '[🥖]')
        editor.get('[data-index=1]').should('have.text', '')
      })

      it('set the cursor at the end of the first column when it is at the end', () => {
        const editor = cy.typeInEditor('[]{control}{2}🥖')
        editor.get('[data-index=0]').should('have.text', '[]🥖')
        editor.get('[data-index=1]').should('have.text', '')
      })
    })
  })
})
