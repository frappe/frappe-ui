import Checkbox from './Checkbox.vue'
import { h, ref } from 'vue'

const VModelComponent = {
  setup: () => {
    const val = ref(false)
    return { val }
  },

  render() {
    return h('div', {}, [
      h('div', { id: 'val' }, this.val),

      h(Checkbox, {
        label: 'abc',
        'model-value': this.val,
        'onUpdate:model-value': (x) => (this.val = x),
      }),
    ])
  },
}

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
    cy.mount(VModelComponent)

    cy.get('#val').should('have.text', 'false')
    cy.get('input[type="checkbox"]').click()
    cy.get('#val').should('have.text', 'true')
  })
})
