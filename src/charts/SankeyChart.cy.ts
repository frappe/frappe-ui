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

/**
 * Charts fill their container, so every case needs one with a size. Animation
 * is off: a band grows out of its source node, and until it has arrived there
 * is nothing under the pointer.
 */
function mountChart(
  props: Record<string, any> = {},
  slots?: Record<string, (props?: any) => unknown>,
) {
  return cy.mount(
    defineComponent({
      setup() {
        return () =>
          h('div', { style: 'width: 520px; height: 320px' }, [
            h(
              SankeyChart,
              {
                data,
                source: 'from',
                target: 'to',
                value: 'signups',
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

/** The one tab stop the flow takes: echarts draws no per-band DOM node. */
const plot = () => cy.get('[data-slot="chart-plot"] [role="img"]')

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

  it('emits select with the row behind the band', () => {
    mountChart({ onSelect: cy.spy().as('onSelect') })
    bands().first().click({ force: true })
    cy.get('@onSelect').should('have.been.calledWithMatch', {
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
      bands().should('not.exist')
      container().should('have.attr', 'data-state', 'empty')
    })

    it('reads as ready once the flow is drawn', () => {
      mountChart()
      bands().should('have.length', data.length)
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
      mountChart(
        { title: 'Signup flow' },
        { actions: () => h('button', 'Week') },
      )
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
      // known band, so the slot props are the first row's every run.
      mountChart(
        {},
        { tooltip: ({ label }: any) => h('span', `flow ${label}`) },
      )
      bands().should('have.length', data.length)
      plot().focus()
      cy.get('[data-slot="chart-tooltip"]')
        .should('contain.text', 'flow Search → Trial')
        .and('not.contain.text', 'Signups')
    })
  })

  // echarts draws into one element, so the flow takes a single tab stop and the
  // arrow keys walk a cursor along its bands.
  describe('keyboard', () => {
    it('opens the tooltip on the first band and reads it out', () => {
      mountChart()
      bands().should('have.length', data.length)
      plot().should('have.attr', 'tabindex', '0')
      plot().focus()
      cy.get('[data-slot="chart-tooltip"]').should(
        'contain.text',
        'Search → Trial',
      )
      cy.get('[role="status"]').should('not.have.text', '')
    })

    it('walks the bands with an arrow key', () => {
      mountChart()
      bands().should('have.length', data.length)
      plot().focus()
      plot().type('{rightarrow}')
      cy.get('[data-slot="chart-tooltip"]').should(
        'contain.text',
        'Referral → Trial',
      )
    })

    it('fires select on Enter, for the band under the cursor', () => {
      mountChart({ onSelect: cy.spy().as('onSelect') })
      bands().should('have.length', data.length)
      plot().focus()
      plot().type('{rightarrow}{enter}')
      cy.get('@onSelect').should('have.been.calledWithMatch', {
        source: 'Referral',
        target: 'Trial',
        value: 80,
        row: { from: 'Referral', to: 'Trial', signups: 80 },
      })
    })

    it('clears the tooltip and the reading on blur', () => {
      mountChart()
      bands().should('have.length', data.length)
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
