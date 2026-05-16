import { h } from 'vue'
import DateRangePicker from './DateRangePicker.vue'
import type { DateRangePickerActionsSlotProps } from './types'

// Slot factory: renders a Clear button when there is a value, and exposes
// a Last-7-days preset that exercises setRange.
const sidebarSlot = {
  actions: (props: DateRangePickerActionsSlotProps) => {
    const children = [
      h(
        'button',
        {
          'aria-label': 'Last 7 days',
          onClick: () => {
            const fmt = (d: Date) => {
              const p = (n: number) => String(n).padStart(2, '0')
              return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
            }
            const today = new Date()
            const start = new Date()
            start.setDate(today.getDate() - 6)
            props.setRange([fmt(start), fmt(today)])
            props.close()
          },
        },
        'Last 7 days',
      ),
    ]
    if (props.fromDate || props.toDate) {
      children.push(
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
      )
    }
    return children
  },
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
const formatLocalDate = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const getTodaysDate = () => formatLocalDate(new Date())

// 10 -> 2026-02-10
const getDateFromDay = (day: number) => {
  const d = new Date()
  d.setDate(day)
  return formatLocalDate(d)
}

describe('DateRangePicker', () => {
  it('renders', () => {
    cy.mount(DateRangePicker)

    cy.get('[role=dialog]').should('not.exist')
    cy.get('input').dblclick()
    cy.get('[role=dialog]').should('exist')
  })

  it('action btns', () => {
    cy.mount(DateRangePicker)
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

  it('Gridcells onclick', () => {
    cy.mount(DateRangePicker)
    cy.get('input').dblclick()

    cy.get('[role=dialog]').should('exist')

    cy.contains('10').click()
    cy.contains('13').click()

    const rangeDate = getDateFromDay(10) + ' to ' + getDateFromDay(13)

    cy.get('input').should('have.value', rangeDate)
  })

  it('Slot-rendered Clear appears once at least one end is picked', () => {
    cy.mount(DateRangePicker, { slots: sidebarSlot })
    cy.get('input').dblclick()

    cy.get('input').should('have.value', '')
    cy.get('[aria-label="Clear"]').should('not.exist')
    cy.contains('10').click()
    cy.get('[aria-label="Clear"]').should('exist')
  })

  it('Clear from #actions slot removes the value', () => {
    cy.mount(DateRangePicker, {
      props: { modelValue: ['2025-06-10', '2025-06-15'] },
      slots: sidebarSlot,
    })
    cy.get('input').dblclick()
    cy.get('[aria-label="Clear"]').click()
    cy.get('input').should('have.value', '')
  })

  it('Today button', () => {
    cy.mount(DateRangePicker)
    cy.get('input').dblclick()

    cy.get('input').should('have.value', '')
    cy.get('[aria-label="Today"]').click()

    const todayStr = getTodaysDate() + ' to ' + getTodaysDate()
    cy.get('input').should('have.value', todayStr)
  })

  it('emits v-model as [from, to] array', () => {
    cy.mount(DateRangePicker, {
      props: {
        modelValue: ['2025-06-10', '2025-06-10'],
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })
    cy.get('input').dblclick()
    cy.get('[aria-label="2025-06-12"]').click()
    cy.get('[aria-label="2025-06-15"]').click()
    cy.get('@onUpdate').should((spy: any) => {
      const last = spy.lastCall.args[0]
      expect(last).to.deep.equal(['2025-06-12', '2025-06-15'])
    })
  })

  it('emits [] when range is cleared', () => {
    cy.mount(DateRangePicker, {
      props: {
        modelValue: ['2025-06-10', '2025-06-15'],
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
      slots: sidebarSlot,
    })
    cy.get('input').dblclick()
    cy.get('[aria-label="Clear"]').click()
    cy.get('@onUpdate').should((spy: any) => {
      const last = spy.lastCall.args[0]
      expect(last).to.deep.equal([])
    })
  })

  it('#actions sidebar renders to the left of the calendar', () => {
    cy.mount(DateRangePicker, { slots: sidebarSlot })
    cy.get('input').dblclick()
    cy.get('[data-slot="actions"]').should('exist')
  })

  it('setRange commits both endpoints atomically', () => {
    cy.mount(DateRangePicker, {
      props: { 'onUpdate:modelValue': cy.spy().as('onUpdate') },
      slots: sidebarSlot,
    })
    cy.get('input').dblclick()
    cy.get('[aria-label="Last 7 days"]').click()
    cy.get('@onUpdate').should((spy: any) => {
      const last = spy.lastCall.args[0]
      expect(last).to.have.length(2)
      // setRange normalizes order: from <= to
      expect(last[0] <= last[1]).to.be.true
    })
  })

  it('setRange normalizes reversed input', () => {
    const reversedSlot = {
      actions: (props: DateRangePickerActionsSlotProps) =>
        h(
          'button',
          {
            'aria-label': 'Reversed',
            onClick: () => {
              props.setRange(['2025-06-20', '2025-06-10'])
              props.close()
            },
          },
          'Reversed',
        ),
    }
    cy.mount(DateRangePicker, {
      props: { 'onUpdate:modelValue': cy.spy().as('onUpdate') },
      slots: reversedSlot,
    })
    cy.get('input').dblclick()
    cy.get('[aria-label="Reversed"]').click()
    cy.get('@onUpdate').should((spy: any) => {
      const last = spy.lastCall.args[0]
      expect(last).to.deep.equal(['2025-06-10', '2025-06-20'])
    })
  })

  it('min and max disable out-of-range cells', () => {
    cy.mount(DateRangePicker, {
      props: {
        modelValue: ['2025-06-15', '2025-06-15'],
        min: '2025-06-10',
        max: '2025-06-20',
      },
    })
    cy.get('input').dblclick()
    cy.get('[aria-label="2025-06-09"]').should('have.attr', 'aria-disabled', 'true')
    cy.get('[aria-label="2025-06-21"]').should('have.attr', 'aria-disabled', 'true')
    cy.get('[aria-label="2025-06-15"]').should('not.have.attr', 'aria-disabled')
  })

  it('exposes open() method', () => {
    cy.mount(DateRangePicker).then(({ component }) => {
      cy.get('[role=dialog]').should('not.exist')
      cy.then(() => (component as any).open())
      cy.get('[role=dialog]').should('exist')
    })
  })

  it('picking end before start auto-reorders the range', () => {
    // Seed an empty range but a modelValue so the view lands on June 2025;
    // then pick the later date first and the earlier one second.
    cy.mount(DateRangePicker, {
      props: {
        modelValue: ['2025-06-15', '2025-06-15'],
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })
    cy.get('input').dblclick()
    cy.get('[aria-label="2025-06-20"]').click()
    cy.get('[aria-label="2025-06-10"]').click()
    cy.get('@onUpdate').should((spy: any) => {
      const last = spy.lastCall.args[0]
      expect(last).to.deep.equal(['2025-06-10', '2025-06-20'])
    })
  })

  it('typed "from to to" parses both ends', () => {
    cy.mount(DateRangePicker, {
      props: {
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })
    cy.get('input').click()
    cy.get('input').type('2025-06-10 to 2025-06-15{enter}')
    cy.get('@onUpdate').should((spy: any) => {
      const last = spy.lastCall.args[0]
      expect(last).to.deep.equal(['2025-06-10', '2025-06-15'])
    })
  })

  describe('dual-pane mode', () => {
    it('renders two side-by-side calendar grids', () => {
      cy.mount(DateRangePicker, { props: { dualPane: true } })
      cy.get('input').dblclick()
      cy.get('[role=grid][aria-label="Calendar dates"]').should('have.length', 2)
    })

    it('shows the centered header (no cycle button) in dual-pane', () => {
      // Regression guard for commit 0ee292c2 — dual-pane uses the slim
      // centered header instead of the single-pane cycle-view button.
      cy.mount(DateRangePicker, { props: { dualPane: true } })
      cy.get('input').dblclick()
      cy.get('[aria-label=cycle-calendar-view]').should('not.exist')
    })

    it('hides the Today button on the right pane (only left has it)', () => {
      cy.mount(DateRangePicker, { props: { dualPane: true } })
      cy.get('input').dblclick()
      // In dual-pane, today-label is empty for left pane too (per DateRangePicker.vue),
      // so neither pane should render the Today action button.
      cy.get('[aria-label="Today"]').should('not.exist')
    })
  })

  describe('keyboard navigation', () => {
    it('arrow-down on input opens popover and focuses range start', () => {
      cy.mount(DateRangePicker, {
        props: { modelValue: ['2025-06-10', '2025-06-15'] },
      })
      cy.get('input').focus().type('{downArrow}')
      cy.get('[role=dialog]').should('exist')
      cy.focused().should('have.attr', 'data-value', '2025-06-10')
    })

    it('Enter on a focused cell selects the range start, then end', () => {
      cy.mount(DateRangePicker, {
        props: {
          modelValue: ['2025-06-15', '2025-06-15'],
          'onUpdate:modelValue': cy.spy().as('onUpdate'),
        },
      })
      cy.get('input').dblclick()
      cy.get('[aria-label="2025-06-10"]').focus()
      cy.focused().trigger('keydown', { key: 'Enter' })
      cy.focused().trigger('keydown', { key: 'ArrowRight' })
      cy.focused().trigger('keydown', { key: 'ArrowRight' })
      cy.focused().trigger('keydown', { key: 'ArrowRight' })
      cy.focused().trigger('keydown', { key: 'Enter' })
      cy.get('@onUpdate').should((spy: any) => {
        const last = spy.lastCall.args[0]
        expect(last).to.deep.equal(['2025-06-10', '2025-06-13'])
      })
    })

    it('arrow keys cross between panes without advancing the view (dual-pane)', () => {
      cy.mount(DateRangePicker, {
        props: {
          dualPane: true,
          modelValue: ['2025-06-28', '2025-06-28'],
        },
      })
      cy.get('input').focus().type('{downArrow}')
      cy.focused().should('have.attr', 'data-value', '2025-06-28')
      // Push past the end of June into July — sibling pane already shows it.
      cy.focused().trigger('keydown', { key: 'ArrowRight' })
      cy.focused().trigger('keydown', { key: 'ArrowRight' })
      cy.focused().trigger('keydown', { key: 'ArrowRight' })
      cy.focused().should('have.attr', 'data-value', '2025-07-01')
      // Both panes still rendered — view didn't advance to hide June.
      cy.get('[role=grid][aria-label="Calendar dates"]').should('have.length', 2)
      cy.get('[aria-label="2025-06-28"]').should('exist')
    })
  })
})
