import ErrorMessage from './ErrorMessage.vue'

describe('ErrorMessage', () => {
  it('renders', () => {
    cy.mount(ErrorMessage, {
      props: {
        message: 'Invalid value',
      },
    })

    cy.get('[role=alert]')
      .should('have.text', 'Invalid value')
      .should('have.class', 'text-ink-red-4')
  })
})
