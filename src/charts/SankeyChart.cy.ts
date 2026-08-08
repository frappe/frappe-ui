import { defineComponent, h } from 'vue'
import SankeyChart from './SankeyChart.vue'
import './style.css'

const data = [
  { from: 'Search', to: 'Trial', signups: 120 },
  { from: 'Referral', to: 'Trial', signups: 80 },
  { from: 'Trial', to: 'Paid', signups: 60 },
  { from: 'Trial', to: 'Churned', signups: 140 },
]

const NODE_COUNT = 5

function mountChart(props: Record<string, any> = {}) {
  return cy.mount(
    defineComponent({
      setup() {
        return () =>
          h('div', { style: 'width: 520px; height: 320px' }, [
            h(SankeyChart, {
              data,
              source: 'from',
              target: 'to',
              value: 'signups',
              echartOptions: { animation: false },
              ...props,
            }),
          ])
      },
    }),
  )
}

/** Bands carry the source node's color at `lineStyle.opacity`; nodes are opaque. */
const bands = () => cy.get('[data-slot="chart-plot"] svg path[fill-opacity]')
const nodes = () =>
  cy.get('[data-slot="chart-plot"] svg path[fill^="#"]:not([fill-opacity])')

describe('SankeyChart', () => {
  it('draws a band per row, between the nodes the rows name', () => {
    mountChart()
    bands().should('have.length', data.length)
    nodes().should('have.length', NODE_COUNT)
  })

  it('labels every node with its name and what passes through it', () => {
    mountChart()
    cy.get('[data-slot="chart-plot"] svg text')
      .should('contain.text', 'Search')
      .and('contain.text', 'Trial')
      .and('contain.text', 'Churned')
      // 120 in from Search and 80 from Referral, 200 out.
      .and('contain.text', '200')
  })

  it('prints node values through `format`', () => {
    mountChart({ format: (value: number) => `${value} signups` })
    cy.get('[data-slot="chart-plot"] svg text').should(
      'contain.text',
      '200 signups',
    )
  })

  it('emits linkClick with the row behind the band', () => {
    mountChart({ onLinkClick: cy.spy().as('onClick') })
    bands().first().click({ force: true })
    cy.get('@onClick').should('have.been.calledWithMatch', {
      source: 'Search',
      target: 'Trial',
      value: 120,
      row: { from: 'Search', to: 'Trial', signups: 120 },
    })
  })

  it('opens the tooltip over the band under the pointer', () => {
    mountChart()
    bands().should('have.length', data.length)
    cy.get('[data-slot="chart-plot"]').trigger('mousemove', 200, 120)
    cy.get('[data-slot="chart-tooltip"]').should('exist')
  })

  it('has nothing to draw when every flow is zero', () => {
    mountChart({ data: data.map((row) => ({ ...row, signups: 0 })) })
    cy.get('[data-slot="chart-plot"]').should('contain.text', 'No data to show')
  })

  it('turns the flow downwards on request', () => {
    mountChart({ orient: 'vertical' })
    // The plot is wider than it is tall, so a vertical flow packs the first
    // column across the top rather than down the left edge.
    nodes().should('have.length', NODE_COUNT)
    cy.get('[data-slot="chart-plot"] svg text').should('contain.text', 'Paid')
  })

  it('drops a self link rather than hanging on it', () => {
    mountChart({ data: [...data, { from: 'Paid', to: 'Paid', signups: 30 }] })
    bands().should('have.length', data.length)
  })

  it('names the plot for a screen reader', () => {
    mountChart({ title: 'Signup flow', subtitle: 'Last 30 days' })
    cy.get('[data-slot="chart-plot"] [role="img"]').should(
      'have.attr',
      'aria-label',
      'Signup flow, Last 30 days',
    )
  })
})
