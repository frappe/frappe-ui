import { defineComponent, h } from 'vue'
import AreaChart from './AreaChart.vue'
import './style.css'

const data = [
  { month: 'Jan', sales: 10, refunds: 4 },
  { month: 'Feb', sales: 20, refunds: 6 },
  { month: 'Mar', sales: 15, refunds: 2 },
]

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
              AreaChart,
              {
                data,
                x: 'month',
                y: ['sales', 'refunds'],
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

/**
 * Where the marks are drawn. `<defs>` is left out on purpose: echarts clips a
 * line series with a `<clipPath>` whose path carries a solid fill of its own,
 * and a definition is not something on the plot.
 */
const MARKS = '[data-slot="chart-plot"] svg > g'

/**
 * The series strokes: a palette stroke with a path to trace. Gridlines are
 * stroked too, but in a theme oklch, and the empty series a reference line
 * rides is stroked over an empty path, having never been given anything to draw.
 */
const lines = () => cy.get(`${MARKS} path[stroke^="#"]:not([d=""])`)
/** The bands under the lines: filled, and the overlapping ones by a gradient. */
const fills = () => cy.get(`${MARKS} path[fill]:not([fill="none"])`)

describe('AreaChart', () => {
  it('draws a line per series with a band under it', () => {
    mountChart()
    lines().should('have.length', 2)
    fills().should('have.length.at.least', 2)
  })

  it('fills an overlapping band by a gradient that fades to the axis', () => {
    mountChart()
    cy.get('[data-slot="chart-plot"] svg linearGradient').should('exist')
  })

  it('fills a stacked band flat, having nothing to see through it', () => {
    mountChart({ stacked: true })
    cy.get('[data-slot="chart-plot"] svg linearGradient').should('not.exist')
    fills().should('have.length.at.least', 2)
  })

  it('takes the stacked bands to a flat top, scaled to 100', () => {
    mountChart({ stacked: 'normalized' })
    fills().should('have.length.at.least', 2)
    cy.get('[data-slot="chart-plot"] svg linearGradient').should('not.exist')
    cy.get('[data-slot="chart-plot"] svg text').should('contain.text', '100')
    // The bands read as shares; the tooltip still carries what was measured.
    cy.get('[data-slot="chart-plot"]').trigger('mousemove', 100, 150)
    cy.get('[data-slot="chart-tooltip"]')
      .should('contain.text', '10')
      .and('contain.text', '71%')
  })

  it('draws a series set to bar as bars beside the bands', () => {
    mountChart({ seriesConfig: { refunds: { type: 'bar' } } })
    lines().should('have.length', 1)
    cy.get(`${MARKS} path[fill^="#"]`).should('have.length', data.length)
  })

  it('washes a band that stacks onto nothing, so the bars stay visible', () => {
    mountChart({ stacked: true, seriesConfig: { refunds: { type: 'bar' } } })
    cy.get('[data-slot="chart-plot"] svg linearGradient').should('exist')
  })

  it('hides a series and its band together', () => {
    mountChart()
    cy.get('[aria-label="Hide Sales"]').click()
    lines().should('have.length', 1)
  })

  it('opens the tooltip on hover', () => {
    mountChart()
    lines().should('have.length', 2)
    cy.get('[data-slot="chart-plot"]').trigger('mousemove', 100, 150)
    cy.get('[data-slot="chart-tooltip"]')
      .should('exist')
      .and('contain.text', 'Sales')
  })

  describe('states', () => {
    /** The state an app styles the card from, without tracking it itself. */
    const container = () => cy.get('[data-slot="chart-container"]')

    it('holds the plot’s shape with a skeleton while loading', () => {
      mountChart({ loading: true })
      container().should('have.attr', 'data-state', 'loading')
      cy.get('[data-slot="chart-loading"] .animate-pulse').should('be.visible')
      // The plot stays mounted — unmounting it would dispose the echarts
      // instance — so it is hidden rather than removed.
      lines().should('not.be.visible')
    })

    it('reports an error over the plot', () => {
      mountChart({ error: 'boom' })
      container().should('have.attr', 'data-state', 'error')
      cy.contains('Could not render this chart').should('be.visible')
      cy.contains('boom').should('be.visible')
    })

    it('says so when there is nothing to plot', () => {
      mountChart({ data: [] })
      container().should('have.attr', 'data-state', 'empty')
      cy.contains('No data to show').should('be.visible')
    })

    it('takes an app’s own placeholder in place of the skeleton', () => {
      mountChart({ loading: true }, { loading: () => h('div', { id: 'own' }) })
      cy.get('#own').should('exist')
      cy.get('[data-slot="chart-loading"] .animate-pulse').should('not.exist')
    })

    it('hands the error to the app’s own message', () => {
      mountChart(
        { error: 'boom' },
        { error: ({ error }: any) => h('span', `Failed: ${error}`) },
      )
      cy.contains('Failed: boom').should('be.visible')
      cy.contains('Could not render this chart').should('not.exist')
    })

    it('takes an app’s own line in place of “No data to show”', () => {
      mountChart({ data: [] }, { empty: () => h('span', 'Widen the filters') })
      cy.contains('Widen the filters').should('be.visible')
      cy.contains('No data to show').should('not.exist')
    })
  })

  describe('slots', () => {
    it('puts an app’s controls in the header', () => {
      mountChart({ title: 'Revenue' }, { actions: () => h('button', 'Export') })
      cy.get('[data-slot="chart-header"]').should('contain.text', 'Export')
    })

    it('takes an app’s own tooltip body', () => {
      mountChart(
        {},
        {
          tooltip: ({ label, items }: any) =>
            h('span', `${label} / ${items.length}`),
        },
      )
      lines().should('have.length', 2)
      cy.get('[data-slot="chart-plot"]').trigger('mousemove', 100, 150)
      cy.get('[data-slot="chart-tooltip"]')
        .should('contain.text', 'Jan / 2')
        // The default body is replaced, not decorated.
        .and('not.contain.text', 'Sales')
    })
  })

  describe('keyboard', () => {
    /** The tab stop: echarts draws into one element, so the plot is the target. */
    const plot = () => cy.get('[data-slot="chart-plot"] [role="img"]')
    /** The tooltip in text, for a reader with no pointer to hang it off. */
    const reading = () => cy.get('[role="status"]')

    it('lands the cursor on the first category and reads it out', () => {
      mountChart()
      lines().should('have.length', 2)
      plot().focus()
      reading().should('contain.text', 'Jan').and('contain.text', 'Sales')
      cy.get('[data-slot="chart-tooltip"]')
        .should('exist')
        .and('contain.text', 'Jan')
    })

    it('steps along the categories with the arrow keys', () => {
      mountChart()
      lines().should('have.length', 2)
      plot().focus()
      plot().type('{rightarrow}')
      reading().should('contain.text', 'Feb')
      cy.get('[data-slot="chart-tooltip"]').should('contain.text', 'Feb')
    })

    it('picks the series Enter fires for with up and down', () => {
      mountChart({ onSelect: cy.spy().as('onSelect') })
      lines().should('have.length', 2)
      plot().focus()
      plot().type('{downarrow}')
      reading().should('contain.text', 'Refunds')
      plot().type('{enter}')
      cy.get('@onSelect').should('have.been.calledWithMatch', {
        seriesName: 'refunds',
        dataIndex: 0,
        value: 4,
        row: { month: 'Jan', refunds: 4 },
      })
    })

    it('emits select for the mark under the cursor', () => {
      mountChart({ onSelect: cy.spy().as('onSelect') })
      lines().should('have.length', 2)
      plot().focus()
      plot().type('{rightarrow}')
      plot().type('{enter}')
      cy.get('@onSelect').should('have.been.calledWithMatch', {
        seriesName: 'sales',
        dataIndex: 1,
        value: 20,
        row: { month: 'Feb', sales: 20 },
      })
    })

    it('drops the tooltip and the reading when focus leaves', () => {
      mountChart()
      lines().should('have.length', 2)
      plot().focus()
      cy.get('[data-slot="chart-tooltip"]').should('exist')
      plot().blur()
      cy.get('[data-slot="chart-tooltip"]').should('not.exist')
      reading().should('have.text', '')
    })
  })
})
