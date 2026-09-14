import { h } from 'vue'
import Icon from './Icon.vue'

describe('<Icon />', () => {
  it('renders a lucide string as a span with the class', () => {
    cy.mount(Icon, { props: { icon: 'lucide-star' } })
    cy.get('span').should('have.class', 'lucide-star')
    cy.get('span').should('have.attr', 'aria-hidden', 'true')
    cy.get('span').should('be.empty')
  })

  it('passes through fallthrough class on lucide spans', () => {
    cy.mount(Icon, {
      props: { icon: 'lucide-check' },
      attrs: { class: 'size-4 text-ink-gray-6' },
    })
    cy.get('span')
      .should('have.class', 'lucide-check')
      .and('have.class', 'size-4')
      .and('have.class', 'text-ink-gray-6')
  })

  it('renders an emoji string as text content', () => {
    cy.mount(Icon, { props: { icon: '🚀' } })
    cy.get('span').should('have.text', '🚀')
    cy.get('span').should('have.attr', 'aria-hidden', 'true')
  })

  it('treats other glyphs (no ASCII letters/digits) as emoji', () => {
    cy.mount(Icon, { props: { icon: '✨' } })
    cy.get('span').should('have.text', '✨')
  })

  it('renders nothing for an unsupported (non-lucide, non-emoji) string', () => {
    cy.mount(Icon, { props: { icon: 'check' } })
    cy.get('span').should('not.exist')
    cy.get('svg').should('not.exist')
  })

  it('renders a Component value via <component :is>', () => {
    const CustomIcon = {
      name: 'custom-icon',
      render() {
        return h('svg', { 'data-cy': 'custom-icon' })
      },
    }
    cy.mount(Icon, { props: { icon: CustomIcon } })
    cy.get('[data-cy="custom-icon"]').should('exist')
  })

  it('supports the name prop with string and Component values', () => {
    const CustomIcon = {
      render() {
        return h('svg', { 'data-cy': 'name-component' })
      },
    }

    cy.mount(Icon, { props: { name: 'lucide-star' } })
    cy.get('span').should('have.class', 'lucide-star')

    cy.mount(Icon, { props: { name: CustomIcon } })
    cy.get('[data-cy="name-component"]').should('exist')
  })

  it('prefers icon unless it is undefined', () => {
    cy.mount(Icon, {
      props: { icon: 'lucide-check', name: 'lucide-star' },
    })
    cy.get('span')
      .should('have.class', 'lucide-check')
      .and('not.have.class', 'lucide-star')

    cy.mount(Icon, { props: { icon: undefined, name: 'lucide-star' } })
    cy.get('span').should('have.class', 'lucide-star')
  })

  it('treats an explicit null icon as the selected empty value', () => {
    cy.mount(Icon, { props: { icon: null, name: 'lucide-star' } })
    cy.get('span').should('not.exist')
    cy.get('svg').should('not.exist')
  })

  it('passes fallthrough attrs to the rendered Component', () => {
    const CustomIcon = {
      name: 'custom-icon',
      render() {
        return h('svg', { 'data-cy': 'custom-icon' })
      },
    }
    cy.mount(Icon, {
      props: { icon: CustomIcon },
      attrs: { class: 'size-5' },
    })
    cy.get('[data-cy="custom-icon"]').should('have.class', 'size-5')
  })

  it('renders nothing when the resolved value is empty or omitted', () => {
    cy.mount(Icon, { props: { icon: '' } })
    cy.get('span').should('not.exist')
    cy.get('svg').should('not.exist')

    cy.mount(Icon, { props: {} })
    cy.get('span').should('not.exist')
    cy.get('svg').should('not.exist')

    cy.mount(Icon, { props: { name: null } })
    cy.get('span').should('not.exist')
    cy.get('svg').should('not.exist')
  })
})
