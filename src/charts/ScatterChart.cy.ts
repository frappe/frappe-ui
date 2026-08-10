import { defineComponent, h, ref } from 'vue'
import ScatterChart from './ScatterChart.vue'
import './style.css'

const data = [
  { account: 'Acme', spend: 400, revenue: 1200, seats: 20, region: 'EU' },
  { account: 'Globex', spend: 900, revenue: 2400, seats: 60, region: 'EU' },
  { account: 'Initech', spend: 200, revenue: 300, seats: 10, region: 'US' },
  { account: 'Umbrella', spend: 700, revenue: 900, seats: 40, region: 'US' },
]

/**
 * Charts fill their container, so every case needs one with a size. Animation
 * is off: a symbol grows from nothing, and until it has arrived it is too small
 * to be hit.
 */
function mountChart(
  props: Record<string, any> = {},
  slots?: Record<string, (props?: any) => unknown>,
) {
  return cy.mount(
    defineComponent({
      setup() {
        return () =>
          h('div', { style: 'width: 480px; height: 320px' }, [
            h(
              ScatterChart,
              {
                data,
                x: 'spend',
                y: 'revenue',
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

/** The one tab stop the cloud takes: echarts draws no per-point DOM node. */
const plot = () => cy.get('[data-slot="chart-plot"] [role="img"]')

/** Symbols carry a translucent fill; nothing else in the plot is filled. */
const points = () => cy.get('[data-slot="chart-plot"] svg path[fill-opacity]')

describe('ScatterChart', () => {
  it('draws a point per row, on two measured axes', () => {
    mountChart()
    points().should('have.length', data.length)
    // Both axes are scales rather than lists of the values plotted, so they
    // read as round ticks: spend up the hundreds, revenue past 2K.
    cy.get('[data-slot="chart-plot"] svg text')
      .should('contain.text', '400')
      .and('contain.text', '2.5K')
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
    // Four distinct seat counts, so four distinct symbol sizes. Measured
    // rather than read off the path: echarts draws every symbol from the same
    // unit outline and scales it, so `d` is the same on all four.
    points().then((els) => {
      const widths = [...els].map((el) => el.getBoundingClientRect().width)
      expect(new Set(widths).size).to.eq(data.length)
    })
  })

  it('draws every point alike without a size column', () => {
    mountChart()
    points().then((els) => {
      const widths = [...els].map((el) => el.getBoundingClientRect().width)
      expect(new Set(widths).size).to.eq(1)
    })
  })

  it('emits select with the row behind the point', () => {
    mountChart({ label: 'account', onSelect: cy.spy().as('onSelect') })
    points().first().click({ force: true })
    cy.get('@onSelect').should('have.been.calledWithMatch', {
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

  describe('point labels', () => {
    it('prints each point’s own name beside it', () => {
      mountChart({ label: 'account', showDataLabels: true })
      cy.get('[data-slot="chart-plot"] svg text')
        .should('contain.text', 'Acme')
        .and('contain.text', 'Globex')
    })

    it('prints nothing beside a point until it is asked to', () => {
      mountChart({ label: 'account' })
      cy.get('[data-slot="chart-plot"] svg text').should(
        'not.contain.text',
        'Acme',
      )
    })

    it('labels the points of every group', () => {
      mountChart({ label: 'account', series: 'region', showDataLabels: true })
      cy.get('[data-slot="chart-plot"] svg text')
        .should('contain.text', 'Acme')
        .and('contain.text', 'Initech')
    })
  })

  describe('reference lines', () => {
    it('draws a labelled rule across the plot with no legend entry of its own', () => {
      mountChart({
        series: 'region',
        referenceLines: [{ value: 1000, label: 'Target' }],
      })
      cy.get('[data-slot="chart-plot"] svg text').should(
        'contain.text',
        'Target',
      )
      // An annotation, not a series: the legend still lists the two groups.
      cy.get('[data-slot="chart-legend"] button').should('have.length', 2)
      points().should('have.length', data.length)
    })

    it('divides the plot into quadrants with one line per measured axis', () => {
      mountChart({
        referenceLines: [
          { value: 500, axis: 'x', label: 'Median spend', dashed: true },
          { value: 1000, axis: 'y', label: 'Median revenue', dashed: true },
        ],
      })
      cy.get('[data-slot="chart-plot"] svg text')
        .should('contain.text', 'Median spend')
        .and('contain.text', 'Median revenue')
      points().should('have.length', data.length)
    })

    it('keeps the rule while a legend toggle hides a group', () => {
      mountChart({
        series: 'region',
        referenceLines: [{ value: 1000, label: 'Target' }],
      })
      cy.get('[data-slot="chart-legend"] button').first().click()
      points().should('have.length', 2)
      cy.get('[data-slot="chart-plot"] svg text').should(
        'contain.text',
        'Target',
      )
    })

    it('leaves the rule out of a bound hiddenSeries', () => {
      // The host series the rule rides on is not something the caller can
      // name, so a bound model that hides a group must not surface it.
      const hidden = ref<string[]>(['EU'])
      cy.mount(
        defineComponent({
          setup() {
            return () =>
              h('div', { style: 'width: 480px; height: 320px' }, [
                h(ScatterChart, {
                  data,
                  x: 'spend',
                  y: 'revenue',
                  series: 'region',
                  echartOptions: { animation: false },
                  referenceLines: [{ value: 1000, label: 'Target' }],
                  hiddenSeries: hidden.value,
                  'onUpdate:hiddenSeries': (v: string[]) => (hidden.value = v),
                }),
              ])
          },
        }),
      )

      // The parent's value reaches the plot: EU starts out of it.
      points().should('have.length', 2)
      cy.get('[aria-label="Show EU"]').click()
      points().should('have.length', data.length)
      cy.get('[aria-label="Hide EU"]')
        .click()
        .then(() => expect(hidden.value).to.deep.equal(['EU']))
      points().should('have.length', 2)
    })
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
      points().should('not.exist')
      container().should('have.attr', 'data-state', 'empty')
    })

    it('reads as ready once the cloud is drawn', () => {
      mountChart()
      points().should('have.length', data.length)
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
        { title: 'Spend vs revenue' },
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
      // known point, so the slot props are the first row's every run.
      mountChart(
        { label: 'account' },
        { tooltip: ({ label }: any) => h('span', `point ${label}`) },
      )
      points().should('have.length', data.length)
      plot().focus()
      cy.get('[data-slot="chart-tooltip"]')
        .should('contain.text', 'point Acme')
        .and('not.contain.text', 'Spend')
    })
  })

  // echarts draws into one element, so the cloud takes a single tab stop and
  // the arrow keys walk a cursor along it.
  describe('keyboard', () => {
    it('opens the tooltip on the first point and reads it out', () => {
      mountChart({ label: 'account' })
      points().should('have.length', data.length)
      plot().should('have.attr', 'tabindex', '0')
      plot().focus()
      cy.get('[data-slot="chart-tooltip"]').should('contain.text', 'Acme')
      cy.get('[role="status"]').should('not.have.text', '')
    })

    it('walks the points with an arrow key', () => {
      mountChart({ label: 'account' })
      points().should('have.length', data.length)
      plot().focus()
      plot().type('{rightarrow}')
      cy.get('[data-slot="chart-tooltip"]').should('contain.text', 'Globex')
    })

    it('fires select on Enter, for the point under the cursor', () => {
      mountChart({ label: 'account', onSelect: cy.spy().as('onSelect') })
      points().should('have.length', data.length)
      plot().focus()
      plot().type('{rightarrow}{enter}')
      cy.get('@onSelect').should('have.been.calledWithMatch', {
        x: 900,
        y: 2400,
        label: 'Globex',
        row: { account: 'Globex', spend: 900, revenue: 2400 },
      })
    })

    it('clears the tooltip and the reading on blur', () => {
      mountChart({ label: 'account' })
      points().should('have.length', data.length)
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
