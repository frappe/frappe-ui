import { defineComponent, h, inject } from 'vue'
import DesktopShell from './DesktopShell.vue'
import PageHeader from '../PageHeader/PageHeader.vue'
import { pageHeaderTargetKey } from '../PageHeader/target'
import {
  shellScrollContainer,
  shellScrollElementKey,
} from '../../composables/useShellScrolled'

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
      .and('not.have.class', 'rounded-6')
  })

  it('registers its scroll region so shellScrollContainer resolves', () => {
    cy.mount(DesktopShell, { slots: { default: () => h('div', 'content') } })
    cy.get('[data-slot=desktop-shell-content]').should('exist')
    cy.then(() => {
      expect(shellScrollContainer.value).to.not.be.null
    })
  })

  // SHELL-Q1.
  it('fills the height without a scroll region when scroll is false', () => {
    cy.mount(DesktopShell, {
      props: { scroll: false },
      slots: { default: () => h('div', { 'data-test': 'page' }, 'page body') },
    })

    cy.get('[data-slot=scroll-area]').should('not.exist')
    cy.get('[data-test=page]')
      .parent()
      .should('have.class', 'flex-1')
      .and('have.class', 'overflow-hidden')
  })

  // SHELL-Q3: the shell a page is inside wins over the newest registry entry.
  describe('ownership', () => {
    it('hands its scroll element to the page it renders', () => {
      const Page = defineComponent({
        setup() {
          const el = inject(shellScrollElementKey, null)
          return () =>
            h('div', { 'data-test': 'page' }, el?.value ? 'found' : 'missing')
        },
      })

      cy.mount(DesktopShell, { slots: { default: () => h(Page) } })
      cy.get('[data-test=page]').should('have.text', 'found')
    })

    it('hands its page-header target to the page it renders', () => {
      const Page = defineComponent({
        setup() {
          const el = inject(pageHeaderTargetKey, null)
          return () =>
            h('div', { 'data-test': 'page' }, el?.value ? 'found' : 'missing')
        },
      })

      cy.mount(DesktopShell, { slots: { default: () => h(Page) } })
      cy.get('[data-test=page]').should('have.text', 'found')
    })

    it('a header inside it teleports to its own target, not the newest one', () => {
      // Two shells mounted at once. The registry answers "newest", which is the
      // second one; the header belongs to the first.
      const Both = defineComponent({
        setup() {
          return () =>
            h('div', [
              h('div', { 'data-test': 'first' }, [
                h(DesktopShell, null, {
                  default: () =>
                    h(PageHeader, null, { default: () => 'Page title' }),
                }),
              ]),
              h('div', { 'data-test': 'second' }, [h(DesktopShell)]),
            ])
        },
      })

      cy.mount(Both)
      cy.get('[data-test=first] header').should('contain.text', 'Page title')
      cy.get('[data-test=second] header').should('not.exist')
    })
  })
})
