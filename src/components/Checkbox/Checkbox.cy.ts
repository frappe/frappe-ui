import Checkbox from './Checkbox.vue'

describe('Checkbox', () => {
  it('renders', () => {
    cy.mount(Checkbox, { props: { label: 'abc' } })

    cy.get('input[type="checkbox"]').should('exist')
    cy.get('label').should('have.text', 'abc')
  })

  it('disabled', () => {
    cy.mount(Checkbox, {
      props: { label: 'abc', disabled: true },
    })

    cy.get('input[type="checkbox"]').should('be.disabled')
    cy.get('label').should('have.class', 'text-ink-gray-4')
  })

  it('test v-model', () => {
    cy.mount(Checkbox, {
      props: {
        'onUpdate:model-value': cy.spy().as('onUpdate'),
      },
    })

    cy.get('@onUpdate').should('not.have.been.called')
    cy.get('input[type="checkbox"]').click()
    cy.get('@onUpdate').should('have.been.calledWith', true)
  })
})
