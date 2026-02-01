import MultiSelect from './MultiSelect.vue'
import { h } from 'vue'

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Orange', value: 'orange' },
]

describe('MultiSelect', () => {
  it('renders', () => {
    cy.mount(MultiSelect, { props: { options } })

    cy.get('.PopoverContent').should('not.exist')
    cy.get('button').click()
    cy.get('.PopoverContent').should('exist')

    cy.get('[role=option]').should('have.length', 3)
  })

  it('option click', () => {
    cy.mount(MultiSelect, { props: { options } })

    cy.get('button').click()

    cy.get('[role=option]').eq(0).click()
    cy.get('[role=option]').eq(1).click()

    cy.get('button:first').should(
      'have.text',
      options[0].label + ', ' + options[1].label + ' ',
    )
  })

  it('input', () => {
    cy.mount(MultiSelect, { props: { options } })

    cy.get('button').click()
    cy.get('input').type(options[1].label.slice(0, 2))

    cy.get('[role=option]').should('have.text', options[1].label)
  })

  it('v-model', () => {
    cy.mount(MultiSelect, {
      props: { options, 'onUpdate:modelValue': cy.spy().as('onUpdate') },
    })

    cy.get('button').click()
    cy.get('[role=option]').click({ multiple: true })

    const expectedVal = options.map((option) => option.value)
    cy.get('@onUpdate').should('have.been.calledWith', expectedVal)
  })

  it('slots', () => {
    cy.mount(MultiSelect, {
      props: { options },
      slots: {
        footer: h('div', { 'data-cy': 'footer' }, ['footer']),
        option: h('div', { 'data-cy': 'option' }, ['option']),
      },
    })

    cy.get('button').click()

    cy.get('[data-cy="footer"]').should('exist')
    cy.get('[data-cy="option"]').should('exist')
  })
})
