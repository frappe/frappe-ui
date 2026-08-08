import PhoneInput from './PhoneInput.vue'
import { ref } from 'vue'

describe('PhoneInput', () => {
  it('initializes with modelValue and updates when modelValue changes', () => {
    cy.mount(PhoneInput, {
      props: {
        modelValue: '+91-9876543210',
      },
    })

    cy.get('input[type=tel]').should('have.value', '9876543210')
    cy.contains('button', '+91').should('exist')
  })

  it('disables input and country picker when loading prop is true', () => {
    cy.mount(PhoneInput, {
      props: {
        loading: true,
        placeholder: 'Enter phone number',
      },
    })

    cy.get('button').should('be.disabled')
    cy.get('input[type=tel]').should('be.disabled')
  })

  it('closes country picker popover when a country is selected', () => {
    cy.mount(PhoneInput, {
      props: {
        default_country: 'in',
      },
    })

    // Open popover
    cy.get('button').click()
    cy.contains('United States').should('be.visible')

    // Click country item
    cy.contains('United States').click()

    // Popover content should be closed
    cy.contains('United States').should('not.exist')
    cy.contains('button', '+1').should('exist')
  })
})
