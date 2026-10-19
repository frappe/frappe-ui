import { defineComponent, h, ref } from 'vue'
import PercentageBarChart from './PercentageBarChart.vue'
import { OTHERS_KEY } from './utils'
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
          h('div', { style: 'width: 480px; height: 200px' }, [
            h(
              PercentageBarChart,
              { data, category: 'source', value: 'visits', ...props },
              slots,
            ),
          ])
      },
    }),
  )
}

const track = () => cy.get('[data-slot="chart-plot"] [role="group"]')
const slices = () => track().find('button')
const tooltip = () => cy.get('[data-slot="chart-tooltip"]')

describe('PercentageBarChart', () => {
  it('draws a slice per row, biggest first, named with its share', () => {
    mountChart()
    slices()
      .should('have.length', 3)
      .then(($slices) =>
        expect(
          [...$slices].map((el) => el.getAttribute('aria-label')),
        ).to.deep.equal([
          'Search, 50, 50%',
          'Direct, 30, 30%',
          'Email, 20, 20%',
        ]),
      )
  })

  it("draws the slices in the rows' order with order: 'rows'", () => {
    mountChart({ data: [data[2], data[0], data[1]], order: 'rows' })
    slices().then(($slices) =>
      expect(
        [...$slices].map((el) => el.getAttribute('aria-label')),
      ).to.deep.equal(['Email, 20, 20%', 'Search, 50, 50%', 'Direct, 30, 30%']),
    )
  })

  it('names the track after the chart', () => {
    mountChart({ title: 'Traffic', subtitle: 'This week' })
    track().should('have.attr', 'aria-label', 'Traffic, This week')
  })

  it('emits select with the slice and the row behind it', () => {
    mountChart({ onSelect: cy.spy().as('onSelect') })
    cy.get('[aria-label="Direct, 30, 30%"]').click()
    cy.get('@onSelect').should('have.been.calledOnceWith', {
      name: 'Direct',
      label: 'Direct',
      value: 30,
      percent: 30,
      rows: [{ source: 'Direct', visits: 30 }],
    })
  })

  describe('keyboard', () => {
    it('gives every slice its own tab stop, in track order', () => {
      mountChart()
      cy.get('[aria-label="Search, 50, 50%"]').focus()
      cy.press(Cypress.Keyboard.Keys.TAB)
      cy.focused().should('have.attr', 'aria-label', 'Direct, 30, 30%')
    })

    it('selects the focused slice with Enter and with Space', () => {
      mountChart({ onSelect: cy.spy().as('onSelect') })
      cy.get('[aria-label="Search, 50, 50%"]').focus().type('{enter}')
      cy.get('@onSelect').should('have.been.calledOnce')
      cy.focused().type(' ')
      cy.get('@onSelect')
        .should('have.been.calledTwice')
        .and('always.have.been.calledWithMatch', { name: 'Search' })
    })

    it('opens the tooltip on the focused slice', () => {
      mountChart()
      cy.get('[aria-label="Email, 20, 20%"]').focus()
      tooltip().should('contain.text', 'Email').and('contain.text', '20%')
      cy.get('[aria-label="Email, 20, 20%"]').blur()
      tooltip().should('not.exist')
    })
  })

  describe('tooltip', () => {
    it('reads the slice under the pointer', () => {
      mountChart()
      cy.get('[aria-label="Direct, 30, 30%"]').trigger('mouseenter')
      tooltip().should('contain.text', 'Direct').and('contain.text', '30%')
      cy.get('[aria-label="Direct, 30, 30%"]').trigger('mouseleave')
      tooltip().should('not.exist')
    })

    // The first reading hangs off the pointer, not off wherever the tooltip
    // was last left.
    it('opens at the pointer on the first mouseenter', () => {
      mountChart()
      cy.get('[aria-label="Search, 50, 50%"]').trigger('mouseenter', {
        clientX: 150,
        clientY: 100,
      })
      tooltip().should(($tooltip) => {
        const rect = $tooltip[0].getBoundingClientRect()
        expect(rect.left).to.be.closeTo(162, 1)
        expect(rect.top).to.be.closeTo(112, 1)
      })
    })

    it('closes when the page scrolls', () => {
      mountChart()
      cy.get('[aria-label="Search, 50, 50%"]').trigger('mouseenter')
      tooltip().should('exist')
      cy.window().then((win) => win.dispatchEvent(new Event('scroll')))
      tooltip().should('not.exist')
    })

    it('closes when the data changes', () => {
      const rows = ref(data)
      cy.mount(
        defineComponent({
          setup() {
            return () =>
              h('div', { style: 'width: 480px; height: 200px' }, [
                h(PercentageBarChart, {
                  data: rows.value,
                  category: 'source',
                  value: 'visits',
                }),
              ])
          },
        }),
      )
      cy.get('[aria-label="Search, 50, 50%"]').trigger('mouseenter')
      tooltip().should('exist')
      cy.then(() => {
        rows.value = [{ source: 'Search', visits: 10 }, ...data.slice(1)]
      })
      tooltip().should('not.exist')
    })

    it('takes an app’s own body', () => {
      mountChart(
        {},
        {
          tooltip: ({ items, rows }: any) =>
            h('span', `only ${items[0].label} from ${rows.length} row`),
        },
      )
      cy.get('[aria-label="Search, 50, 50%"]').trigger('mouseenter')
      tooltip().should('contain.text', 'only Search from 1 row')
    })
  })

  describe('legend', () => {
    it('lists every slice with its share', () => {
      mountChart()
      cy.get('[data-slot="chart-legend"] [aria-pressed]').should(
        'have.length',
        3,
      )
      cy.get('[data-slot="chart-legend"]').should('contain.text', '50%')
    })

    it('hides a slice and re-shares the rest against what is left', () => {
      mountChart()
      cy.get('[aria-label="Hide Search"]').click()
      slices().should('have.length', 2)
      cy.get('[aria-label="Direct, 30, 60%"]').should('exist')
    })

    it('round-trips v-model:hiddenSlices', () => {
      const hidden = ref<string[]>(['Email'])
      cy.mount(
        defineComponent({
          setup() {
            return () =>
              h('div', { style: 'width: 480px; height: 200px' }, [
                h(PercentageBarChart, {
                  data,
                  category: 'source',
                  value: 'visits',
                  hiddenSlices: hidden.value,
                  'onUpdate:hiddenSlices': (v: string[]) => (hidden.value = v),
                }),
              ])
          },
        }),
      )
      slices().should('have.length', 2)
      cy.get('[aria-label="Hide Search"]')
        .click()
        .then(() => expect(hidden.value).to.deep.equal(['Email', 'Search']))
      slices().should('have.length', 1)
    })

    it('refuses to hide the last slice drawn, but hides a zero one', () => {
      mountChart({
        data: [
          { source: 'Search', visits: 100 },
          { source: 'Direct', visits: 0 },
        ],
      })
      cy.get('[aria-label="Hide Search"]').click()
      cy.get('[aria-label="Hide Search"]').should(
        'have.attr',
        'aria-pressed',
        'true',
      )
      cy.get('[aria-label="Hide Direct"]').click()
      cy.get('[aria-label="Show Direct"]').should('exist')
    })
  })

  describe('"Others"', () => {
    it('folds the tail into one slice and selects it by the reserved key', () => {
      mountChart({ maxSlices: 2, onSelect: cy.spy().as('onSelect') })
      slices().should('have.length', 2)
      cy.get('[aria-label="Others, 50, 50%"]').click()
      cy.get('@onSelect').should('have.been.calledWithMatch', {
        name: OTHERS_KEY,
        label: 'Others',
        value: 50,
        rows: [
          { source: 'Direct', visits: 30 },
          { source: 'Email', visits: 20 },
        ],
      })
    })
  })

  it('pins a color to a category, CSS variable or not', () => {
    cy.document().then((doc) =>
      doc.documentElement.style.setProperty('--overdue', '#ff0000'),
    )
    mountChart({
      data: [...data, { source: 'Events', visits: 10 }],
      maxSlices: 3,
      colors: { Direct: 'var(--overdue)', [OTHERS_KEY]: '#00ff00' },
    })
    cy.get('[aria-label^="Direct"]').should(
      'have.css',
      'background-color',
      'rgb(255, 0, 0)',
    )
    cy.get('[aria-label^="Others"]').should(
      'have.css',
      'background-color',
      'rgb(0, 255, 0)',
    )
    cy.contains('[data-slot="chart-legend"] [aria-pressed]', 'Direct')
      .find('[style*="background-color"]')
      .should('have.css', 'background-color', 'rgb(255, 0, 0)')
    cy.document().then((doc) =>
      doc.documentElement.style.removeProperty('--overdue'),
    )
  })

  describe('states', () => {
    const container = () => cy.get('[data-slot="chart-container"]')

    // Zero of everything is still a breakdown: an empty track, as the ring
    // draws an empty ring, not the empty state beside a legend of 0%s.
    it('draws a bare track when every slice is zero', () => {
      mountChart({
        data: [
          { source: 'Search', visits: 0 },
          { source: 'Direct', visits: 0 },
        ],
      })
      container().should('have.attr', 'data-state', 'ready')
      track()
        .should('be.visible')
        .and('not.have.css', 'background-color', 'rgba(0, 0, 0, 0)')
      slices().should('have.length', 0)
      cy.contains('No data to show').should('not.exist')
    })

    it('says so when there is nothing to draw', () => {
      mountChart({ data: [] })
      container().should('have.attr', 'data-state', 'empty')
      cy.contains('No data to show').should('be.visible')
    })

    it('takes an app’s own placeholder while loading', () => {
      mountChart({ loading: true }, { loading: () => h('div', { id: 'own' }) })
      cy.get('#own').should('exist')
    })

    it('hands the error to the app’s own message', () => {
      mountChart(
        { error: 'boom' },
        { error: ({ error }: any) => h('span', `Failed: ${error}`) },
      )
      cy.contains('Failed: boom').should('be.visible')
    })

    it('takes an app’s own line in place of “No data to show”', () => {
      mountChart({ data: [] }, { empty: () => h('span', 'Widen the filters') })
      cy.contains('Widen the filters').should('be.visible')
    })
  })

  describe('slots', () => {
    it('puts an app’s controls in the header', () => {
      mountChart({ title: 'Traffic' }, { actions: () => h('button', 'Export') })
      cy.get('[data-slot="chart-header"]').should('contain.text', 'Export')
    })

    it('puts a mark after the title', () => {
      mountChart(
        { title: 'Traffic' },
        { 'title-suffix': () => h('span', { id: 'lock' }, 'locked') },
      )
      cy.get('[data-slot="chart-header"] #lock').should('exist')
    })
  })
})
