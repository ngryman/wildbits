describe('markdown syntax', () => {
  beforeEach(() => {
    cy.visitNewDocument()
  })

  it('supports the heading syntax', () => {
    const editor = cy.typeInEditor('# h1\n## h2\n### h3')
    editor.get('h1').first().should('have.text', 'h1')
    editor.get('h2').first().should('have.text', 'h2')
    editor.get('h3').first().should('have.text', 'h3')
  })

  it('supports the bold syntax', () => {
    cy.typeInEditor('This is **bold**, and __bold__.')
      .first()
      .should(
        'have.html',
        '<p>This is <strong>bold</strong>, and <strong>bold</strong>.</p>'
      )
  })

  it('supports the italic syntax', () => {
    cy.typeInEditor('This is *italic*, and _italic_.')
      .first()
      .should(
        'have.html',
        '<p>This is <em>italic</em>, and <em>italic</em>.</p>'
      )
  })

  it('supports the blockquote syntax', () => {
    cy.typeInEditor('> Simplicity is the ultimate sophistication.')
      .first()
      .should(
        'have.html',
        '<blockquote><p>Simplicity is the ultimate sophistication.</p></blockquote>'
      )
  })

  it('supports the ordered list syntax', () => {
    // NOTE: Insert 2 line breaks avoid automatic item creation
    cy.typeInEditor('1. first\n\n2. second\n\n3. third')
      .first()
      .should(
        'have.html',
        '<ol><li><p>first</p></li><li><p>second</p></li><li><p>third</p></li></ol>'
      )
  })

  it('supports the unordered list syntax', () => {
    // NOTE: Insert 2 line breaks avoid automatic item creation
    cy.typeInEditor('- first\n\n* second\n\n+ third')
      .first()
      .should(
        'have.html',
        '<ul><li><p>first</p></li><li><p>second</p></li><li><p>third</p></li></ul>'
      )
  })

  it('supports the code syntax', () => {
    cy.typeInEditor('This is `some code`.')
      .first()
      .should('have.html', '<p>This is <code>some code</code>.</p>')
  })

  // TODO: wait for a fix to `@tiptap/extension-horizontal-rule
  // https://github.com/ueberdosis/tiptap/issues/3809
  // https://github.com/ueberdosis/tiptap/issues/1964
  // https://github.com/ueberdosis/tiptap/issues/1665
  it.skip('supports the horizontal rule syntax', () => {
    cy.typeInEditor('Hello\n---')
      .first()
      .should('have.html', '<p>Hello</p><hr>')
  })

  // TODO: wait for a fix to `@tiptap/extension-link`
  // https://github.com/ueberdosis/tiptap/issues/819
  it.skip('supports the link syntax', () => {
    cy.typeInEditor('This is [Wildbits](https://wildbits.app).')
      .first()
      .should(
        'have.html',
        '<p>This is <a href="https://wildbits.app">Wildbits</a>.</p>'
      )
  })

  // TODO: wait for a fix to `@tiptap/extension-image`
  it.skip('supports the image syntax', () => {
    cy.typeInEditor(
      'This is a ![Tiger](https://thumbs.dreamstime.com/b/tiger-portrait-horizontal-11392212.jpg)'
    )
      .first()
      .should(
        'have.html',
        '<p>This is a </p><img src="https://thumbs.dreamstime.com/b/tiger-portrait-horizontal-11392212.jpg" alt="Tiger" contenteditable="false" draggable="true">'
      )
  })
})
