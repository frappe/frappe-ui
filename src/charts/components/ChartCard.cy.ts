import { defineComponent, h } from 'vue'
import ChartCard from './ChartCard.vue'
import '../style.css'

/**
 * The card fills the width it is given, so every case needs a box with one.
 * Nothing else about the mount matters: the card draws a surface and clips
 * whatever is put inside it.
 */
function mountCard(
  props: Record<string, any> = {},
  slots: Record<string, () => unknown> = { default: () => h('p', 'Plot') },
) {
  return cy.mount(
    defineComponent({
      setup() {
        return () =>
          h('div', { style: 'width: 320px' }, [h(ChartCard, props, slots)])
      },
    }),
  )
}

const card = () => cy.get('[data-slot="chart-card"]')

describe('ChartCard', () => {
  // v-model is N/A: the card holds no value, it is a surface around one.
  // Loading and error are N/A too — the states live on ChartContainer, which
  // the card wraps.

  it('renders what it is given', () => {
    mountCard()
    card().should('contain.text', 'Plot')
  })

  describe('surface', () => {
    it('draws the surface by default', () => {
      mountCard()
      card()
        .should('have.class', 'border')
        .and('have.class', 'border-outline-gray-1')
        .and('have.class', 'bg-surface-elevation-2')
        .and('have.class', 'rounded-4')
        .and('have.class', 'px-4')
        .and('have.class', 'py-3')
    })

    it('renders bare for a card the app draws itself', () => {
      mountCard({ card: false })
      card()
        .should('contain.text', 'Plot')
        .and('not.have.class', 'border')
        .and('not.have.class', 'bg-surface-elevation-2')
        .and('not.have.class', 'rounded-4')
        .and('not.have.class', 'px-4')
    })

    // Structure, not surface: a chart is drawn against this box and expects it
    // to anchor and clip, whichever way `card` is set.
    it('keeps the box anchored and clipping without the surface', () => {
      mountCard({ card: false })
      card()
        .should('have.class', 'relative')
        .and('have.class', 'overflow-hidden')
        .and('have.class', 'w-full')
        .and('have.class', 'min-w-0')
    })
  })

  describe('direction', () => {
    it('carries the direction it is told to lay out in', () => {
      mountCard({ dir: 'rtl' })
      card().should('have.attr', 'dir', 'rtl')
    })

    it('names no direction of its own, so the page decides', () => {
      mountCard()
      card().should('not.have.attr', 'dir')
    })
  })

  describe('slot', () => {
    it('renders the default slot rather than wrapping it in chrome', () => {
      mountCard({}, { default: () => h('div', { id: 'own' }, 'Own plot') })
      cy.get('#own').should('exist')
      card().should('contain.text', 'Own plot')
    })

    // The card takes no focus of its own, so anything focusable inside it is
    // reached in one tab rather than two.
    it('leaves the tab order to its contents', () => {
      mountCard({}, { default: () => h('button', { id: 'action' }, 'Export') })
      card().should('not.have.attr', 'tabindex')
      cy.get('#action').focus()
      cy.focused().should('have.id', 'action')
    })
  })
})
