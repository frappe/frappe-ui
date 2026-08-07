import { defineComponent, h } from 'vue'
import AreaChart from './AreaChart.vue'
import './style.css'

const data = [
  { month: 'Jan', sales: 10, refunds: 4 },
  { month: 'Feb', sales: 20, refunds: 6 },
  { month: 'Mar', sales: 15, refunds: 2 },
]

function mountChart(props: Record<string, any> = {}) {
  return cy.mount(
    defineComponent({
      setup() {
        return () =>
          h('div', { style: 'width: 480px; height: 300px' }, [
            h(AreaChart, {
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

const lines = () => cy.get('[data-slot="chart-plot"] svg path[stroke^="#"]')
/** The bands under the lines: filled, and the overlapping ones by a gradient. */
const fills = () =>
  cy.get('[data-slot="chart-plot"] svg path[fill]:not([fill="none"])')

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
    cy.get('[data-slot="chart-plot"] svg path[fill^="#"]').should(
      'have.length',
      data.length,
    )
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
})
