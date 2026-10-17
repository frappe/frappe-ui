import { defineComponent, h } from 'vue'
import CalendarHeatmapChart from './CalendarHeatmapChart.vue'
import './style.css'

const data = [
  { day: '2024-03-04', commits: 2 },
  { day: '2024-03-05', commits: 6 },
  { day: '2024-03-05', commits: 2 },
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

  it('reads a day out on the keyboard, rows on that day summed', () => {
    mountChart()
    days().should('have.length', 31)
    plot().focus().type('{rightarrow}')
    cy.get('[data-slot="chart-tooltip"]')
      .should('contain.text', 'Mar 5, 2024')
      .and('contain.text', '8')
  })

  it('selects a day with every row behind it', () => {
    mountChart({ onSelect: cy.spy().as('onSelect') })
    days().should('have.length', 31)
    plot().focus().type('{rightarrow}{enter}')
    cy.get('@onSelect').should('have.been.calledWithMatch', {
      date: '2024-03-05',
      value: 8,
      rows: [data[1], data[2]],
    })
  })

  it('draws one calendar per year past a year', () => {
    mountChart({ start: '2023-01-01', end: '2024-12-31' })
    cy.get('[data-slot="chart-plot"] svg text')
      .should('contain.text', '2023')
      .and('contain.text', '2024')
  })

  it('shows the empty state, not an empty calendar, for no data', () => {
    mountChart({ data: [] })
    cy.get('[data-slot="chart-container"]').should(
      'have.attr',
      'data-state',
      'empty',
    )
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
