import { defineComponent, h } from 'vue'
import DonutChart from './DonutChart.vue'
import './style.css'

const data = [
  { source: 'Search', visits: 50 },
  { source: 'Direct', visits: 30 },
  { source: 'Email', visits: 20 },
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
              DonutChart,
              {
                data,
                category: 'source',
                value: 'visits',
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

  it('emits select with the row behind the slice', () => {
    mountChart({ onSelect: cy.spy().as('onSelect') })
    slices().should('have.length', data.length)
    onFirstSlice().click(350, 135)
    cy.get('@onSelect')
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

  describe('states', () => {
    /** The state an app styles the card from, without tracking it itself. */
    const container = () => cy.get('[data-slot="chart-container"]')

    it('holds the plot’s shape with a skeleton while loading', () => {
      mountChart({ loading: true })
      container().should('have.attr', 'data-state', 'loading')
      cy.get('[data-slot="chart-loading"] .animate-pulse').should('be.visible')
      // The ring stays mounted — unmounting it would dispose the echarts
      // instance — so it is hidden rather than removed.
      slices().should('not.be.visible')
    })

    it('reports an error over the ring', () => {
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
      mountChart({ title: 'Traffic' }, { actions: () => h('button', 'Export') })
      cy.get('[data-slot="chart-header"]').should('contain.text', 'Export')
    })

    it('takes an app’s own readout in the hole', () => {
      mountChart(
        {},
        {
          center: ({ value, label }: any) => h('span', `${value} of ${label}`),
        },
      )
      cy.get('[data-slot="chart-plot"]').should('contain.text', '100 of Visits')
    })

    it('reads the hovered slice into the readout slot', () => {
      mountChart(
        {},
        {
          center: ({ label, percent }: any) =>
            h('span', `${label} ${percent ?? ''}`),
        },
      )
      slices().should('have.length', data.length)
      // A ring slice's box is centred on the hole, so the point aims at the
      // band itself: the first slice sweeps clockwise from the top.
      cy.get('[data-slot="chart-plot"] > div > div').trigger(
        'mousemove',
        350,
        135,
      )
      cy.get('[data-slot="chart-plot"]').should('contain.text', 'Search 50%')
    })

    it('takes an app’s own tooltip body', () => {
      mountChart(
        {},
        { tooltip: ({ items }: any) => h('span', `only ${items[0].label}`) },
      )
      slices().should('have.length', data.length)
      cy.get('[data-slot="chart-plot"] [role="img"]').focus()
      cy.get('[data-slot="chart-tooltip"]').should(
        'contain.text',
        'only Search',
      )
    })
  })

  describe('keyboard', () => {
    /** The tab stop: echarts draws into one element, so the ring is the target. */
    const plot = () => cy.get('[data-slot="chart-plot"] [role="img"]')
    /** The tooltip in text, for a reader with no pointer to hang it off. */
    const reading = () => cy.get('[role="status"]')

    it('lands the cursor on the first slice and reads it out', () => {
      mountChart()
      slices().should('have.length', data.length)
      plot().focus()
      reading().should('contain.text', 'Search').and('contain.text', '50%')
      cy.get('[data-slot="chart-tooltip"]')
        .should('exist')
        .and('contain.text', 'Search')
    })

    it('walks the ring with the arrow keys', () => {
      mountChart()
      slices().should('have.length', data.length)
      plot().focus()
      plot().type('{rightarrow}')
      reading().should('contain.text', 'Direct')
      cy.get('[data-slot="chart-tooltip"]').should('contain.text', 'Direct')
    })

    it('emits select for the slice under the cursor', () => {
      mountChart({ onSelect: cy.spy().as('onSelect') })
      slices().should('have.length', data.length)
      plot().focus()
      plot().type('{rightarrow}')
      plot().type('{enter}')
      cy.get('@onSelect').should('have.been.calledWithMatch', {
        name: 'Direct',
        value: 30,
        percent: 30,
        rows: [{ source: 'Direct', visits: 30 }],
      })
    })

    it('drops the tooltip and the reading when focus leaves', () => {
      mountChart()
      slices().should('have.length', data.length)
      plot().focus()
      cy.get('[data-slot="chart-tooltip"]').should('exist')
      plot().blur()
      cy.get('[data-slot="chart-tooltip"]').should('not.exist')
      reading().should('have.text', '')
    })
  })
})
