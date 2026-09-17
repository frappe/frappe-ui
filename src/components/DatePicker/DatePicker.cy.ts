import { defineComponent, h, ref } from 'vue'
import DatePicker from './DatePicker.vue'
import type {
  DatePickerActionsSlotProps,
  DatePickerTriggerSlotProps,
} from './types'

// Slot factory used by tests that need a sidebar Clear button.
// The new #actions slot renders to the left of the calendar; consumers
// who want an in-popover Clear render one inside it via `clear()`.
const clearSlot = {
  actions: (props: DatePickerActionsSlotProps) =>
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

const monthsLabels = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const currentYear = new Date().getFullYear()
const currentMonth = monthsLabels[new Date().getMonth()]

const pad = (n: number) => String(n).padStart(2, '0')
const getTodaysDate = () => {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

describe('DatePicker', () => {
  it('renders', () => {
    cy.mount(DatePicker)

    cy.get('[role=dialog]').should('not.exist')
    cy.get('input').dblclick()
    cy.get('[role=dialog]').should('exist')
  })

  it('action btns', () => {
    cy.mount(DatePicker)
    cy.get('input').dblclick()

    const currMonthIndex = monthsLabels.indexOf(currentMonth)
    const prevMonthIndex = currentMonth == 'Jan' ? 11 : currMonthIndex - 1
    const nextMonthIndex = currentMonth == 'Dec' ? 0 : currMonthIndex + 1
    const prevYear = currentMonth == 'Jan' ? currentYear - 1 : currentYear
    const nextYear = currentMonth == 'Dec' ? currentYear + 1 : currentYear

    cy.get('[aria-label=previous]').click()
    cy.get('[aria-label=cycle-calendar-view]').should(
      'have.text',
      monthsLabels[prevMonthIndex] + ' ' + prevYear,
    )

    cy.get('[aria-label=next]').dblclick()

    cy.get('[aria-label=cycle-calendar-view]').should(
      'have.text',
      monthsLabels[nextMonthIndex] + ' ' + nextYear,
    )
  })

  it('today button selects today and closes popover', () => {
    cy.mount(DatePicker)
    cy.get('input').dblclick()
    cy.get('[role=dialog]').should('exist')
    cy.get('[aria-label="Today"]').click()
    cy.get('[role=dialog]').should('not.exist')
    cy.get('input').should('have.value', getTodaysDate())
  })

  it('clicking the already-selected date closes the popover', () => {
    cy.mount(DatePicker, { props: { modelValue: '2025-06-15' } })
    cy.get('input').dblclick()
    cy.get('[role=dialog]').should('exist')
    cy.get('[aria-label="2025-06-15"]').click()
    cy.get('[role=dialog]').should('not.exist')
  })

  it('today button closes the popover when today is already selected', () => {
    cy.mount(DatePicker, { props: { modelValue: getTodaysDate() } })
    cy.get('input').dblclick()
    cy.get('[role=dialog]').should('exist')
    cy.get('[aria-label="Today"]').click()
    cy.get('[role=dialog]').should('not.exist')
  })

  it('clear slot prop removes the value', () => {
    // Consumer renders Clear in the #actions sidebar; verifies clear() + close() wiring.
    cy.mount(DatePicker, {
      props: { modelValue: '2025-06-15' },
      slots: clearSlot,
    })
    cy.get('input').should('have.value', '2025-06-15')
    cy.get('input').dblclick()
    cy.get('[aria-label="Clear"]').click()
    cy.get('[role=dialog]').should('not.exist')
    cy.get('input').should('have.value', '')
  })

  it('renders #actions slot to the left of the calendar', () => {
    cy.mount(DatePicker, { slots: clearSlot })
    cy.get('input').dblclick()
    cy.get('[data-slot="actions"]').should('exist')
  })

  it('keepOpen', () => {
    cy.mount(DatePicker, {
      props: { keepOpen: false },
    })

    cy.get('input').dblclick()
    cy.get('[role=dialog]').should('exist')
    cy.get('[aria-label="Today"]').click()
    cy.get('[role=dialog]').should('not.exist')

    cy.mount(DatePicker, {
      props: { keepOpen: true },
    })

    cy.get('input').dblclick()
    cy.get('[role=dialog]').should('exist')
    cy.get('[aria-label="Today"]').click()
    cy.get('[role=dialog]').should('exist')
  })

  it('v-model', () => {
    cy.mount(DatePicker, {
      props: {
        onChange: cy.spy().as('onChange'),
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })

    cy.get('input').dblclick()

    cy.get('[aria-label="Today"]').click()
    cy.get('@onUpdate').should('have.been.calledWith', getTodaysDate())
    cy.get('@onChange').should('have.been.calledWith', getTodaysDate())
  })

  it('keepOpen prop', () => {
    cy.mount(DatePicker, { props: { keepOpen: true } })
    cy.get('input').dblclick()
    cy.get('[role=dialog]').should('exist')
    cy.get('[aria-label="Today"]').click()
    cy.get('[role=dialog]').should('exist')
  })

  it('typeable: false prevents typing but still opens popover', () => {
    cy.mount(DatePicker, { props: { typeable: false } })
    cy.get('input').should('have.attr', 'readonly')
    cy.get('input').dblclick()
    cy.get('[role=dialog]').should('exist')
  })

  it('min and max disable out-of-range cells', () => {
    cy.mount(DatePicker, {
      props: {
        modelValue: '2025-06-15',
        min: '2025-06-10',
        max: '2025-06-20',
      },
    })
    cy.get('input').dblclick()
    cy.get('[role=dialog]').should('exist')
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

  it('isDateUnavailable callback disables matching cells', () => {
    cy.mount(DatePicker, {
      props: {
        modelValue: '2025-06-15',
        // disable weekends in the rendered month
        isDateUnavailable: (d: any) => d.day() === 0 || d.day() === 6,
      },
    })
    cy.get('input').dblclick()
    // 2025-06-14 is a Saturday, 2025-06-15 is a Sunday, 2025-06-16 is a Monday
    cy.get('[aria-label="2025-06-14"]').should(
      'have.attr',
      'aria-disabled',
      'true',
    )
    cy.get('[aria-label="2025-06-15"]').should(
      'have.attr',
      'aria-disabled',
      'true',
    )
    cy.get('[aria-label="2025-06-16"]').should('not.have.attr', 'aria-disabled')
  })

  it('exposes open() method', () => {
    cy.mount(DatePicker).then(({ component }) => {
      cy.get('[role=dialog]').should('not.exist')
      cy.then(() => (component as any).open())
      cy.get('[role=dialog]').should('exist')
    })
  })

  it('disabled prop disables the trigger', () => {
    cy.mount(DatePicker, { props: { disabled: true } })
    cy.get('input').should('have.attr', 'disabled')
  })

  it('re-clicking the input keeps the popover open', () => {
    // Regression guard for commit 89668bb8 — clicking the same input that
    // already has the popover open used to setOpen it closed.
    cy.mount(DatePicker)
    cy.get('input').click()
    cy.get('[role=dialog]').should('exist')
    cy.get('input').click()
    cy.get('[role=dialog]').should('exist')
  })

  it('typed input commits on Enter', () => {
    cy.mount(DatePicker, {
      props: {
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })
    cy.get('input').click()
    cy.get('input').type('2025-06-15{enter}')
    cy.get('input').should('have.value', '2025-06-15')
    cy.get('@onUpdate').should('have.been.calledWith', '2025-06-15')
  })

  it('typed unavailable date is rejected and reverts', () => {
    cy.mount(DatePicker, {
      props: {
        modelValue: '2025-06-15',
        min: '2025-06-10',
        max: '2025-06-20',
      },
    })
    cy.get('input').should('have.value', '2025-06-15')
    cy.get('input').click()
    cy.get('input').clear().type('2025-06-25{enter}')
    cy.get('input').should('have.value', '2025-06-15')
  })

  describe('#trigger slot props', () => {
    // These two names are the public contract, so a rename here is a silent
    // break in consumer templates. Popover carries the same test
    // (Popover.cy.ts, "exposes reactive open state to the #trigger slot").
    it('exposes open and setOpen to the #trigger slot', () => {
      cy.mount(DatePicker, {
        props: { modelValue: '2025-06-15' },
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

    it('setOpen sets the open state when passed a boolean', () => {
      // Same signature as Popover's `setOpen`: a boolean sets, so `setOpen(true)`
      // on an open picker is a no-op rather than a close. Called directly
      // because a `#trigger` click is not auto-wired here — the slot owns it.
      let setOpen: DatePickerTriggerSlotProps['setOpen'] | null = null

      cy.mount(DatePicker, {
        props: { modelValue: '2025-06-15' },
        slots: {
          trigger: (props: DatePickerTriggerSlotProps) => {
            setOpen = props.setOpen
            return h('button', { 'data-cy': 'trigger' }, 'Open')
          },
        },
      })

      cy.then(() => setOpen?.(true))
      cy.get('[role=dialog]').should('exist')

      // A flip would close it here. Setting must be idempotent.
      cy.then(() => setOpen?.(true))
      cy.get('[role=dialog]').should('exist')

      cy.then(() => setOpen?.(false))
      cy.get('[role=dialog]').should('not.exist')
    })
  })

  describe('keyboard navigation', () => {
    it('arrow-down on the input opens popover and moves focus into the grid', () => {
      cy.mount(DatePicker, { props: { modelValue: '2025-06-15' } })
      cy.get('input').focus().type('{downArrow}')
      cy.get('[role=dialog]').should('exist')
      cy.focused().should('have.attr', 'data-value', '2025-06-15')
    })

    it('arrow keys move focus by ±1 day and ±1 week', () => {
      cy.mount(DatePicker, { props: { modelValue: '2025-06-15' } })
      cy.get('input').focus().type('{downArrow}')
      cy.focused().trigger('keydown', { key: 'ArrowRight' })
      cy.focused().should('have.attr', 'data-value', '2025-06-16')
      cy.focused().trigger('keydown', { key: 'ArrowDown' })
      cy.focused().should('have.attr', 'data-value', '2025-06-23')
      cy.focused().trigger('keydown', { key: 'ArrowLeft' })
      cy.focused().should('have.attr', 'data-value', '2025-06-22')
      cy.focused().trigger('keydown', { key: 'ArrowUp' })
      cy.focused().should('have.attr', 'data-value', '2025-06-15')
    })

    it('Home/End jump to week edges', () => {
      // 2025-06-15 is a Sunday → Home stays on 06-15, End jumps to 06-21 (Saturday)
      cy.mount(DatePicker, { props: { modelValue: '2025-06-18' } })
      cy.get('input').focus().type('{downArrow}')
      cy.focused().trigger('keydown', { key: 'End' })
      cy.focused().should('have.attr', 'data-value', '2025-06-21')
      cy.focused().trigger('keydown', { key: 'Home' })
      cy.focused().should('have.attr', 'data-value', '2025-06-15')
    })

    it('PageUp/PageDown shift by one month, Shift+PageDown shifts by one year', () => {
      cy.mount(DatePicker, { props: { modelValue: '2025-06-15' } })
      cy.get('input').focus().type('{downArrow}')
      cy.focused().trigger('keydown', { key: 'PageDown' })
      cy.focused().should('have.attr', 'data-value', '2025-07-15')
      cy.focused().trigger('keydown', { key: 'PageUp' })
      cy.focused().should('have.attr', 'data-value', '2025-06-15')
      cy.focused().trigger('keydown', { key: 'PageDown', shiftKey: true })
      cy.focused().should('have.attr', 'data-value', '2026-06-15')
    })

    it('Enter and Space select the focused cell', () => {
      cy.mount(DatePicker, {
        props: {
          modelValue: '2025-06-15',
          'onUpdate:modelValue': cy.spy().as('onUpdate'),
        },
      })
      cy.get('input').focus().type('{downArrow}')
      cy.focused().trigger('keydown', { key: 'ArrowRight' })
      cy.focused().trigger('keydown', { key: 'Enter' })
      cy.get('@onUpdate').should('have.been.calledWith', '2025-06-16')
    })

    it('arrow navigation skips disabled dates', () => {
      cy.mount(DatePicker, {
        props: {
          modelValue: '2025-06-15',
          // Disable 2025-06-16 only — pressing → from 15 should skip to 17.
          isDateUnavailable: (d: any) =>
            d.format('YYYY-MM-DD') === '2025-06-16',
        },
      })
      cy.get('input').focus().type('{downArrow}')
      cy.focused().trigger('keydown', { key: 'ArrowRight' })
      cy.focused().should('have.attr', 'data-value', '2025-06-17')
    })

    it('crossing month boundary advances the view', () => {
      // 2025-06-30 is the last day of June; → should land on 2025-07-01 in July's grid.
      cy.mount(DatePicker, { props: { modelValue: '2025-06-30' } })
      cy.get('input').focus().type('{downArrow}')
      cy.focused().trigger('keydown', { key: 'ArrowRight' })
      cy.focused().should('have.attr', 'data-value', '2025-07-01')
      cy.get('[aria-label=cycle-calendar-view]').should(
        'contain.text',
        'Jul 2025',
      )
    })
  })

  // INP-Q5 / INP-Q10 (ADR-0012).
  describe('template ref and picker hooks', () => {
    it('open() and close() drive the panel', () => {
      let vm: any
      cy.mount(DatePicker).then((mounted: any) => {
        vm = mounted.component ?? mounted.wrapper?.vm ?? mounted
      })

      cy.get('[role=dialog]').should('not.exist')
      cy.then(() => vm?.open?.())
      cy.get('[role=dialog]').should('exist')
      cy.then(() => vm?.close?.())
      cy.get('[role=dialog]').should('not.exist')
    })

    it('open() is a no-op while disabled', () => {
      let vm: any
      cy.mount(DatePicker, { props: { disabled: true } }).then(
        (mounted: any) => {
          vm = mounted.component ?? mounted.wrapper?.vm ?? mounted
        },
      )

      cy.then(() => vm?.open?.())
      cy.get('[role=dialog]').should('not.exist')
    })

    it('focus() focuses the trigger input', () => {
      cy.mount(DatePicker).then((mounted: any) => {
        const vm = mounted.component ?? mounted.wrapper?.vm ?? mounted
        vm?.focus?.()
      })

      cy.get('input').should('be.focused')
    })

    it('marks the input and the chevron with the picker hooks', () => {
      cy.mount(DatePicker)

      cy.get('input')
        .should('have.attr', 'data-slot', 'control')
        .and('have.attr', 'role', 'combobox')
        .and('have.attr', 'aria-haspopup', 'dialog')
        .and('have.attr', 'aria-expanded', 'false')
      cy.get('[data-slot="chevron"]').should('exist')
      // INP-Q10: a picker's input is a `control`, not a `trigger`. The
      // `trigger` marker belongs to Popover's own wrapper, so assert the input
      // itself never carries it.
      cy.get('input').should('not.have.attr', 'data-slot', 'trigger')

      cy.get('input').click()
      cy.get('input').should('have.attr', 'aria-expanded', 'true')
    })

    it('points aria-controls at the open panel', () => {
      cy.mount(DatePicker)

      cy.get('input').should('not.have.attr', 'aria-controls')

      cy.get('input').click()
      cy.get('input')
        .invoke('attr', 'aria-controls')
        .should('be.a', 'string')
        .then((panelId) => {
          // The id names the popover's own `role="dialog"` element. No wrapper
          // node sits between the panel shell and the calendar.
          cy.get(`#${panelId}`)
            .should('have.attr', 'role', 'dialog')
            .find('[aria-label="Today"]')
            .should('exist')
        })
    })
  })

  // A parent that mounts a picker with `open` already true gets an open panel.
  // The prop is only watched for changes, so the initial value used to be
  // dropped (plans/001, step 1).
  describe('initial open state', () => {
    it('mounts open when `open` starts true', () => {
      cy.mount(DatePicker, { props: { modelValue: '2025-06-15', open: true } })

      cy.get('[role=dialog]').should('exist')
      // The panel shows the bound value, not an unseeded month.
      cy.get('[aria-label=cycle-calendar-view]').should('have.text', 'Jun 2025')
      cy.get('[aria-label="2025-06-15"]').should(
        'have.attr',
        'aria-selected',
        'true',
      )
      cy.get('input').should('have.value', '2025-06-15')
      // A panel that is merely displayed is not open: the trigger has to point
      // at it too.
      cy.get('input').should('have.attr', 'aria-expanded', 'true')
      cy.get('input')
        .invoke('attr', 'aria-controls')
        .should('be.a', 'string')
        .then((panelId) => {
          cy.get(`#${panelId}`).should('have.attr', 'role', 'dialog')
        })
    })

    it('stays closed when `open` starts false', () => {
      cy.mount(DatePicker, { props: { modelValue: '2025-06-15', open: false } })
      cy.get('[role=dialog]').should('not.exist')
      cy.get('input').should('have.attr', 'aria-expanded', 'false')
    })

    it('stays closed when `open` is omitted', () => {
      cy.mount(DatePicker, { props: { modelValue: '2025-06-15' } })
      cy.get('[role=dialog]').should('not.exist')
    })

    it('follows the parent from false to true and back', () => {
      cy.mount(DatePicker, {
        props: { modelValue: '2025-06-15', open: false },
      }).then(({ wrapper }) => {
        cy.get('[role=dialog]').should('not.exist')
        cy.then(() => wrapper.setProps({ open: true }))
        cy.get('[role=dialog]').should('exist')
        cy.then(() => wrapper.setProps({ open: false }))
        cy.get('[role=dialog]').should('not.exist')
      })
    })

    it('still opens from the trigger with no `open` bound', () => {
      cy.mount(DatePicker, { props: { modelValue: '2025-06-15' } })
      cy.get('input').click()
      cy.get('[role=dialog]').should('exist')
    })

    it('emits no `update:open` while mounting open', () => {
      cy.mount(DatePicker, {
        props: {
          modelValue: '2025-06-15',
          open: true,
          'onUpdate:open': cy.spy().as('onUpdateOpen'),
        },
      })

      cy.get('[role=dialog]').should('exist')
      cy.get('@onUpdateOpen').should('not.have.been.called')

      // The first emit is the picker's own close, so nothing looped on mount.
      cy.get('[aria-label="2025-06-16"]').click()
      cy.get('[role=dialog]').should('not.exist')
      cy.get('@onUpdateOpen').should('have.been.calledOnceWith', false)
    })

    // Mounting open follows no gesture, so it must not take focus from the
    // page. The default `TextInput` trigger already behaves this way — the
    // shell passes `:auto-focus="false"` to the popover, so reka's mount
    // autofocus is cancelled — and a custom `#trigger` now matches it.
    it('leaves focus alone when mounting open with a custom #trigger', () => {
      // The picker renders behind a flag the outside input flips, so focus is
      // parked on a real element when the open panel appears. Mounting the
      // picker straight away would only prove focus stayed on `<body>`.
      const Harness = defineComponent({
        setup() {
          const show = ref(false)
          return () =>
            h('div', [
              h('input', {
                'data-cy': 'outside',
                onInput: () => (show.value = true),
              }),
              show.value
                ? h(
                    DatePicker,
                    { modelValue: '2025-06-15', open: true },
                    {
                      trigger: () =>
                        h('button', { 'data-cy': 'pick' }, 'Pick'),
                    },
                  )
                : null,
            ])
        },
      })

      cy.mount(Harness)
      cy.get('[data-cy=outside]').focus().type('x')
      cy.get('[role=dialog]').should('exist')
      cy.get('[aria-label="2025-06-15"]').should('exist')
      cy.focused().should('have.attr', 'data-cy', 'outside')
    })

    it('moves focus into the calendar on a later open from a custom #trigger', () => {
      cy.mount(DatePicker, {
        props: { modelValue: '2025-06-15' },
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
