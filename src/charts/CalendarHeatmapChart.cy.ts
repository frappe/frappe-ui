import { defineComponent, h } from 'vue'
import CalendarHeatmapChart from './CalendarHeatmapChart.vue'
import './style.css'

const data = [
  { day: '2024-03-04', commits: 2 },
  { day: '2024-03-05', commits: 8 },
  { day: '2024-03-07', commits: 4 },
]

function mountChart(
  props: Record<string, any> = {},
  slots?: Record<string, (props?: any) => unknown>,
) {
  return cy.mount(
    defineComponent({
      setup() {
        return () =>
          h('div', { style: 'width: 720px; height: 240px' }, [
            h(
              CalendarHeatmapChart,
              {
                data,
                date: 'day',
                value: 'commits',
                start: '2024-03-01',
                end: '2024-03-31',
                echartOptions: { animation: false },
                ...props,
              },
              slots,
            ),
          ])
      },
    }),
  )
}

const plot = () => cy.get('[data-slot="chart-plot"] [role="img"]')

/**
 * Every day of the range is a filled path, data days and empty ones alike. The
 * calendar's own day rects are drawn transparent under them.
 */
const days = () =>
  cy.get(
    '[data-slot="chart-plot"] svg path[fill]:not([fill="transparent"]):not([fill="none"])',
  )

describe('CalendarHeatmapChart', () => {
  it('draws every day of the range, labelled by month and weekday', () => {
    mountChart()
    days().should('have.length', 31)
    cy.get('[data-slot="chart-plot"] svg text')
      .should('contain.text', 'Mar')
      .and('contain.text', 'Mon')
  })

  it('fills the days with no data in the gridline color, not black', () => {
    mountChart()
    days().should('have.length', 31)
    cy.document().then((doc) => {
      const gridline = getComputedStyle(doc.documentElement)
        .getPropertyValue('--chart-gridline')
        .trim()
      expect(gridline).not.to.equal('')
      cy.get(`[data-slot="chart-plot"] svg path[fill="${gridline}"]`).should(
        'have.length',
        28,
      )
    })
  })

  it('stands the scale under the calendar, from zero to the busiest day', () => {
    mountChart()
    cy.get('[data-slot="chart-scale"] > span').then((spans) => {
      expect(spans.first()).to.have.text('0')
      expect(spans.last()).to.have.text('8')
    })
    days().then((cells) => {
      const bottom = Math.max(
        ...[...cells].map((cell) => cell.getBoundingClientRect().bottom),
      )
      cy.get('[data-slot="chart-scale"]').should(([scale]) => {
        expect(scale.getBoundingClientRect().top).to.be.within(
          bottom,
          bottom + 16,
        )
      })
    })
  })

  it('marks an end of the scale that days lie past', () => {
    mountChart({ max: 5 })
    cy.get('[data-slot="chart-scale"] > span').then((spans) => {
      expect(spans.first()).to.have.text('0')
      expect(spans.last()).to.have.text('≥ 5')
    })
  })

  it('reads a day out on the keyboard', () => {
    mountChart()
    days().should('have.length', 31)
    plot().focus().type('{downarrow}{downarrow}{downarrow}{downarrow}')
    cy.get('[data-slot="chart-tooltip"]')
      .should('contain.text', 'Mar 5, 2024')
      .and('contain.text', '8')
  })

  it('selects a day with the row behind it', () => {
    mountChart({ onSelect: cy.spy().as('onSelect') })
    days().should('have.length', 31)
    plot().focus().type('{downarrow}{downarrow}{downarrow}{downarrow}{enter}')
    cy.get('@onSelect').should('have.been.calledWithMatch', {
      date: '2024-03-05',
      value: 8,
      row: data[1],
    })
  })

  it('reads a day with no row as no data on the keyboard, and does not select it', () => {
    mountChart({ onSelect: cy.spy().as('onSelect') })
    days().should('have.length', 31)
    plot().focus()
    cy.get('[data-slot="chart-tooltip"]')
      .should('contain.text', 'Mar 1, 2024')
      .and('contain.text', 'No data')
    plot().type('{enter}')
    cy.get('@onSelect').should('not.have.been.called')
  })

  describe('on the keyboard', () => {
    const tooltip = () => cy.get('[data-slot="chart-tooltip"]')

    it('walks a day up and down, and a week left and right', () => {
      mountChart()
      days().should('have.length', 31)
      // 1 March 2024 is a Friday, two rows above the week's end.
      plot().focus()
      tooltip().should('contain.text', 'Fri, Mar 1, 2024')
      plot().type('{downarrow}{downarrow}')
      tooltip().should('contain.text', 'Sun, Mar 3, 2024')
      plot().type('{rightarrow}')
      tooltip().should('contain.text', 'Sun, Mar 10, 2024')
      plot().type('{uparrow}')
      tooltip().should('contain.text', 'Sat, Mar 9, 2024')
      plot().type('{leftarrow}')
      tooltip().should('contain.text', 'Sat, Mar 2, 2024')
    })

    it('holds at the edge rather than wrapping', () => {
      mountChart()
      days().should('have.length', 31)
      plot().focus().type('{leftarrow}{uparrow}')
      tooltip().should('contain.text', 'Mar 1, 2024')
      plot().type('{end}{rightarrow}{downarrow}')
      tooltip().should('contain.text', 'Mar 31, 2024')
    })

    it('crosses from one band into the next', () => {
      mountChart({ start: '2023-01-01', end: '2024-12-31' })
      days().should('have.length', 731)
      plot().focus().type('{rightarrow}'.repeat(52))
      tooltip().should('contain.text', 'Dec 31, 2023')
      plot().type('{downarrow}')
      tooltip().should('contain.text', 'Jan 1, 2024')
      plot().type('{uparrow}{rightarrow}')
      tooltip().should('contain.text', 'Jan 7, 2024')
    })

    it('steps right to the next week in RTL, where the grid still runs left to right', () => {
      mountChart({ dir: 'rtl' })
      days().should('have.length', 31)
      plot().focus().type('{rightarrow}')
      tooltip().should('contain.text', 'Mar 8, 2024')
    })
  })

  it('names the date of a day with no row under the pointer', () => {
    mountChart()
    days().should('have.length', 31)
    cy.document().then((doc) => {
      const gridline = getComputedStyle(doc.documentElement)
        .getPropertyValue('--chart-gridline')
        .trim()
      cy.get(`[data-slot="chart-plot"] svg path[fill="${gridline}"]`)
        .first()
        .then(([cell]) => {
          const box = cell.getBoundingClientRect()
          cy.get('[data-slot="chart-plot"]').then(([plot]) => {
            const origin = plot.getBoundingClientRect()
            cy.get('[data-slot="chart-plot"]').trigger(
              'mousemove',
              box.left - origin.left + box.width / 2,
              box.top - origin.top + box.height / 2,
            )
          })
        })
    })
    cy.get('[data-slot="chart-tooltip"]')
      .should('contain.text', 'Mar 1, 2024')
      .and('contain.text', 'No data')
  })

  it('draws a band per twelve months past a year, its years beside it', () => {
    mountChart({ start: '2023-01-01', end: '2024-12-31' })
    cy.get('[data-slot="chart-plot"] svg text')
      .should('contain.text', '2023')
      .and('contain.text', '2024')
  })

  it('shows the empty state for no data and no range', () => {
    mountChart({ data: [], start: undefined, end: undefined })
    cy.get('[data-slot="chart-container"]').should(
      'have.attr',
      'data-state',
      'empty',
    )
    cy.get('[data-slot="chart-scale"]').should('not.exist')
  })

  it('draws the empty days of a range set in full with no data', () => {
    mountChart({ data: [] })
    days().should('have.length', 31)
    cy.get('[data-slot="chart-scale"]').should('not.exist')
  })

  it('reports a range written backwards as an error', () => {
    mountChart({ start: '2024-03-31', end: '2024-03-01' })
    cy.get('[data-slot="chart-container"]').should(
      'have.attr',
      'data-state',
      'error',
    )
  })
})
