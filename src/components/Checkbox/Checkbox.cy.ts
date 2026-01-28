import Checkbox from './Checkbox.vue'
import { h, ref } from 'vue'

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

  it('v-model', () => {
    const VModelComponent = () => {
      const val = ref(false)

      return h('div', {}, [
        h('div', { id: 'val' }, val.value),
        h(Checkbox, { label: 'abc', 'v-model': val }),
      ])
    }

    cy.mount(VModelComponent)

    cy.get('#val').should('have.text', 'false')
    cy.get('input[type="checkbox"]').click()
    cy.get('#val').should('have.text', 'true')
  })
})
