const url = 'https://wildbits.app'

describe('link mark', () => {
  beforeEach(() => {
    cy.visitNewDocument()
  })

  describe('markdown', () => {
    it('supports the [](url) syntax', () => {
      cy.typeInEditor(`[](${url})🥖`).should('matchHTML', `<p><a href="${url}">${url}</a>🥖</p>`)
    })

    it('supports the [text](url) syntax', () => {
      cy.typeInEditor(`[Wildbits](${url})🥖`).should(
        'matchHTML',
        `<p><a href="${url}">Wildbits</a>🥖</p>`
      )
    })

    it('supports the [text](url "title") syntax', () => {
      cy.typeInEditor(`[Wildbits](${url} "Wildbits App")🥖`).should(
        'matchHTML',
        `<p><a href="${url}" title="Wildbits App">Wildbits</a>🥖</p>`
      )
    })

    it('accepts utf8 characters in the `text` portion', () => {
      cy.typeInEditor(`[Issue #42 · ngryman/wildbits](${url})🥖`).should(
        'matchHTML',
        `<p><a href="${url}">Issue #42 · ngryman/wildbits</a>🥖</p>`
      )
    })

    it('accepts a sequence of links ', () => {
      cy.typeInEditor(`[](${url}) [](${url})🥖`).should(
        'matchHTML',
        `<p><a href="${url}">${url}</a><a href="${url}">${url}</a>🥖</p>`
      )
    })

    it('supports the vanilla url syntax', () => {
      cy.typeInEditor(`${url} 🥖`).should('matchHTML', `<p><a href="${url}">${url}</a> 🥖</p>`)
    })

    it('creates a new mark after content', () => {
      cy.typeInEditor(`B [](${url})🥖`).should(
        'matchHTML',
        `<p>B <a href="${url}">${url}</a>🥖</p>`
      )
    })

    it('creates a new mark before content', () => {
      cy.typeInEditor('A')
        .wait(200)
        .typeInEditor(`{leftarrow}[](${url})🥖`)
        .should('matchHTML', `<a href="${url}">${url}</a>🥖A</p>`)
    })

    it('creates a new mark between content', () => {
      cy.typeInEditor(`BA{leftarrow} [](${url})🥖`).should(
        'matchHTML',
        `<p>B <a href="${url}">${url}</a>🥖A</p>`
      )
    })

    it('creates a new mark below content', () => {
      cy.typeInEditor(`A\n[](${url})🥖`).should(
        'matchHTML',
        `<p>A</p><p><a href="${url}">${url}</a>🥖</p>`
      )
    })

    it('creates a new mark above content', () => {
      cy.typeInEditor('\nB')
        .wait(200)
        .typeInEditor(`{uparrow}[](${url})🥖`)
        .should('matchHTML', `<a href="${url}">${url}</a>🥖</p><p>B</p>`)
    })

    it('creates a new mark between content', () => {
      cy.typeInEditor(`A\n\nB{uparrow} [](${url})🥖`).should(
        'matchHTML',
        `<p>A</p><a href="${url}">${url}</a>🥖</p><p>B</p>`
      )
    })
  })

  describe('clipboard', () => {
    it('supports pasting markdown', () => {
      cy.pasteInEditor('text/plain', `[](${url})`).should(
        'matchHTML',
        `<p><a target="_blank" rel="noopener noreferrer nofollow" href="${url}">${url}</a></p>`
      )
    })

    it('supports pasting anchor html tag', () => {
      cy.pasteInEditor('text/html', `<a href="${url}">Wildbits</a>`).should(
        'matchHTML',
        `<p><a target="_blank" rel="noopener noreferrer nofollow" href="${url}">Wildbits</a></p>`
      )
    })

    it('supports pasting a vanilla url', () => {
      cy.pasteInEditor('text/plain', url).should(
        'matchHTML',
        `<p><a target="_blank" rel="noopener noreferrer nofollow" href="${url}">${url}</a></p>`
      )
    })

    it('accepts a sequence of links', () => {
      cy.pasteInEditor('text/plain', `[](${url}) [](${url})`)
        .typeInEditor('🥖')
        .should('matchHTML', `<p><a href="${url}">${url}</a><a href="${url}">${url}</a>🥖</p>`)
    })

    it('accepts a sequence of links after content', () => {
      cy.typeInEditor('A')
        .wait(200)
        .typeInEditor('{leftarrow}')
        .pasteInEditor('text/plain', `[](${url}) [](${url})`)
        .should('matchHTML', `<p><a href="${url}">${url}</a><a href="${url}">${url}</a>A</p>`)
    })

    it('accepts a sequence of links between content', () => {
      cy.typeInEditor('BA{leftarrow}')
        .pasteInEditor('text/plain', `[](${url}) [](${url})`)
        .should('matchHTML', `<p>B<a href="${url}">${url}</a><a href="${url}">${url}</a>A</p>`)
    })

    it('accepts a sequence of links after content', () => {
      cy.typeInEditor('B')
        .pasteInEditor('text/plain', `[](${url}) [](${url})`)
        .should('matchHTML', `<p>B<a href="${url}">${url}</a><a href="${url}">${url}</a></p>`)
    })

    /**
     * Disabling the base extension paste rules makes this work, however we
     * don't have vanilla links working anymore. This is an acceptable bug for
     * now.
     */
    it.skip('accepts a sequence of links with trailing content', () => {
      cy.pasteInEditor('text/plain', `[](${url}) [](${url})A`).should(
        'matchHTML',
        `<p><a href="${url}">${url}</a><a href="${url}">${url}</a>A</p>`
      )
    })
  })

  // TODO: selection doesn't work
  // https://github.com/decaporg/decap-cms/blob/a4b7481a99f58b9abe85ab5712d27593cde20096/cypress/support/commands.js
  describe.skip('shortcuts', () => {
    it('mod+k sets the selected text to link')
  })
})
