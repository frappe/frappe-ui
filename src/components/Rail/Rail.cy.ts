import { h } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import Rail from './Rail.vue'
import RailItem from './RailItem.vue'

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/search', component: { template: '<div />' } },
    ],
  })
}

describe('<Rail />', () => {
  it('renders its children in a single column', () => {
    cy.mount(Rail, {
      slots: {
        default: () => [
          h(RailItem, { label: 'Home', icon: 'lucide-house' }),
          h(RailItem, { label: 'Design' }, () => 'DE'),
          h(RailItem, { label: 'Search', icon: 'lucide-search' }),
        ],
      },
    })
    cy.get('[data-slot=rail]').should('exist')
    cy.get('[data-slot=rail] [aria-label=Home]').should('exist')
    cy.get('[data-slot=rail] [aria-label=Design]').should('contain.text', 'DE')
    cy.get('[data-slot=rail] [aria-label=Search]').should('exist')
  })
})

describe('<RailItem />', () => {
  it('renders a button and emits click when there is no `to`', () => {
    const onClick = cy.stub().as('click')
    cy.mount(RailItem, {
      props: { label: 'Search', icon: 'lucide-search', onClick },
    })
    cy.get('button[data-slot=rail-item]').should('exist')
    cy.get('button').click()
    cy.get('@click').should('have.been.calledOnce')
  })

  it('renders a router link when `to` is set', () => {
    cy.mount(RailItem, {
      props: { label: 'Search', icon: 'lucide-search', to: '/search' },
      global: { plugins: [createTestRouter()] },
    })
    cy.get('a[data-slot=rail-item]').should('have.attr', 'href', '/search')
  })

  it('shows the indicator bar for an active tile, not an active ghost', () => {
    cy.mount(RailItem, { props: { label: 'Design', active: true } })
    cy.get('[data-slot=rail-item][data-state=active]').should('exist')
    cy.get('[data-slot=rail-item-indicator]').should('exist')

    cy.mount(RailItem, {
      props: { label: 'Search', icon: 'lucide-search', variant: 'ghost', active: true },
    })
    cy.get('[data-slot=rail-item-indicator]').should('not.exist')
    cy.get('[data-slot=rail-item]').should('have.class', 'shadow-sm')
  })

  it('renders a dot for badgeStyle=dot and a capped pill for badgeStyle=count', () => {
    cy.mount(RailItem, {
      props: { label: 'Notifications', icon: 'lucide-bell', badge: 3, badgeStyle: 'dot' },
    })
    cy.get('[data-slot=rail-item-badge-dot]').should('exist')

    cy.mount(RailItem, {
      props: { label: 'Notifications', icon: 'lucide-bell', badge: 142, badgeStyle: 'count' },
    })
    // The pill teleports to <body>.
    cy.get('body').should('contain.text', '99+')
  })

  it('folds the unread count into the accessible label', () => {
    cy.mount(RailItem, {
      props: { label: 'Notifications', icon: 'lucide-bell', badge: 3 },
    })
    cy.get('[data-slot=rail-item]').should('have.attr', 'aria-label', 'Notifications, 3 unread')
  })
})
