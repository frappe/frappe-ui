import LoadingIndicator from './LoadingIndicator.vue'

describe('LoadingIndicator', () => {
  it('renders a Spinner with role="status"', () => {
    cy.mount(LoadingIndicator)

    cy.get('[role="status"]').should('exist')
  })

  it('scale=100 (default) applies no inline scale style', () => {
    cy.mount(LoadingIndicator)

    cy.get('[role="status"]').should(($el) => {
      expect($el[0].style.scale).to.equal('')
    })
  })

  it('scale=50 applies a scale style', () => {
    cy.mount(LoadingIndicator, { props: { scale: 50 } })

    cy.get('[role="status"]').should(($el) => {
      // The browser normalizes the CSS `scale` property's percentage
      // value to a unitless number when it reflects `style.scale`.
      expect($el[0].style.scale).to.equal('0.5')
    })
  })
})
