import { defineComponent, h, inject } from 'vue'
import MobileShell from './MobileShell.vue'
import PageHeader from '../PageHeader/PageHeader.vue'
import { pageHeaderTargetKey } from '../PageHeader/target'
import {
  shellScrollContainer,
  shellScrollElementKey,
} from '../../composables/useShellScrolled'

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

  it('registers its scroll region so shellScrollContainer resolves', () => {
    cy.mount(MobileShell, { slots: { default: () => h('div', 'content') } })
    cy.get('[data-slot=mobile-shell-scroll]').should('exist')
    cy.then(() => {
      expect(shellScrollContainer.value).to.not.be.null
    })
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

      cy.mount(MobileShell, { slots: { default: () => h(Page) } })
      cy.get('[data-test=page]').should('have.text', 'found')
      cy.then(() => {
        cy.get('[data-slot=mobile-shell-scroll]').then(($el) => {
          expect(shellScrollContainer.value).to.equal($el[0])
        })
      })
    })

    it('hands its page-header target to the page it renders', () => {
      const Page = defineComponent({
        setup() {
          const el = inject(pageHeaderTargetKey, null)
          return () =>
            h('div', { 'data-test': 'page' }, el?.value ? 'found' : 'missing')
        },
      })

      cy.mount(MobileShell, { slots: { default: () => h(Page) } })
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
                h(MobileShell, null, {
                  default: () =>
                    h(PageHeader, null, { default: () => 'Page title' }),
                }),
              ]),
              h('div', { 'data-test': 'second' }, [h(MobileShell)]),
            ])
        },
      })

      cy.mount(Both)
      cy.get('[data-test=first] header').should('contain.text', 'Page title')
      cy.get('[data-test=second] header').should('not.exist')
    })
  })
})
