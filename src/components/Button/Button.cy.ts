import Button from './Button.vue'
import { h } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/reports', component: { template: '<div />' } },
    ],
  })
}

describe('<Button />', () => {
  it('renders default button', () => {
    cy.mount(Button, {
      slots: {
        default: 'Click me',
      },
    })
    cy.get('button').should('have.text', 'Click me')
    cy.get('button').should('have.class', 'bg-surface-gray-2')
  })

  it('renders themes and variants', () => {
    cy.mount(Button, {
      props: {
        theme: 'blue',
        variant: 'solid',
        label: 'Submit',
      },
    })

    cy.get('button').should('have.class', 'bg-blue-500')
    cy.get('button').should('contain.text', 'Submit')
  })

  it('renders different sizes', () => {
    cy.mount(Button, {
      props: {
        size: 'lg',
        label: 'Large Button',
      },
    })

    cy.get('button').should('have.class', 'h-10 text-lg')
  })

  it('handles loading state', () => {
    cy.mount(Button, {
      props: {
        loading: true,
        loadingText: 'Processing...',
        label: 'Submit',
      },
    })
    cy.get('button').should('be.disabled')
    cy.get('button').should('contain.text', 'Processing...')
    cy.get('[role="status"]').should('exist') // Loading Spinner
  })

  it('handles prefix and suffix slots (replacing deprecated icon props)', () => {
    const TestIcon = {
      render() {
        return h('svg', { 'data-cy': 'test-icon' })
      },
    }

    // Test Prefix
    cy.mount(Button, {
      props: { label: 'Add' },
      slots: {
        prefix: () => h(TestIcon),
      },
    })
    cy.get('button').find('[data-cy="test-icon"]').should('exist')
    cy.get('button').should('contain.text', 'Add')

    // Test Suffix
    cy.mount(Button, {
      props: { label: 'Next' },
      slots: {
        suffix: () => h(TestIcon),
      },
    })
    cy.get('button').find('[data-cy="test-icon"]').should('exist')
    cy.get('button').should('contain.text', 'Next')
  })

  it('handles icon-only button via default slot', () => {
    // Button.vue detects if the default slot content is a Lucide icon by checking component name
    const LucideEdit = {
      name: 'lucide-edit',
      render() {
        return h('svg', { 'data-cy': 'lucide-edit' })
      },
    }

    cy.mount(Button, {
      slots: {
        default: () => h(LucideEdit),
      },
    })

    // Should render the icon
    cy.get('button').find('[data-cy="lucide-edit"]').should('exist')

    // Should be square (icon button classes).
    // isIconButton computed property triggers specific size classes.
    cy.get('button').then(($btn) => {
      const width = parseFloat($btn.css('width'))
      const height = parseFloat($btn.css('height'))
      expect(width).to.be.closeTo(height, 1)
    })
  })

  it('handles clicks', () => {
    const onClickSpy = cy.spy().as('onClickSpy')
    cy.mount(Button, {
      props: {
        label: 'Click me',
        onClick: onClickSpy,
      },
    })
    cy.get('button').click()
    cy.get('@onClickSpy').should('have.been.called')
  })

  it('renders a router link when route is provided', () => {
    const router = createTestRouter()

    cy.mount(Button, {
      props: {
        route: '/reports',
        label: 'Reports',
      },
      attrs: {
        'data-test-id': 'reports-link',
        'aria-current': 'page',
      },
      global: {
        plugins: [router],
      },
    })

    cy.get('a[data-test-id="reports-link"]')
      .should('have.attr', 'href', '/reports')
      .and('have.attr', 'aria-current', 'page')
      .and('contain.text', 'Reports')
    cy.get('button').should('not.exist')
  })

  it('renders an anchor when link is provided', () => {
    cy.mount(Button, {
      props: {
        link: 'https://frappe.io/docs',
        label: 'Docs',
      },
    })

    cy.get('a')
      .should('have.attr', 'href', 'https://frappe.io/docs')
      .and('have.attr', 'target', '_blank')
      .and('have.attr', 'rel', 'noreferrer noopener')
      .and('contain.text', 'Docs')
    cy.get('button').should('not.exist')
  })

  it('is disabled', () => {
    cy.mount(Button, {
      props: {
        disabled: true,
        label: 'Disabled',
      },
    })
    cy.get('button').should('be.disabled')
  })

  it('falls back to a disabled button when route or link is blocked', () => {
    const router = createTestRouter()

    cy.mount(Button, {
      props: {
        route: '/reports',
        disabled: true,
        label: 'Disabled route',
      },
      global: {
        plugins: [router],
      },
    })
    cy.get('button').should('be.disabled').and('contain.text', 'Disabled route')
    cy.get('a').should('not.exist')

    cy.mount(Button, {
      props: {
        link: 'https://frappe.io/docs',
        loading: true,
        loadingText: 'Loading docs',
        label: 'Docs',
      },
    })
    cy.get('button').should('be.disabled').and('contain.text', 'Loading docs')
    cy.get('a').should('not.exist')
  })
})
