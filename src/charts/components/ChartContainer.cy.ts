import { defineComponent, h } from 'vue'
import ChartContainer from './ChartContainer.vue'
import '../style.css'

/**
 * The container fills its box and hands the leftover height to the plot, so
 * every case needs a box with a size. The default slot stands in for the plot
 * an app would draw there.
 */
function mountContainer(
  props: Record<string, any> = {},
  slots: Record<string, (props?: any) => unknown> = {
    default: () => h('div', { id: 'plot' }, 'Plot'),
  },
) {
  return cy.mount(
    defineComponent({
      setup() {
        return () =>
          h('div', { style: 'width: 480px; height: 300px' }, [
            h(ChartContainer, props, slots),
          ])
      },
    }),
  )
}

const container = () => cy.get('[data-slot="chart-container"]')
const plot = () => cy.get('[data-slot="chart-plot"]')

describe('ChartContainer', () => {
  // v-model is N/A: the container holds no value. It is told a state and draws
  // it; nothing inside it changes a value the parent owns.

  it('renders the plot it is given, with no header of its own', () => {
    mountContainer()
    container().should('have.attr', 'data-state', 'ready')
    cy.get('#plot').should('exist')
    cy.get('[data-slot="chart-header"]').should('not.exist')
  })

  describe('header', () => {
    it('prints the title and the subtitle', () => {
      mountContainer({ title: 'Revenue', subtitle: 'By month' })
      cy.get('[data-slot="chart-header"]')
        .should('contain.text', 'Revenue')
        .and('contain.text', 'By month')
    })

    it('puts the actions slot at the end of the header row', () => {
      mountContainer({ title: 'Revenue' }, {
        default: () => h('div', 'Plot'),
        actions: () => h('button', { id: 'period' }, 'Last 30 days'),
      } as any)
      cy.get('[data-slot="chart-header"] #period').should('exist')
    })

    // A card with only controls still needs the row to hang them on.
    it('draws the header for actions alone', () => {
      mountContainer({}, {
        default: () => h('div', 'Plot'),
        actions: () => h('button', { id: 'period' }, 'Last 30 days'),
      } as any)
      cy.get('[data-slot="chart-header"]').should('exist')
    })
  })

  describe('state', () => {
    it('reads ready when nothing is wrong', () => {
      mountContainer()
      container().should('have.attr', 'data-state', 'ready')
      cy.get('[data-slot="chart-loading"]').should('not.exist')
    })

    it('reads loading, and says so for a screen reader', () => {
      mountContainer({ loading: true })
      container().should('have.attr', 'data-state', 'loading')
      cy.get('[data-slot="chart-loading"] [role="status"]')
        .should('have.class', 'sr-only')
        .and('have.text', 'Loading chart')
      cy.get('.animate-pulse').should('exist')
    })

    it('reads error, and prints the reason under the message', () => {
      mountContainer({ error: 'Query timed out' })
      container().should('have.attr', 'data-state', 'error')
      container()
        .should('contain.text', 'Could not render this chart')
        .and('contain.text', 'Query timed out')
    })

    it('reads empty, and says there is nothing to draw', () => {
      mountContainer({ empty: true })
      container().should('have.attr', 'data-state', 'empty')
      container().should('contain.text', 'No data to show')
    })

    // A failed query is the thing to say, even while the next one is in flight
    // and even though a failed query returns no rows.
    it('takes error over loading and over empty', () => {
      mountContainer({ error: 'Query timed out', loading: true, empty: true })
      container().should('have.attr', 'data-state', 'error')
      cy.get('[data-slot="chart-loading"]').should('not.exist')
      container().should('not.contain.text', 'No data to show')
    })

    it('takes loading over empty', () => {
      mountContainer({ loading: true, empty: true })
      container().should('have.attr', 'data-state', 'loading')
      container().should('not.contain.text', 'No data to show')
    })

    // Unmounting the plot would dispose the echarts instance and pay to build
    // it again on the way back, so it is hidden rather than removed.
    it('keeps the plot mounted but out of sight in every state', () => {
      for (const props of [
        { loading: true },
        { error: 'Query timed out' },
        { empty: true },
      ]) {
        mountContainer(props)
        cy.get('#plot').should('exist')
        cy.get('#plot').parent().should('have.class', 'invisible')
      }
    })

    it('shows the plot again once the state is ready', () => {
      mountContainer()
      cy.get('#plot').parent().should('not.have.class', 'invisible')
    })
  })

  describe('state slots', () => {
    it('takes an app’s own placeholder in place of the skeleton', () => {
      mountContainer({ loading: true }, {
        default: () => h('div', 'Plot'),
        loading: () => h('div', { id: 'own' }, 'Fetching'),
      } as any)
      cy.get('[data-slot="chart-loading"] #own').should('exist')
      cy.get('.animate-pulse').should('not.exist')
    })

    it('puts an app’s retry button in place of the error message', () => {
      const retry = cy.spy().as('onRetry')
      mountContainer({ error: 'Query timed out' }, {
        default: () => h('div', 'Plot'),
        error: ({ error }: any) => [
          h('span', `Failed: ${error}`),
          h('button', { id: 'retry', onClick: retry }, 'Retry'),
        ],
      } as any)

      container()
        .should('contain.text', 'Failed: Query timed out')
        .and('not.contain.text', 'Could not render this chart')
      cy.get('#retry').click()
      cy.get('@onRetry').should('have.been.calledOnce')
    })

    it('takes an app’s own line in place of “No data to show”', () => {
      mountContainer({ empty: true }, {
        default: () => h('div', 'Plot'),
        empty: () => h('div', { id: 'own' }, 'Widen the date range'),
      } as any)
      cy.get('#own').should('exist')
      container().should('not.contain.text', 'No data to show')
    })

    it('renders the legend slot under the plot', () => {
      mountContainer({}, {
        default: () => h('div', 'Plot'),
        legend: () => h('div', { id: 'legend' }, 'Sales'),
      } as any)
      cy.get('#legend').should('exist')
      // The pad that stands in for a legend is dropped once there is one.
      plot().should('not.have.class', 'pb-3')
    })

    it('pads the plot in place of a legend when there is none', () => {
      mountContainer()
      plot().should('have.class', 'pb-3')
    })
  })

  describe('plot labels', () => {
    it('heads the plot with the axis titles', () => {
      mountContainer({ plotLabel: 'Revenue', plotLabelSecondary: 'Orders' })
      container()
        .should('contain.text', 'Revenue')
        .and('contain.text', 'Orders')
      cy.contains('Revenue').then(($label) => {
        cy.get('[data-slot="chart-plot"]').then(($plot) => {
          expect($label[0].getBoundingClientRect().top).to.be.lessThan(
            $plot[0].getBoundingClientRect().top,
          )
        })
      })
    })

    it('puts them under the plot when asked to', () => {
      mountContainer({ plotLabel: 'Revenue', plotLabelPlacement: 'bottom' })
      cy.contains('Revenue').then(($label) => {
        cy.get('[data-slot="chart-plot"]').then(($plot) => {
          expect($label[0].getBoundingClientRect().top).to.be.greaterThan(
            $plot[0].getBoundingClientRect().top,
          )
        })
      })
    })

    // A title over a placeholder or a message heads a plot that is not drawn.
    for (const [name, props] of [
      ['loading', { loading: true }],
      ['an error', { error: 'Query timed out' }],
      ['empty', { empty: true }],
    ] as const) {
      it(`leaves the titles off while ${name}`, () => {
        mountContainer({ plotLabel: 'Revenue', ...props })
        container().should('not.contain.text', 'Revenue')
      })
    }
  })

  describe('direction', () => {
    it('carries the direction it is told to lay out in', () => {
      mountContainer({ dir: 'rtl' })
      container().should('have.attr', 'dir', 'rtl')
    })
  })

  describe('keyboard', () => {
    // The container takes no focus of its own: the header controls and the
    // legend under it are the only stops, and they follow the reading order.
    it('runs the tab order from the actions through to the legend', () => {
      mountContainer({ title: 'Revenue' }, {
        default: () => h('div', 'Plot'),
        actions: () => h('button', { id: 'period' }, 'Last 30 days'),
        legend: () => h('button', { id: 'series' }, 'Sales'),
      } as any)

      container().should('not.have.attr', 'tabindex')
      cy.get('#period').focus()
      cy.focused().should('have.id', 'period')
      cy.get('#series').focus()
      cy.focused().should('have.id', 'series')
    })
  })
})
