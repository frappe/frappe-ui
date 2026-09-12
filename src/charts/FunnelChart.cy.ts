import { defineComponent, h } from 'vue'
import FunnelChart from './FunnelChart.vue'
import './style.css'

const data = [
  { stage: 'Visited', deals: 50 },
  { stage: 'Demoed', deals: 30 },
  { stage: 'Won', deals: 20 },
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
              FunnelChart,
              {
                data,
                category: 'stage',
                value: 'deals',
                ...props,
              },
              slots,
            ),
          ])
      },
    }),
  )
}

/** One hit area per stage; the columns behind them are aria-hidden. */
const hitAreas = () => cy.get('[data-slot="chart-container"] button')
const columns = () => cy.get('[data-slot="chart-container"] svg path')

describe('FunnelChart', () => {
  it('heads each stage with its name and count, in process order', () => {
    mountChart()
    cy.get('[data-slot="chart-container"]')
      .invoke('text')
      .should('match', /Visited\s*50.*Demoed\s*30.*Won\s*20/s)
  })

  it('draws a column per stage', () => {
    mountChart()
    columns().should('have.length', data.length)
  })

  it('leaves out a stage whose count it cannot read', () => {
    mountChart({
      data: [
        { stage: 'Visited', deals: 50 },
        { stage: 'Demoed', deals: 'n/a' },
        { stage: 'Won', deals: 20 },
      ],
    })
    columns().should('have.length', 2)
    cy.get('[data-slot="chart-container"]').should('not.contain.text', 'Demoed')
  })

  it('prints each stage against the first, and nothing against the first', () => {
    mountChart()
    cy.get('[data-slot="chart-container"]')
      .should('contain.text', '60%')
      .and('contain.text', '40%')
      .and('not.contain.text', '100%')
  })

  it('gives every stage a hit area that names it', () => {
    mountChart()
    hitAreas().should('have.length', data.length)
    cy.get('[aria-label="Visited, 50"]').should('exist')
  })

  it('emits select with the row behind the stage', () => {
    mountChart({ onSelect: cy.spy().as('onSelect') })
    cy.get('[aria-label="Demoed, 30"]').click()
    cy.get('@onSelect').should('have.been.calledWithMatch', {
      name: 'Demoed',
      label: 'Demoed',
      value: 30,
      row: { stage: 'Demoed', deals: 30 },
    })
  })

  it('opens the tooltip over the stage under the pointer', () => {
    mountChart()
    cy.get('[aria-label="Won, 20"]').trigger('mouseenter')
    cy.get('[data-slot="chart-tooltip"]')
      .should('exist')
      .and('contain.text', 'Won')
  })

  it('reads both conversion rates in the tooltip, against the first stage and the one before', () => {
    mountChart()
    cy.get('[aria-label="Won, 20"]').trigger('mouseenter')
    cy.get('[data-slot="chart-tooltip"]')
      .should('contain.text', 'of Visited')
      .and('contain.text', '40%')
      .and('contain.text', 'of Demoed')
      .and('contain.text', '67%')
  })

  describe('keyboard', () => {
    // The funnel draws its own HTML, so each stage is a tab stop of its own —
    // no arrow-key cursor, unlike the echarts plots.
    it('reaches a stage by keyboard, not by pointer alone', () => {
      mountChart()
      cy.get('[aria-label="Visited, 50"]').focus()
      cy.get('[data-slot="chart-tooltip"]')
        .should('exist')
        .and('contain.text', 'Visited')
    })

    it('hangs the tooltip off the focused stage, having no pointer to follow', () => {
      mountChart()
      // Two stages far apart along the row: the tooltip follows the focus, so
      // the second reading sits well to the right of the first.
      cy.get('[aria-label="Visited, 50"]').focus()
      cy.get('[data-slot="chart-tooltip"]')
        .then(($first) => $first[0].getBoundingClientRect().left)
        .then((firstLeft) => {
          cy.get('[aria-label="Won, 20"]').focus()
          cy.get('[data-slot="chart-tooltip"]').should(($last) => {
            expect($last[0].getBoundingClientRect().left).to.be.greaterThan(
              firstLeft,
            )
          })
        })
    })

    it('emits select from the focused stage', () => {
      mountChart({ onSelect: cy.spy().as('onSelect') })
      cy.get('[aria-label="Won, 20"]').focus().type('{enter}')
      cy.get('@onSelect').should('have.been.calledWithMatch', {
        label: 'Won',
        value: 20,
        row: { stage: 'Won', deals: 20 },
      })
    })

    it('drops the tooltip when focus leaves', () => {
      mountChart()
      cy.get('[aria-label="Visited, 50"]').focus()
      cy.get('[data-slot="chart-tooltip"]').should('exist')
      cy.get('[aria-label="Visited, 50"]').blur()
      cy.get('[data-slot="chart-tooltip"]').should('not.exist')
    })
  })

  describe('states', () => {
    /** The state an app styles the card from, without tracking it itself. */
    const container = () => cy.get('[data-slot="chart-container"]')

    it('holds the plot’s shape with a skeleton while loading', () => {
      mountChart({ loading: true })
      container().should('have.attr', 'data-state', 'loading')
      cy.get('[data-slot="chart-loading"] .animate-pulse').should('be.visible')
      columns().should('not.be.visible')
    })

    it('reports an error over the funnel', () => {
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

    it('says so when no row carries a count', () => {
      mountChart({ data: [{ stage: 'Visited', deals: null }] })
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
      mountChart(
        { title: 'Pipeline' },
        { actions: () => h('button', 'Export') },
      )
      cy.get('[data-slot="chart-header"]').should('contain.text', 'Export')
    })

    it('takes an app’s own tooltip body, with the rates among the items', () => {
      mountChart(
        {},
        {
          tooltip: ({ items, rows }: any) =>
            h(
              'span',
              `${rows[0].stage} at ${
                items.find((item: any) => item.name === 'ofPrevious')
                  .formattedValue
              }`,
            ),
        },
      )
      cy.get('[aria-label="Won, 20"]').focus()
      cy.get('[data-slot="chart-tooltip"]')
        .should('contain.text', 'Won at 67%')
        // The default body is replaced, not decorated.
        .and('not.contain.text', 'of Visited')
    })
  })
})
