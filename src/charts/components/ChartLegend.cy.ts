import { defineComponent, h, ref } from 'vue'
import ChartLegend from './ChartLegend.vue'
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
    const list = () => cy.get('[data-slot="chart-legend-list"]')
    const rows = () => list().find('[aria-pressed]')

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

    it('names the trigger by what it opens, and the panel after it', () => {
      mountMany(30)
      more().then((trigger) => {
        const hidden = trigger.text().trim().match(/\d+/)![0]
        expect(trigger.attr('aria-label')).to.equal(
          `Show ${hidden} more series`,
        )
        trigger.trigger('click')
        cy.get('[role="dialog"]').should(
          'have.attr',
          'aria-labelledby',
          trigger.attr('id'),
        )
      })
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

    it('toggles a series from the popover', () => {
      mountMany(12, { onChange: cy.spy().as('onChange') })
      more().click()
      rows().last().click()
      cy.get('@onChange').should('have.been.calledOnceWith', 's0')
    })

    it('highlights the series under a popover row', () => {
      mountMany(12, { onHighlight: cy.spy().as('onHighlight') })
      more().click()
      rows().eq(2).trigger('mouseenter')
      cy.get('@onHighlight').should('have.been.calledWith', 's9')
      rows().eq(2).trigger('mouseleave')
      cy.get('@onHighlight').should('have.been.calledWith', null)
    })

    it('clears the highlight when the popover closes', () => {
      mountMany(12, { onHighlight: cy.spy().as('onHighlight') })
      more().click()
      rows().eq(2).trigger('mouseenter')
      cy.get('body').type('{esc}')
      list().should('not.exist')
      cy.get('@onHighlight').should((spy: any) =>
        expect(spy.lastCall.args[0]).to.equal(null),
      )
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
      list().find('input').should('not.exist')
    })

    it('finds a series by its label past fifteen', () => {
      mountMany(30)
      more().click()
      list().find('input').type('series 2')
      // Series 2 and Series 20 to 29.
      rows().should('have.length', 11)
      rows().first().should('contain.text', 'Series 29')
      list().find('input').clear().type('nothing like it')
      rows().should('not.exist')
      list().should('contain.text', 'No series match')
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
      list().should('have.attr', 'dir', 'rtl')
    })
  })
})
