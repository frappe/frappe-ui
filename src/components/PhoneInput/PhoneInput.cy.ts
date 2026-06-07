import PhoneInput from './PhoneInput.vue'

function stubTimezone(timeZone: string) {
  cy.stub(Intl.DateTimeFormat.prototype, 'resolvedOptions').returns({
    timeZone,
  } as Intl.ResolvedDateTimeFormatOptions)
}

describe('PhoneInput', () => {
  it('typing emits the joined "<isd>-<number>" format, empty number emits ""', () => {
    cy.mount(PhoneInput, {
      props: {
        defaultCountry: 'in',
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })

    cy.get('input[type=tel]').type('9876543210')
    cy.get('@onUpdate').should('have.been.calledWith', '+91-9876543210')

    cy.get('input[type=tel]').clear()
    cy.get('@onUpdate').should('have.been.calledWith', '')
  })

  it('values carrying an ISD re-route through the parser', () => {
    cy.mount(PhoneInput, {
      props: {
        defaultCountry: 'in',
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })

    // Typed: "+81" flips the country, the rest stays in the input.
    cy.get('input[type=tel]').type('+819012345678')
    cy.get('[data-slot="country"]').should(
      'have.attr',
      'aria-label',
      'Country: Japan',
    )
    cy.get('input[type=tel]').should('have.value', '9012345678')
    cy.get('@onUpdate').should('have.been.calledWith', '+81-9012345678')

    // Pasted in one go: the longest ISD wins — Bahamas (+1242), not +1.
    cy.get('input[type=tel]').clear().invoke('val', '+12425550100')
    cy.get('input[type=tel]').trigger('input')
    cy.get('[data-slot="country"]').should(
      'have.attr',
      'aria-label',
      'Country: Bahamas',
    )
    cy.get('@onUpdate').should('have.been.calledWith', '+1242-5550100')
  })

  it('external model values parse into country + number without echoing back', () => {
    cy.mount(PhoneInput, {
      props: {
        modelValue: '+91-9876543210',
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })

    cy.get('[data-slot="country"]').should(
      'have.attr',
      'aria-label',
      'Country: India',
    )
    cy.contains('+91').should('exist')
    cy.get('input[type=tel]').should('have.value', '9876543210')

    cy.then(() => {
      Cypress.vueWrapper.setProps({ modelValue: '+81-9012345678' })
    })
    cy.get('[data-slot="country"]').should(
      'have.attr',
      'aria-label',
      'Country: Japan',
    )
    cy.get('input[type=tel]').should('have.value', '9012345678')

    // Echo guard: parsing a model update never re-emits it.
    cy.get('@onUpdate').should('not.have.been.called')
  })

  it('picking a country from the dropdown re-emits and focuses the number input', () => {
    cy.mount(PhoneInput, {
      props: {
        defaultCountry: 'in',
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })

    cy.get('input[type=tel]').type('9876543210')
    cy.get('[data-slot="country"]').click()
    cy.get('input[placeholder="Search country"]').type('japan')
    cy.get('[role="option"]').should('have.length', 1).click()

    cy.get('[data-slot="country"]').should(
      'have.attr',
      'aria-label',
      'Country: Japan',
    )
    cy.get('@onUpdate').should('have.been.calledWith', '+81-9876543210')
    cy.get('input[type=tel]').should('have.focus')
  })

  it('defaultCountry accepts ISO2, dial code (with or without +), or name', () => {
    const cases: [string, string][] = [
      ['us', 'United States'],
      ['+91', 'India'],
      ['91', 'India'],
      ['Japan', 'Japan'],
    ]
    for (const [identifier, name] of cases) {
      cy.mount(PhoneInput, { props: { defaultCountry: identifier } })
      cy.get('[data-slot="country"]').should(
        'have.attr',
        'aria-label',
        `Country: ${name}`,
      )
    }

    // Unresolvable prop + unknown timezone → no country, globe placeholder.
    stubTimezone('Etc/UTC')
    cy.mount(PhoneInput, { props: { defaultCountry: 'zz' } })
    cy.get('[data-slot="country"]')
      .should('have.attr', 'aria-label', 'Select country')
      .find('.lucide-globe')
      .should('exist')
  })

  it('guesses the country from the system timezone when defaultCountry is absent', () => {
    stubTimezone('Asia/Tokyo')
    cy.mount(PhoneInput)
    cy.get('[data-slot="country"]').should(
      'have.attr',
      'aria-label',
      'Country: Japan',
    )
  })

  it('backspace on an empty number clears the country', () => {
    cy.mount(PhoneInput, { props: { defaultCountry: 'in' } })
    cy.get('input[type=tel]').type('{backspace}')
    cy.get('[data-slot="country"]')
      .should('have.attr', 'aria-label', 'Select country')
      .find('.lucide-globe')
      .should('exist')
  })

  it('disabled blocks both the picker and the input', () => {
    cy.mount(PhoneInput, {
      props: { disabled: true, modelValue: '+91-9876543210' },
    })

    cy.get('input[type=tel]').should('be.disabled')
    cy.get('[data-slot="country"]').should('be.disabled')
    cy.get('[data-slot="country"]').click({ force: true })
    cy.get('[role="option"]').should('not.exist')
  })
})
