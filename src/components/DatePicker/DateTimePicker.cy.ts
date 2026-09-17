import { h } from 'vue'
import { dayjs } from '../../utils/dayjs'
import DateTimePicker from './DateTimePicker.vue'
import type {
  DateTimePickerActionsSlotProps,
  DatePickerTriggerSlotProps,
} from './types'

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

  it('Now button selects current date and time, and closes', () => {
    cy.mount(DateTimePicker, {
      props: { 'onUpdate:modelValue': cy.spy().as('onUpdate') },
    })
    cy.get('input').first().dblclick()
    cy.get('[role=dialog]').should('exist')
    cy.get('[aria-label="Now"]').click()
    cy.get('[role=dialog]').should('not.exist')
    cy.get('input').first().should('not.have.value', '')
    cy.get('@onUpdate').then((spy) => {
      // One press, one emit — no transient midnight value on the way.
      expect((spy as any).callCount).to.equal(1)
      const emitted = (spy as any).lastCall.args[0] as string
      // The current time, not the midnight a plain date selection would give.
      expect(dayjs(emitted).diff(dayjs(), 'minute')).to.be.closeTo(0, 1)
    })
  })

  it('Now emits once with the current time when today is already selected', () => {
    const today = dayjs().format('YYYY-MM-DD')
    cy.mount(DateTimePicker, {
      props: {
        modelValue: `${today} 00:00:00`,
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })
    cy.get('input').first().dblclick()
    cy.get('[aria-label="Now"]').click()
    cy.get('[role=dialog]').should('not.exist')
    cy.get('@onUpdate').then((spy) => {
      expect((spy as any).callCount).to.equal(1)
      const emitted = (spy as any).lastCall.args[0] as string
      expect(emitted.startsWith(today)).to.equal(true)
      expect(dayjs(emitted).diff(dayjs(), 'minute')).to.be.closeTo(0, 1)
    })
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
    cy.get('[aria-label="2025-06-09"]').should(
      'have.attr',
      'aria-disabled',
      'true',
    )
    cy.get('[aria-label="2025-06-21"]').should(
      'have.attr',
      'aria-disabled',
      'true',
    )
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
  })

  // `open` and `setOpen` are the public slot contract, so a rename here is a
  // silent break in consumer templates. Popover carries the same test.
  it('exposes open and setOpen to the #trigger slot', () => {
    cy.mount(DateTimePicker, {
      props: { modelValue: '2025-06-15 10:30:00' },
      slots: {
        trigger: ({ open, setOpen }: DatePickerTriggerSlotProps) =>
          h(
            'button',
            {
              'data-cy': 'trigger',
              class: open ? 'is-open' : 'is-closed',
              onClick: () => setOpen(!open),
            },
            open ? 'Close' : 'Open',
          ),
      },
    })

    cy.get('[data-cy="trigger"]')
      .should('have.class', 'is-closed')
      .and('have.text', 'Open')
    cy.get('[role=dialog]').should('not.exist')

    cy.get('[data-cy="trigger"]').click()
    cy.get('[role=dialog]').should('exist')
    cy.get('[data-cy="trigger"]')
      .should('have.class', 'is-open')
      .and('have.text', 'Close')
  })

  // INP-Q5 (ADR-0012).
  describe('template ref', () => {
    it('open(), close() and focus() drive the picker', () => {
      let vm: any
      cy.mount(DateTimePicker).then((mounted: any) => {
        vm = mounted.component ?? mounted.wrapper?.vm ?? mounted
      })

      cy.get('[role=dialog]').should('not.exist')
      cy.then(() => vm?.open?.())
      cy.get('[role=dialog]').should('exist')
      cy.then(() => vm?.close?.())
      cy.get('[role=dialog]').should('not.exist')

      cy.then(() => vm?.focus?.())
      cy.get('input').first().should('be.focused')
    })
  })

  // A parent that mounts a picker with `open` already true gets an open panel.
  // The prop is only watched for changes, so the initial value used to be
  // dropped (plans/001, step 1).
  describe('initial open state', () => {
    it('mounts open when `open` starts true', () => {
      cy.mount(DateTimePicker, {
        props: { modelValue: '2025-06-15 10:30:00', open: true },
      })

      cy.get('[role=dialog]').should('exist')
      // The panel shows the bound date and time, not an unseeded month.
      cy.get('[aria-label=cycle-calendar-view]').should('have.text', 'Jun 2025')
      cy.get('[aria-label="2025-06-15"]').should(
        'have.attr',
        'aria-selected',
        'true',
      )
      cy.get('input').first().should('have.value', '2025-06-15 10:30:00')
      // The nested TimePicker holds the time half of the value.
      cy.get('input').eq(1).should('have.value', '10:30')
      // A panel that is merely displayed is not open: the trigger has to point
      // at it too.
      cy.get('input').first().should('have.attr', 'aria-expanded', 'true')
      cy.get('input')
        .first()
        .invoke('attr', 'aria-controls')
        .should('be.a', 'string')
        .then((panelId) => {
          cy.get(`#${panelId}`).should('have.attr', 'role', 'dialog')
        })
    })

    it('stays closed when `open` starts false', () => {
      cy.mount(DateTimePicker, {
        props: { modelValue: '2025-06-15 10:30:00', open: false },
      })
      cy.get('[role=dialog]').should('not.exist')
      cy.get('input').first().should('have.attr', 'aria-expanded', 'false')
    })

    it('stays closed when `open` is omitted', () => {
      cy.mount(DateTimePicker, {
        props: { modelValue: '2025-06-15 10:30:00' },
      })
      cy.get('[role=dialog]').should('not.exist')
    })

    it('follows the parent from false to true and back', () => {
      cy.mount(DateTimePicker, {
        props: { modelValue: '2025-06-15 10:30:00', open: false },
      }).then(({ wrapper }) => {
        cy.get('[role=dialog]').should('not.exist')
        cy.then(() => wrapper.setProps({ open: true }))
        cy.get('[role=dialog]').should('exist')
        cy.then(() => wrapper.setProps({ open: false }))
        cy.get('[role=dialog]').should('not.exist')
      })
    })

    it('still opens from the trigger with no `open` bound', () => {
      cy.mount(DateTimePicker, {
        props: { modelValue: '2025-06-15 10:30:00' },
      })
      cy.get('input').first().click()
      cy.get('[role=dialog]').should('exist')
    })

    it('emits no `update:open` while mounting open', () => {
      cy.mount(DateTimePicker, {
        props: {
          modelValue: '2025-06-15 10:30:00',
          open: true,
          'onUpdate:open': cy.spy().as('onUpdateOpen'),
        },
      })

      cy.get('[role=dialog]').should('exist')
      cy.get('@onUpdateOpen').should('not.have.been.called')

      // The first emit is the picker's own close, so nothing looped on mount.
      cy.get('[aria-label="Now"]').click()
      cy.get('[role=dialog]').should('not.exist')
      cy.get('@onUpdateOpen').should('have.been.calledOnceWith', false)
    })

    // Mounting open follows no gesture, so nothing inside the panel takes
    // focus — the default trigger does not either.
    it('moves no focus into the panel when mounting open with a custom #trigger', () => {
      cy.mount(DateTimePicker, {
        props: { modelValue: '2025-06-15 10:30:00', open: true },
        slots: {
          trigger: () => h('button', { 'data-cy': 'pick' }, 'Pick'),
        },
      })

      cy.get('[role=dialog]').should('exist')
      cy.get('[aria-label="2025-06-15"]').should('exist')
      cy.document().then((doc) => {
        expect(
          (doc.activeElement as HTMLElement | null)?.closest('[role=dialog]'),
        ).to.equal(null)
      })
    })

    it('moves focus into the calendar on a later open from a custom #trigger', () => {
      cy.mount(DateTimePicker, {
        props: { modelValue: '2025-06-15 10:30:00' },
        slots: {
          trigger: ({ open, setOpen }: DatePickerTriggerSlotProps) =>
            h(
              'button',
              { 'data-cy': 'pick', onClick: () => setOpen(!open) },
              'Pick',
            ),
        },
      })

      cy.get('[data-cy=pick]').click()
      cy.get('[role=dialog]').should('exist')
      cy.focused().should('have.attr', 'data-value', '2025-06-15')
    })
  })
})
