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

const entries = () => cy.get('[data-slot="chart-legend"] button')

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
})
