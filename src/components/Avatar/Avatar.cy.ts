import Avatar from './Avatar.vue'

const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']

const sizeHeights = {
  xs: '4',
  sm: '5',
  md: '6',
  lg: '7',
  xl: '8',
  '2xl': '10',
  '3xl': '11.5',
}

const defaultProps = {
  'data-cy': 'avatar',
  image: 'https://avatars.githubusercontent.com/u/499550',
  label: 'Abc',
}

describe('Avatar', () => {
  it('Renders', () => {
    cy.mount(Avatar, {
      props: defaultProps,
    })

    cy.get('[data-cy="avatar"]').should('exist')
  })

  it('Sizes', () => {
    sizes.forEach((x) => {
      cy.mount(Avatar, {
        props: { ...defaultProps, size: x },
      })

      cy.get('[data-cy="avatar"]').should('have.class', 'h-' + sizeHeights[x])
    })
  })

  it('Name', () => {
    cy.mount(Avatar, {
      props: { 'data-cy': 'avatar', label: 'Abc' },
    })

    cy.get('[data-cy="avatar"]').should('have.text', 'A')
  })

  it('Uses gray fallback theme by default', () => {
    cy.mount(Avatar, {
      props: { 'data-cy': 'avatar', label: 'Abc' },
    })

    cy.get('[data-cy="avatar"] > div')
      .should('have.class', 'bg-surface-gray-2')
      .and('have.class', 'text-ink-gray-5')
  })

  it('Supports colorful fallback themes', () => {
    cy.mount(Avatar, {
      props: { 'data-cy': 'avatar', label: 'Abc', theme: 'blue' },
    })

    cy.get('[data-cy="avatar"] > div')
      .should('have.class', 'bg-surface-blue-2')
      .and('have.class', 'text-ink-blue-7')
  })

  it('keeps the size enum when the class only sizes at a breakpoint', () => {
    // Tailwind emits variant utilities after the base ones, so `sm:size-16`
    // wins at `sm` on its own. Dropping the enum for it left the avatar
    // unsized below `sm`, and this root is inline-block.
    cy.mount(Avatar, {
      props: { 'data-cy': 'avatar', label: 'Abc', size: 'md' },
      attrs: { class: 'sm:size-16' },
    })
    cy.get('[data-cy="avatar"]').should('have.class', 'w-6')

    cy.mount(Avatar, {
      props: { 'data-cy': 'avatar-plain', label: 'Abc', size: 'md' },
      attrs: { class: 'size-16' },
    })
    cy.get('[data-cy="avatar-plain"]').should('not.have.class', 'w-6')
  })
})
