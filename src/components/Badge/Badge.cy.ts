import Badge from './Badge.vue'
import { h } from 'vue'
import { _resetResolvePropValue } from '../../utils/resolvePropValue'

describe('<Badge />', () => {
  it('renders default badge', () => {
    cy.mount(Badge, {
      slots: {
        default: 'Default',
      },
    })
    cy.get('.inline-flex.rounded-full').should('contain.text', 'Default')
    // Default theme is gray, variant is subtle
    cy.get('.inline-flex.rounded-full').should('have.class', 'text-ink-gray-6')
    cy.get('.inline-flex.rounded-full').should('have.class', 'bg-surface-gray-2')
  })

  it('renders label prop', () => {
    cy.mount(Badge, {
      props: {
        label: 'Badge Label',
      },
    })
    cy.get('.inline-flex.rounded-full').should('have.text', 'Badge Label')
  })

  it('renders different themes with subtle variant', () => {
    // Gray (default)
    cy.mount(Badge, {
      props: {
        theme: 'gray',
        label: 'Gray',
      },
    })
    cy.get('.inline-flex.rounded-full').should('have.class', 'text-ink-gray-6')
    cy.get('.inline-flex.rounded-full').should('have.class', 'bg-surface-gray-2')

    // Blue
    cy.mount(Badge, {
      props: {
        theme: 'blue',
        label: 'Blue',
      },
    })
    cy.get('.inline-flex.rounded-full').should('have.class', 'text-ink-blue-7')
    cy.get('.inline-flex.rounded-full').should('have.class', 'bg-surface-blue-2')

    // Green
    cy.mount(Badge, {
      props: {
        theme: 'green',
        label: 'Green',
      },
    })
    cy.get('.inline-flex.rounded-full').should('have.class', 'text-ink-green-7')
    cy.get('.inline-flex.rounded-full').should('have.class', 'bg-surface-green-2')

    // Amber
    cy.mount(Badge, {
      props: {
        theme: 'amber',
        label: 'Amber',
      },
    })
    cy.get('.inline-flex.rounded-full').should('have.class', 'text-ink-amber-7')
    cy.get('.inline-flex.rounded-full').should('have.class', 'bg-surface-amber-2')

    // Red
    cy.mount(Badge, {
      props: {
        theme: 'red',
        label: 'Red',
      },
    })
    cy.get('.inline-flex.rounded-full').should('have.class', 'text-ink-red-7')
    cy.get('.inline-flex.rounded-full').should('have.class', 'bg-surface-red-2')

    // Violet
    cy.mount(Badge, {
      props: {
        theme: 'violet',
        label: 'Violet',
      },
    })
    cy.get('.inline-flex.rounded-full').should('have.class', 'text-ink-violet-7')
    cy.get('.inline-flex.rounded-full').should('have.class', 'bg-surface-violet-2')
  })

  it('renders different variants with gray theme', () => {
    // Solid (gray uses semantic token; non-gray solids use raw palette)
    cy.mount(Badge, {
      props: {
        variant: 'solid',
        label: 'Solid',
      },
    })
    cy.get('.inline-flex.rounded-full').should('have.class', 'text-ink-base')
    cy.get('.inline-flex.rounded-full').should('have.class', 'bg-surface-gray-10')

    // Solid with a chromatic theme uses white text
    cy.mount(Badge, {
      props: {
        theme: 'red',
        variant: 'solid',
        label: 'Solid red',
      },
    })
    cy.get('.inline-flex.rounded-full').should('have.class', 'text-white')
    cy.get('.inline-flex.rounded-full').should('have.class', 'bg-surface-red-7')

    // Subtle (default)
    cy.mount(Badge, {
      props: {
        variant: 'subtle',
        label: 'Subtle',
      },
    })
    cy.get('.inline-flex.rounded-full').should('have.class', 'text-ink-gray-6')
    cy.get('.inline-flex.rounded-full').should('have.class', 'bg-surface-gray-2')

    // Outline
    cy.mount(Badge, {
      props: {
        variant: 'outline',
        label: 'Outline',
      },
    })
    cy.get('.inline-flex.rounded-full').should('have.class', 'text-ink-gray-6')
    cy.get('.inline-flex.rounded-full').should('have.class', 'border-outline-gray-2')

    // Ghost
    cy.mount(Badge, {
      props: {
        variant: 'ghost',
        label: 'Ghost',
      },
    })
    cy.get('.inline-flex.rounded-full').should('have.class', 'text-ink-gray-6')
  })

  it('renders different sizes', () => {
    // Small
    cy.mount(Badge, {
      props: {
        size: 'sm',
        label: 'Small',
      },
    })
    cy.get('.inline-flex.rounded-full').should('have.class', 'h-4')
    cy.get('.inline-flex.rounded-full').should('have.class', 'text-xs')
    cy.get('.inline-flex.rounded-full').should('have.class', 'px-1.5')

    // Medium (default)
    cy.mount(Badge, {
      props: {
        size: 'md',
        label: 'Medium',
      },
    })
    cy.get('.inline-flex.rounded-full').should('have.class', 'h-5')
    cy.get('.inline-flex.rounded-full').should('have.class', 'text-xs')
    cy.get('.inline-flex.rounded-full').should('have.class', 'px-1.5')

    // Large
    cy.mount(Badge, {
      props: {
        size: 'lg',
        label: 'Large',
      },
    })
    cy.get('.inline-flex.rounded-full').should('have.class', 'h-6')
    cy.get('.inline-flex.rounded-full').should('have.class', 'text-[13px]')
    cy.get('.inline-flex.rounded-full').should('have.class', 'px-2')
  })

  it('renders prefix slot', () => {
    const TestIcon = {
      render() {
        return h('svg', { 'data-cy': 'prefix-icon' })
      },
    }

    cy.mount(Badge, {
      props: { label: 'With Icon' },
      slots: {
        prefix: () => h(TestIcon),
      },
    })

    cy.get('[data-cy="prefix-icon"]').should('exist')
    cy.get('.inline-flex.rounded-full').should('contain.text', 'With Icon')
  })

  it('renders suffix slot', () => {
    const TestIcon = {
      render() {
        return h('svg', { 'data-cy': 'suffix-icon' })
      },
    }

    cy.mount(Badge, {
      props: { label: 'With Icon' },
      slots: {
        suffix: () => h(TestIcon),
      },
    })

    cy.get('[data-cy="suffix-icon"]').should('exist')
    cy.get('.inline-flex.rounded-full').should('contain.text', 'With Icon')
  })

  it('renders both prefix and suffix slots', () => {
    const PrefixIcon = {
      render() {
        return h('svg', { 'data-cy': 'prefix-icon' })
      },
    }

    const SuffixIcon = {
      render() {
        return h('svg', { 'data-cy': 'suffix-icon' })
      },
    }

    cy.mount(Badge, {
      props: { label: 'With Icons' },
      slots: {
        prefix: () => h(PrefixIcon),
        suffix: () => h(SuffixIcon),
      },
    })

    cy.get('[data-cy="prefix-icon"]').should('exist')
    cy.get('[data-cy="suffix-icon"]').should('exist')
    cy.get('.inline-flex.rounded-full').should('contain.text', 'With Icons')
  })

  it('supports numeric label', () => {
    cy.mount(Badge, {
      props: {
        label: 42,
      },
    })
    cy.get('.inline-flex.rounded-full').should('have.text', '42')
  })

  it('has correct layout classes', () => {
    cy.mount(Badge, {
      props: {
        label: 'Test',
      },
    })
    cy.get('.inline-flex.rounded-full').should('have.class', 'inline-flex')
    cy.get('.inline-flex.rounded-full').should('have.class', 'items-center')
    cy.get('.inline-flex.rounded-full').should('have.class', 'rounded-full')
    cy.get('.inline-flex.rounded-full').should('have.class', 'whitespace-nowrap')
  })

  it('renders prefix slot with correct size constraints', () => {
    const TestIcon = {
      render() {
        return h('svg', { 'data-cy': 'prefix-icon', class: 'w-4 h-4' })
      },
    }

    // Test with sm size
    cy.mount(Badge, {
      props: { label: 'SM', size: 'sm' },
      slots: {
        prefix: () => h(TestIcon),
      },
    })
    cy.get('[data-cy="prefix-icon"]').parent().should('have.class', 'size-2.5')

    // Test with md size (default)
    cy.mount(Badge, {
      props: { label: 'MD', size: 'md' },
      slots: {
        prefix: () => h(TestIcon),
      },
    })
    cy.get('[data-cy="prefix-icon"]').parent().should('have.class', 'size-2.5')

    // Test with lg size
    cy.mount(Badge, {
      props: { label: 'LG', size: 'lg' },
      slots: {
        prefix: () => h(TestIcon),
      },
    })
    cy.get('[data-cy="prefix-icon"]').parent().should('have.class', 'size-3')
  })

  // A value outside a prop's union used to reach a raw table lookup. For
  // `theme` that was the first of two chained lookups, so the second one read
  // a property of `undefined` and threw `TypeError: Cannot read properties of
  // undefined (reading 'subtle')` mid-render — the badge vanished and the
  // error took the parent render with it. `theme="orange"` (a removed alias,
  // still live in consumer apps) is the case that made this reachable.
  describe('unsupported prop values', () => {
    beforeEach(() => {
      _resetResolvePropValue()
    })

    it('falls back to the default theme instead of throwing', () => {
      cy.mount(Badge, {
        props: { theme: 'orange' as any, label: 'Orange' },
      })

      // Renders at all — this is the regression guard.
      cy.get('.inline-flex.rounded-full').should('have.text', 'Orange')
      // ...wearing the default gray subtle classes.
      cy.get('.inline-flex.rounded-full').should('have.class', 'text-ink-gray-6')
      cy.get('.inline-flex.rounded-full').should(
        'have.class',
        'bg-surface-gray-2',
      )
    })

    it('warns in dev, naming the component, prop and value', () => {
      cy.window().then((win) => {
        cy.spy(win.console, 'warn').as('consoleWarn')
      })
      cy.mount(Badge, { props: { theme: 'orange' as any, label: 'Orange' } })

      cy.get('@consoleWarn').should(
        'have.been.calledWithMatch',
        /Badge\.theme="orange" is not a supported value.*falling back to "gray".*gray, blue, green, amber, red, violet/,
      )
    })

    it('warns once per offending value, not once per render', () => {
      cy.window().then((win) => {
        cy.spy(win.console, 'warn').as('consoleWarn')
      })
      cy.mount(Badge, { props: { theme: 'orange' as any, label: 'A' } })
      cy.mount(Badge, { props: { theme: 'orange' as any, label: 'B' } })

      cy.get('@consoleWarn').should('have.been.calledOnce')
    })

    it('falls back to the default variant', () => {
      cy.mount(Badge, {
        props: { variant: 'bogus' as any, label: 'Variant' },
      })
      cy.get('.inline-flex.rounded-full').should('have.class', 'text-ink-gray-6')
      cy.get('.inline-flex.rounded-full').should(
        'have.class',
        'bg-surface-gray-2',
      )
    })

    it('falls back to the default size', () => {
      cy.mount(Badge, {
        props: { size: 'bogus' as any, label: 'Size' },
      })
      cy.get('.inline-flex.rounded-full').should('have.class', 'h-5')
      cy.get('.inline-flex.rounded-full').should('have.class', 'text-xs')
    })

    it('still renders every supported theme unchanged', () => {
      cy.mount(Badge, { props: { theme: 'amber', label: 'Amber' } })
      cy.get('.inline-flex.rounded-full').should(
        'have.class',
        'text-ink-amber-7',
      )
      cy.get('.inline-flex.rounded-full').should(
        'have.class',
        'bg-surface-amber-2',
      )
    })
  })
})
