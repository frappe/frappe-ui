import { h } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import MobileNav from './MobileNav.vue'
import MobileNavItem from './MobileNavItem.vue'
import {
  registerScrollContainer,
  unregisterScrollContainer,
} from '../../composables/useScrollContainer'

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
  it('renders a button and emits click when there is no `to`', () => {
    const onClick = cy.stub().as('click')
    cy.mount(MobileNavItem, { props: { label: 'Home', icon: 'lucide-house', onClick } })
    cy.get('button[data-slot=mobile-nav-item]').should('exist')
    cy.get('button').click()
    cy.get('@click').should('have.been.calledOnce')
  })

  it('renders a router link to a different route', () => {
    cy.mount(MobileNavItem, {
      props: { label: 'Search', icon: 'lucide-search', to: '/search' },
      global: { plugins: [routerAt('/')] },
    })
    cy.get('a[data-slot=mobile-nav-item]').should('have.attr', 'href', '/search')
  })

  it('is a button (not a link) when `to` is already the current route', () => {
    cy.mount(MobileNavItem, {
      props: { label: 'Home', icon: 'lucide-house', to: '/' },
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
    registerScrollContainer(scroller)

    cy.mount(MobileNavItem, {
      props: { label: 'Home', icon: 'lucide-house', to: '/' },
      global: { plugins: [routerAt('/')] },
    })
    cy.get('button[data-slot=mobile-nav-item]').click()
    cy.get('@scrollTo')
      .should('have.been.calledOnce')
      .then(() => unregisterScrollContainer(scroller))
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
