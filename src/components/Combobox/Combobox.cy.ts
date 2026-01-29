import Combobox from './Combobox.vue'
import { h, ref } from 'vue'

const options = ['Apple', 'Mango', 'Cherry']

const VModelComponent = {
  setup() {
    const val = ref<string | null>(null)
    return { val }
  },

  render() {
    return h('div', {}, [
      h('div', { id: 'val' }, this.val ?? 'null'),
      h(Combobox, {
        options,
        modelValue: this.val,
        'onUpdate:modelValue': (x: string | null) => (this.val = x),
      }),
    ])
  },
}

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
    cy.mount(VModelComponent)

    cy.get('#val').should('have.text', 'null')

    cy.get('[aria-label="Show popup"]').click()
    cy.get('[role=option]:first').click()

    cy.get('#val').should('have.text', 'Apple')
  })
})
