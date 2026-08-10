import { defineComponent, h, ref } from 'vue'
import LineChart from './LineChart.vue'
import './style.css'

const data = [
  { month: 'Jan', sales: 10, refunds: 4 },
  { month: 'Feb', sales: 20, refunds: 6 },
  { month: 'Mar', sales: 15, refunds: 2 },
]

/** Animation off: a line draws itself in, and half a line is not clickable. */
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
              LineChart,
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

describe('LineChart', () => {
  it('draws one line per series, through every category', () => {
    mountChart()
    lines().should('have.length', 2)
    cy.get('[data-slot="chart-plot"] svg text')
      .should('contain.text', 'Jan')
      .and('contain.text', 'Mar')
  })

  it('opens the tooltip on hover, with every series at that category', () => {
    mountChart()
    lines().should('have.length', 2)
    cy.get('[data-slot="chart-plot"]').trigger('mousemove', 100, 150)
    cy.get('[data-slot="chart-tooltip"]')
      .should('exist')
      .and('contain.text', 'Sales')
      .and('contain.text', 'Refunds')
  })

  it('emits select with the row behind the point', () => {
    mountChart({
      seriesConfig: { sales: { showDataPoints: true } },
      onSelect: cy.spy().as('onSelect'),
    })
    // The stroke is a thin target; the symbols are what a reader aims at.
    cy.get(`${MARKS} path[fill^="#"]`).first().click()
    cy.get('@onSelect').should('have.been.calledWithMatch', {
      seriesName: 'sales',
      row: { month: 'Jan', sales: 10 },
    })
  })

  describe('legend', () => {
    it('hides a series when its entry is pressed, and brings it back', () => {
      mountChart()
      cy.get('[aria-label="Hide Sales"]').click()
      lines().should('have.length', 1)

      cy.get('[aria-label="Show Sales"]').click()
      lines().should('have.length', 2)
    })

    it('round-trips v-model:hiddenSeries', () => {
      const hidden = ref<string[]>([])
      cy.mount(
        defineComponent({
          setup() {
            return () =>
              h('div', { style: 'width: 480px; height: 300px' }, [
                h(LineChart, {
                  data,
                  x: 'month',
                  y: ['sales', 'refunds'],
                  echartOptions: { animation: false },
                  hiddenSeries: hidden.value,
                  'onUpdate:hiddenSeries': (v: string[]) => (hidden.value = v),
                }),
              ])
          },
        }),
      )

      cy.get('[aria-label="Hide Refunds"]')
        .click()
        .then(() => expect(hidden.value).to.deep.equal(['refunds']))
      lines().should('have.length', 1)
    })
  })

  describe('combo series', () => {
    /** A filled band: every path with a fill that is not the "none" of a stroke. */
    const fills = () => cy.get(`${MARKS} path[fill]:not([fill="none"])`)

    it('fills one series on type: area and leaves the other bare', () => {
      mountChart({ seriesConfig: { sales: { type: 'area' } } })
      lines().should('have.length', 2)
      fills().should('have.length', 1)
      // The wash of an unstacked area fades towards the axis.
      cy.get('[data-slot="chart-plot"] svg linearGradient').should('exist')
    })

    it('draws a series set to bar as bars', () => {
      mountChart({ seriesConfig: { refunds: { type: 'bar' } } })
      lines().should('have.length', 1)
      cy.get(`${MARKS} path[fill^="#"]`).should('have.length', data.length)
    })
  })

  describe('reference lines', () => {
    it('draws a rule that is neither a series nor a legend entry', () => {
      mountChart({ referenceLines: [{ value: 12, label: 'Target' }] })
      cy.get('[data-slot="chart-plot"] svg text').should(
        'contain.text',
        'Target',
      )
      // The rule takes its ink from the theme, not from the palette, so the
      // hex-stroked paths are still the two series.
      lines().should('have.length', 2)
      cy.get('[data-slot="chart-legend"] button').should('have.length', 2)
    })

    it('reads a y2 line against the second axis', () => {
      mountChart({
        seriesConfig: { refunds: { axis: 'y2' } },
        referenceLines: [
          { value: 15, label: 'Sales target' },
          { value: 5, axis: 'y2', label: 'Refund cap' },
        ],
      })
      cy.get('[data-slot="chart-plot"] svg text')
        .should('contain.text', 'Sales target')
        .and('contain.text', 'Refund cap')
    })

    it('leaves the rule in place while every series is switched off', () => {
      // Inside refunds' own range, so the rule stays on the scale the plot
      // settles at: a line off the end of the axis is not drawn, which would
      // pass this test for the wrong reason.
      mountChart({ referenceLines: [{ value: 5, label: 'Target' }] })
      cy.get('[aria-label="Hide Sales"]').click()
      cy.get('[aria-label="Hide Refunds"]').click()
      lines().should('not.exist')
      cy.get('[data-slot="chart-plot"] svg text').should(
        'contain.text',
        'Target',
      )
    })
  })

  it('measures a y2 series against a second axis, drawn opposite', () => {
    mountChart({ seriesConfig: { refunds: { axis: 'y2' } } })
    lines().should('have.length', 2)
    // Two scales, so the axis labels no longer share a single set of values.
    cy.get('[data-slot="chart-plot"] svg text').should('contain.text', '6')
  })

  describe('numeric x axis', () => {
    /**
     * Uneven quantities: two neighbours and one far out. Evenly spaced numbers
     * draw the same on either reading, which would prove nothing.
     */
    const byDiscount = [
      { discount: 1, revenue: 10 },
      { discount: 2, revenue: 20 },
      { discount: 100, revenue: 30 },
    ]

    /** The symbols. A stroke has no position of its own; a dot does. */
    const dots = () => cy.get(`${MARKS} path[fill^="#"]`)

    function mountNumeric() {
      return cy.mount(
        defineComponent({
          setup() {
            return () =>
              h('div', { style: 'width: 480px; height: 300px' }, [
                h(LineChart, {
                  data: byDiscount,
                  x: 'discount',
                  y: 'revenue',
                  xAxis: { type: 'value' },
                  seriesConfig: { revenue: { showDataPoints: true } },
                  echartOptions: { animation: false },
                }),
              ])
          },
        }),
      )
    }

    it('places a point at its value, not in its row’s slot', () => {
      mountNumeric()
      dots().should('have.length', byDiscount.length)
      dots().then(($dots) => {
        const centers = [...$dots]
          .map((el) => {
            const box = el.getBoundingClientRect()
            return box.left + box.width / 2
          })
          .sort((a, b) => a - b)

        const [first, second, third] = centers

        // Three slots put the same distance between both pairs, whatever the
        // numbers say. Drawn on the scale, the gaps hold the ratio of the
        // numbers behind them: 1 to 2 is a 99th of 1 to 100. Which axis the
        // plot took is the whole of the difference between the two.
        expect((second - first) / (third - first)).to.be.closeTo(1 / 99, 0.005)
      })
    })
  })

  it('titles each value axis over the edge its axis is drawn on', () => {
    mountChart({
      seriesConfig: { refunds: { axis: 'y2' } },
      yAxis: { title: 'Sales' },
      y2Axis: { title: 'Refunds' },
    })
    cy.get('[data-slot="chart-container"]')
      .should('contain.text', 'Sales')
      .and('contain.text', 'Refunds')
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
