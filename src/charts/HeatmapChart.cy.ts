import { defineComponent, h, ref } from 'vue'
import HeatmapChart from './HeatmapChart.vue'
import './style.css'

const data = [
  { day: 'Mon', hour: '9am', tickets: 4 },
  { day: 'Mon', hour: '10am', tickets: 8 },
  { day: 'Tue', hour: '9am', tickets: 2 },
  { day: 'Tue', hour: '10am', tickets: 6 },
]

/**
 * Charts fill their container, so every case needs one with a size. Animation
 * is off: a cell fades in, and until it has arrived it is transparent.
 */
function mountChart(
  props: Record<string, any> = {},
  slots?: Record<string, (props?: any) => unknown>,
) {
  return cy.mount(
    defineComponent({
      setup() {
        return () =>
          h('div', { style: 'width: 480px; height: 300px' }, [
            h(
              HeatmapChart,
              {
                data,
                x: 'hour',
                y: 'day',
                value: 'tickets',
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

/** The state the container is in, which an app can also style from CSS. */
const container = () => cy.get('[data-slot="chart-container"]')

/** The one tab stop the grid takes: echarts draws no per-cell DOM node. */
const plot = () => cy.get('[data-slot="chart-plot"] [role="img"]')

/** Cells carry a computed rgb() fill; nothing else in the plot is filled. */
const cells = () => cy.get('[data-slot="chart-plot"] svg path[fill^="rgb"]')

/** The scale is DOM beside a canvas grid, so checking the two agree means
 *  measuring both. */
const box = (selector: string) =>
  cy.get(selector).then(($el) => $el[0].getBoundingClientRect())

/** One x-axis label, as echarts drew it into the plot. */
const axisLabel = (text: string) =>
  cy
    .get('[data-slot="chart-plot"] svg text')
    .filter((_, el) => el.textContent === text)
    .first()
    .then(($el) => ($el[0] as unknown as SVGGraphicsElement).getBoundingClientRect())

describe('HeatmapChart', () => {
  it('draws a cell per row, on axes taken from the data', () => {
    mountChart()
    cells().should('have.length', data.length)
    cy.get('[data-slot="chart-plot"] svg text')
      .should('contain.text', 'Mon')
      .and('contain.text', '9am')
  })

  it('colors a cell by its magnitude', () => {
    mountChart()
    // Mon 10am is the busiest cell and Tue 9am the quietest: different fills.
    cells().then((els) => {
      const fills = [...els].map((el) => el.getAttribute('fill'))
      expect(new Set(fills).size).to.be.greaterThan(1)
    })
  })

  it('stands the scale beside the plot, ends labelled', () => {
    mountChart()
    // A continuous ramp has no entries to switch on and off, so the scale
    // stands in for the legend.
    cy.get('[data-slot="chart-legend"]').should('not.exist')
    cy.get('[data-slot="chart-scale"]')
      .should('contain.text', '2')
      .and('contain.text', '8')

    box('[data-slot="chart-scale"]').then((scale) => {
      box('[data-slot="chart-plot"] [role="img"]').then((plot) => {
        expect(scale.left, 'scale sits after the plot').to.be.at.least(
          plot.right - 1,
        )
      })
    })
  })

  it('lines the low end up with the row of x-axis labels', () => {
    mountChart()
    // `min` reads as one of the axis labels, so it starts where they start —
    // which is a number only the laid-out chart knows.
    axisLabel('9am').then((label) => {
      box('[data-slot="chart-scale-min"]').then((min) => {
        expect(min.top, 'min starts on the x-label row').to.be.closeTo(
          label.top,
          3,
        )
      })
    })
  })

  it('stands the scale opposite the category axis in RTL', () => {
    mountChart({ dir: 'rtl' })
    box('[data-slot="chart-scale"]').then((scale) => {
      box('[data-slot="chart-plot"] [role="img"]').then((plot) => {
        expect(scale.right, 'scale sits before the plot').to.be.at.most(
          plot.left + 1,
        )
      })
    })
  })

  it('takes the ends of the scale from the props', () => {
    mountChart({ min: 0, max: 10 })
    cy.get('[data-slot="chart-container"]')
      .should('contain.text', '0')
      .and('contain.text', '10')
  })

  it('prints the categories through the axis formatters', () => {
    mountChart({
      xAxis: { format: (hour: string) => hour.toUpperCase() },
      yAxis: { format: (day: string) => day.slice(0, 1) },
    })
    cy.get('[data-slot="chart-plot"] svg text')
      .should('contain.text', '9AM')
      .and('contain.text', 'M')
  })

  it('prints the values in the cells on request', () => {
    mountChart({ showValues: true })
    cy.get('[data-slot="chart-plot"] svg text').should('contain.text', '8')
  })

  it('emits select with the row behind the cell', () => {
    mountChart({ onSelect: cy.spy().as('onSelect') })
    cells().first().click()
    cy.get('@onSelect').should('have.been.calledWithMatch', {
      row: { day: 'Mon', hour: '9am', tickets: 4 },
    })
  })

  it('opens the tooltip over the cell under the pointer', () => {
    mountChart()
    cells().should('have.length', data.length)
    cy.get('[data-slot="chart-plot"]').trigger('mousemove', 100, 60)
    cy.get('[data-slot="chart-tooltip"]').should('exist')
  })

  describe('states', () => {
    it('holds the plot’s shape with a skeleton while loading', () => {
      mountChart({ loading: true })
      cy.get('[data-slot="chart-loading"] .animate-pulse').should('be.visible')
      // Unmounting the plot would dispose the echarts instance behind it.
      cy.get('[data-slot="chart-plot"]').should('exist')
      container().should('have.attr', 'data-state', 'loading')
    })

    it('reports an error over the plot', () => {
      mountChart({ error: 'boom' })
      cy.contains('Could not render this chart').should('be.visible')
      cy.contains('boom').should('be.visible')
      container().should('have.attr', 'data-state', 'error')
    })

    it('says so when there is nothing to plot', () => {
      mountChart({ data: [] })
      cy.contains('No data to show').should('be.visible')
      cells().should('not.exist')
      container().should('have.attr', 'data-state', 'empty')
    })

    it('reads as ready once the grid is drawn', () => {
      mountChart()
      cells().should('have.length', data.length)
      container().should('have.attr', 'data-state', 'ready')
    })

    // An error outranks the rest: a stale skeleton over a failed query would
    // read as data still on its way.
    it('reports the error even while loading', () => {
      mountChart({ loading: true, error: 'boom' })
      container().should('have.attr', 'data-state', 'error')
    })
  })

  // The chrome is the library's, so reaching one of its corners costs the app a
  // slot rather than a chart of its own.
  describe('slots', () => {
    it('puts an app’s controls in the header', () => {
      mountChart({ title: 'Tickets' }, { actions: () => h('button', 'Week') })
      cy.get('[data-slot="chart-header"]').should('contain.text', 'Week')
    })

    it('takes an app’s own placeholder in place of the skeleton', () => {
      mountChart({ loading: true }, { loading: () => h('div', { id: 'own' }) })
      cy.get('#own').should('exist')
      cy.get('[data-slot="chart-loading"] .animate-pulse').should('not.exist')
    })

    it('puts an app’s retry button beside the error message', () => {
      const retry = cy.spy().as('onRetry')
      mountChart(
        { error: 'boom' },
        {
          error: ({ error }: any) => [
            h('span', `Failed: ${error}`),
            h('button', { id: 'retry', onClick: retry }, 'Retry'),
          ],
        },
      )

      cy.contains('Failed: boom').should('be.visible')
      cy.contains('Could not render this chart').should('not.exist')
      cy.get('#retry').click()
      cy.get('@onRetry').should('have.been.calledOnce')
    })

    it('takes an app’s own line in place of “No data to show”', () => {
      mountChart({ data: [] }, { empty: () => h('span', 'Widen the filters') })
      cy.contains('Widen the filters').should('be.visible')
      cy.contains('No data to show').should('not.exist')
    })

    it('replaces the tooltip body with the app’s own', () => {
      // Opened from the keyboard rather than a hover: the cursor lands on a
      // known cell, so the slot props are the first cell's every run.
      mountChart({}, { tooltip: ({ label }: any) => h('span', `at ${label}`) })
      cells().should('have.length', data.length)
      plot().focus()
      cy.get('[data-slot="chart-tooltip"]')
        .should('contain.text', 'at Mon · 9am')
        .and('not.contain.text', 'Tickets')
    })
  })

  // echarts draws into one element, so the grid takes a single tab stop and the
  // arrow keys walk a cursor along it.
  describe('keyboard', () => {
    it('opens the tooltip on the first cell and reads it out', () => {
      mountChart()
      cells().should('have.length', data.length)
      plot().should('have.attr', 'tabindex', '0')
      plot().focus()
      cy.get('[data-slot="chart-tooltip"]').should('contain.text', 'Mon · 9am')
      cy.get('[role="status"]').should('not.have.text', '')
    })

    it('walks the cells left and right', () => {
      mountChart()
      cells().should('have.length', data.length)
      plot().focus()
      plot().type('{rightarrow}')
      cy.get('[data-slot="chart-tooltip"]').should('contain.text', 'Mon · 10am')
    })

    it('holds the column with up and down', () => {
      mountChart()
      cells().should('have.length', data.length)
      plot().focus()
      // Down from Mon 9am is Tue 9am: the same hour, one row along.
      plot().type('{downarrow}')
      cy.get('[data-slot="chart-tooltip"]').should('contain.text', 'Tue · 9am')
    })

    it('fires select on Enter, for the cell under the cursor', () => {
      mountChart({ onSelect: cy.spy().as('onSelect') })
      cells().should('have.length', data.length)
      plot().focus()
      plot().type('{rightarrow}{enter}')
      cy.get('@onSelect').should('have.been.calledWithMatch', {
        x: '10am',
        y: 'Mon',
        value: 8,
        row: { day: 'Mon', hour: '10am', tickets: 8 },
      })
    })

    // One cursor, not a trail: the cell the cursor leaves goes back to rest,
    // and so does the last one when focus leaves the grid.
    it('takes the emphasis off the cell the cursor leaves', () => {
      const chart = ref<any>(null)
      mountChart({ ref: chart })
      cells().should('have.length', data.length)
      cy.then(() => cy.spy(chart.value.chart, 'dispatchAction').as('dispatch'))
      plot().focus()
      plot().type('{rightarrow}')
      cy.get('@dispatch').should('have.been.calledWithMatch', {
        type: 'downplay',
        dataIndex: 0,
      })
      plot().blur()
      cy.get('@dispatch').should('have.been.calledWithMatch', {
        type: 'downplay',
        dataIndex: 1,
      })
    })

    it('clears the tooltip and the reading on blur', () => {
      mountChart()
      cells().should('have.length', data.length)
      plot().focus()
      cy.get('[data-slot="chart-tooltip"]').should('exist')
      plot().blur()
      cy.get('[data-slot="chart-tooltip"]').should('not.exist')
      cy.get('[role="status"]').should('have.text', '')
    })

    // Nothing to walk, so the plot drops out of the tab order rather than
    // taking a stop that does nothing.
    it('takes no tab stop with nothing drawn', () => {
      mountChart({ data: [] })
      plot().should('not.have.attr', 'tabindex')
    })
  })
})
