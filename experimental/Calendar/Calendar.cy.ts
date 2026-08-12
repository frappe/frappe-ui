import { h } from 'vue'
import Calendar from './Calendar.vue'
import type { CalendarEvent } from './types'

function monthYear(offsetDays = 0) {
  const date = new Date()
  date.setDate(date.getDate() + offsetDays)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const today = monthYear()

const events: CalendarEvent[] = [
  {
    id: 'EV-001',
    title: 'Design review',
    participant: 'Jane Doe',
    venue: 'Room 1',
    fromDate: today,
    toDate: today,
    fromTime: '10:00',
    toTime: '11:00',
    color: 'blue',
  },
  {
    id: 'EV-002',
    title: 'Team offsite',
    participant: 'John Doe',
    venue: 'HQ',
    fromDate: today,
    toDate: today,
    fromTime: '00:00',
    toTime: '02:00',
    color: 'amber',
    isFullDay: true,
  },
]

describe('Calendar', () => {
  // Behavior 1: renders with default props
  it('renders the month view with the default header', () => {
    cy.mount(Calendar, { props: { events: [] } })

    // Weekday strip and a 7-column grid
    for (const day of ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']) {
      cy.contains(day).should('exist')
    }
    // Default header controls
    cy.contains('button', 'Today').should('exist')
    cy.contains('Month').should('exist')
  })

  // Behavior 2: value round-trip — Calendar has no v-model; the nearest
  // equivalent is events in via props, CRUD out via emits.
  it('renders events from props and emits delete', () => {
    cy.mount(Calendar, {
      props: {
        events,
        config: { isEditMode: true, enableShortcuts: true },
        onDelete: cy.spy().as('onDelete'),
      },
    })

    cy.contains('Design review').should('exist')
    cy.contains('Team offsite').should('exist')

    // Open the event popover (single click applies after a 200ms delay),
    // then delete it with the keyboard shortcut.
    cy.contains('Design review').click()
    cy.get('body').type('{del}')
    cy.get('@onDelete').should('have.been.calledWith', 'EV-001')
    cy.contains('Design review').should('not.exist')
  })

  it('emits rangeChange with the visible range on mount', () => {
    cy.mount(Calendar, {
      props: { events: [], onRangeChange: cy.spy().as('onRangeChange') },
    })

    cy.get('@onRangeChange').should('have.been.calledWithMatch', {
      view: 'Month',
      startDate: Cypress.sinon.match.string,
      endDate: Cypress.sinon.match.string,
    })
  })

  // Behavior 3: disabled / loading — N/A, the component has neither.

  // Behavior 4: keyboard
  it('switches views and navigates with keyboard shortcuts', () => {
    cy.mount(Calendar, { props: { events: [] } })

    // w -> Week view (time gutter appears)
    cy.get('body').type('w')
    cy.contains('All day').should('exist')

    // m -> back to Month view
    cy.get('body').type('m')
    cy.contains('All day').should('not.exist')

    // ArrowRight moves forward, t returns to today
    cy.contains('button', 'Today')
      .parent()
      .parent()
      .then(() => {
        const startTitle = new Date().toLocaleString('en', { month: 'long' })
        cy.get('body').type('{rightarrow}')
        cy.get('body').type('t')
        cy.contains(startTitle).should('exist')
      })
  })

  it('ignores shortcuts when enableShortcuts is off', () => {
    cy.mount(Calendar, {
      props: { events: [], config: { enableShortcuts: false } },
    })

    cy.get('body').type('w')
    cy.contains('All day').should('not.exist')
  })

  // Behavior 5: every documented slot renders
  it('renders the #header slot with its props', () => {
    cy.mount(Calendar, {
      props: { events: [] },
      slots: {
        header: (props: any) =>
          h('div', { 'data-cy': 'custom-header' }, [
            h('span', { 'data-cy': 'title' }, props.currentMonthYear),
            h('span', { 'data-cy': 'view' }, props.activeView),
          ]),
      },
    })

    cy.get('[data-cy=custom-header]').should('exist')
    cy.get('[data-cy=view]').should('have.text', 'Month')
    cy.get('[data-cy=title]').should('not.be.empty')
    // The default header is replaced
    cy.contains('button', 'Today').should('not.exist')
  })

  // The default header binds DatePicker's `#trigger` slot prop `toggle`. The
  // picker's slot props are a public contract, so a rename there breaks this
  // button silently — nothing throws, the month picker just stops opening.
  it('opens the month picker from the default header', () => {
    cy.mount(Calendar, { props: { events: [] } })

    cy.get('[role=dialog]').should('not.exist')
    // The month/year button is the header's first control.
    cy.get('button').first().click()
    cy.get('[role=dialog]').should('exist')
    cy.get('[aria-label=cycle-calendar-view]').should('exist')
  })

  it('renders the #event-popover-content slot inside the event popover', () => {
    cy.mount(Calendar, {
      props: { events },
      slots: {
        'event-popover-content': (props: any) =>
          h(
            'div',
            { 'data-cy': 'custom-popover' },
            `custom: ${props.calendarEvent.title}`,
          ),
      },
    })

    cy.contains('Design review').click()
    cy.get('[data-cy=custom-popover]').should(
      'have.text',
      'custom: Design review',
    )
  })
})
