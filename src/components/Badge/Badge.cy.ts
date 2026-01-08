import Badge from './Badge.vue'
import { h } from 'vue'

describe('<Badge />', () => {
  it('renders default badge', () => {
    cy.mount(Badge, {
      slots: {
        default: 'Default',
      },
    })
    cy.get('div').should('contain.text', 'Default')
    // Default theme is gray, variant is subtle
    cy.get('div').should('have.class', 'text-ink-gray-6')
    cy.get('div').should('have.class', 'bg-surface-gray-2')
  })

  it('renders label prop', () => {
    cy.mount(Badge, {
      props: {
        label: 'Badge Label',
      },
    })
    cy.get('div').should('have.text', 'Badge Label')
  })

  it('renders different themes with subtle variant', () => {
    // Gray (default)
    cy.mount(Badge, {
      props: {
        theme: 'gray',
        label: 'Gray',
      },
    })
    cy.get('div').should('have.class', 'text-ink-gray-6')
    cy.get('div').should('have.class', 'bg-surface-gray-2')

    // Blue
    cy.mount(Badge, {
      props: {
        theme: 'blue',
        label: 'Blue',
      },
    })
    cy.get('div').should('have.class', 'text-ink-blue-2')
    cy.get('div').should('have.class', 'bg-surface-blue-1')

    // Green
    cy.mount(Badge, {
      props: {
        theme: 'green',
        label: 'Green',
      },
    })
    cy.get('div').should('have.class', 'text-ink-green-3')
    cy.get('div').should('have.class', 'bg-surface-green-2')

    // Orange
    cy.mount(Badge, {
      props: {
        theme: 'orange',
        label: 'Orange',
      },
    })
    cy.get('div').should('have.class', 'text-ink-amber-3')
    cy.get('div').should('have.class', 'bg-surface-amber-1')

    // Red
    cy.mount(Badge, {
      props: {
        theme: 'red',
        label: 'Red',
      },
    })
    cy.get('div').should('have.class', 'text-ink-red-4')
    cy.get('div').should('have.class', 'bg-surface-red-1')
  })

  it('renders different variants with gray theme', () => {
    // Solid
    cy.mount(Badge, {
      props: {
        variant: 'solid',
        label: 'Solid',
      },
    })
    cy.get('div').should('have.class', 'text-ink-white')
    cy.get('div').should('have.class', 'bg-surface-gray-7')

    // Subtle (default)
    cy.mount(Badge, {
      props: {
        variant: 'subtle',
        label: 'Subtle',
      },
    })
    cy.get('div').should('have.class', 'text-ink-gray-6')
    cy.get('div').should('have.class', 'bg-surface-gray-2')

    // Outline
    cy.mount(Badge, {
      props: {
        variant: 'outline',
        label: 'Outline',
      },
    })
    cy.get('div').should('have.class', 'text-ink-gray-6')
    cy.get('div').should('have.class', 'bg-transparent')
    cy.get('div').should('have.class', 'border-outline-gray-1')

    // Ghost
    cy.mount(Badge, {
      props: {
        variant: 'ghost',
        label: 'Ghost',
      },
    })
    cy.get('div').should('have.class', 'text-ink-gray-6')
    cy.get('div').should('have.class', 'bg-transparent')
  })

  it('renders different sizes', () => {
    // Small
    cy.mount(Badge, {
      props: {
        size: 'sm',
        label: 'Small',
      },
    })
    cy.get('div').should('have.class', 'h-4')
    cy.get('div').should('have.class', 'text-xs')
    cy.get('div').should('have.class', 'px-1.5')

    // Medium (default)
    cy.mount(Badge, {
      props: {
        size: 'md',
        label: 'Medium',
      },
    })
    cy.get('div').should('have.class', 'h-5')
    cy.get('div').should('have.class', 'text-xs')
    cy.get('div').should('have.class', 'px-1.5')

    // Large
    cy.mount(Badge, {
      props: {
        size: 'lg',
        label: 'Large',
      },
    })
    cy.get('div').should('have.class', 'h-6')
    cy.get('div').should('have.class', 'text-sm')
    cy.get('div').should('have.class', 'px-2')
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
    cy.get('div').should('contain.text', 'With Icon')
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
    cy.get('div').should('contain.text', 'With Icon')
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
    cy.get('div').should('contain.text', 'With Icons')
  })

  it('supports numeric label', () => {
    cy.mount(Badge, {
      props: {
        label: 42,
      },
    })
    cy.get('div').should('have.text', '42')
  })

  it('has correct layout classes', () => {
    cy.mount(Badge, {
      props: {
        label: 'Test',
      },
    })
    cy.get('div').should('have.class', 'inline-flex')
    cy.get('div').should('have.class', 'items-center')
    cy.get('div').should('have.class', 'rounded-full')
    cy.get('div').should('have.class', 'whitespace-nowrap')
  })

  it('renders prefix slot with correct size constraints', () => {
    const TestIcon = {
      render() {
        return h('svg', { 'data-cy': 'prefix-icon', class: 'w-4 h-4' })
      },
    }

    // Test with md size (default)
    cy.mount(Badge, {
      props: { label: 'MD', size: 'md' },
      slots: {
        prefix: () => h(TestIcon),
      },
    })
    cy.get('div > div').first().should('have.class', 'max-h-4')

    // Test with lg size
    cy.mount(Badge, {
      props: { label: 'LG', size: 'lg' },
      slots: {
        prefix: () => h(TestIcon),
      },
    })
    cy.get('div > div').first().should('have.class', 'max-h-6')
  })
})
