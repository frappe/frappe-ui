import { defineComponent, h } from 'vue'
import DonutChart from './DonutChart.vue'
import './style.css'

const data = [
  { source: 'Search', visits: 50 },
  { source: 'Direct', visits: 30 },
  { source: 'Email', visits: 20 },
]

function mountChart(props: Record<string, any> = {}) {
  return cy.mount(
    defineComponent({
      setup() {
        return () =>
          h('div', { style: 'width: 480px; height: 300px' }, [
            h(DonutChart, {
              data,
              category: 'source',
              value: 'visits',
              echartOptions: { animation: false },
              ...props,
            }),
          ])
      },
    }),
  )
}

const slices = () => cy.get('[data-slot="chart-plot"] svg path[fill^="#"]')

describe('DonutChart', () => {
  it('draws a slice per row', () => {
    mountChart()
    slices().should('have.length', data.length)
  })

  it('reads out the total in the hole, captioned by the value column', () => {
    mountChart()
    cy.get('[data-slot="chart-plot"]')
      .should('contain.text', '100')
      .and('contain.text', 'Visits')
  })

  /**
   * A ring slice's bounding box is centred on the hole, so neither Cypress nor
   * echarts finds the slice at the point they aim at. Both cases below point at
   * the band itself: the first slice sweeps clockwise from the top, so a point
   * out to the right of centre lands on it.
   */
  const onFirstSlice = () => cy.get('[data-slot="chart-plot"] > div > div')

  it('swaps the readout to the slice under the pointer', () => {
    mountChart()
    slices().should('have.length', data.length)
    onFirstSlice().trigger('mousemove', 350, 135)
    cy.get('[data-slot="chart-plot"]')
      .should('contain.text', 'Search')
      .and('contain.text', '50%')
  })

  it('emits sliceClick with the row behind the slice', () => {
    mountChart({ onSliceClick: cy.spy().as('onClick') })
    slices().should('have.length', data.length)
    onFirstSlice().click(350, 135)
    cy.get('@onClick')
      .should('have.been.calledWithMatch', {
        name: 'Search',
        value: 50,
        percent: 50,
      })
      // Every row behind the slice, so an "Others" click carries the group.
      .and('have.been.calledWithMatch', {
        rows: [{ source: 'Search', visits: 50 }],
      })
  })

  it('lists the slices in the legend with their share', () => {
    mountChart()
    cy.get('[data-slot="chart-legend"] button').should('have.length', 3)
    cy.get('[data-slot="chart-legend"]').should('contain.text', '50%')
  })

  it('hides a slice and re-shares the rest against what is left', () => {
    mountChart()
    cy.get('[aria-label="Hide Search"]').click()
    slices().should('have.length', 2)
    // 30 of the 50 still on the ring.
    cy.get('[data-slot="chart-legend"]').should('contain.text', '60%')
  })

  it('gives up the readout when the labels move onto the ring', () => {
    mountChart({ showInlineLabels: true })
    cy.get('[data-slot="chart-plot"]').should('not.contain.text', 'Visits')
    cy.get('[data-slot="chart-plot"] svg text').should('contain.text', 'Search')
  })

  it('sweeps the top half only in the half variant', () => {
    mountChart({ variant: 'half' })
    slices().should('have.length', data.length)
    cy.get('[data-slot="chart-plot"]').should('contain.text', '100')
  })

  it('folds the tail into one slice past maxSlices', () => {
    mountChart({ maxSlices: 2 })
    slices().should('have.length', 2)
    cy.get('[data-slot="chart-legend"]').should('contain.text', 'Others')
  })
})
