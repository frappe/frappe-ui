import { h } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import MobileNav from './MobileNav.vue'
import MobileNavItem from './MobileNavItem.vue'
import {
  registerShellScrollContainer,
  unregisterShellScrollContainer,
} from '../../composables/useShellScrolled'

function routerAt(path: string) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div />' } },
      { path: '/search', name: 'search', component: { template: '<div />' } },
    ],
  })
  router.push(path)
  return router
}

describe('<MobileNav />', () => {
  it('lays its items out as an equal-width grid', () => {
    cy.mount(MobileNav, {
      slots: {
        default: () => [
          h(MobileNavItem, { label: 'Home', icon: 'lucide-house' }),
          h(MobileNavItem, { label: 'Search', icon: 'lucide-search' }),
        ],
      },
    })
    cy.get('[data-slot=mobile-nav]').should('have.class', 'grid')
    cy.get('[data-slot=mobile-nav-item]').should('have.length', 2)
  })
})

describe('<MobileNavItem />', () => {
  it('renders a button and emits click when there is no destination', () => {
    const onClick = cy.stub().as('click')
    cy.mount(MobileNavItem, { props: { label: 'Home', icon: 'lucide-house', onClick } })
    cy.get('button[data-slot=mobile-nav-item]').should('exist')
    cy.get('button').click()
    cy.get('@click').should('have.been.calledOnce')
  })

  it('renders a router link to a different route', () => {
    cy.mount(MobileNavItem, {
      props: { label: 'Search', icon: 'lucide-search', route: '/search' },
      global: { plugins: [routerAt('/')] },
    })
    cy.get('a[data-slot=mobile-nav-item]').should('have.attr', 'href', '/search')
  })

  it('renders a plain anchor for href', () => {
    cy.mount(MobileNavItem, {
      props: { label: 'Docs', icon: 'lucide-book-open', href: 'https://frappe.io/docs' },
    })
    cy.get('a[data-slot=mobile-nav-item]').should('have.attr', 'href', 'https://frappe.io/docs')

    cy.mount(MobileNavItem, {
      props: { label: 'Route wins', route: '/search', href: 'https://frappe.io/docs' },
      global: { plugins: [routerAt('/')] },
    })
    cy.get('a[data-slot=mobile-nav-item]').should('have.attr', 'href', '/search')
  })

  it('is a button (not a link) when `route` is already the current route', () => {
    cy.mount(MobileNavItem, {
      props: { label: 'Home', icon: 'lucide-house', route: '/' },
      global: { plugins: [routerAt('/')] },
    })
    cy.get('button[data-slot=mobile-nav-item]').should('exist')
    cy.get('a[data-slot=mobile-nav-item]').should('not.exist')
    cy.get('[data-slot=mobile-nav-item]').should('have.attr', 'aria-current', 'page')
  })

  it('scrolls the registered container to the top when the current tab is tapped', () => {
    const scroller = document.createElement('div')
    Object.defineProperty(scroller, 'scrollHeight', { value: 2000 })
    const scrollTo = cy.stub().as('scrollTo')
    scroller.scrollTo = scrollTo
    registerShellScrollContainer(scroller)

    cy.mount(MobileNavItem, {
      props: { label: 'Home', icon: 'lucide-house', route: '/' },
      global: { plugins: [routerAt('/')] },
    })
    cy.get('button[data-slot=mobile-nav-item]').click()
    cy.get('@scrollTo')
      .should('have.been.calledOnce')
      .then(() => unregisterShellScrollContainer(scroller))
  })

  it('reflects `active` in data-state and exposes it to the default slot', () => {
    cy.mount(MobileNavItem, {
      props: { label: 'You', active: true },
      slots: { default: (props: { active: boolean }) => h('span', `active:${props.active}`) },
    })
    cy.get('[data-slot=mobile-nav-item][data-state=active]').should('exist')
    cy.get('[data-slot=mobile-nav-item]').should('contain.text', 'active:true')
  })
})
