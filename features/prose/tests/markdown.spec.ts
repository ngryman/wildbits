describe('markdown syntax', () => {
  beforeEach(() => {
    cy.visitNewDocument()
  })

  // TODO: wait for a fix to `@tiptap/extension-image`
  it.skip('supports the image syntax', () => {
    cy.typeInEditor(
      'This is a ![Tiger](https://thumbs.dreamstime.com/b/tiger-portrait-horizontal-11392212.jpg)'
    ).should(
      'have.html',
      '<p>This is a </p><img src="https://thumbs.dreamstime.com/b/tiger-portrait-horizontal-11392212.jpg" alt="Tiger" contenteditable="false" draggable="true">'
    )
  })
})
