import { defineComponent, h, ref } from 'vue'
import BarChart from './BarChart.vue'
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
function mountChart(props: Record<string, any> = {}) {
  return cy.mount(
    defineComponent({
      setup() {
        return () =>
          h('div', { style: 'width: 480px; height: 300px' }, [
            h(BarChart, {
              data,
              x: 'month',
              y: ['sales', 'refunds'],
              echartOptions: { animation: false },
              ...props,
            }),
          ])
      },
    }),
  )
}

/** The bars, in series order. Gridlines are paths too, but unfilled. */
const bars = () => cy.get('[data-slot="chart-plot"] svg path[fill^="#"]')

/** The series strokes. Gridlines are stroked too, but in a theme oklch. */
const lines = () => cy.get('[data-slot="chart-plot"] svg path[stroke^="#"]')

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
    it('emits datapointClick with the row behind the bar', () => {
      mountChart({ onDatapointClick: cy.spy().as('onClick') })
      bars().first().click()
      cy.get('@onClick').should('have.been.calledWithMatch', {
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
        y: 'sales',
        y2: 'refunds',
        seriesConfig: { refunds: { type: 'line' } },
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
      mountChart({ referenceLines: [{ value: 12, label: 'Target' }] })
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
    it('spins while loading and keeps the plot mounted', () => {
      mountChart({ loading: true })
      cy.contains('Loading chart…').should('be.visible')
      // Unmounting the plot would dispose the echarts instance behind it.
      cy.get('[data-slot="chart-plot"]').should('exist')
    })

    it('reports an error over the plot', () => {
      mountChart({ error: 'Query timed out' })
      cy.contains('Could not render this chart').should('be.visible')
      cy.contains('Query timed out').should('be.visible')
    })

    it('says so when there is nothing to plot', () => {
      mountChart({ data: [] })
      cy.contains('No data to show').should('be.visible')
      bars().should('not.exist')
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
