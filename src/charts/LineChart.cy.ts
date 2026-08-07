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

/** The series strokes. Gridlines are paths too, but stroked in a theme oklch. */
const lines = () => cy.get('[data-slot="chart-plot"] svg path[stroke^="#"]')

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
    cy.get('[data-slot="chart-plot"] svg path[fill^="#"]').first().click()
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
    const fills = () =>
      cy.get('[data-slot="chart-plot"] svg path[fill]:not([fill="none"])')

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
      cy.get('[data-slot="chart-plot"] svg path[fill^="#"]').should(
        'have.length',
        data.length,
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
    cy.get('[data-slot="chart-card"]')
      .should('contain.text', 'Sales')
      .and('contain.text', 'Refunds')
  })
})
