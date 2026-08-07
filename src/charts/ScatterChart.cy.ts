import { defineComponent, h } from 'vue'
import ScatterChart from './ScatterChart.vue'
import './style.css'

const data = [
  { account: 'Acme', spend: 400, revenue: 1200, seats: 20, region: 'EU' },
  { account: 'Globex', spend: 900, revenue: 2400, seats: 60, region: 'EU' },
  { account: 'Initech', spend: 200, revenue: 300, seats: 10, region: 'US' },
  { account: 'Umbrella', spend: 700, revenue: 900, seats: 40, region: 'US' },
]

function mountChart(props: Record<string, any> = {}) {
  return cy.mount(
    defineComponent({
      setup() {
        return () =>
          h('div', { style: 'width: 480px; height: 320px' }, [
            h(ScatterChart, {
              data,
              x: 'spend',
              y: 'revenue',
              echartOptions: { animation: false },
              ...props,
            }),
          ])
      },
    }),
  )
}

/** Symbols carry a translucent fill; nothing else in the plot is filled. */
const points = () => cy.get('[data-slot="chart-plot"] svg path[fill-opacity]')

describe('ScatterChart', () => {
  it('draws a point per row, on two measured axes', () => {
    mountChart()
    points().should('have.length', data.length)
    cy.get('[data-slot="chart-plot"] svg text')
      .should('contain.text', '400')
      .and('contain.text', '2.4K')
  })

  it('keeps one series and no legend when nothing groups the rows', () => {
    mountChart()
    cy.get('[data-slot="chart-legend"]').should('not.exist')
  })

  it('splits the rows into groups the legend names', () => {
    mountChart({ series: 'region' })
    points().should('have.length', data.length)
    cy.get('[data-slot="chart-legend"] button')
      .should('have.length', 2)
      .and('contain.text', 'EU')
    cy.get('[data-slot="chart-legend"]').should('contain.text', 'US')
  })

  it('colors a group from the palette', () => {
    mountChart({ series: 'region' })
    points().then((els) => {
      const fills = [...els].map((el) => el.getAttribute('fill'))
      expect(new Set(fills).size).to.eq(2)
    })
  })

  it('takes a group out of the plot when its legend entry is pressed', () => {
    mountChart({ series: 'region' })
    points().should('have.length', 4)
    cy.get('[data-slot="chart-legend"] button').first().click()
    points().should('have.length', 2)
  })

  it('sizes the points by the size column', () => {
    mountChart({ size: 'seats' })
    // Four distinct seat counts, so four distinct symbol geometries.
    points().then((els) => {
      const shapes = [...els].map((el) => el.getAttribute('d'))
      expect(new Set(shapes).size).to.eq(data.length)
    })
  })

  it('draws every point alike without a size column', () => {
    mountChart()
    points().then((els) => {
      const widths = [...els].map((el) => el.getBoundingClientRect().width)
      expect(new Set(widths).size).to.eq(1)
    })
  })

  it('emits pointClick with the row behind the point', () => {
    mountChart({ label: 'account', onPointClick: cy.spy().as('onClick') })
    points().first().click({ force: true })
    cy.get('@onClick').should('have.been.calledWithMatch', {
      x: 400,
      y: 1200,
      label: 'Acme',
      row: { account: 'Acme', spend: 400, revenue: 1200 },
    })
  })

  it('opens the tooltip over the point under the pointer', () => {
    mountChart({ label: 'account', size: 'seats' })
    points().should('have.length', data.length)
    points().first().trigger('mousemove', { force: true })
    cy.get('[data-slot="chart-tooltip"]')
      .should('contain.text', 'Acme')
      .and('contain.text', 'Spend')
      .and('contain.text', 'Revenue')
      .and('contain.text', 'Seats')
  })

  it('prints the measures through `format`', () => {
    mountChart({ format: (value: number) => `$${value}` })
    points().first().trigger('mousemove', { force: true })
    cy.get('[data-slot="chart-tooltip"]').should('contain.text', '$400')
  })

  it('heads the plot with the y axis title and puts the x title on its axis', () => {
    mountChart({
      xAxis: { title: 'spend' },
      yAxis: { title: 'revenue' },
    })
    cy.get('[data-slot="chart-container"]').should('contain.text', 'Revenue')
    cy.get('[data-slot="chart-plot"] svg text').should('contain.text', 'Spend')
  })

  it('has nothing to draw without rows', () => {
    mountChart({ data: [] })
    cy.get('[data-slot="chart-plot"]').should('contain.text', 'No data to show')
  })

  it('names the plot for a screen reader', () => {
    mountChart({ title: 'Spend vs revenue', subtitle: 'Top accounts' })
    cy.get('[data-slot="chart-plot"] [role="img"]').should(
      'have.attr',
      'aria-label',
      'Spend vs revenue, Top accounts',
    )
  })
})
