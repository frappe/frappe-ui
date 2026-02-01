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

  it('test v-model', () => {
    cy.mount(Combobox, {
      props: {
        options,
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })

    cy.get('input').type('a')
    cy.get('[role=option]:first').click()
    cy.get('@onUpdate').should('have.been.calledWith', 'Apple')

    cy.get('input').clear()
    cy.get('input').type('ch')
    cy.get('[role=option]:first').click()
    cy.get('@onUpdate').should('have.been.calledWith', 'Cherry')
  })

  it('emitted events', () => {
    const onBlurSpy = cy.spy().as('onBlurSpy')
    const onFocus = cy.spy().as('onFocus')
    const onInput = cy.spy().as('onInput')
    const onSelectedOption = cy.spy().as('onSelectedOption')

    cy.mount(Combobox, {
      props: {
        options,
        onBlur: onBlurSpy,
        onFocus: onFocus,
        onInput: onInput,
        'onUpdate:selectedOption': onSelectedOption,
      },
    })

    // type in input -> select 1st option -> outsideclick
    cy.get('input').type('a')
    cy.get('@onFocus').should('have.been.called')
    cy.get('@onInput').should('have.been.called')

    cy.get('[role=option]:first').click()
    cy.get('@onSelectedOption').should('have.been.called')

    cy.root().click(0, 0, { force: true })
    cy.get('@onBlurSpy').should('have.been.called')
  })
})
