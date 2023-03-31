const ID_AND_KEY_LENGTH = 21

describe('home page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('new user', () => {
    it('redirects to a new welcome note', () => {
      cy.location('pathname').should('eq', '/welcome')
      cy.location('hash').should('match', new RegExp(`#[\\w-]{${ID_AND_KEY_LENGTH}}`))
      cy.get('nav a').should('have.length', 1)
      cy.editor().get('h1').should('contain.text', 'Welcome to Wildbits!')
    })
  })

  describe('returning user', () => {
    it('redirects to the existing welcome note', () => {
      // Make sure the welcome note has time to be generated
      cy.get('h1').should('be.visible')

      cy.location().then(location => {
        cy.visit('/')
        cy.location('pathname').should('eq', location.pathname)
        cy.location('hash').should('eq', location.hash)
        cy.get('nav a').should('have.length', 1)
      })
    })

    it('redirects to the last note', () => {
      // Make sure the welcome note has time to be generated
      cy.get('h1').should('be.visible')

      cy.visitNewDocument().typeInEditor('# Hello!')
      cy.location().then(location => {
        cy.visit('/')
        cy.location('pathname').should('eq', location.pathname)
        cy.location('hash').should('eq', location.hash)
        cy.get('nav a').should('have.length', 2)
        cy.editor().get('h1').should('not.contain.text', 'Hello!')
      })
    })
  })
})
