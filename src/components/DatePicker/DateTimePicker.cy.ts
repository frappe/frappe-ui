import DateTimePicker from './DateTimePicker.vue'

describe('DateTimePicker', () => {
  it('renders', () => {
    cy.mount(DateTimePicker)

    cy.get('[role=dialog]').should('not.exist')
    cy.get('input').first().dblclick()
    cy.get('[role=dialog]').should('exist')
  })

  it('has accessible cycle-calendar-view label', () => {
    // Regression guard for the v1 audit issue: DateTimePicker's month/year
    // cycle button must expose aria-label="cycle-calendar-view" like the
    // other two pickers.
    cy.mount(DateTimePicker)
    cy.get('input').first().dblclick()
    cy.get('[aria-label=cycle-calendar-view]').should('exist')
  })

  it('Now button selects current date and time', () => {
    cy.mount(DateTimePicker)
    cy.get('input').first().dblclick()
    cy.get('[role=dialog]').should('exist')
    cy.get('[aria-label="Now"]').click()
    cy.get('input').first().should('not.have.value', '')
  })

  it('Clear button resets the value', () => {
    // Pre-seed a value so the Clear button is rendered immediately
    // (the footer Clear button is gated on selectedDate being truthy).
    cy.mount(DateTimePicker, {
      props: { modelValue: '2025-06-15 12:00:00' },
    })
    cy.get('input').first().should('not.have.value', '')
    cy.get('input').first().dblclick()
    cy.get('[aria-label="Clear"]').click()
    cy.get('input').first().should('have.value', '')
  })

  it('minDate disables out-of-range cells', () => {
    cy.mount(DateTimePicker, {
      props: {
        modelValue: '2025-06-15 12:00:00',
        minDate: '2025-06-10',
        maxDate: '2025-06-20',
      },
    })
    cy.get('input').first().dblclick()
    cy.get('[aria-label="2025-06-09"]').should('have.attr', 'aria-disabled', 'true')
    cy.get('[aria-label="2025-06-21"]').should('have.attr', 'aria-disabled', 'true')
    cy.get('[aria-label="2025-06-15"]').should('not.have.attr', 'aria-disabled')
  })

  it('exposes open() method', () => {
    cy.mount(DateTimePicker).then(({ component }) => {
      cy.get('[role=dialog]').should('not.exist')
      cy.then(() => (component as any).open())
      cy.get('[role=dialog]').should('exist')
    })
  })

  it('disabled prop disables the trigger', () => {
    cy.mount(DateTimePicker, { props: { disabled: true } })
    cy.get('input').first().should('have.attr', 'disabled')
  })

  it('emits v-model on date+time change', () => {
    cy.mount(DateTimePicker, {
      props: {
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })
    cy.get('input').first().dblclick()
    cy.get('[aria-label="Now"]').click()
    cy.get('@onUpdate').should('have.been.called')
  })
})
