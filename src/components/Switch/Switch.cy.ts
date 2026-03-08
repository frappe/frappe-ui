import Switch from './Switch.vue'

describe('Switch', () => {
  it('renders the component', () => {
    cy.mount(Switch)

    cy.get('[role="switch"]').should('exist')
  })

  it('renders the label & description', () => {
    cy.mount(Switch, {
      props: { label: 'abc', description: 'some long sentence' },
    })

    cy.get('label').should('have.text', 'abc')
    cy.get('span').should('have.text', 'some long sentence')
  })

  it('disabled', () => {
    cy.mount(Switch, {
      props: { disabled: true },
    })

    cy.get('[role="switch"]').should('have.attr', 'disabled')
  })

  it('v-model', () => {
    cy.mount(Switch, {
      props: {
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
        onChange: cy.spy().as('onChange'),
      },
    })

    cy.get('@onUpdate').should('not.be.called')
    cy.get('@onChange').should('not.be.called')

    cy.get('[role="switch"]').click()
    cy.get('@onUpdate').should('be.calledWith', true)
    cy.get('@onChange').should('be.calledWith', true)
    cy.get('[role="switch"]').click()

    cy.get('@onUpdate').should('be.calledWith', false)
    cy.get('@onChange').should('be.calledWith', false)
  })
})
