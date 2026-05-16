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

  describe('open-on-select (v1 behavior change)', () => {
    it('selecting a date does NOT close the popover', () => {
      // Regression guard for the v1 behavior change: clicking a date used
      // to auto-close the popover, stranding the embedded TimePicker.
      cy.mount(DateTimePicker, { props: { modelValue: '2025-06-15 12:00:00' } })
      cy.get('input').first().dblclick()
      cy.get('[role=dialog]').should('exist')
      cy.get('[aria-label="2025-06-16"]').click()
      cy.get('[role=dialog]').should('exist')
    })

    it('selecting a date moves focus into the time picker input', () => {
      cy.mount(DateTimePicker, { props: { modelValue: '2025-06-15 12:00:00' } })
      cy.get('input').first().dblclick()
      cy.get('[aria-label="2025-06-16"]').click()
      // The TimePicker is the second <input> inside the popover (the first
      // is the trigger). Focus should land there for keyboard continuation.
      cy.focused().should('match', 'input')
      cy.focused().invoke('attr', 'placeholder').should('match', /time/i)
    })

    it('selecting a date emits update:modelValue with combined date+time', () => {
      cy.mount(DateTimePicker, {
        props: {
          modelValue: '2025-06-15 12:00:00',
          'onUpdate:modelValue': cy.spy().as('onUpdate'),
        },
      })
      cy.get('input').first().dblclick()
      cy.get('[aria-label="2025-06-16"]').click()
      cy.get('@onUpdate').should((spy: any) => {
        const last = String(spy.lastCall.args[0])
        expect(last.startsWith('2025-06-16')).to.equal(true)
        expect(last).to.match(/12:00/)
      })
    })
  })

  it('minDateTime constrains the time picker for the boundary day', () => {
    cy.mount(DateTimePicker, {
      props: {
        modelValue: '2025-06-15 14:00:00',
        minDateTime: '2025-06-15 12:00:00',
        maxDateTime: '2025-06-20 18:00:00',
      },
    })
    cy.get('input').first().dblclick()
    // On 2025-06-15 — the min boundary day — the earliest visible option
    // should be 12:00 (anything earlier is filtered out by computedMinTime).
    cy.get('input').last().click()
    cy.get('[role=option]')
      .first()
      .invoke('text')
      .should('match', /^12[:0]/)
  })

  describe('keyboard navigation', () => {
    it('arrow-down on the input opens popover and focuses selected cell', () => {
      cy.mount(DateTimePicker, { props: { modelValue: '2025-06-15 12:00:00' } })
      cy.get('input').first().focus().type('{downArrow}')
      cy.get('[role=dialog]').should('exist')
      cy.focused().should('have.attr', 'data-value', '2025-06-15')
    })

    it('Enter on a focused cell selects it and keeps popover open', () => {
      cy.mount(DateTimePicker, {
        props: {
          modelValue: '2025-06-15 12:00:00',
          'onUpdate:modelValue': cy.spy().as('onUpdate'),
        },
      })
      cy.get('input').first().focus().type('{downArrow}')
      cy.focused().trigger('keydown', { key: 'ArrowRight' })
      cy.focused().trigger('keydown', { key: 'Enter' })
      cy.get('[role=dialog]').should('exist')
      cy.get('@onUpdate').should('have.been.called')
    })
  })

  it('cycle-calendar-view button switches to month view', () => {
    cy.mount(DateTimePicker)
    cy.get('input').first().dblclick()
    cy.get('[aria-label=cycle-calendar-view]').click()
    cy.get('[role=grid][aria-label="Select month"]').should('exist')
  })
})
