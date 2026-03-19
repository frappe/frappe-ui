import Rating from './Rating.vue'

describe('Rating', () => {
  it('Renders', () => {
    cy.mount(Rating, { props: { modelValue: 2, label: 'abc' } })

    cy.get('label').should('have.text', 'abc')

    cy.get('svg').each((x, i) => {
      cy.wrap(x).should(
        'have.class',
        i < 2 ? '!fill-yellow-500' : 'fill-gray-300',
      )
    })
  })

  it('v-model', () => {
    const onUpdate = cy.spy().as('onUpdate')
    const rating = 3

    cy.mount(Rating, {
      props: { modelValue: rating, 'onUpdate:modelValue': onUpdate },
    })

    cy.get('svg')
      .eq(rating - 1)
      .click()

    cy.get('svg').eq(rating).should('not.have.class', '!fill-yellow-500')
    cy.get('@onUpdate').should('have.been.calledWith', rating)
    cy.get('svg')
      .eq(rating - 1)
      .should('have.class', '!fill-yellow-500')
  })

  it('readonly', () => {
    cy.mount(Rating, {
      props: { 'onUpdate:modelValue': cy.spy().as('onUpdate'), readonly: true },
    })

    cy.get('svg').eq(1).click()
    cy.get('@onUpdate').should('not.have.been.called')
  })

  it('sizes', () => {
    const sizes = {
      sm: 'size-4',
      md: 'size-5',
      lg: 'size-6',
      xl: 'size-7',
    }

    for (const size in sizes) {
      cy.mount(Rating, {
        props: { modelValue: 2, size: size },
      })
      cy.get('svg').should('have.class', sizes[size])
    }
  })

  it('rating_from prop', () => {
    cy.mount(Rating, {
      props: { modelValue: 2, rating_from: 10 },
    })
    cy.get('svg').should('have.length', 10)
  })
})
