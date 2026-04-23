import Tabs from './Tabs.vue'
import { defineComponent, h, ref } from 'vue'

const tabs = [
  {
    label: 'Tab 1',
    content: 'Tab 1 content',
  },
  {
    label: 'Tab 2',
    content: 'Tab 2 content',
  },
]

describe('Tabs', () => {
  it('Vertical', () => {
    cy.mount(Tabs, {
      props: { tabs },
      slots: { 'tab-panel': ({ tab }) => tab.contentkkkk },
    })

    cy.get('[role=tablist]').should('exist')
    cy.get('[role=tab]').should('have.length', tabs.length)
    cy.get('[role=tablist]').should(
      'have.attr',
      'aria-orientation',
      'horizontal',
    )
  })

  it('Horizontal', () => {
    cy.mount(Tabs, {
      props: { tabs, vertical: true },
      slots: { 'tab-panel': ({ tab }) => tab.content },
    })

    cy.get('[role=tablist]').should('exist')
    cy.get('[role=tab]').should('have.length', tabs.length)
    cy.get('[role=tablist]').should('have.attr', 'aria-orientation', 'vertical')
  })

  it('Slots', () => {
    cy.mount(Tabs, {
      props: { tabs },

      slots: {
        'tab-item': ({ tab }) => h('div', { 'data-cy': tab.label }, tab.label),
        'tab-panel': ({ tab }) =>
          h('div', { 'data-cy': tab.content }, tab.content),
      },
    })

    cy.get(`[data-cy="${tabs[0].label}"]`).should('exist')
    cy.get(`[data-cy="${tabs[0].content}"]`).should('exist')
  })

  it('supports uncontrolled selection fallback', () => {
    cy.mount(Tabs, {
      props: { tabs, 'onUpdate:modelValue': cy.spy().as('onUpdate') },
      slots: {
        'tab-panel': ({ tab }) =>
          h('div', { 'data-cy': tab.content }, tab.content),
      },
    })

    cy.get('@onUpdate').should('not.have.been.called')
    cy.get('[role=tab]').eq(1).should('have.attr', 'aria-selected', 'false')

    cy.get('[role=tab]').eq(1).click()

    cy.get('@onUpdate').should('have.been.calledWith', 1)
    cy.get('[role=tab]').eq(1).should('have.attr', 'aria-selected', 'true')
  })

  it('supports controlled v-model round-trip', () => {
    const Harness = defineComponent({
      setup() {
        const value = ref(0)

        return () =>
          h(
            Tabs,
            {
              tabs,
              modelValue: value.value,
              'onUpdate:modelValue': (nextValue: string | number) => {
                value.value = nextValue
              },
            },
            {
              'tab-panel': ({ tab }) =>
                h('div', { 'data-cy': tab.content }, tab.content),
            },
          )
      },
    })

    cy.mount(Harness)

    cy.get('[role=tab]').eq(0).should('have.attr', 'aria-selected', 'true')
    cy.get('[role=tab]').eq(1).should('have.attr', 'aria-selected', 'false')

    cy.get('[role=tab]').eq(1).click()

    cy.get('[role=tab]').eq(0).should('have.attr', 'aria-selected', 'false')
    cy.get('[role=tab]').eq(1).should('have.attr', 'aria-selected', 'true')
  })
})
