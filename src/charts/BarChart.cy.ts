import { defineComponent, h, ref } from 'vue'
import BarChart from './BarChart.vue'
import Dialog from '../components/Dialog/Dialog.vue'
import './style.css'

const data = [
  { month: 'Jan', sales: 10, refunds: 4 },
  { month: 'Feb', sales: 20, refunds: 6 },
  { month: 'Mar', sales: 15, refunds: 2 },
]

/**
 * Charts fill their container, so every case needs one with a size. Animation
 * is off: a bar grows from the baseline, and until it has arrived it is a
 * zero-height path nothing can be clicked on.
 */
function mountChart(
  props: Record<string, any> = {},
  slots?: Record<string, () => unknown>,
) {
  return cy.mount(
    defineComponent({
      setup() {
        return () =>
          h('div', { style: 'width: 480px; height: 300px' }, [
            h(
              BarChart,
              {
                data,
                x: 'month',
                y: ['sales', 'refunds'],
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

/**
 * Where the marks are drawn. `<defs>` is left out on purpose: echarts clips a
 * line series with a `<clipPath>` whose path carries a solid fill of its own,
 * and a definition is not something on the plot.
 */
const MARKS = '[data-slot="chart-plot"] svg > g'

/** The bars, in series order. Gridlines are paths too, but unfilled. */
const bars = () => cy.get(`${MARKS} path[fill^="#"]`)

/**
 * The series strokes: a palette stroke with a path to trace. Gridlines are
 * stroked too, but in a theme oklch, and the empty series a reference line
 * rides is stroked over an empty path, having never been given anything to draw.
 */
const lines = () => cy.get(`${MARKS} path[stroke^="#"]:not([d=""])`)

/** The state the container is in, which an app can also style from CSS. */
const container = () => cy.get('[data-slot="chart-container"]')

/** The one tab stop the plot takes: echarts draws no per-bar DOM node. */
const plot = () => cy.get('[data-slot="chart-plot"] [role="img"]')

describe('BarChart', () => {
  it('paints a bar per datapoint, and labels the categories', () => {
    mountChart()
    bars().should('have.length', data.length * 2)
    cy.get('[data-slot="chart-plot"] svg text').should('contain.text', 'Jan')
  })

  it('names the plot for a screen reader', () => {
    mountChart({ title: 'Revenue', subtitle: 'By month' })
    cy.get('[role="img"]').should('have.attr', 'aria-label')
    cy.get('[data-slot="chart-header"]').should('contain.text', 'Revenue')
  })

  describe('interaction', () => {
    it('emits select with the row behind the bar', () => {
      mountChart({ onSelect: cy.spy().as('onSelect') })
      bars().first().click()
      cy.get('@onSelect').should('have.been.calledWithMatch', {
        seriesName: 'sales',
        dataIndex: 0,
        value: 10,
        row: { month: 'Jan', sales: 10 },
      })
    })

    it('opens the tooltip on hover, with every series at that category', () => {
      mountChart()
      bars().should('have.length', data.length * 2)
      cy.get('[data-slot="chart-plot"]').trigger('mousemove', 100, 150)
      cy.get('[data-slot="chart-tooltip"]')
        .should('exist')
        .and('contain.text', 'Jan')
        .and('contain.text', 'Sales')
        .and('contain.text', '10')
    })
  })

  describe('legend', () => {
    it('lists one entry per series, named as the chrome names them', () => {
      mountChart()
      cy.get('[data-slot="chart-legend"] button').should('have.length', 2)
      cy.get('[aria-label="Hide Sales"]').should(
        'have.attr',
        'aria-pressed',
        'true',
      )
    })

    it('hides a series when its entry is pressed, and brings it back', () => {
      mountChart()
      cy.get('[aria-label="Hide Sales"]').click()
      cy.get('[aria-label="Show Sales"]').should(
        'have.attr',
        'aria-pressed',
        'false',
      )
      bars().should('have.length', data.length)

      cy.get('[aria-label="Show Sales"]').click()
      bars().should('have.length', data.length * 2)
    })

    it('round-trips v-model:hiddenSeries', () => {
      const hidden = ref<string[]>([])
      cy.mount(
        defineComponent({
          setup() {
            return () =>
              h('div', { style: 'width: 480px; height: 300px' }, [
                h(BarChart, {
                  data,
                  x: 'month',
                  y: ['sales', 'refunds'],
                  echartOptions: { animation: false },
                  hiddenSeries: hidden.value,
                  'onUpdate:hiddenSeries': (v: string[]) => (hidden.value = v),
                }),
              ])
          },
        }),
      )

      cy.get('[aria-label="Hide Refunds"]')
        .click()
        .then(() => expect(hidden.value).to.deep.equal(['refunds']))
      bars().should('have.length', data.length)
    })

    it('keeps the legend out of a single-series chart', () => {
      mountChart({ y: 'sales' })
      cy.get('[data-slot="chart-legend"]').should('not.exist')
    })
  })

  describe('combo series', () => {
    it('draws a series set to line as a line, over the bars', () => {
      mountChart({ seriesConfig: { refunds: { type: 'line' } } })
      bars().should('have.length', data.length)
      lines().should('have.length', 1)
    })

    it('keeps a line series in the legend, and hides it like any other', () => {
      mountChart({ seriesConfig: { refunds: { type: 'line' } } })
      cy.get('[data-slot="chart-legend"] button').should('have.length', 2)
      cy.get('[aria-label="Hide Refunds"]').click()
      lines().should('not.exist')
      bars().should('have.length', data.length)
    })

    it('measures a line series against a second axis', () => {
      mountChart({
        seriesConfig: { refunds: { type: 'line', axis: 'y2' } },
      })
      bars().should('have.length', data.length)
      lines().should('have.length', 1)
      // Two scales, so the axis labels no longer share one set of values.
      cy.get('[data-slot="chart-plot"] svg text').should('contain.text', '6')
    })

    it('draws bars as bars when horizontal overrules the mark', () => {
      mountChart({
        horizontal: true,
        seriesConfig: { refunds: { type: 'line' } },
      })
      bars().should('have.length', data.length * 2)
      lines().should('not.exist')
    })
  })

  describe('normalized stacking', () => {
    it('fills every column to the top and scales the axis to 100', () => {
      mountChart({ stacked: 'normalized' })
      bars().should('have.length', data.length * 2)
      cy.get('[data-slot="chart-plot"] svg text').should('contain.text', '100')
    })

    it('prints the share on the bars', () => {
      mountChart({
        stacked: 'normalized',
        seriesConfig: {
          sales: { showDataLabels: true },
          refunds: { showDataLabels: true },
        },
      })
      cy.get('[data-slot="chart-plot"] svg text').should('contain.text', '%')
    })

    // The plot draws the share; the tooltip is where the measured number lives.
    it('keeps the real number in the tooltip and prints the share beside it', () => {
      mountChart({ stacked: 'normalized' })
      bars().should('have.length', data.length * 2)
      cy.get('[data-slot="chart-plot"]').trigger('mousemove', 100, 150)
      cy.get('[data-slot="chart-tooltip"]')
        .should('exist')
        .and('contain.text', '10')
        .and('contain.text', '71%')
    })
  })

  describe('maxSeries', () => {
    const byRegion = [
      { month: 'Jan', region: 'East', amount: 50 },
      { month: 'Jan', region: 'West', amount: 30 },
      { month: 'Jan', region: 'North', amount: 15 },
      { month: 'Jan', region: 'South', amount: 5 },
    ]

    it('collapses the tail into one "Others" series', () => {
      mountChart({
        data: byRegion,
        y: 'amount',
        series: 'region',
        maxSeries: 3,
      })
      cy.get('[data-slot="chart-legend"] button')
        .should('have.length', 3)
        .last()
        .should('contain.text', 'Others')
      bars().should('have.length', 3)
    })

    it('lets seriesConfig rename the collapsed series', () => {
      mountChart({
        data: byRegion,
        y: 'amount',
        series: 'region',
        maxSeries: 2,
        seriesConfig: { __others__: { label: 'Everywhere else' } },
      })
      cy.get('[data-slot="chart-legend"]').should(
        'contain.text',
        'Everywhere else',
      )
    })

    it('takes the shares after the collapse, so the column still fills', () => {
      mountChart({
        data: byRegion,
        y: 'amount',
        series: 'region',
        maxSeries: 3,
        stacked: 'normalized',
      })
      bars().should('have.length', 3)
      cy.get('[data-slot="chart-plot"]').trigger('mousemove', 240, 150)
      // 20 of the 100 at that month, the two smallest regions summed.
      cy.get('[data-slot="chart-tooltip"]')
        .should('contain.text', 'Others')
        .and('contain.text', '20%')
    })
  })

  describe('reference lines', () => {
    it('draws a labelled rule over the plot with no legend entry of its own', () => {
      mountChart({ referenceLines: [{ value: 12, label: 'Target' }] })
      cy.get('[data-slot="chart-plot"] svg text').should(
        'contain.text',
        'Target',
      )
      // An annotation, not a series: the legend still lists the two columns.
      cy.get('[data-slot="chart-legend"] button').should('have.length', 2)
      bars().should('have.length', data.length * 2)
    })

    it('keeps the rule while a legend toggle hides a series', () => {
      // Inside refunds' own range, so the rule is still on the scale once the
      // taller series goes: a line off the end of the axis is not drawn, which
      // would pass this test for the wrong reason.
      mountChart({ referenceLines: [{ value: 5, label: 'Target' }] })
      cy.get('[aria-label="Hide Sales"]').click()
      bars().should('have.length', data.length)
      cy.get('[data-slot="chart-plot"] svg text').should(
        'contain.text',
        'Target',
      )
    })

    it('draws a rule down the plot at a category', () => {
      mountChart({
        referenceLines: [{ value: 'Feb', axis: 'x', label: 'Launch' }],
      })
      cy.get('[data-slot="chart-plot"] svg text').should(
        'contain.text',
        'Launch',
      )
    })

    it('follows the axes round on a horizontal chart', () => {
      mountChart({
        horizontal: true,
        referenceLines: [
          { value: 12, label: 'Target' },
          { value: 'Feb', axis: 'x', label: 'Launch' },
        ],
      })
      cy.get('[data-slot="chart-plot"] svg text')
        .should('contain.text', 'Target')
        .and('contain.text', 'Launch')
      bars().should('have.length', data.length * 2)
    })
  })

  describe('category labels', () => {
    const regions = [
      'Marketplace Listings',
      'Referral Partners',
      'Outbound Calling',
      'Paid Search Brand',
      'Organic Search',
      'Field Events',
      'Partner Resellers',
      'Lifecycle Email',
    ]

    /** Long category names in a box too narrow to lay them out flat. */
    function mountLongLabels(props: Record<string, any> = {}) {
      return cy.mount(
        defineComponent({
          setup() {
            return () =>
              h('div', { style: 'width: 420px; height: 300px' }, [
                h(BarChart, {
                  data: regions.map((region, i) => ({
                    region,
                    sales: i + 1,
                  })),
                  x: 'region',
                  y: 'sales',
                  echartOptions: { animation: false },
                  ...props,
                }),
              ])
          },
        }),
      )
    }

    /** zrender writes a rotation out as a matrix; a flat label gets neither. */
    const tilted = () =>
      cy.get('[data-slot="chart-plot"] svg text[transform*="matrix"]')

    it('leaves labels that fit flat', () => {
      mountChart()
      cy.get('[data-slot="chart-plot"] svg text').should('contain.text', 'Jan')
      tilted().should('not.exist')
    })

    it('tilts them rather than dropping them once they crowd', () => {
      mountLongLabels()
      // One label per category: flat they would collide, and echarts would
      // thin most of them away instead.
      tilted().should('have.length', regions.length)
      // Shortened to the room a tilted label has, both ends kept.
      cy.get('[data-slot="chart-plot"] svg text').should('contain.text', '…')
    })

    it('keeps the plot clear of its own labels', () => {
      mountLongLabels()
      // `containLabel` reserves the height the tilt costs, so the bars end
      // above the labels rather than behind them.
      tilted().then(($labels) => {
        const top = Math.min(
          ...[...$labels].map((el) => el.getBoundingClientRect().top),
        )
        bars().each(($bar) => {
          expect($bar[0].getBoundingClientRect().bottom).to.be.at.most(top + 1)
        })
      })
    })

    it('stacks a row chart’s labels down the side, never tilted', () => {
      mountLongLabels({ horizontal: true })
      tilted().should('not.exist')
      cy.get('[data-slot="chart-plot"] svg text').should(
        'contain.text',
        'Listings',
      )
    })
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
      mountChart({ error: 'Query timed out' })
      cy.contains('Could not render this chart').should('be.visible')
      cy.contains('Query timed out').should('be.visible')
      container().should('have.attr', 'data-state', 'error')
    })

    it('says so when there is nothing to plot', () => {
      mountChart({ data: [] })
      cy.contains('No data to show').should('be.visible')
      bars().should('not.exist')
      container().should('have.attr', 'data-state', 'empty')
    })

    it('reads as ready once the bars are drawn', () => {
      mountChart()
      bars().should('have.length', data.length * 2)
      container().should('have.attr', 'data-state', 'ready')
    })

    // An error outranks the rest: a stale skeleton over a failed query would
    // read as data still on its way.
    it('reports the error even while loading', () => {
      mountChart({ loading: true, error: 'Query timed out' })
      container().should('have.attr', 'data-state', 'error')
    })

    // The chrome is the library's, so reaching one of its states costs the app
    // a slot rather than a chart of its own.
    it('puts an app’s retry button beside the error message', () => {
      const retry = cy.spy().as('onRetry')
      mountChart({ error: 'Query timed out' }, {
        error: ({ error }: any) => [
          h('span', `Failed: ${error}`),
          h('button', { id: 'retry', onClick: retry }, 'Retry'),
        ],
      } as any)

      cy.contains('Failed: Query timed out').should('be.visible')
      cy.contains('Could not render this chart').should('not.exist')
      cy.get('#retry').click()
      cy.get('@onRetry').should('have.been.calledOnce')
    })

    it('takes an app’s own placeholder in place of the skeleton', () => {
      mountChart({ loading: true }, { loading: () => h('div', { id: 'own' }) })

      cy.get('#own').should('exist')
      cy.get('[data-slot="chart-loading"] .animate-pulse').should('not.exist')
    })

    it('takes an app’s own line in place of “No data to show”', () => {
      mountChart({ data: [] }, { empty: () => h('span', 'Widen the filters') })

      cy.contains('Widen the filters').should('be.visible')
      cy.contains('No data to show').should('not.exist')
    })
  })

  // The state slots are covered above, beside the states they replace; these
  // are the two the chrome forwards outside them.
  describe('slots', () => {
    it('puts an app’s controls in the header', () => {
      mountChart({ title: 'Revenue' }, { actions: () => h('button', 'Week') })
      cy.get('[data-slot="chart-header"]').should('contain.text', 'Week')
    })

    it('replaces the tooltip body with the app’s own', () => {
      // Opened from the keyboard rather than a hover: the cursor lands on a
      // known category, so the slot props are January's every run.
      mountChart({}, {
        tooltip: ({ label, items }: any) =>
          h('span', `at ${label}: ${items.length}`),
      } as any)
      bars().should('have.length', data.length * 2)
      plot().focus()
      cy.get('[data-slot="chart-tooltip"]')
        .should('contain.text', 'at Jan: 2')
        .and('not.contain.text', 'Sales')
    })
  })

  // echarts draws into one element, so the plot takes a single tab stop and the
  // arrow keys walk a cursor along it.
  describe('keyboard', () => {
    it('opens the tooltip on the first category and reads it out', () => {
      mountChart()
      bars().should('have.length', data.length * 2)
      plot().should('have.attr', 'tabindex', '0')
      plot().focus()
      cy.get('[data-slot="chart-tooltip"]').should('contain.text', 'Jan')
      cy.get('[role="status"]').should('not.have.text', '')
    })

    it('walks the categories with an arrow key', () => {
      mountChart()
      bars().should('have.length', data.length * 2)
      plot().focus()
      plot().type('{rightarrow}')
      cy.get('[data-slot="chart-tooltip"]').should('contain.text', 'Feb')
    })

    it('fires select on Enter, for the bar under the cursor', () => {
      mountChart({ onSelect: cy.spy().as('onSelect') })
      bars().should('have.length', data.length * 2)
      plot().focus()
      plot().type('{rightarrow}{enter}')
      cy.get('@onSelect').should('have.been.calledWithMatch', {
        seriesName: 'sales',
        dataIndex: 1,
        value: 20,
        row: { month: 'Feb', sales: 20 },
      })
    })

    // Two dimensions to walk: left and right run along the categories, up and
    // down pick which series inside one Enter fires for.
    it('picks the series with up and down', () => {
      mountChart({ onSelect: cy.spy().as('onSelect') })
      bars().should('have.length', data.length * 2)
      plot().focus()
      plot().type('{downarrow}{enter}')
      cy.get('@onSelect').should('have.been.calledWithMatch', {
        seriesName: 'refunds',
        dataIndex: 0,
        value: 4,
      })
    })

    it('comes back up to the first series', () => {
      mountChart({ onSelect: cy.spy().as('onSelect') })
      bars().should('have.length', data.length * 2)
      plot().focus()
      plot().type('{downarrow}{uparrow}{enter}')
      cy.get('@onSelect').should('have.been.calledWithMatch', {
        seriesName: 'sales',
        dataIndex: 0,
        value: 10,
      })
    })

    // A press focuses the plot as well. Putting the cursor on the first
    // category there would pull the tooltip off the bar under the pointer.
    it('holds the cursor back when a pointer causes the focus', () => {
      mountChart()
      bars().should('have.length', data.length * 2)
      plot().trigger('pointerdown')
      plot().focus()
      cy.get('[data-slot="chart-tooltip"]').should('not.exist')
    })

    // The tooltip and the reading are taken when the cursor moves. New rows
    // under a reader who is still on the plot have to reach both.
    it('reads the bar under the cursor again when the data changes', () => {
      const rows = ref(data)
      cy.mount(
        defineComponent({
          setup() {
            return () =>
              h('div', { style: 'width: 480px; height: 300px' }, [
                h(BarChart, {
                  data: rows.value,
                  x: 'month',
                  y: ['sales'],
                  echartOptions: { animation: false },
                }),
              ])
          },
        }),
      )
      plot().focus()
      cy.get('[role="status"]').should('contain.text', '10')
      cy.then(() => {
        rows.value = [{ month: 'Jan', sales: 99, refunds: 4 }, ...data.slice(1)]
      })
      cy.get('[role="status"]').should('contain.text', '99')
      cy.get('[data-slot="chart-tooltip"]').should('contain.text', '99')
    })

    it('clears the tooltip and the reading on blur', () => {
      mountChart()
      bars().should('have.length', data.length * 2)
      plot().focus()
      cy.get('[data-slot="chart-tooltip"]').should('exist')
      plot().blur()
      cy.get('[data-slot="chart-tooltip"]').should('not.exist')
      cy.get('[role="status"]').should('have.text', '')
    })

    // The first Escape drops the cursor, and the plot keeps the key. With no
    // cursor left it has nothing to dismiss, so the next Escape belongs to
    // whatever is around the plot — the dialog it sits in.
    it('gives Escape back once the cursor is gone', () => {
      const open = ref(true)
      cy.mount(
        defineComponent({
          setup() {
            return () =>
              h(
                Dialog,
                {
                  open: open.value,
                  'onUpdate:open': (value: boolean) => (open.value = value),
                },
                {
                  default: () =>
                    h('div', { style: 'width: 480px; height: 300px' }, [
                      h(BarChart, {
                        data,
                        x: 'month',
                        y: ['sales'],
                        echartOptions: { animation: false },
                      }),
                    ]),
                },
              )
          },
        }),
      )
      plot().focus()
      cy.get('[data-slot="chart-tooltip"]').should('exist')
      plot().type('{esc}')
      cy.get('[data-slot="chart-tooltip"]').should('not.exist')
      cy.get('[role="dialog"]').should('exist')
      plot().type('{esc}')
      cy.get('[role="dialog"]').should('not.exist')
    })

    // Nothing to walk, so the plot drops out of the tab order rather than
    // taking a stop that does nothing.
    it('takes no tab stop with nothing drawn', () => {
      mountChart({ data: [] })
      plot().should('not.have.attr', 'tabindex')
    })
  })

  describe('layout', () => {
    it('redraws at the width of its container', () => {
      cy.mount(
        defineComponent({
          setup() {
            const width = ref(480)
            return () =>
              h('div', [
                h(
                  'button',
                  { id: 'shrink', onClick: () => (width.value = 300) },
                  'shrink',
                ),
                h('div', { style: `width: ${width.value}px; height: 300px` }, [
                  h(BarChart, {
                    data,
                    x: 'month',
                    y: 'sales',
                    echartOptions: { animation: false },
                  }),
                ]),
              ])
          },
        }),
      )

      cy.get('[data-slot="chart-plot"] svg')
        .invoke('attr', 'width')
        .then((before) => {
          cy.get('#shrink').click()
          cy.get('[data-slot="chart-plot"] svg')
            .invoke('attr', 'width')
            .should('not.equal', before)
        })
    })

    it('mirrors the card in RTL', () => {
      mountChart({ dir: 'rtl', title: 'Revenue' })
      cy.get('[data-slot="chart-container"]').should('have.attr', 'dir', 'rtl')
      // The plot stays LTR: echarts mirrors the axes through the option.
      cy.get('[role="img"]').should('have.attr', 'dir', 'ltr')
    })
  })
})
