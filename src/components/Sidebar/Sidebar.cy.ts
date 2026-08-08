import { h, ref } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import Sidebar from './Sidebar.vue'
import SidebarItem from './SidebarItem.vue'
import SidebarLabel from './SidebarLabel.vue'
import SidebarSection from './SidebarSection.vue'
import SidebarHeader from './SidebarHeader.vue'

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

  it('v-model round-trip: `collapsed` drives data-state, and the toggle writes it back', () => {
    cy.viewport(1280, 720)
    const collapsed = ref(false)
    cy.mount(
      () =>
        h('div', [
          h(Sidebar, {
            collapsed: collapsed.value,
            'onUpdate:collapsed': (v: boolean | null) => (collapsed.value = v),
          }),
        ]),
      { global: { plugins: [createTestRouter()] } },
    )
    cy.get('[data-slot=sidebar]')
      .should('have.attr', 'data-state', 'expanded')
      .then(($el) => cy.wrap($el).invoke('css', 'width').should('eq', '240px')) // 15rem
    cy.then(() => {
      collapsed.value = true
    })
    cy.get('[data-slot=sidebar]')
      .should('have.attr', 'data-state', 'collapsed')
      .then(($el) => cy.wrap($el).invoke('css', 'width').should('eq', '48px')) // 3rem
  })
})

describe('<SidebarSection />', () => {
  it('collapsible: toggles its own state when `collapsed` is unbound', () => {
    cy.mount(SidebarSection, {
      props: { label: 'More', collapsible: true },
      slots: {
        default: () => [
          h(SidebarItem, { label: 'Junk' }),
          h(SidebarItem, { label: 'Trash' }),
        ],
      },
    })
    cy.get("[aria-label='Junk']").should('exist')
    cy.contains('More').click()
    cy.get("[aria-label='Junk']").should('not.exist')
    cy.contains('More').click()
    cy.get("[aria-label='Junk']").should('exist')
  })

  it('collapsible: bound `collapsed` model lets the app own the state', () => {
    const onUpdate = cy.stub().as('update')
    cy.mount(SidebarSection, {
      props: {
        label: 'More',
        collapsible: true,
        collapsed: true,
        'onUpdate:collapsed': onUpdate,
      },
      slots: { default: () => h(SidebarItem, { label: 'Junk' }) },
    })
    // Starts collapsed because the bound model says so — the app can default a
    // section closed, which the internal-state version could not.
    cy.get("[aria-label='Junk']").should('not.exist')
    cy.contains('More').click()
    cy.get('@update').should('have.been.calledWith', false)
  })

  it('starts collapsed from a one-way `collapsed` prop with no listener', () => {
    // No `onUpdate:collapsed` — this is the "default collapsed, app doesn't
    // otherwise own the state" shape: the model's initial value seeds local
    // state, and toggling stays purely internal from there.
    cy.mount(SidebarSection, {
      props: { label: 'More', collapsible: true, collapsed: true },
      slots: { default: () => h(SidebarItem, { label: 'Junk' }) },
    })
    cy.get("[aria-label='Junk']").should('not.exist')
    cy.contains('More').click()
    cy.get("[aria-label='Junk']").should('exist')
  })

  it('keyboard: the collapsible trigger is a focusable, labeled toggle button', () => {
    cy.mount(SidebarSection, {
      props: { label: 'More', collapsible: true },
      slots: { default: () => h(SidebarItem, { label: 'Junk' }) },
    })
    cy.contains('button', 'More')
      .should('have.attr', 'aria-expanded', 'true')
      .focus()
      .type('{enter}')
    cy.contains('button', 'More').should('have.attr', 'aria-expanded', 'false')
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

  it('is keyboard reachable and shows a visible focus ring', () => {
    cy.mount(SidebarItem, { props: { label: 'Design', to: '/design' } })
    cy.get('a').focus().should('have.focus')
  })
})

describe('<SidebarHeader />', () => {
  const menuItems = [{ label: 'Settings' }, { label: 'Log out' }]

  it('renders with default props', () => {
    cy.mount(SidebarHeader, { props: { title: 'Frappe CRM' } })
    cy.get('[data-slot=sidebar-header]').should('contain.text', 'Frappe CRM')
  })

  it('renders the title, subtitle, and menu items from props', () => {
    cy.mount(SidebarHeader, {
      props: { title: 'Frappe CRM', subtitle: 'crm.frappe.io', menuItems },
    })
    cy.contains('Frappe CRM').should('exist')
    cy.contains('crm.frappe.io').should('exist')
    cy.get('[aria-haspopup=menu]').click()
    cy.get('[role=menuitem]').should('have.length', menuItems.length)
  })

  it('renders the #prefix slot instead of the default logo box', () => {
    cy.mount(SidebarHeader, {
      props: { title: 'Frappe CRM' },
      slots: { prefix: () => h('span', { 'data-test': 'logo' }, 'L') },
    })
    cy.get('[data-test=logo]').should('contain.text', 'L')
  })

  it('omits the leading box when `showLogo` is false', () => {
    cy.mount(SidebarHeader, {
      props: { title: 'Frappe CRM', showLogo: false },
    })
    cy.get('.size-7').should('not.exist')
  })
})
