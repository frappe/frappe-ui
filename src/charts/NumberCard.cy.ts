import { defineComponent, h } from 'vue'
import NumberCard from './NumberCard.vue'
import './style.css'

function mountCard(props: Record<string, any> = {}) {
  return cy.mount(
    defineComponent({
      setup() {
        return () =>
          h('div', { style: 'width: 260px' }, [
            h(NumberCard, { title: 'Revenue', value: 12300, ...props }),
          ])
      },
    }),
  )
}

const card = () => cy.get('[data-slot="chart-card"]')

describe('NumberCard', () => {
  it('prints the title and the reading', () => {
    mountCard()
    card().should('contain.text', 'Revenue').and('contain.text', '12,300')
  })

  it('wraps the reading in its prefix and suffix', () => {
    mountCard({ value: 1234.5, prefix: '$', suffix: ' MRR', precision: 1 })
    card().should('contain.text', '$1,234.5 MRR')
  })

  it('shortens the reading on request', () => {
    mountCard({ compact: true })
    card().should('contain.text', '12.3K')
  })

  it('prints a string reading exactly as given', () => {
    mountCard({ value: 'Not tracked', compact: true })
    card().should('contain.text', 'Not tracked')
  })

  describe('delta', () => {
    it('points a rise up and colors it as good news', () => {
      mountCard({
        delta: 12.5,
        deltaSuffix: '%',
        deltaCaption: 'vs last month',
      })
      card()
        .should('contain.text', '12.5%')
        .and('contain.text', 'vs last month')
      cy.get('.lucide-arrow-up-right').should('exist')
      cy.get('.text-ink-green-3, [class*="ink-green"]').should('exist')
    })

    it('points a fall down, and drops the sign the arrow carries', () => {
      mountCard({ delta: -8 })
      cy.get('.lucide-arrow-down-left').should('exist')
      card().should('contain.text', '8').and('not.contain.text', '-8')
    })

    it('reads a fall as good news where less is better', () => {
      mountCard({ delta: -8, negativeIsBetter: true })
      cy.get('.lucide-arrow-down-left').should('exist')
      cy.get('[class*="ink-green"]').should('exist')
    })

    it('leaves no arrow on a flat reading', () => {
      mountCard({ delta: 0 })
      cy.get('.lucide-arrow-up-right').should('not.exist')
      cy.get('.lucide-arrow-down-left').should('not.exist')
    })
  })

  describe('sparkline', () => {
    it('draws a line and the band under it', () => {
      mountCard({ sparkline: { data: [1, 5, 3, 8] } })
      cy.get('[data-slot="chart-card"] svg path').should('have.length', 2)
      cy.get('linearGradient').should('exist')
    })

    it('draws bars instead when asked for', () => {
      mountCard({ sparkline: { data: [1, 5, 3, 8], type: 'bar' } })
      cy.get('[data-slot="chart-card"] svg').should('not.exist')
      cy.get('[data-slot="chart-card"] .rounded-t-1').should('have.length', 4)
    })

    it('keeps the sparkline out of the accessible tree', () => {
      mountCard({ sparkline: { data: [1, 5, 3, 8] } })
      cy.get('[aria-hidden="true"] svg').should('exist')
    })
  })

  describe('card surface', () => {
    it('draws the surface by default', () => {
      mountCard()
      card()
        .should('have.class', 'border')
        .and('have.class', 'bg-surface-elevation-2')
        .and('have.class', 'rounded-7')
        .and('have.class', 'px-4')
    })

    it('renders bare for a card the app draws itself', () => {
      mountCard({ card: false })
      card()
        .should('contain.text', 'Revenue')
        .and('not.have.class', 'border')
        .and('not.have.class', 'bg-surface-elevation-2')
        .and('not.have.class', 'rounded-7')
        .and('not.have.class', 'px-4')
    })

    it('keeps the sparkline anchored and clipped without the surface', () => {
      mountCard({ card: false, sparkline: { data: [1, 5, 3, 8] } })
      card()
        .should('have.class', 'relative')
        .and('have.class', 'overflow-hidden')
      cy.get('[data-slot="chart-card"] svg path').should('have.length', 2)
    })
  })

  describe('states', () => {
    it('holds the line open with a skeleton while loading', () => {
      mountCard({ loading: true })
      card().should('contain.text', 'Revenue')
      cy.get('.animate-pulse').should('exist')
    })

    it('says so rather than printing a stale reading on error', () => {
      mountCard({ error: 'Query timed out' })
      card()
        .should('contain.text', 'Could not render this chart')
        .and('contain.text', 'Query timed out')
        .and('not.contain.text', '12,300')
    })

    it('says there is no data rather than printing a zero', () => {
      mountCard({ value: null })
      card().should('contain.text', 'No data')
    })
  })
})
