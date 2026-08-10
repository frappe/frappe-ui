import Alert from './Alert.vue'
import { h } from 'vue'
import type { AlertActionContext } from './types'

const title = 'Your trial ends soon!'
const description = 'Upgrade to keep enjoying features.'
const root = '[data-layout]'

describe('<Alert />', () => {
  it('renders title and description', () => {
    cy.mount(Alert, { props: { title, description } })
    cy.get('[data-slot="title"]').should('have.text', title)
    cy.get('[data-slot="description"]').should('have.text', description)
  })

  it('switches layout based on content', () => {
    cy.mount(Alert, { props: { title } })
    cy.get(root).should('have.attr', 'data-layout', 'row')

    cy.mount(Alert, { props: { title, description } })
    cy.get(root).should('have.attr', 'data-layout', 'banner')

    cy.mount(Alert, {
      props: {
        title,
        primaryAction: { label: 'Update now' },
        secondaryAction: { label: 'View plans' },
      },
    })
    cy.get(root).should('have.attr', 'data-layout', 'banner')
  })

  it('shows the theme icon automatically for every theme', () => {
    cy.mount(Alert, { props: { title, theme: 'blue' } })
    cy.get('[data-slot="prefix"] svg')
      .should('exist')
      .and('have.class', 'text-ink-blue-5')

    cy.mount(Alert, { props: { title, theme: 'red' } })
    cy.get('[data-slot="prefix"] svg')
      .should('exist')
      .and('have.class', 'text-ink-red-5')

    // Gray shows the info glyph in black ink (Figma default-intent master).
    cy.mount(Alert, { props: { title, theme: 'gray' } })
    cy.get('[data-slot="prefix"] svg')
      .should('exist')
      .and('have.class', 'text-ink-gray-7')
  })

  it('icon: false hides the theme icon', () => {
    cy.mount(Alert, { props: { title, theme: 'blue', icon: false } })
    cy.get('[data-slot="prefix"]').should('not.exist')

    cy.mount(Alert, { props: { title, theme: 'gray', icon: false } })
    cy.get('[data-slot="prefix"]').should('not.exist')
  })

  it('renders a custom lucide string icon in the theme color', () => {
    cy.mount(Alert, { props: { title, theme: 'green', icon: 'lucide-rocket' } })
    cy.get('[data-slot="prefix"] .lucide-rocket')
      .should('exist')
      .and('have.class', 'text-ink-green-5')
  })

  it('primaryAction click gets a working context.dismiss', () => {
    const onDismiss = cy.spy().as('onDismiss')
    cy.mount(Alert, {
      props: {
        title,
        primaryAction: {
          label: 'Update now',
          onClick: ({ dismiss }: AlertActionContext) => dismiss(),
        },
        onDismiss,
      },
    })
    cy.get(root).should('have.attr', 'data-layout', 'row')
    cy.get('[data-slot="action"]').should('have.text', 'Update now').click()
    cy.get('@onDismiss').should('have.been.calledOnce')
    // Stateless: the alert does not hide itself.
    cy.get(root).should('exist')
  })

  it('async primaryAction shows loading and blocks re-clicks', () => {
    let resolveClick!: () => void
    const onClick = cy
      .stub()
      .callsFake(() => new Promise<void>((resolve) => (resolveClick = resolve)))
      .as('onClick')
    cy.mount(Alert, {
      props: { title, primaryAction: { label: 'Update now', onClick } },
    })
    cy.get('[data-slot="action"]').click()
    cy.get('[data-slot="action"]').should('have.attr', 'aria-busy', 'true')
    // A second click while pending is ignored.
    cy.get('[data-slot="action"]').click({ force: true })
    cy.get('@onClick').should('have.been.calledOnce')
    cy.then(() => resolveClick())
    cy.get('[data-slot="action"]').should('not.have.attr', 'aria-busy')
  })

  it('secondaryAction renders a second button and forces banner', () => {
    const onSecondary = cy.spy().as('onSecondary')
    cy.mount(Alert, {
      props: {
        title,
        primaryAction: { label: 'Confirm' },
        secondaryAction: { label: 'Cancel', onClick: onSecondary },
      },
    })
    cy.get(root).should('have.attr', 'data-layout', 'banner')
    cy.get('[data-slot="action"]').should('have.length', 2)
    // The design's banner secondary label is ink-gray-7, not Button's default.
    cy.get('[data-slot="action"]')
      .eq(1)
      .should('have.class', '!text-ink-gray-7')
      .and('have.text', 'Cancel')
      .click()
    cy.get('@onSecondary').should('have.been.calledOnce')
  })

  it('dismissible shows the × button and emits dismiss', () => {
    const onDismiss = cy.spy().as('onDismiss')
    cy.mount(Alert, { props: { title, dismissible: true, onDismiss } })
    cy.get('[data-slot="dismiss"]')
      .should('have.attr', 'aria-label', 'Dismiss')
      .click()
    cy.get('@onDismiss').should('have.been.calledOnce')
    cy.get(root).should('exist')
  })

  it('is not dismissible by default', () => {
    cy.mount(Alert, { props: { title } })
    cy.get('[data-slot="dismiss"]').should('not.exist')
  })

  it('Tab reaches the dismiss button and Enter activates it', () => {
    const onDismiss = cy.spy().as('onDismiss')
    cy.mount(Alert, { props: { title, dismissible: true, onDismiss } })
    cy.press(Cypress.Keyboard.Keys.TAB)
    cy.focused().should('have.attr', 'data-slot', 'dismiss')
    cy.focused().type('{enter}')
    cy.get('@onDismiss').should('have.been.calledOnce')
  })

  it('renders slot overrides', () => {
    cy.mount(Alert, {
      props: { title },
      slots: {
        prefix: () => h('svg', { 'data-cy': 'custom-icon' }),
        title: () => h('em', { 'data-cy': 'custom-title' }, 'Rich title'),
        description: () =>
          h('span', { 'data-cy': 'custom-description' }, 'Rich description'),
      },
    })
    cy.get('[data-cy="custom-icon"]').should('exist')
    cy.get('[data-cy="custom-title"]').should('have.text', 'Rich title')
    cy.get('[data-cy="custom-description"]').should(
      'have.text',
      'Rich description',
    )
    // A description slot also forces the banner layout.
    cy.get(root).should('have.attr', 'data-layout', 'banner')
  })

  it('renders the #title slot without a title prop', () => {
    cy.mount(Alert, {
      slots: { title: () => h('em', {}, 'Slot-only title') },
    })
    cy.get('[data-slot="title"]').should('contain.text', 'Slot-only title')

    // No prop and no slot: the title element is skipped entirely.
    cy.mount(Alert, { props: { description } })
    cy.get('[data-slot="title"]').should('not.exist')
  })

  it('#actions slot replaces auto buttons and receives dismiss', () => {
    const onDismiss = cy.spy().as('onDismiss')
    cy.mount(Alert, {
      props: { title, primaryAction: { label: 'Auto' }, onDismiss },
      slots: {
        actions: ({ dismiss }: { dismiss: () => void }) =>
          h('button', { 'data-cy': 'custom-action', onClick: dismiss }, 'Done'),
      },
    })
    cy.get('[data-slot="action"]').should('not.exist')
    cy.get('[data-cy="custom-action"]').click()
    cy.get('@onDismiss').should('have.been.calledOnce')
  })

  it('uses role=alert for red/amber and role=status otherwise', () => {
    cy.mount(Alert, { props: { title, theme: 'red' } })
    cy.get('[role="alert"]').should('exist')

    cy.mount(Alert, { props: { title, theme: 'amber' } })
    cy.get('[role="alert"]').should('exist')

    cy.mount(Alert, { props: { title, theme: 'blue' } })
    cy.get('[role="status"]').should('exist')

    cy.mount(Alert, { props: { title } })
    cy.get('[role="status"]').should('exist')
  })
})
