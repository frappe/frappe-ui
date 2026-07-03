import { h } from 'vue'
import DesktopShell from './DesktopShell.vue'
import { getScrollContainer } from '../../composables/useScrollContainer'

describe('<DesktopShell />', () => {
  it('renders the rail, sidebar, and default content slots', () => {
    cy.mount(DesktopShell, {
      slots: {
        rail: () => h('div', { 'data-test': 'rail' }, 'rail'),
        sidebar: () => h('div', { 'data-test': 'sidebar' }, 'sidebar'),
        default: () => h('div', { 'data-test': 'page' }, 'page body'),
      },
    })
    cy.get('[data-slot=desktop-shell]').should('exist')
    cy.get('[data-test=rail]').should('exist')
    cy.get('[data-test=sidebar]').should('exist')
    cy.get('[data-slot=desktop-shell-content]').should(
      'contain.text',
      'page body',
    )
  })

  it('renders the structural content region without app styling', () => {
    cy.mount(DesktopShell)
    cy.get('[data-slot=desktop-shell-content]')
      .should('have.class', 'flex')
      .and('have.class', 'min-w-0')
      .and('have.class', 'flex-1')
      .and('not.have.class', 'rounded-lg')
  })

  it('registers its scroll region so getScrollContainer() resolves', () => {
    cy.mount(DesktopShell, { slots: { default: () => h('div', 'content') } })
    cy.get('[data-slot=desktop-shell-content]').should('exist')
    cy.then(() => {
      expect(getScrollContainer()).to.not.be.null
    })
  })
})
