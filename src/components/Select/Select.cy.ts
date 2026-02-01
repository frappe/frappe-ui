import Select from './Select.vue'
import { h } from 'vue'

const options = ['abc', 'def', 'xyz']

describe('Select', () => {
  it('Renders', () => {
    cy.mount(Select, { props: { options, placeholder: 'pla' } })

    // basic selection
    cy.get('button').should('have.text', 'pla')
    cy.get('[role=combobox]').should('have.attr', 'aria-expanded', 'false')
    cy.get('[role=presentation]').should('not.exist')

    cy.get('button').click()

    cy.get('[role=combobox]').should('have.attr', 'aria-expanded', 'true')
    cy.get('[role=presentation]').should('exist')
    cy.get('[role=option]').should('have.length', options.length)

    cy.get('[role=combobox]').should('not.have.text', 'def')
    cy.get('[role=option]').eq(1).click()
    cy.get('[role=combobox]').should('have.text', 'def')
  })

  it('sizes', () => {
    const classes = {
      sm: 'min-h-7',
      md: 'min-h-8',
      lg: 'min-h-10',
      xl: 'min-h-10',
    }

    for (const size in classes) {
      cy.mount(Select, { props: { options, size } })
      cy.get('button').click()
      cy.get('[role=option]').should('have.class', classes[size])
    }
  })

  it('v-model', () => {
    cy.mount(Select, {
      props: {
        options,
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })

    cy.get('button').click()

    cy.get('@onUpdate').should('not.have.been.called')
    cy.get('[role=option]').eq(1).click()
    cy.get('[role=combobox]').should('have.text', 'def')
    cy.get('@onUpdate').should('have.been.calledWith', 'def')
  })

  it('slots', () => {
    cy.mount(Select, {
      props: { options },
      slots: {
        prefix: h('span', { 'data-cy': 'prefix' }, 'prefix'),
        suffix: h('span', { 'data-cy': 'suffix' }, 'suffix'),
        option: h('span', { 'data-cy': 'option' }, 'option'),
        footer: h('span', { 'data-cy': 'footer' }, 'footer'),
      },
    })

    cy.get('[data-cy="prefix"]').should('exist')
    cy.get('[data-cy="suffix"]').should('exist')

    cy.get('button').click()

    cy.get('[data-cy="option"]').should('exist')
    cy.get('[data-cy="footer"]').should('exist')
  })

  it('disabled', () => {
    cy.mount(Select, {
      props: { options, disabled: true },
    })

    cy.get('button').should('have.class', 'cursor-not-allowed')
  })
})
