import Slider from './Slider.vue'

describe('Slider', () => {
  it('renders one thumb for a single value', () => {
    cy.mount(Slider, {
      props: {
        modelValue: [25],
      },
    })

    cy.get('[role="slider"]').should('have.length', 1)
  })

  it('renders two thumbs for a range value', () => {
    cy.mount(Slider, {
      props: {
        modelValue: [20, 80],
      },
    })

    cy.get('[role="slider"]').should('have.length', 2)
  })

  it('renders one thumb at the default minimum value when uncontrolled', () => {
    cy.mount(Slider)

    cy.get('[role="slider"]')
      .should('have.length', 1)
      .first()
      .should('have.attr', 'aria-valuenow', '0')
  })

  it('renders one thumb at the provided minimum value when uncontrolled', () => {
    cy.mount(Slider, {
      props: {
        min: 10,
      },
    })

    cy.get('[role="slider"]')
      .should('have.length', 1)
      .first()
      .should('have.attr', 'aria-valuenow', '10')
  })

  it('does not bake in a hardcoded aria-label', () => {
    cy.mount(Slider, { props: { modelValue: [25] } })
    cy.get('[role="slider"]').should('not.have.attr', 'aria-label')
  })

  it('forwards disabled to aria-disabled and SliderRoot', () => {
    cy.mount(Slider, {
      props: { id: 'sl-disabled', modelValue: [25], disabled: true },
    })
    cy.get('#sl-disabled').should('have.attr', 'aria-disabled', 'true')
    cy.get('[role="slider"]').should('have.attr', 'data-disabled')
  })

  describe('shared labeling contract', () => {
    it('wires aria-labelledby and aria-describedby', () => {
      cy.mount(Slider, {
        props: { label: 'Volume', description: 'Adjust volume.' },
      })
      cy.get('[role="slider"]')
        .parents('[aria-labelledby]')
        .first()
        .then(($root) => {
          const labelledBy = $root.attr('aria-labelledby')!
          const describedBy = $root.attr('aria-describedby')!
          cy.get(`#${labelledBy}`).should('contain.text', 'Volume')
          cy.get(`#${describedBy}`).should('contain.text', 'Adjust volume.')
        })
    })

    it('renders error state', () => {
      cy.mount(Slider, {
        props: { label: 'Volume', error: 'Required' },
      })
      cy.contains('Required').should('exist')
    })
  })
})
