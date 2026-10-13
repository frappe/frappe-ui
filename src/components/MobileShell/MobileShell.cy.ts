import { defineComponent, h, inject } from 'vue'
import MobileShell from './MobileShell.vue'
import MobileNav from '../MobileNav/MobileNav.vue'
import MobileNavItem from '../MobileNav/MobileNavItem.vue'
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
    cy.get('[data-slot=mobile-shell-scroll]').should(
      'contain.text',
      'page body',
    )
    cy.get('[data-test=nav]').should('contain.text', 'tab bar')
  })

  it('registers its scroll region so shellScrollContainer resolves', () => {
    cy.mount(MobileShell, { slots: { default: () => h('div', 'content') } })
    cy.get('[data-slot=mobile-shell-scroll]').should('exist')
    cy.then(() => {
      expect(shellScrollContainer.value).to.not.be.null
    })
  })

  describe('in an installed PWA', () => {
    let restoreStandaloneMedia: (() => void) | undefined

    afterEach(() => {
      restoreStandaloneMedia?.()
      restoreStandaloneMedia = undefined
      cy.then(() =>
        Cypress.automation('remote:debugger:protocol', {
          command: 'Emulation.setSafeAreaInsetsOverride',
          params: { insets: {} },
        }),
      )
    })

    function mountNavigation() {
      cy.mount(MobileShell, {
        slots: {
          default: () => h('div', 'page body'),
          nav: () =>
            h(MobileNav, null, {
              default: () => [
                h(MobileNavItem, { label: 'Home', icon: 'lucide-house' }),
                h(MobileNavItem, { label: 'Search', icon: 'lucide-search' }),
              ],
            }),
        },
      })
    }

    function setSafeAreaInsets(top: number, bottom: number) {
      cy.then(() =>
        Cypress.automation('remote:debugger:protocol', {
          command: 'Emulation.setSafeAreaInsetsOverride',
          params: { insets: { top, bottom } },
        }),
      )
    }

    function enableStandaloneMedia(doc: Document) {
      // Chrome cannot emulate standalone display mode, so enable its media rules here.
      const changed: { media: MediaList; original: string }[] = []
      for (const sheet of Array.from(doc.styleSheets)) {
        try {
          for (const rule of Array.from(sheet.cssRules)) {
            const media = (rule as CSSMediaRule).media
            if (media && /display-mode:\s*standalone/.test(media.mediaText)) {
              changed.push({ media, original: media.mediaText })
              media.mediaText = 'all'
            }
          }
        } catch {
          // Cross-origin stylesheets do not expose their rules.
        }
      }
      expect(changed.length, 'standalone media rules').to.be.greaterThan(0)
      return () =>
        changed.forEach(({ media, original }) => (media.mediaText = original))
    }

    it('pads the nav by the home-indicator inset on iPhone', () => {
      setSafeAreaInsets(59, 34)
      mountNavigation()
      cy.document().then((doc) => {
        restoreStandaloneMedia = enableStandaloneMedia(doc)
      })
      cy.get('[data-slot=mobile-nav]').should(($nav) => {
        const nav = $nav[0]
        const win = nav.ownerDocument.defaultView!
        expect(win.getComputedStyle(nav).paddingBottom).to.equal('34px')
      })
    })

    it('keeps one rem of bottom padding when there is no inset', () => {
      setSafeAreaInsets(0, 0)
      mountNavigation()
      cy.document().then((doc) => {
        restoreStandaloneMedia = enableStandaloneMedia(doc)
      })
      cy.get('[data-slot=mobile-nav]').should(($nav) => {
        const nav = $nav[0]
        expect(
          nav.ownerDocument.defaultView!.getComputedStyle(nav).paddingBottom,
        ).to.equal('16px')
      })
    })

    it('leaves the nav unpadded in a browser tab', () => {
      setSafeAreaInsets(59, 34)
      mountNavigation()
      cy.get('[data-slot=mobile-nav]').should(($nav) => {
        const nav = $nav[0]
        expect(
          nav.ownerDocument.defaultView!.getComputedStyle(nav).paddingBottom,
        ).to.equal('0px')
      })
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
