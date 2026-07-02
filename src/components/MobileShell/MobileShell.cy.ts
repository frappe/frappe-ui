import { h } from 'vue'
import MobileShell from './MobileShell.vue'
import { getScrollContainer } from '../../composables/useScrollContainer'

describe('<MobileShell />', () => {
  it('renders the default content and #nav slots', () => {
    cy.mount(MobileShell, {
      slots: {
        default: () => h('div', { 'data-test': 'page' }, 'page body'),
        nav: () => h('div', { 'data-test': 'nav' }, 'tab bar'),
      },
    })
    cy.get('[data-slot=mobile-shell]').should('exist')
    cy.get('[data-slot=mobile-shell-scroll]').should('contain.text', 'page body')
    cy.get('[data-test=nav]').should('contain.text', 'tab bar')
  })

  it('registers its scroll region so getScrollContainer() resolves', () => {
    cy.mount(MobileShell, { slots: { default: () => h('div', 'content') } })
    cy.get('[data-slot=mobile-shell-scroll]').should('exist')
    cy.then(() => {
      expect(getScrollContainer()).to.not.be.null
    })
  })
})
