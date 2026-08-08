import PhoneInput from './PhoneInput.vue'
import { _resetWarnDeprecated } from '../../utils/warnDeprecated'

describe('PhoneInput', () => {
  beforeEach(() => {
    _resetWarnDeprecated()
  })

  it('renders with initial modelValue and parses country + number', () => {
    cy.mount(PhoneInput, {
      props: {
        modelValue: '+91-9876543210',
      },
    })

    cy.get('input[type="tel"]').should('have.value', '9876543210')

    cy.get('button[type="button"]').should('contain.text', '+91')
  })

  it('disables the country button and number input when loading is true', () => {
    cy.mount(PhoneInput, {
      props: {
        loading: true,
      },
    })

    cy.get('button[type="button"]').should('be.disabled')
    cy.get('input[type="tel"]').should('be.disabled')
  })

  it('closes the country picker popover after a country is selected', () => {
    cy.mount(PhoneInput, {
      props: {
        default_country: 'in',
      },
    })

    cy.get('[data-slot="content"]').should('not.exist')

    cy.get('button[type="button"]').click()

    cy.get('[data-slot="content"]').should('exist')

    cy.contains('[data-slot="content"] div', 'United States')
      .should('be.visible')
      .click()

    cy.get('[data-slot="content"]').should('not.exist')
  })
})
