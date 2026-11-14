import { defineComponent, h, inject } from 'vue'
import DesktopShell from './DesktopShell.vue'
import SidebarRail from '../SidebarRail/SidebarRail.vue'
import SidebarRailItem from '../SidebarRail/SidebarRailItem.vue'
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

  // The navigation side moves the drawing only; the DOM order stays rail,
  // sidebar, content.
  describe('navSide', () => {
    const slots = {
      rail: () => h('div', { 'data-test': 'rail', class: 'w-10' }, 'rail'),
      sidebar: () => h('div', { 'data-test': 'sidebar', class: 'w-20' }, 'sb'),
      default: () => h('div', { 'data-test': 'page' }, 'page body'),
    }
    const left = (selector: string) =>
      cy.get(selector).then(($el) => $el[0].getBoundingClientRect().left)

    it('draws rail, sidebar, content left to right by default', () => {
      cy.mount(DesktopShell, { slots })
      cy.get('[data-slot=desktop-shell]').should(
        'not.have.class',
        'flex-row-reverse',
      )
      left('[data-test=rail]').then((rail) =>
        left('[data-test=sidebar]').then((sidebar) =>
          left('[data-test=page]').then((page) => {
            expect(rail).to.be.lessThan(sidebar)
            expect(sidebar).to.be.lessThan(page)
          }),
        ),
      )
    })

    it('draws content, sidebar, rail left to right on the right, with the DOM order unchanged', () => {
      cy.mount(DesktopShell, { props: { navSide: 'right' }, slots })
      cy.get('[data-slot=desktop-shell]').should(
        'have.class',
        'flex-row-reverse',
      )
      left('[data-test=page]').then((page) =>
        left('[data-test=sidebar]').then((sidebar) =>
          left('[data-test=rail]').then((rail) => {
            expect(page).to.be.lessThan(sidebar)
            expect(sidebar).to.be.lessThan(rail)
          }),
        ),
      )
      cy.get('[data-slot=desktop-shell]').then(($shell) => {
        const order = Array.from($shell[0].children).map(
          (el) => el.getAttribute('data-test') ?? el.getAttribute('data-slot'),
        )
        expect(order).to.deep.equal([
          'rail',
          'sidebar',
          'desktop-shell-content',
        ])
      })
    })

    // The tooltip content teleports out of the shell, so it is found by its
    // text. Focus opens it with no hover delay.
    for (const navSide of ['left', 'right'] as const) {
      const right = navSide === 'right'

      it(`puts a rail item's active bar and tooltip on the outer edge for navSide=${navSide}`, () => {
        cy.mount(DesktopShell, {
          props: { navSide },
          slots: {
            rail: () =>
              h(SidebarRail, null, {
                default: () =>
                  h(SidebarRailItem, {
                    label: 'Design',
                    icon: 'lucide-palette',
                    active: true,
                  }),
              }),
          },
        })
        cy.get('[data-slot=sidebar-rail-item-indicator]')
          .should(right ? 'have.class' : 'not.have.class', 'rounded-l-4')
          .and(right ? 'not.have.class' : 'have.class', 'rounded-r-4')
          .then(($bar) => {
            const bar = $bar[0].getBoundingClientRect()
            const cell = $bar[0].parentElement!.getBoundingClientRect()
            if (right) expect(bar.left).to.be.greaterThan(cell.right)
            else expect(bar.right).to.be.lessThan(cell.left)
          })
        cy.get('[data-slot=sidebar-rail-item]').focus()
        cy.contains('[data-side]', 'Design').should(
          'have.attr',
          'data-side',
          right ? 'left' : 'right',
        )
      })
    }
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
