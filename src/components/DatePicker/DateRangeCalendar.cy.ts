import { defineComponent, h, ref } from 'vue'
import DateRangeCalendar from './DateRangeCalendar.vue'
import type { DateRangeValue } from './types'

const pad = (n: number) => String(n).padStart(2, '0')
const getTodaysDate = () => {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

// The range is only half-picked between the two clicks, so the value has to
// travel back down for the second click to read it. A harness holding the
// `v-model` is the smallest way to test the component the way it is used.
function mountCalendar(
  modelValue: DateRangeValue = [],
  props: Record<string, unknown> = {},
) {
  const onUpdate = cy.spy().as('onUpdate')
  const onSelect = cy.spy().as('onSelect')
  const onToday = cy.spy().as('onToday')
  return cy.mount(
    defineComponent({
      setup() {
        const range = ref<DateRangeValue>(modelValue)
        return () =>
          h(DateRangeCalendar, {
            ...props,
            modelValue: range.value,
            onSelect,
            onToday,
            'onUpdate:modelValue': (value: DateRangeValue) => {
              range.value = value
              onUpdate(value)
            },
          })
      },
    }),
  )
}

describe('DateRangeCalendar', () => {
  it('renders the grid inline, with no popover', () => {
    mountCalendar()

    cy.get('[role=dialog]').should('not.exist')
    cy.get('[role=grid]').should('have.length', 1)
    cy.get(`[aria-label^="${getTodaysDate()}"]`).should('exist')
  })

  it('opens on the month of its range start', () => {
    mountCalendar(['2025-06-10', '2025-06-15'])
    cy.get('[aria-label=cycle-calendar-view]').should('have.text', 'Jun 2025')
  })

  it('first click opens the range, second closes it', () => {
    mountCalendar(['2025-06-10', '2025-06-15'])
    cy.get('[aria-label="2025-06-12"]').click()
    cy.get('@onUpdate').should('have.been.calledWith', ['2025-06-12', ''])
    cy.get('[aria-label="2025-06-18"]').click()
    cy.get('@onUpdate').should('have.been.calledWith', [
      '2025-06-12',
      '2025-06-18',
    ])
  })

  it('clicking a current endpoint still emits select', () => {
    mountCalendar(['2025-06-10', '2025-06-15'])
    cy.get('[aria-label="2025-06-10"]').click()
    cy.get('@onSelect').should('have.been.calledOnceWith', ['2025-06-10', ''])
    cy.get('[aria-label="2025-06-10"]').click()
    cy.get('@onSelect').should('have.been.calledTwice')
  })

  it('clicking an out-of-month cell keeps the view put', () => {
    mountCalendar(['2025-06-10', '2025-06-15'])
    cy.get('[aria-label="2025-07-01"]').click()
    cy.get('@onSelect').should('have.been.calledWith', ['2025-07-01', ''])
    cy.get('[aria-label=cycle-calendar-view]').should('have.text', 'Jun 2025')
  })

  it('a range set from outside pulls the view to its start', () => {
    cy.mount(DateRangeCalendar, {
      props: { modelValue: ['2025-06-15', '2025-06-20'] },
    }).then(({ wrapper }) =>
      wrapper.setProps({ modelValue: ['2025-09-03', '2025-09-10'] }),
    )
    cy.get('[aria-label=cycle-calendar-view]').should('have.text', 'Sep 2025')
  })

  it('picking the end before the start swaps them', () => {
    mountCalendar(['2025-06-10', '2025-06-15'])
    cy.get('[aria-label="2025-06-20"]').click()
    cy.get('[aria-label="2025-06-05"]').click()
    cy.get('@onUpdate').should('have.been.calledWith', [
      '2025-06-05',
      '2025-06-20',
    ])
  })

  it('hovering after the first click previews the range', () => {
    mountCalendar(['2025-06-10', '2025-06-15'])
    cy.get('[aria-label="2025-06-20"]').click()
    cy.get('[aria-label="2025-06-24"]').trigger('mouseenter')
    cy.get('[aria-label="2025-06-22"]').should(
      'have.class',
      'bg-surface-gray-3',
    )
    cy.get('[aria-label="2025-06-26"]').should(
      'not.have.class',
      'bg-surface-gray-3',
    )
  })

  it('today button selects today at both ends and emits today', () => {
    mountCalendar()
    cy.get('[aria-label="Today"]').click()
    cy.get('@onUpdate').should('have.been.calledWith', [
      getTodaysDate(),
      getTodaysDate(),
    ])
    cy.get('@onToday').should('have.been.calledOnceWith', [
      getTodaysDate(),
      getTodaysDate(),
    ])
  })

  it('today button emits today even when today is already the range', () => {
    mountCalendar([getTodaysDate(), getTodaysDate()])
    cy.get('[aria-label="Today"]').click()
    cy.get('@onToday').should('have.been.calledOnceWith', [
      getTodaysDate(),
      getTodaysDate(),
    ])
  })

  it('empty todayLabel hides the button', () => {
    mountCalendar([], { todayLabel: '' })
    cy.get('[aria-label="Today"]').should('not.exist')
  })

  it('min disables earlier cells and blocks selecting them', () => {
    mountCalendar(['2025-06-15', '2025-06-15'], { min: '2025-06-10' })
    cy.get('[aria-label="2025-06-09"]').should(
      'have.attr',
      'aria-disabled',
      'true',
    )
    cy.get('[aria-label="2025-06-09"]').click({ force: true })
    cy.get('@onUpdate').should('not.have.been.called')
  })

  it('dualPane renders two grids and drops the cycle-view button', () => {
    mountCalendar(['2025-06-10', '2025-06-15'], { dualPane: true })
    cy.get('[role=grid][aria-label="Calendar dates"]').should('have.length', 2)
    cy.get('[aria-label=cycle-calendar-view]').should('not.exist')
    cy.get('[aria-label="2025-07-05"]').should('exist')
  })

  describe('keyboard navigation', () => {
    it('arrowing past the end of the month steps the view', () => {
      mountCalendar(['2025-06-30', '2025-06-30'])
      cy.get('[aria-label="2025-06-30"]').focus()
      cy.focused().trigger('keydown', { key: 'ArrowRight' })
      cy.focused().should('have.attr', 'data-value', '2025-07-01')
      cy.get('[aria-label=cycle-calendar-view]').should('have.text', 'Jul 2025')
    })

    it('Enter selects the focused cell', () => {
      mountCalendar(['2025-06-15', '2025-06-15'])
      cy.get('[aria-label="2025-06-15"]').focus()
      cy.focused().trigger('keydown', { key: 'ArrowRight' })
      cy.focused().trigger('keydown', { key: 'Enter' })
      cy.get('@onUpdate').should('have.been.calledWith', ['2025-06-16', ''])
    })

    it('a range set from outside hands the tabindex to its start', () => {
      cy.mount(DateRangeCalendar, {
        props: { modelValue: ['2025-06-15', '2025-06-20'] },
      }).then(({ wrapper }) =>
        wrapper.setProps({ modelValue: ['2025-09-03', '2025-09-10'] }),
      )
      cy.get('[aria-label=cycle-calendar-view]').should('have.text', 'Sep 2025')
      cy.get('[aria-label="2025-09-03"]').should('have.attr', 'tabindex', '0')
    })
  })
})
