import { defineComponent, h, ref } from 'vue'
import ChartLegend from './ChartLegend.vue'
import { toggleHiddenSeries } from '../hiddenSeries'
import '../style.css'

const items = [
  { name: 'sales', label: 'Sales', color: '#318AD8', hidden: false },
  { name: 'refunds', label: 'Refunds', color: '#48BB74', hidden: false },
]

/**
 * The legend wraps to as many rows as it needs, so it is mounted in a box with
 * a width the way a card would give it one.
 */
function mountLegend(props: Record<string, any> = {}) {
  return cy.mount(
    defineComponent({
      setup() {
        return () =>
          h('div', { style: 'width: 320px' }, [
            h(ChartLegend, { items, ...props }),
          ])
      },
    }),
  )
}

// `aria-pressed` marks an entry. The legend also holds the "+N more" trigger,
// and copies of every entry it measures and hides.
const entries = () => cy.get('[data-slot="chart-legend"] [aria-pressed]')

describe('ChartLegend', () => {
  // v-model is N/A: the legend owns nothing. It is handed the entries and
  // emits `change`; the chart holds the hidden set and hands back new entries.
  // Slots are N/A too: an entry is a swatch, a label and a hint, all read off
  // the item. Loading and error are N/A — those states belong to the container,
  // which draws no legend until the chart is ready.

  it('lists one entry per item, named as the item names it', () => {
    mountLegend()
    entries().should('have.length', 2)
    entries().first().should('contain.text', 'Sales')
    entries().last().should('contain.text', 'Refunds')
  })

  it('draws each entry in the color of the series it stands for', () => {
    mountLegend()
    entries()
      .first()
      .find('.rounded-full')
      .should('have.css', 'background-color', 'rgb(49, 138, 216)')
  })

  it('prints the hint after the label', () => {
    mountLegend({ items: [{ ...items[0], hint: '62%' }] })
    entries().first().should('contain.text', '62%')
  })

  it('draws nothing for an empty legend', () => {
    mountLegend({ items: [] })
    cy.get('[data-slot="chart-legend"]').should('exist')
    entries().should('not.exist')
  })

  describe('pressed state', () => {
    it('reads pressed while the series is drawn', () => {
      mountLegend()
      entries().first().should('have.attr', 'aria-pressed', 'true')
    })

    it('follows the item into the hidden state', () => {
      mountLegend({ items: [{ ...items[0], hidden: true }, items[1]] })
      entries().first().should('have.attr', 'aria-pressed', 'false')
      entries().last().should('have.attr', 'aria-pressed', 'true')
    })

    // The label is the series name, so the accessible name has to carry the
    // action: "Sales" alone does not read as something to press.
    it('names the press rather than the series', () => {
      mountLegend({ items: [{ ...items[0], hidden: true }, items[1]] })
      cy.get('[aria-label="Show Sales"]').should('exist')
      cy.get('[aria-label="Hide Refunds"]').should('exist')
    })

    it('dims the swatch and the label of a hidden series', () => {
      mountLegend({ items: [{ ...items[0], hidden: true }] })
      entries().first().find('.rounded-full').should('have.class', 'opacity-30')
      entries().first().find('.text-ink-gray-4').should('have.text', 'Sales')
    })
  })

  describe('change', () => {
    it('emits the series name when an entry is pressed', () => {
      mountLegend({ onChange: cy.spy().as('onChange') })
      entries().last().click()
      cy.get('@onChange').should('have.been.calledOnceWith', 'refunds')
    })

    // The parent owns the hidden set: the legend redraws only once new items
    // come back down.
    it('reflects the hidden set the parent hands back', () => {
      cy.mount(
        defineComponent({
          setup() {
            const hidden = ref<string[]>([])
            return () =>
              h('div', { style: 'width: 320px' }, [
                h(ChartLegend, {
                  items: items.map((item) => ({
                    ...item,
                    hidden: hidden.value.includes(item.name),
                  })),
                  onChange: (name: string) => {
                    hidden.value = hidden.value.includes(name)
                      ? hidden.value.filter((n) => n !== name)
                      : [...hidden.value, name]
                  },
                }),
              ])
          },
        }),
      )

      cy.get('[aria-label="Hide Sales"]').click()
      cy.get('[aria-label="Show Sales"]').should(
        'have.attr',
        'aria-pressed',
        'false',
      )
      cy.get('[aria-label="Show Sales"]').click()
      cy.get('[aria-label="Hide Sales"]').should(
        'have.attr',
        'aria-pressed',
        'true',
      )
    })
  })

  describe('highlight', () => {
    it('names the hovered series, and clears it on the way out', () => {
      mountLegend({ onHighlight: cy.spy().as('onHighlight') })
      entries().first().trigger('mouseenter')
      cy.get('@onHighlight').should('have.been.calledWith', 'sales')
      entries().first().trigger('mouseleave')
      cy.get('@onHighlight').should('have.been.calledWith', null)
    })

    // A keyboard reader gets the same highlight a pointer does.
    it('names the focused series, and clears it on blur', () => {
      mountLegend({ onHighlight: cy.spy().as('onHighlight') })
      entries().first().focus()
      cy.get('@onHighlight').should('have.been.calledWith', 'sales')
      entries().first().blur()
      cy.get('@onHighlight').should('have.been.calledWith', null)
    })
  })

  describe('keyboard', () => {
    it('reaches every entry in the order the series are drawn', () => {
      mountLegend()
      entries().first().focus()
      cy.focused().should('have.attr', 'aria-label', 'Hide Sales')
      cy.press(Cypress.Keyboard.Keys.TAB)
      cy.focused().should('have.attr', 'aria-label', 'Hide Refunds')
    })

    it('presses an entry with Enter', () => {
      mountLegend({ onChange: cy.spy().as('onChange') })
      entries().first().focus()
      cy.focused().type('{enter}')
      cy.get('@onChange').should('have.been.calledOnceWith', 'sales')
    })

    it('presses an entry with Space', () => {
      mountLegend({ onChange: cy.spy().as('onChange') })
      entries().last().focus()
      cy.focused().type(' ')
      cy.get('@onChange').should('have.been.calledOnceWith', 'refunds')
    })
  })

  describe('overflow', () => {
    // Named so the largest totals sit at the end of the given order: ranking
    // has to move them to the front for a test to tell the two orders apart.
    const many = (count: number) =>
      Array.from({ length: count }, (_, i) => ({
        name: `s${i}`,
        label: `Series ${i}`,
        color: '#318AD8',
        hidden: false,
        weight: (i + 1) * 10,
        formattedValue: `${(i + 1) * 10} kg`,
      }))

    function mountMany(
      count: number,
      props: Record<string, any> = {},
      width = 320,
    ) {
      return cy.mount(
        defineComponent({
          setup() {
            return () =>
              h('div', { style: `width: ${width}px` }, [
                h(ChartLegend, { items: many(count), ...props }),
              ])
          },
        }),
      )
    }

    const inline = () => cy.get('[data-slot="chart-legend"] [aria-pressed]')
    const more = () =>
      cy.get('[data-slot="chart-legend"] [aria-label$="more series"]')
    const list = () => cy.get('[data-slot="content"][role="listbox"]')
    const rows = () => list().find('[role="option"]')

    // A parent that owns the hidden set the way a chart does, refusals
    // included.
    function mountOwned(count: number) {
      return cy.mount(
        defineComponent({
          setup() {
            const hidden = ref<string[]>([])
            return () =>
              h('div', { style: 'width: 320px' }, [
                h(ChartLegend, {
                  items: many(count).map((item) => ({
                    ...item,
                    hidden: hidden.value.includes(item.name),
                  })),
                  onChange: (name: string) => {
                    hidden.value = toggleHiddenSeries(
                      hidden.value,
                      name,
                      many(count)
                        .map((item) => item.name)
                        .filter((n) => !hidden.value.includes(n)),
                    )
                  },
                }),
              ])
          },
        }),
      )
    }

    it('keeps to one row and puts the rest behind "+N more"', () => {
      mountMany(30)
      more().should('be.visible')
      inline().then((entries) => {
        const tops = new Set(
          [...entries].map((entry) => entry.getBoundingClientRect().top),
        )
        expect(tops.size).to.equal(1)
        more().should('have.text', `+${30 - entries.length} more`)
      })
      cy.get('[data-slot="chart-legend"]')
        .invoke('outerHeight')
        .should('be.lessThan', 30)
    })

    it('keeps the largest series on the row', () => {
      mountMany(30)
      inline().first().should('have.attr', 'aria-label', 'Hide Series 29')
      inline().eq(1).should('have.attr', 'aria-label', 'Hide Series 28')
    })

    it('keeps the given order when every entry fits', () => {
      mountMany(3, {}, 800)
      more().should('not.exist')
      inline().first().should('have.attr', 'aria-label', 'Hide Series 0')
      inline().last().should('have.attr', 'aria-label', 'Hide Series 2')
    })

    function mountResizable() {
      return cy.mount(
        defineComponent({
          setup() {
            const width = ref(240)
            return () =>
              h('div', [
                h(
                  'button',
                  { id: 'widen', onClick: () => (width.value = 1400) },
                  'Widen',
                ),
                h(
                  'button',
                  { id: 'narrow', onClick: () => (width.value = 240) },
                  'Narrow',
                ),
                h('div', { style: `width: ${width.value}px` }, [
                  h(ChartLegend, { items: many(8) }),
                ]),
              ])
          },
        }),
      )
    }

    it('fits again once the row has the room', () => {
      mountResizable()
      more().should('exist')
      cy.get('#widen').click()
      more().should('not.exist')
      inline().should('have.length', 8)
    })

    // The panel goes with its trigger, rather than coming back on its own
    // the next time the row overflows.
    it('closes the popover once every entry fits', () => {
      mountResizable()
      more().click()
      list().should('be.visible')
      cy.get('#widen').click({ force: true })
      more().should('not.exist')
      cy.get('#narrow').click({ force: true })
      more().should('exist').and('have.attr', 'aria-expanded', 'false')
      list().should('not.exist')
    })

    it('names the trigger by what it opens', () => {
      mountMany(30)
      more().then((trigger) => {
        const hidden = trigger.text().trim().match(/\d+/)![0]
        expect(trigger.attr('aria-label')).to.equal(
          `Show ${hidden} more series`,
        )
      })
      more()
        .should('have.attr', 'aria-haspopup', 'listbox')
        .and('have.attr', 'aria-expanded', 'false')
        .click()
      more().should('have.attr', 'aria-expanded', 'true')
    })

    // The legend measures hidden copies of its entries. A search by text
    // has to land on the one a reader sees.
    it('finds the real entry first by its label', () => {
      mountMany(30)
      cy.contains('button', 'Series 29')
        .should('be.visible')
        .and('have.attr', 'aria-pressed', 'true')
    })

    it('lists every series in the popover, heaviest first, with its value', () => {
      mountMany(12)
      more().click()
      rows().should('have.length', 12)
      rows().first().should('contain.text', 'Series 11')
      rows().first().should('contain.text', '120 kg')
      rows().last().should('contain.text', 'Series 0')
      rows().last().should('contain.text', '10 kg')
    })

    it('checks the rows whose series are drawn', () => {
      mountMany(12, {
        items: many(12).map((item) => ({
          ...item,
          hidden: item.name === 's0',
        })),
      })
      more().click()
      rows().first().should('have.attr', 'aria-selected', 'true')
      rows().last().should('have.attr', 'aria-selected', 'false')
    })

    it('toggles a series from the popover', () => {
      mountMany(12, { onChange: cy.spy().as('onChange') })
      more().click()
      rows().last().click()
      cy.get('@onChange').should('have.been.calledOnceWith', 's0')
    })

    it('shows a hidden series again from the popover', () => {
      mountOwned(12)
      more().click()
      rows().last().click()
      rows().last().should('have.attr', 'aria-selected', 'false')
      rows().last().click()
      rows().last().should('have.attr', 'aria-selected', 'true')
    })

    // The chart refuses to hide its last visible series, and the row has to
    // say so rather than show a box the plot does not agree with.
    it('keeps the last visible series checked', () => {
      cy.mount(
        defineComponent({
          setup() {
            const hidden = ref<string[]>(['s0', 's1'])
            return () =>
              h('div', { style: 'width: 120px' }, [
                h(ChartLegend, {
                  items: many(3).map((item) => ({
                    ...item,
                    hidden: hidden.value.includes(item.name),
                  })),
                  onChange: (name: string) => {
                    hidden.value = toggleHiddenSeries(
                      hidden.value,
                      name,
                      many(3)
                        .map((item) => item.name)
                        .filter((n) => !hidden.value.includes(n)),
                    )
                  },
                }),
              ])
          },
        }),
      )
      more().click()
      list().contains('[role="option"]', 'Series 2').click()
      list()
        .contains('[role="option"]', 'Series 2')
        .should('have.attr', 'aria-selected', 'true')
    })

    it('walks the list with the arrow keys and toggles with Enter', () => {
      mountMany(30, { onChange: cy.spy().as('onChange') })
      more().click()
      list().find('[data-slot="input"]').should('have.focus')
      cy.press(Cypress.Keyboard.Keys.DOWN)
      cy.focused().type('{enter}')
      cy.get('@onChange').should('have.been.calledOnceWith', 's28')
    })

    it('prints no number for a series that has none', () => {
      mountMany(12, {
        items: many(12).map(({ formattedValue, ...item }) => item),
      })
      more().click()
      rows().first().should('have.text', 'Series 11')
    })

    it('offers no search for a short list', () => {
      mountMany(12)
      more().click()
      rows().should('have.length', 12)
      list().find('[data-slot="input"]').should('not.exist')
    })

    it('finds a series by its label past fifteen, keeping the ranking', () => {
      mountMany(30)
      more().click()
      list().find('[data-slot="input"]').type('series 2')
      // Series 2 and Series 20 to 29, heaviest first rather than closest
      // match first.
      rows().should('have.length', 11)
      rows().first().should('contain.text', 'Series 29')
      rows().last().should('contain.text', 'Series 2')
      list().find('[data-slot="input"]').clear().type('nothing like it')
      rows().should('not.exist')
      list().should('contain.text', 'No series match')
    })

    it('starts the next search empty', () => {
      mountMany(30)
      more().click()
      list().find('[data-slot="input"]').type('series 2')
      cy.get('body').type('{esc}')
      list().should('not.exist')
      more().click()
      list().find('[data-slot="input"]').should('have.value', '')
      rows().should('have.length', 30)
    })

    it('lays the popover out right to left inside an rtl chart', () => {
      cy.mount(
        defineComponent({
          setup() {
            return () =>
              h('div', { dir: 'rtl', style: 'width: 320px' }, [
                h(ChartLegend, { items: many(12) }),
              ])
          },
        }),
      )
      more().click()
      list().should(($list) =>
        expect(getComputedStyle($list[0]).direction).to.equal('rtl'),
      )
    })
  })
})
