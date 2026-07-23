import { h } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import Sidebar from './Sidebar.vue'
import SidebarItem from './SidebarItem.vue'
import SidebarLabel from './SidebarLabel.vue'

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }],
  })
}

describe('<Sidebar /> composition', () => {
  it('renders whatever the default slot provides (bare frame)', () => {
    cy.mount(Sidebar, {
      props: { disableCollapse: true },
      slots: {
        default: () => [
          h(SidebarLabel, () => 'Spaces'),
          h(SidebarItem, { label: 'Design', icon: 'lucide-palette' }),
        ],
      },
      global: { plugins: [createTestRouter()] },
    })
    cy.get('[data-slot=sidebar]').should('exist')
    cy.get('[data-slot=sidebar-label]').should('contain.text', 'Spaces')
    cy.get('[data-slot=sidebar-item]').should('contain.text', 'Design')
  })
})

describe('<Sidebar /> legacy config API (compat layer)', () => {
  const header = {
    title: 'Sidebar',
    subtitle: 'Brand name',
    menuItems: [{ label: 'Help' }, { label: 'Logout' }],
  }
  const sections = [
    {
      label: '',
      items: [
        { label: 'Leads', to: '/leads', icon: 'lucide-box' },
        { label: 'Deals', to: '/deals', icon: 'lucide-box' },
      ],
    },
  ]

  it('still renders header, items, and the collapse toggle from config props', () => {
    // Wide enough that the sidebar doesn't auto-collapse below the `sm` breakpoint.
    cy.viewport(1280, 720)
    const router = createTestRouter()
    cy.wrap(router.push('/')).then(() => router.isReady())
    cy.mount(
      () => h('div', [h(Sidebar, { header, sections, class: 'w-fit' })]),
      {
        global: { plugins: [router] },
      },
    )

    cy.contains('Sidebar').should('exist')
    cy.contains('Brand name').should('exist')

    cy.get('[role=menu]').should('not.exist')
    cy.get('[aria-haspopup=menu]').should('exist').click()
    cy.get('[role=menuitem]').should('have.length', header.menuItems.length)
    // Close the menu so its overlay stops capturing pointer events.
    cy.get('[role=menu]').type('{esc}', { force: true })
    cy.get('[role=menu]').should('not.exist')

    cy.get("[aria-label='Leads']").should('exist')
    cy.get("[aria-label='Deals']").should('exist')

    cy.contains('Collapse').click()
    cy.contains('Expand').should('exist')
  })

  it('passes legacy header-logo and footer-items slots through', () => {
    cy.viewport(1280, 720)
    cy.mount(
      () =>
        h(
          'div',
          h(
            Sidebar,
            { header, sections, disableCollapse: true },
            {
              'header-logo': () =>
                h('span', { 'data-test': 'legacy-logo' }, 'L'),
              'footer-items': () =>
                h('button', { 'data-test': 'legacy-footer' }, 'Invite'),
            },
          ),
        ),
      { global: { plugins: [createTestRouter()] } },
    )

    cy.get('[data-test=legacy-logo]').should('contain.text', 'L')
    cy.get('[data-test=legacy-footer]').should('contain.text', 'Invite')
  })
})

describe('<SidebarItem />', () => {
  it('renders a router link when `to` is set, a button otherwise', () => {
    cy.mount(SidebarItem, {
      props: { label: 'Deals', to: '/deals' },
      global: { plugins: [createTestRouter()] },
    })
    cy.get('a[href="/deals"]').should('exist')

    const onClick = cy.stub().as('click')
    cy.mount(SidebarItem, { props: { label: 'Action', onClick } })
    cy.get('button').should('exist').click()
    cy.get('@click').should('have.been.calledOnce')
  })

  it('drives data-state from `active`', () => {
    cy.mount(SidebarItem, { props: { label: 'Design', active: true } })
    cy.get('[data-slot=sidebar-item][data-state=active]').should('exist')
  })

  it('falls back to the deprecated `isActive` when `active` is not passed', () => {
    cy.mount(SidebarItem, { props: { label: 'Design', isActive: true } })
    cy.get('[data-slot=sidebar-item][data-state=active]').should('exist')
  })

  it('renders #prefix, default, and #suffix slots', () => {
    cy.mount(SidebarItem, {
      slots: {
        prefix: () => h('span', { 'data-test': 'prefix' }, 'P'),
        default: () => 'Engineering',
        suffix: () => h('span', { 'data-test': 'suffix' }, '3'),
      },
    })
    cy.get('[data-test=prefix]').should('exist')
    cy.get('[data-slot=sidebar-item]').should('contain.text', 'Engineering')
    cy.get('[data-slot=sidebar-item-suffix] [data-test=suffix]').should(
      'contain.text',
      '3',
    )
  })

  it('keeps a #suffix options button a sibling of the link (not nested inside it)', () => {
    const onOptions = cy.stub().as('options')
    cy.mount(SidebarItem, {
      props: { label: 'Design', to: '/design' },
      slots: {
        suffix: () =>
          h('button', { 'data-test': 'options', onClick: onOptions }, '...'),
      },
      global: { plugins: [createTestRouter()] },
    })
    // The options button must not live inside the anchor.
    cy.get('a [data-test=options]').should('not.exist')
    cy.get('[data-test=options]').click()
    cy.get('@options').should('have.been.calledOnce')
  })
})
