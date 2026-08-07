import { defineComponent, h } from 'vue'
import HeatmapChart from './HeatmapChart.vue'
import './style.css'

const data = [
  { day: 'Mon', hour: '9am', tickets: 4 },
  { day: 'Mon', hour: '10am', tickets: 8 },
  { day: 'Tue', hour: '9am', tickets: 2 },
  { day: 'Tue', hour: '10am', tickets: 6 },
]

function mountChart(props: Record<string, any> = {}) {
  return cy.mount(
    defineComponent({
      setup() {
        return () =>
          h('div', { style: 'width: 480px; height: 300px' }, [
            h(HeatmapChart, {
              data,
              x: 'hour',
              y: 'day',
              value: 'tickets',
              echartOptions: { animation: false },
              ...props,
            }),
          ])
      },
    }),
  )
}

/** Cells carry a computed rgb() fill; nothing else in the plot is filled. */
const cells = () => cy.get('[data-slot="chart-plot"] svg path[fill^="rgb"]')

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

  it('stands the scale in for a legend, ends labelled', () => {
    mountChart()
    cy.get('[data-slot="chart-container"]')
      .should('contain.text', '2')
      .and('contain.text', '8')
    cy.get('[data-slot="chart-legend"] button').should('not.exist')
  })

  it('takes the ends of the scale from the props', () => {
    mountChart({ min: 0, max: 10 })
    cy.get('[data-slot="chart-container"]')
      .should('contain.text', '0')
      .and('contain.text', '10')
  })

  it('prints the values in the cells on request', () => {
    mountChart({ showValues: true })
    cy.get('[data-slot="chart-plot"] svg text').should('contain.text', '8')
  })

  it('emits cellClick with the row behind the cell', () => {
    mountChart({ onCellClick: cy.spy().as('onClick') })
    cells().first().click()
    cy.get('@onClick').should('have.been.calledWithMatch', {
      row: { day: 'Mon', hour: '9am', tickets: 4 },
    })
  })

  it('opens the tooltip over the cell under the pointer', () => {
    mountChart()
    cells().should('have.length', data.length)
    cy.get('[data-slot="chart-plot"]').trigger('mousemove', 100, 60)
    cy.get('[data-slot="chart-tooltip"]').should('exist')
  })
})
