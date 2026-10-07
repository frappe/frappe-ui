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
    cy.get('[data-slot=sidebar-rail] [aria-label=Design]').should(
      'contain.text',
      'DE',
    )
    cy.get('[data-slot=sidebar-rail] [aria-label=Search]').should('exist')
  })
})

describe('<SidebarRailItem />', () => {
  it('renders a button and emits click when there is no destination', () => {
    const onClick = cy.stub().as('click')
    cy.mount(SidebarRailItem, {
      props: { label: 'Search', icon: 'lucide-search', onClick },
    })
    cy.get('button[data-slot=sidebar-rail-item]').should('exist')
    cy.get('button').click()
    cy.get('@click').should('have.been.calledOnce')
  })

  it('renders links for `route` and `href`', () => {
    cy.mount(SidebarRailItem, {
      props: { label: 'Search', icon: 'lucide-search', route: '/search' },
      global: { plugins: [createTestRouter()] },
    })
    cy.get('a[data-slot=sidebar-rail-item]').should(
      'have.attr',
      'href',
      '/search',
    )

    cy.mount(SidebarRailItem, {
      props: {
        label: 'Docs',
        icon: 'lucide-book-open',
        href: 'https://frappe.io/docs',
      },
    })
    cy.get('a[data-slot=sidebar-rail-item]').should(
      'have.attr',
      'href',
      'https://frappe.io/docs',
    )

    cy.mount(SidebarRailItem, {
      props: {
        label: 'Route wins',
        route: '/search',
        href: 'https://frappe.io/docs',
      },
      global: { plugins: [createTestRouter()] },
    })
    cy.get('a[data-slot=sidebar-rail-item]').should(
      'have.attr',
      'href',
      '/search',
    )
  })

  it('shows the indicator bar for an active subtle item, not an active ghost', () => {
    cy.mount(SidebarRailItem, { props: { label: 'Design', active: true } })
    cy.get('[data-slot=sidebar-rail-item][data-state=active]').should('exist')
    cy.get('[data-slot=sidebar-rail-item-indicator]').should('exist')

    cy.mount(SidebarRailItem, {
      props: {
        label: 'Search',
        icon: 'lucide-search',
        variant: 'ghost',
        active: true,
      },
    })
    cy.get('[data-slot=sidebar-rail-item-indicator]').should('not.exist')
    cy.get('[data-slot=sidebar-rail-item]').should('have.class', 'shadow-sm')
  })

  it('derives active state from the current route', () => {
    const router = createTestRouter()
    cy.wrap(router.push('/search'))
    cy.mount(SidebarRailItem, {
      props: { label: 'Search', icon: 'lucide-search', route: '/search' },
      global: { plugins: [router] },
    })
    cy.get('[data-slot=sidebar-rail-item]')
      .should('have.attr', 'data-state', 'active')
      .and('have.attr', 'aria-current', 'page')
  })

  it('falls back to a plain anchor for a string route without a router', () => {
    cy.mount(SidebarRailItem, {
      props: { label: 'Search', icon: 'lucide-search', route: '/search' },
    })
    cy.get('a[data-slot=sidebar-rail-item]').should(
      'have.attr',
      'href',
      '/search',
    )
  })

  it('renders a dot for badgeStyle=dot and a capped pill for badgeStyle=count', () => {
    cy.mount(SidebarRailItem, {
      props: {
        label: 'Notifications',
        icon: 'lucide-bell',
        badge: 3,
        badgeStyle: 'dot',
      },
    })
    cy.get('[data-slot=sidebar-rail-item-badge-dot]').should('exist')

    cy.mount(SidebarRailItem, {
      props: {
        label: 'Notifications',
        icon: 'lucide-bell',
        badge: 142,
        badgeStyle: 'count',
      },
    })
    cy.get(
      '[data-slot=sidebar-rail-item] [data-slot=sidebar-rail-item-badge]',
    ).should('contain.text', '99+')
  })

  it('keeps the count pill on its item when a scroll area moves it', () => {
    cy.mount({
      render: () =>
        h(
          'div',
          {
            'data-testid': 'scroller',
            class: 'h-20 w-[50px] overflow-y-auto pt-2',
          },
          [
            h('div', { class: 'flex h-60 flex-col items-center pt-12' }, [
              h(SidebarRailItem, { label: 'Design', badge: 3 }),
            ]),
          ],
        ),
    })
    cy.get('[data-slot=sidebar-rail-item-badge]').should('be.visible')
    cy.get('[data-testid=scroller]').then(($scroller) => {
      const item = $scroller[0].querySelector('[data-slot=sidebar-rail-item]')!
      const pill = item.querySelector('[data-slot=sidebar-rail-item-badge]')!
      const pillOffset = () =>
        pill.getBoundingClientRect().top - item.getBoundingClientRect().top

      const before = pillOffset()
      $scroller[0].scrollTop = 40
      // Read in the same task as the scroll, before any scroll event fires: a
      // pill that is moved after its item on scroll would still be 40px off here.
      expect(pillOffset()).to.equal(before)
    })
  })

  it('lets `description` replace the unread line under the tooltip label', () => {
    cy.mount(SidebarRailItem, {
      props: {
        label: 'Notifications',
        icon: 'lucide-bell',
        badge: 3,
        badgeStyle: 'dot',
      },
    })
    cy.get('[data-slot=sidebar-rail-item]')
      .trigger('pointerenter')
      .trigger('pointermove')
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
    cy.get('[data-slot=sidebar-rail-item]')
      .trigger('pointerenter')
      .trigger('pointermove')
    cy.get('body')
      .should('contain.text', '12 members')
      // Only meaningful because the line above already waited for the tooltip to open.
      .and('not.contain.text', '3 unread')
  })

  it('passes fallthrough attrs to the cell, merging class with its own', () => {
    cy.mount(SidebarRailItem, {
      props: { label: 'Search', icon: 'lucide-search' },
      attrs: { class: 'my-cell', 'data-testid': 'search-cell' },
    })
    cy.get('button[data-slot=sidebar-rail-item]')
      .should('have.attr', 'data-testid', 'search-cell')
      .and('have.class', 'my-cell')
      // The component's own classes survive the merge.
      .and('have.class', 'rounded-[7px]')

    cy.mount(SidebarRailItem, {
      props: { label: 'Docs', icon: 'lucide-book-open', href: '/docs' },
      attrs: { class: 'my-cell', 'data-testid': 'docs-cell' },
    })
    cy.get('a[data-slot=sidebar-rail-item]')
      .should('have.attr', 'data-testid', 'docs-cell')
      .and('have.attr', 'href', '/docs')
      .and('have.class', 'my-cell')
      .and('have.class', 'rounded-[7px]')
  })

  it('folds the unread count into the accessible label', () => {
    cy.mount(SidebarRailItem, {
      props: { label: 'Notifications', icon: 'lucide-bell', badge: 3 },
    })
    cy.get('[data-slot=sidebar-rail-item]').should(
      'have.attr',
      'aria-label',
      'Notifications, 3 unread',
    )
  })
})
