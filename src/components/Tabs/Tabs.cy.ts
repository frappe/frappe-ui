import { h } from 'vue'

import Tabs from './Tabs.vue'

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
    cy.get('[role=tablist]').should('have.attr', 'aria-orientation', 'horizontal')
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
        'tab-panel': ({ tab }) => h('div', { 'data-cy': tab.content }, tab.content),
      },
    })

    cy.get(`[data-cy="${tabs[0].label}"]`).should('exist')
    cy.get(`[data-cy="${tabs[0].content}"]`).should('exist')
  })

  it('v-model', () => {
    cy.mount(Tabs, {
      props: { tabs, 'onUpdate:modelValue': cy.spy().as('onUpdate') },

      slots: {
        'tab-panel': ({ tab }) => h('div', { 'data-cy': tab.content }, tab.content),
      },
    })

    cy.get('@onUpdate').should('not.have.been.called')
    cy.get('[role=tab]').eq(1).should('have.attr', 'aria-selected', 'false')

    cy.get('[role=tab]').eq(1).should('have.attr', 'aria-selected', 'false').click()

    cy.get('@onUpdate').should('have.been.calledWith', 1)
    cy.get('[role=tab]').eq(1).should('have.attr', 'aria-selected', 'true')
  })
})
