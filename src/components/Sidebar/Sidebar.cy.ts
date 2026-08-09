import { h, ref } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import Sidebar from './Sidebar.vue'
import SidebarItem from './SidebarItem.vue'
import SidebarLabel from './SidebarLabel.vue'
import SidebarSection from './SidebarSection.vue'
import SidebarHeader from './SidebarHeader.vue'
import SidebarCollapseToggle from './SidebarCollapseToggle.vue'
import SidebarCard from './SidebarCard.vue'
import type { AlertActionContext } from '../Alert'

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
    cy.get("[aria-label='Junk']").should('be.visible')
    cy.contains('More').click()
    cy.get("[aria-label='Junk']").should('not.be.visible')
    cy.contains('More').click()
    cy.get("[aria-label='Junk']").should('be.visible')
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
    cy.get("[aria-label='Junk']").should('not.be.visible')
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
    cy.get("[aria-label='Junk']").should('not.be.visible')
    cy.contains('More').click()
    cy.get("[aria-label='Junk']").should('be.visible')
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

  it('is keyboard reachable and shows a visible focus-visible outline', () => {
    cy.mount(SidebarItem, { props: { label: 'Design', to: '/design' } })
    cy.get('a')
      .focus()
      .should('have.focus')
      .should('have.css', 'outline-style', 'solid')
      .and('not.have.css', 'outline-width', '0px')
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

  it('renders the #prefix slot filling the default logo box', () => {
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

describe('<SidebarLabel />', () => {
  it('renders its default slot, and `divider` while collapsed', () => {
    cy.mount(SidebarLabel, { slots: { default: () => 'Spaces' } })
    cy.get('[data-slot=sidebar-label]').should('contain.text', 'Spaces')
    cy.mount(SidebarLabel, {
      props: { divider: true },
      slots: { default: () => 'Spaces' },
    })
    // Uncollapsed (no injected sidebarCollapsedKey): no divider line.
    cy.get('hr').should('not.exist')
  })
})

describe('<SidebarCard />', () => {
  const title = 'Your trial ends soon!'
  const description = 'Upgrade to keep enjoying features.'

  it('renders title, description, and the full-width action button', () => {
    cy.mount(SidebarCard, {
      props: { title, description, action: { label: 'Update now' } },
    })
    cy.get('[data-slot=sidebar-card]').should('have.attr', 'data-color', 'gray')
    cy.get('[data-slot=title]').should('have.text', title)
    cy.get('[data-slot=description]').should('have.text', description)
    cy.get('[data-slot=action]')
      .should('have.text', 'Update now')
      .and('have.class', 'w-full')
  })

  it('shows the theme icon automatically for every theme', () => {
    cy.mount(SidebarCard, { props: { title, theme: 'blue' } })
    cy.get('[data-slot=prefix] svg')
      .should('exist')
      .and('have.class', 'text-ink-blue-7')

    // Gray shows the info glyph in black ink (Figma compact master).
    cy.mount(SidebarCard, { props: { title } })
    cy.get('[data-slot=prefix] svg')
      .should('exist')
      .and('have.class', 'text-ink-gray-8')

    cy.mount(SidebarCard, { props: { title, icon: false } })
    cy.get('[data-slot=prefix]').should('not.exist')

    cy.mount(SidebarCard, { props: { title, theme: 'red', icon: false } })
    cy.get('[data-slot=prefix]').should('not.exist')
  })

  it('action click gets a working context.dismiss (card stays — stateless)', () => {
    const onDismiss = cy.spy().as('onDismiss')
    cy.mount(SidebarCard, {
      props: {
        title,
        action: {
          label: 'Update now',
          onClick: ({ dismiss }: AlertActionContext) => dismiss(),
        },
        onDismiss,
      },
    })
    cy.get('[data-slot=action]').click()
    cy.get('@onDismiss').should('have.been.calledOnce')
    cy.get('[data-slot=sidebar-card]').should('exist')
  })

  it('async action shows loading and blocks re-clicks', () => {
    let resolveClick!: () => void
    const onClick = cy
      .stub()
      .callsFake(() => new Promise<void>((resolve) => (resolveClick = resolve)))
      .as('onClick')
    cy.mount(SidebarCard, {
      props: { title, action: { label: 'Update now', onClick } },
    })
    cy.get('[data-slot=action]').click()
    cy.get('[data-slot=action]').should('have.attr', 'aria-busy', 'true')
    // A second click while pending is ignored.
    cy.get('[data-slot=action]').click({ force: true })
    cy.get('@onClick').should('have.been.calledOnce')
    cy.then(() => resolveClick())
    cy.get('[data-slot=action]').should('not.have.attr', 'aria-busy')
  })

  it('dismissible shows the × button and emits dismiss; hidden by default', () => {
    cy.mount(SidebarCard, { props: { title } })
    cy.get('[data-slot=dismiss]').should('not.exist')

    const onDismiss = cy.spy().as('onDismiss')
    cy.mount(SidebarCard, { props: { title, dismissible: true, onDismiss } })
    cy.get('[data-slot=dismiss]')
      .should('have.attr', 'aria-label', 'Dismiss')
      .click()
    cy.get('@onDismiss').should('have.been.calledOnce')
  })

  it('Tab reaches the dismiss button and Enter activates it', () => {
    const onDismiss = cy.spy().as('onDismiss')
    cy.mount(SidebarCard, { props: { title, dismissible: true, onDismiss } })
    cy.press(Cypress.Keyboard.Keys.TAB)
    cy.focused().should('have.attr', 'data-slot', 'dismiss')
    cy.focused().type('{enter}')
    cy.get('@onDismiss').should('have.been.calledOnce')
  })

  it('renders the #title slot without a title prop', () => {
    cy.mount(SidebarCard, {
      slots: { title: () => h('em', {}, 'Slot-only title') },
    })
    cy.get('[data-slot=title]').should('contain.text', 'Slot-only title')

    // No prop and no slot: the title element is skipped entirely.
    cy.mount(SidebarCard, { props: { description } })
    cy.get('[data-slot=title]').should('not.exist')
  })

  it('renders slot overrides, and #actions receives dismiss', () => {
    const onDismiss = cy.spy().as('onDismiss')
    cy.mount(SidebarCard, {
      props: { title, action: { label: 'Auto' }, onDismiss },
      slots: {
        prefix: () => h('svg', { 'data-test': 'custom-icon' }),
        title: () => h('em', {}, 'Rich title'),
        description: () => h('span', {}, 'Rich description'),
        actions: ({ dismiss }: { dismiss: () => void }) =>
          h('button', { 'data-test': 'custom-action', onClick: dismiss }, 'Go'),
      },
    })
    cy.get('[data-test=custom-icon]').should('exist')
    cy.get('[data-slot=title]').should('contain.text', 'Rich title')
    cy.get('[data-slot=description]').should('contain.text', 'Rich description')
    cy.get('[data-slot=action]').should('not.exist')
    cy.get('[data-test=custom-action]').click()
    cy.get('@onDismiss').should('have.been.calledOnce')
  })
})

describe('<SidebarCollapseToggle />', () => {
  it('renders a labeled toggle row and flips the injected collapsed state', () => {
    const collapsed = ref(false)
    cy.mount(
      () =>
        h(Sidebar, {
          collapsed: collapsed.value,
          'onUpdate:collapsed': (v: boolean | null) => (collapsed.value = v),
        }, () => h(SidebarCollapseToggle)),
      { global: { plugins: [createTestRouter()] } },
    )
    cy.contains('Collapse').should('exist')
    cy.contains('Collapse').click()
    cy.contains('Expand').should('exist')
  })
})
