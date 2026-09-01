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

/**
 * A weekday (0 = Sunday) of the current week. Weeks run Sunday to Saturday,
 * so a span over Monday to Wednesday sits inside one week row whatever day
 * the suite runs on; the month grid pads with neighbouring months, so it
 * shows those days whichever month they fall in.
 */
function thisWeek(weekday: number) {
  return monthYear(weekday - new Date().getDay())
}

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
  // Below the `sm` breakpoint the Month view stacks days instead of drawing
  // week rows; the desktop specs want the rows.
  beforeEach(() => cy.viewport(1024, 768))

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

    // Open the event popover (single click applies after a 200ms delay) and
    // wait for it — the shortcut is armed by the popover actually opening, not
    // by the click — then delete it with the keyboard shortcut.
    cy.contains('Design review').click()
    cy.get('[data-slot=content]').should('exist')
    cy.get('body').type('{del}')
    cy.get('@onDelete').should('have.been.calledWith', 'EV-001')
    cy.contains('Design review').should('not.exist')

    // The pill unmounted with its popover still open, so no `close` came to
    // take the listener down. A second press must find nothing listening.
    cy.get('body').type('{del}')
    cy.get('@onDelete').should('have.been.calledOnce')
  })

  // The delete shortcut listens on the document, so it hears keys that belong
  // to something else. Backspace in a text field is an edit.
  it('leaves Backspace to a text field while the popover is open', () => {
    cy.mount(Calendar, {
      props: {
        events,
        config: { isEditMode: true, enableShortcuts: true },
        onDelete: cy.spy().as('onDelete'),
      },
      slots: {
        'event-popover-content': () => h('input', { 'data-cy': 'note' }),
      },
    })

    cy.contains('Design review').click()
    cy.get('[data-cy=note]').type('ab{backspace}')
    cy.get('[data-cy=note]').should('have.value', 'a')
    cy.get('@onDelete').should('not.have.been.called')
    cy.contains('Design review').should('exist')
  })

  // A consumer that takes over the click never opens the popover, so nothing
  // should be listening for the shortcut. It used to arm anyway — the popover
  // announced an open it never performed — and stayed armed, swallowing
  // Backspace and Delete across the page for the rest of its life.
  it('does not arm the delete shortcut when onClick suppresses the popover', () => {
    cy.mount(Calendar, {
      props: {
        events,
        config: { isEditMode: true, enableShortcuts: true },
        onClick: cy.spy().as('onClick'),
        onDelete: cy.spy().as('onDelete'),
      },
    })

    cy.contains('Design review').click()
    cy.get('@onClick').should('have.been.called')
    cy.get('[data-slot=content]').should('not.exist')

    cy.get('body').type('{del}')
    cy.get('@onDelete').should('not.have.been.called')
    cy.contains('Design review').should('exist')
  })

  it('draws a multi-day event as one bar in the month view', () => {
    cy.mount(Calendar, {
      props: {
        events: [
          {
            id: 'EV-STAY',
            title: 'Offsite',
            fromDate: thisWeek(1),
            toDate: thisWeek(3),
            isFullDay: true,
            color: 'cyan',
          },
        ],
      },
    })

    // One bar across the stay's three days, never a copy per day.
    cy.get('.event')
      .filter(':contains("Offsite")')
      .should('have.length', 1)
      .then(($bar) => {
        const cell = $bar.closest('[data-week-row]')
        const cellWidth = cell.width()! / 7
        expect($bar.width()!).to.be.greaterThan(cellWidth * 1.5)
      })
  })

  it('sizes a month row to its day and shows every event in it', () => {
    const titles = [
      'Standup',
      'Design review',
      'Interview',
      'Team lunch',
      'Retro',
    ]
    cy.mount(Calendar, {
      props: {
        events: titles.map((title, i) => ({
          id: `EV-${i}`,
          title,
          fromDate: today,
          toDate: today,
          fromTime: `${9 + i}:00`,
          toTime: `${10 + i}:00`,
        })),
      },
    })

    // Five events on one day: all five rendered, nothing folded behind a
    // count.
    for (const title of titles)
      cy.contains('.event', title).should('be.visible')
    cy.contains('more').should('not.exist')
  })

  it('names the month on its first day', () => {
    // Pinned mid-month: today's own number is a bare pill, so on the 1st the
    // label would not be there to find.
    cy.clock(new Date(2026, 7, 15), ['Date'])
    cy.mount(Calendar, { props: { events: [] } })

    cy.get('[data-strip-date]').first().contains('Aug 1').should('exist')
  })

  it('stacks the days on a narrow screen', () => {
    cy.viewport(390, 800)
    cy.mount(Calendar, {
      props: {
        events: [
          {
            id: 'EV-STAY',
            title: 'Offsite',
            fromDate: thisWeek(1),
            toDate: thisWeek(3),
            isFullDay: true,
          },
        ],
      },
    })

    // No week-row grid; a row per day, with a stay saying which day it is on.
    cy.get('[data-week-row]').should('not.exist')
    cy.contains('.event', 'Offsite').should('have.length.at.least', 1)
    cy.contains('Day 1 of 3').should('exist')
  })

  it('puts a multi-day event in the all-day row and splits an overnight one', () => {
    cy.mount(Calendar, {
      props: {
        events: [
          {
            id: 'EV-STAY',
            title: 'Offsite',
            fromDate: thisWeek(1),
            toDate: thisWeek(2),
            isFullDay: true,
            color: 'cyan',
          },
          {
            id: 'EV-NIGHT',
            title: 'Release night',
            fromDate: thisWeek(1),
            toDate: thisWeek(2),
            fromTime: '22:00',
            toTime: '02:00',
            color: 'violet',
          },
        ],
        config: { defaultMode: 'Week' },
      },
    })

    // The all-day row holds the stay as a bar spanning its days.
    cy.get('[data-day-columns]')
      .first()
      .within(() => {
        cy.contains('.event', 'Offsite').should('exist')
      })
    // The overnight event shows once per day in the time grid, each piece
    // still labelled with the whole event's times.
    cy.get('[data-time-grid] .event')
      .filter(':contains("Release night")')
      .should('have.length', 2)
      .each(($piece) => {
        expect($piece.text()).to.contain('10 pm - 2 am')
      })
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

  // Anything layered over the calendar owns the keyboard. The shortcuts are bare
  // letters, so without this they reached straight through an open dialog and
  // switched the view behind it.
  it('ignores shortcuts while an overlay is open', () => {
    cy.mount(Calendar, { props: { events: [] } })

    // The month/year button is the header's first control; its picker is a dialog.
    cy.get('button').first().click()
    cy.get('[role=dialog]').should('exist')

    cy.get('body').type('w')
    cy.contains('All day').should('not.exist')

    // Closed again, the same key does what it always did.
    cy.get('body').type('{esc}')
    cy.get('[role=dialog]').should('not.exist')
    cy.get('body').type('w')
    cy.contains('All day').should('exist')
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
