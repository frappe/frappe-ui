import Tag from './Tag.vue'
import { h } from 'vue'
import { _resetResolvePropValue } from '../../utils/resolvePropValue'

const root = '[data-slot="tag"]'

describe('<Tag />', () => {
  it('renders a gray subtle md button by default', () => {
    cy.mount(Tag, { props: { label: 'Discover' } })
    cy.get(root)
      .should('match', 'button[type="button"]')
      .and('have.text', 'Discover')
      .and('have.attr', 'data-variant', 'subtle')
      .and('have.attr', 'data-color', 'gray')
      .and('have.attr', 'data-size', 'md')
      .and('have.class', 'bg-surface-gray-2')
      .and('have.class', 'text-ink-gray-7')
      .and('have.class', 'h-6')
    cy.get('[data-slot="dismiss"]').should('not.exist')
  })

  it('maps each variant to its Figma tokens', () => {
    cy.mount(Tag, { props: { label: 'x', variant: 'solid', theme: 'blue' } })
    cy.get(root)
      .should('have.class', 'bg-surface-blue-7')
      .and('have.class', 'hover:bg-surface-blue-8')
      .and('have.class', 'active:bg-surface-blue-6')
      .and('have.class', 'text-white')

    cy.mount(Tag, { props: { label: 'x', variant: 'outline', theme: 'red' } })
    cy.get(root)
      .should('have.class', 'ring-outline-red-3')
      .and('have.class', 'hover:ring-outline-red-4')
      .and('have.class', 'active:bg-surface-red-4')

    cy.mount(Tag, { props: { label: 'x', variant: 'ghost', theme: 'green' } })
    cy.get(root)
      .should('have.class', 'text-ink-green-7')
      .and('have.class', 'hover:bg-surface-green-3')
      .and('have.class', 'focus-visible:bg-surface-base')
  })

  it('sizes to 20, 24 and 28px', () => {
    for (const [size, height] of [
      ['sm', 20],
      ['md', 24],
      ['lg', 28],
    ] as const) {
      cy.mount(Tag, { props: { label: 'Discover', size } })
      cy.get(root).invoke('outerHeight').should('equal', height)
    }
  })

  it('renders content passed to #prefix, #default and #suffix', () => {
    cy.mount(Tag, {
      props: { label: 'ignored' },
      slots: {
        prefix: () => h('span', { 'data-cy': 'prefix' }),
        default: () => h('em', { 'data-cy': 'label' }, 'Rich label'),
        suffix: () => h('span', { 'data-cy': 'suffix' }),
      },
    })
    cy.get('[data-slot="prefix"] [data-cy="prefix"]').should('exist')
    cy.get('[data-cy="label"]').should('have.text', 'Rich label')
    cy.get(root).should('not.contain.text', 'ignored')
    cy.get('[data-slot="suffix"] [data-cy="suffix"]').should('exist')
  })

  it('dismissible shows the × and a click on it emits dismiss, not click', () => {
    const onDismiss = cy.spy().as('onDismiss')
    const onClick = cy.spy().as('onClick')
    cy.mount(Tag, {
      props: { label: 'Open', dismissible: true, onDismiss, onClick },
    })
    cy.get('[data-slot="dismiss"]').click()
    cy.get('@onDismiss').should('have.been.calledOnce')
    cy.get('@onClick').should('not.have.been.called')

    cy.get(root).click('left')
    cy.get('@onClick').should('have.been.calledOnce')
    cy.get('@onDismiss').should('have.been.calledOnce')
  })

  it('Tab focuses the tag and Delete or Backspace emits dismiss', () => {
    const onDismiss = cy.spy().as('onDismiss')
    cy.mount(Tag, { props: { label: 'Open', dismissible: true, onDismiss } })
    cy.press(Cypress.Keyboard.Keys.TAB)
    cy.focused()
      .should('have.attr', 'data-slot', 'tag')
      .and('have.attr', 'aria-keyshortcuts', 'Delete Backspace')
    cy.focused().type('{del}')
    cy.get('@onDismiss').should('have.been.calledOnce')
    cy.focused().type('{backspace}')
    cy.get('@onDismiss').should('have.been.calledTwice')
  })

  it('Delete does nothing when the tag is not dismissible', () => {
    const onDismiss = cy.spy().as('onDismiss')
    cy.mount(Tag, { props: { label: 'Open', onDismiss } })
    cy.get(root).focus().type('{del}')
    cy.get('@onDismiss').should('not.have.been.called')
  })

  it('draws the theme focus ring on keyboard focus, offset on solid', () => {
    cy.mount(Tag, { props: { label: 'x', variant: 'solid', theme: 'violet' } })
    cy.get(root)
      .should(
        'have.class',
        'focus-visible:[outline-color:var(--outline-violet-3)]',
      )
      .and('have.class', 'focus-visible:outline-offset-2')

    cy.mount(Tag, { props: { label: 'x', variant: 'subtle', theme: 'violet' } })
    cy.get(root).should('not.have.class', 'focus-visible:outline-offset-2')
  })

  it('disabled dims the tag, drops its states and never dismisses', () => {
    const onDismiss = cy.spy().as('onDismiss')
    cy.mount(Tag, {
      props: {
        label: 'Open',
        variant: 'solid',
        theme: 'amber',
        dismissible: true,
        disabled: true,
        onDismiss,
      },
    })
    cy.get(root).should('be.disabled').and('have.attr', 'data-disabled')
    cy.get(root)
      .should('have.class', 'bg-surface-amber-7')
      .and('not.have.class', 'hover:bg-surface-amber-8')
      .and('have.css', 'opacity', '0.5')
    cy.get('[data-slot="dismiss"]').click({ force: true })
    cy.get('@onDismiss').should('not.have.been.called')
  })

  it('a disabled gray subtle tag uses the gray-3 fill', () => {
    cy.mount(Tag, { props: { label: 'x', disabled: true } })
    cy.get(root)
      .should('have.class', 'bg-surface-gray-3')
      .and('not.have.class', 'bg-surface-gray-2')
  })

  describe('unsupported values', () => {
    beforeEach(() => _resetResolvePropValue())

    it('falls back to the defaults and warns once in dev', () => {
      cy.window().then((win) => {
        cy.spy(win.console, 'warn').as('consoleWarn')
      })
      cy.mount(Tag, {
        props: {
          label: 'x',
          theme: 'orange' as any,
          variant: 'soft' as any,
          size: 'xl' as any,
        },
      })
      cy.get(root)
        .should('have.attr', 'data-color', 'gray')
        .and('have.attr', 'data-variant', 'subtle')
        .and('have.attr', 'data-size', 'md')
        .and('have.class', 'bg-surface-gray-2')
      cy.get('@consoleWarn').should(
        'have.been.calledWithMatch',
        'Tag.theme="orange"',
      )
      cy.get('@consoleWarn').should(
        'have.been.calledWithMatch',
        'Tag.variant="soft"',
      )
      cy.get('@consoleWarn').should(
        'have.been.calledWithMatch',
        'Tag.size="xl"',
      )
    })
  })
})
