import { defineComponent, h, ref } from 'vue'
import LineChart from './LineChart.vue'
import './style.css'

const data = [
  { month: 'Jan', sales: 10, refunds: 4 },
  { month: 'Feb', sales: 20, refunds: 6 },
  { month: 'Mar', sales: 15, refunds: 2 },
]

/** Animation off: a line draws itself in, and half a line is not clickable. */
function mountChart(props: Record<string, any> = {}) {
  return cy.mount(
    defineComponent({
      setup() {
        return () =>
          h('div', { style: 'width: 480px; height: 300px' }, [
            h(LineChart, {
              data,
              x: 'month',
              y: ['sales', 'refunds'],
              echartOptions: { animation: false },
              ...props,
            }),
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

  it('emits datapointClick with the row behind the point', () => {
    mountChart({
      seriesConfig: { sales: { showDataPoints: true } },
      onDatapointClick: cy.spy().as('onClick'),
    })
    // The stroke is a thin target; the symbols are what a reader aims at.
    cy.get(`${MARKS} path[fill^="#"]`).first().click()
    cy.get('@onClick').should('have.been.calledWithMatch', {
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
        y: 'sales',
        y2: 'refunds',
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
    mountChart({ y: 'sales', y2: 'refunds' })
    lines().should('have.length', 2)
    // Two scales, so the axis labels no longer share a single set of values.
    cy.get('[data-slot="chart-plot"] svg text').should('contain.text', '6')
  })

  it('titles each value axis over the edge its axis is drawn on', () => {
    mountChart({
      y: 'sales',
      y2: 'refunds',
      yAxis: { title: 'Sales' },
      y2Axis: { title: 'Refunds' },
    })
    cy.get('[data-slot="chart-container"]')
      .should('contain.text', 'Sales')
      .and('contain.text', 'Refunds')
  })
})
