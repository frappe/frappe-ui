import LoadingText from './LoadingText.vue'

describe('LoadingText', () => {
  it('renders default text', () => {
    cy.mount(LoadingText)

    cy.contains('Loading...').should('exist')
  })

  it('renders custom text', () => {
    cy.mount(LoadingText, { props: { text: 'Saving...' } })

    cy.contains('Saving...').should('exist')
  })

  it('renders a loading indicator', () => {
    cy.mount(LoadingText)

    cy.get('[role="status"]').should('exist')
  })
})
