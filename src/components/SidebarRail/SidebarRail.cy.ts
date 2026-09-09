import { h } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import SidebarRail from './SidebarRail.vue'
import SidebarRailItem from './SidebarRailItem.vue'

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/search', component: { template: '<div />' } },
    ],
  })
}

describe('<SidebarRail />', () => {
  it('renders its children in a single column', () => {
    cy.mount(SidebarRail, {
      slots: {
        default: () => [
          h(SidebarRailItem, { label: 'Home', icon: 'lucide-house' }),
          h(SidebarRailItem, { label: 'Design' }, () => 'DE'),
          h(SidebarRailItem, { label: 'Search', icon: 'lucide-search' }),
        ],
      },
    })
    cy.get('[data-slot=sidebar-rail]').should('exist')
    cy.get('[data-slot=sidebar-rail] [aria-label=Home]').should('exist')
    cy.get('[data-slot=sidebar-rail] [aria-label=Design]').should('contain.text', 'DE')
    cy.get('[data-slot=sidebar-rail] [aria-label=Search]').should('exist')
  })
})

describe('<SidebarRailItem />', () => {
  it('renders a button and emits click when there is no `to`', () => {
    const onClick = cy.stub().as('click')
    cy.mount(SidebarRailItem, {
      props: { label: 'Search', icon: 'lucide-search', onClick },
    })
    cy.get('button[data-slot=sidebar-rail-item]').should('exist')
    cy.get('button').click()
    cy.get('@click').should('have.been.calledOnce')
  })

  it('renders a router link when `to` is set', () => {
    cy.mount(SidebarRailItem, {
      props: { label: 'Search', icon: 'lucide-search', to: '/search' },
      global: { plugins: [createTestRouter()] },
    })
    cy.get('a[data-slot=sidebar-rail-item]').should('have.attr', 'href', '/search')
  })

  it('shows the indicator bar for an active tile, not an active ghost', () => {
    cy.mount(SidebarRailItem, { props: { label: 'Design', active: true } })
    cy.get('[data-slot=sidebar-rail-item][data-state=active]').should('exist')
    cy.get('[data-slot=sidebar-rail-item-indicator]').should('exist')

    cy.mount(SidebarRailItem, {
      props: { label: 'Search', icon: 'lucide-search', variant: 'ghost', active: true },
    })
    cy.get('[data-slot=sidebar-rail-item-indicator]').should('not.exist')
    cy.get('[data-slot=sidebar-rail-item]').should('have.class', 'shadow-sm')
  })

  it('renders a dot for badgeStyle=dot and a capped pill for badgeStyle=count', () => {
    cy.mount(SidebarRailItem, {
      props: { label: 'Notifications', icon: 'lucide-bell', badge: 3, badgeStyle: 'dot' },
    })
    cy.get('[data-slot=sidebar-rail-item-badge-dot]').should('exist')

    cy.mount(SidebarRailItem, {
      props: { label: 'Notifications', icon: 'lucide-bell', badge: 142, badgeStyle: 'count' },
    })
    // The pill teleports to <body>.
    cy.get('body').should('contain.text', '99+')
  })

  it('lets `description` replace the unread line under the tooltip label', () => {
    cy.mount(SidebarRailItem, {
      props: { label: 'Notifications', icon: 'lucide-bell', badge: 3, badgeStyle: 'dot' },
    })
    cy.get('[data-slot=sidebar-rail-item]').trigger('pointerenter').trigger('pointermove')
    // The tooltip teleports to <body>.
    cy.get('body').should('contain.text', '3 unread')

    cy.mount(SidebarRailItem, {
      props: {
        label: 'People',
        icon: 'lucide-users-2',
        badge: 3,
        badgeStyle: 'dot',
        description: '12 members',
      },
    })
    cy.get('[data-slot=sidebar-rail-item]').trigger('pointerenter').trigger('pointermove')
    cy.get('body')
      .should('contain.text', '12 members')
      // Only meaningful because the line above already waited for the tooltip to open.
      .and('not.contain.text', '3 unread')
  })

  it('folds the unread count into the accessible label', () => {
    cy.mount(SidebarRailItem, {
      props: { label: 'Notifications', icon: 'lucide-bell', badge: 3 },
    })
    cy.get('[data-slot=sidebar-rail-item]').should('have.attr', 'aria-label', 'Notifications, 3 unread')
  })
})
