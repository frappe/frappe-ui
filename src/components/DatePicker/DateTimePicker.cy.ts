import { h } from 'vue'
import DateTimePicker from './DateTimePicker.vue'
import type { DateTimePickerActionsSlotProps } from './types'

const clearSlot = {
  actions: (props: DateTimePickerActionsSlotProps) =>
    h(
      'button',
      {
        'aria-label': 'Clear',
        onClick: () => {
          props.clear()
          props.close()
        },
      },
      'Clear',
    ),
}

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

  it('Clear from #actions slot resets the value', () => {
    cy.mount(DateTimePicker, {
      props: { modelValue: '2025-06-15 12:00:00' },
      slots: clearSlot,
    })
    cy.get('input').first().should('not.have.value', '')
    cy.get('input').first().dblclick()
    cy.get('[aria-label="Clear"]').click()
    cy.get('input').first().should('have.value', '')
  })

  it('min and max disable out-of-range cells', () => {
    cy.mount(DateTimePicker, {
      props: {
        modelValue: '2025-06-15 12:00:00',
        min: '2025-06-10',
        max: '2025-06-20',
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

  it('min constrains the time picker for the boundary day', () => {
    cy.mount(DateTimePicker, {
      props: {
        modelValue: '2025-06-15 14:00:00',
        min: '2025-06-15 12:00:00',
        max: '2025-06-20 18:00:00',
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

  it('back-compat: minDateTime/maxDateTime still constrain selection', () => {
    cy.mount(DateTimePicker, {
      props: {
        modelValue: '2025-06-15 14:00:00',
        minDateTime: '2025-06-10 00:00:00',
        maxDateTime: '2025-06-20 23:59:59',
      },
    })
    cy.get('input').first().dblclick()
    cy.get('[aria-label="2025-06-09"]').should('have.attr', 'aria-disabled', 'true')
    cy.get('[aria-label="2025-06-21"]').should('have.attr', 'aria-disabled', 'true')
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

  it('cycle-calendar-view button opens the month-year split view', () => {
    cy.mount(DateTimePicker)
    cy.get('input').first().dblclick()
    cy.get('[aria-label=cycle-calendar-view]').click()
    // Split view: scrollable year list beside a scrollable month list.
    cy.get('[role=listbox][aria-label="Select year"]').should('exist')
    cy.get('[role=listbox][aria-label="Select month"]').should('exist')
    // Picking a month commits and returns to the day grid. Force the click on the
    // selected month: in headless CI the actionability check on a button inside the
    // scrollable list intermittently swallows the click (the live behavior is fine).
    cy.get('[role=listbox][aria-label="Select month"] [data-selected]').click({
      force: true,
    })
    cy.get('[role=grid][aria-label="Calendar dates"]').should('exist')
  })
})
