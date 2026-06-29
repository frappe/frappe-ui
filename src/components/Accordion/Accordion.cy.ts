import Accordion from './Accordion.vue'
import { defineComponent, h, ref } from 'vue'

const items = [
  { value: 'one', title: 'First', content: 'First content' },
  { value: 'two', title: 'Second', content: 'Second content' },
  { value: 'three', title: 'Third', content: 'Third content', disabled: true },
]

describe('Accordion', () => {
  it('renders a trigger per item', () => {
    cy.mount(Accordion, { props: { items } })

    cy.get('[data-slot=trigger]').should('have.length', items.length)
    cy.get('[data-slot=trigger]').first().should('contain.text', 'First')
  })

  it('opens the item named by default-value', () => {
    cy.mount(Accordion, { props: { items, defaultValue: 'two' } })

    cy.get('[data-slot=trigger]')
      .eq(1)
      .should('have.attr', 'aria-expanded', 'true')
    cy.contains('Second content').should('be.visible')
    // reka unmounts collapsed panel content by default.
    cy.contains('First content').should('not.exist')
  })

  it('exposes only the open panel to assistive tech', () => {
    cy.mount(Accordion, { props: { items, defaultValue: 'one' } })

    // reka drives the region semantics: open panel is exposed, collapsed
    // panels carry the `hidden` attribute (skipped by AT and tabbing).
    cy.get('[data-slot=content]').eq(0).should('not.have.attr', 'hidden')
    cy.get('[data-slot=content]').eq(1).should('have.attr', 'hidden')

    cy.get('[data-slot=trigger]').eq(0).should('have.attr', 'aria-controls')
    cy.get('[data-slot=content]').eq(0).should('have.attr', 'role', 'region')
  })

  it('renders the item-suffix slot before the chevron', () => {
    cy.mount(Accordion, {
      props: { items },
      slots: {
        'item-suffix': ({ item }) =>
          h('span', { 'data-cy': `suffix-${item.value}` }, 'badge'),
      },
    })

    cy.get('[data-cy=suffix-one]').should('exist')
    // Lives inside the trigger, ahead of the chevron.
    cy.get('[data-slot=trigger]').first().find('[data-cy=suffix-one]')
  })

  it('wraps each trigger in the configured heading tag', () => {
    cy.mount(Accordion, { props: { items, headingTag: 'h2' } })

    cy.get('h2').should('have.length', items.length)
    cy.get('h2').first().find('[data-slot=trigger]').should('exist')
  })

  it('keeps only one item open in single mode', () => {
    cy.mount(Accordion, { props: { items, defaultValue: 'one' } })

    cy.get('[data-slot=trigger]').eq(1).click()

    cy.get('[data-slot=trigger]')
      .eq(0)
      .should('have.attr', 'aria-expanded', 'false')
    cy.get('[data-slot=trigger]')
      .eq(1)
      .should('have.attr', 'aria-expanded', 'true')
  })

  it('collapses the open item when collapsible (default)', () => {
    cy.mount(Accordion, { props: { items, defaultValue: 'one' } })

    cy.get('[data-slot=trigger]')
      .eq(0)
      .should('have.attr', 'aria-expanded', 'true')
    cy.get('[data-slot=trigger]').eq(0).click()
    cy.get('[data-slot=trigger]')
      .eq(0)
      .should('have.attr', 'aria-expanded', 'false')
  })

  it('allows several open items in multiple mode', () => {
    cy.mount(Accordion, {
      props: { items, type: 'multiple', defaultValue: ['one'] },
    })

    cy.get('[data-slot=trigger]').eq(1).click()

    cy.get('[data-slot=trigger]')
      .eq(0)
      .should('have.attr', 'aria-expanded', 'true')
    cy.get('[data-slot=trigger]')
      .eq(1)
      .should('have.attr', 'aria-expanded', 'true')
  })

  it('does not open a disabled item', () => {
    cy.mount(Accordion, { props: { items } })

    cy.get('[data-slot=trigger]').eq(2).should('be.disabled')
    cy.get('[data-slot=trigger]').eq(2).click({ force: true })
    cy.get('[data-slot=trigger]')
      .eq(2)
      .should('have.attr', 'aria-expanded', 'false')
  })

  it('renders the item-content slot', () => {
    cy.mount(Accordion, {
      props: { items, defaultValue: 'one' },
      slots: {
        'item-content': ({ item }) =>
          h('div', { 'data-cy': 'slot' }, `slot:${item.value}`),
      },
    })

    cy.contains('[data-cy=slot]', 'slot:one').should('be.visible')
  })

  it('supports a controlled v-model round-trip', () => {
    const Harness = defineComponent({
      setup() {
        const value = ref<string>('one')
        return () =>
          h(Accordion, {
            items,
            modelValue: value.value,
            'onUpdate:modelValue': (next: string | string[]) => {
              value.value = next as string
            },
          })
      },
    })

    cy.mount(Harness)

    cy.get('[data-slot=trigger]')
      .eq(0)
      .should('have.attr', 'aria-expanded', 'true')
    cy.get('[data-slot=trigger]').eq(1).click()
    cy.get('[data-slot=trigger]')
      .eq(0)
      .should('have.attr', 'aria-expanded', 'false')
    cy.get('[data-slot=trigger]')
      .eq(1)
      .should('have.attr', 'aria-expanded', 'true')
  })
})
