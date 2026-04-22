import FormControl from './FormControl.vue'
import { h } from 'vue'

describe('FormControl', () => {
  it('renders a text input with label and description', () => {
    cy.mount(FormControl, {
      props: {
        label: 'Title',
        description: 'Shown below the input',
        placeholder: 'Enter a title',
        required: true,
      },
    })

    cy.contains('label', 'Title').should('exist')
    cy.get('input')
      .should('have.attr', 'placeholder', 'Enter a title')
      .and('have.attr', 'required')
    cy.contains('Shown below the input').should('exist')
  })

  it('renders a textarea when type is textarea', () => {
    cy.mount(FormControl, {
      props: {
        type: 'textarea',
        label: 'Notes',
        modelValue: 'Hello',
      },
    })

    cy.contains('label', 'Notes').should('exist')
    cy.get('textarea').should('have.value', 'Hello')
  })

  it('renders a checkbox when type is checkbox', () => {
    cy.mount(FormControl, {
      props: {
        type: 'checkbox',
        label: 'Accept terms',
        modelValue: true,
      },
    })

    cy.get('input[type="checkbox"]').should('be.checked')
    cy.contains('Accept terms').should('exist')
  })

  it('passes prefix and suffix slots through to the text input', () => {
    cy.mount(FormControl, {
      props: {
        label: 'Search',
      },
      slots: {
        prefix: () => h('span', { 'data-cy': 'prefix' }, 'P'),
        suffix: () => h('span', { 'data-cy': 'suffix' }, 'S'),
      },
    })

    cy.get('input')
      .parent()
      .within(() => {
        cy.get('[data-cy="prefix"]').should('exist')
        cy.get('[data-cy="suffix"]').should('exist')
      })
  })
})
