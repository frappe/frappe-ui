import Combobox from './Combobox.vue'
import { h } from 'vue'

const options = ['Apple', 'Mango', 'Cherry']

describe('Combobox', () => {
  it('Renders', () => {
    cy.mount(Combobox, { props: { options } })
    cy.get('input[type="text"]').should('exist')
  })

  it('Popup Click', () => {
    cy.mount(Combobox, { props: { options } })

    // click popup trigger
    cy.get('[role=presentation]').should('not.exist')
    cy.get('[aria-label="Show popup"]').click()
    cy.get('[role=presentation]').should('exist')
  })

  it('Option Click', () => {
    cy.mount(Combobox, { props: { options } })

    cy.get('[aria-label="Show popup"]').click()
    cy.get('[role=option]:first').click()
    cy.get('input[type="text"]').should('have.value', 'Apple')
  })

  it('user input', () => {
    cy.mount(Combobox, { props: { options } })

    cy.get('input[type="text"]').type('ch')
    cy.get('[role=option]:first').click()
    cy.get('input[type="text"]').should('have.value', 'Cherry')
  })

  it('prefix slot', () => {
    cy.mount(Combobox, {
      props: { options },
      slots: {
        prefix: h('div', { 'data-cy': 'prefix-icon' }, ['abc']),
      },
    })

    cy.get('[data-cy="prefix-icon"]').should('exist')
  })
})
