import Password from './Password.vue'
import { h } from 'vue'

describe('Password', () => {
  it('Renders & password toggle ', () => {
    cy.mount(Password)
    cy.get('input[type=password]').should('exist')

    cy.get('[data-grace-area-trigger]').click()
    cy.get('input[type=password]').should('not.exist')
    cy.get('input[type=text]').should('exist')
  })

  it('v-model', () => {
    cy.mount(Password, {
      props: {
        value: '123456',
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })

    cy.get('input').type('a')
    cy.get('@onUpdate').should('have.been.calledWith', '123456a')
  })

  it('Prefix slot', () => {
    cy.mount(Password, {
      slots: {
        prefix: h('div', { 'data-cy': 'prefix-icon' }, ['abc']),
      },
    })

    cy.get("[data-cy='prefix-icon']").should('exist')
  })
})
