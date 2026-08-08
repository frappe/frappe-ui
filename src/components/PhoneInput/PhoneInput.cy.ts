import PhoneInput from './PhoneInput.vue'
import { _resetWarnDeprecated } from '../../utils/warnDeprecated'

describe('PhoneInput', () => {
  beforeEach(() => {
    _resetWarnDeprecated()
  })

  it('renders with initial modelValue and shows correct country + number', () => {
    cy.mount(PhoneInput, {
      props: {
        modelValue: '+91-9876543210',
      },
    })

    cy.get('input[type=tel]').should('have.value', '9876543210')
    cy.get('button').should('contain.text', '+91')
  })

  it('disables button and input when loading prop is true', () => {
    cy.mount(PhoneInput, {
      props: {
        loading: true,
      },
    })

    cy.get('button').should('be.disabled')
    cy.get('input[type=tel]').should('be.disabled')
  })

  it('closes country popover after selecting a country', () => {
    cy.mount(PhoneInput)

    // Open popover via legacy #target button
    cy.get('button').click()

    // Country list is visible
    cy.get('[data-slot="content"]').should('exist')

    // Click United States
    cy.contains('United States').click()

    // Popover closes
    cy.get('[data-slot="content"]').should('not.exist')

    // Button now shows US dial code
    cy.get('button').should('contain.text', '+1')
  })
})
