import Slider from './Slider.vue'

describe('Slider', () => {
  it('renders one thumb for a single value', () => {
    cy.mount(Slider, {
      props: {
        modelValue: [25],
      },
    })

    cy.get('[aria-label="Volume"]').should('have.length', 1)
    cy.get('[role="slider"]').should('have.length', 1)
  })

  it('renders two thumbs for a range value', () => {
    cy.mount(Slider, {
      props: {
        modelValue: [20, 80],
      },
    })

    cy.get('[aria-label="Volume"]').should('have.length', 2)
  })
})
