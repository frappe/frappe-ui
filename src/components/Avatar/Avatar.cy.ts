import { h } from 'vue'
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

  it('cuts a see-through hole for the indicator', () => {
    cy.mount(Avatar, {
      props: { 'data-cy': 'avatar', label: 'Abc', size: '3xl' },
      slots: { indicator: () => h('span', { 'data-cy': 'dot' }) },
    })

    cy.get('[data-cy="avatar"] > div')
      .first()
      .should('have.css', 'mask-image')
      .and('include', 'radial-gradient')
    cy.get('[data-cy="dot"]')
      .parent()
      .parent()
      .should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
  })

  it('hangs the indicator box past the corner', () => {
    cy.mount(Avatar, {
      props: { 'data-cy': 'avatar', label: 'Abc', size: '3xl' },
      slots: { indicator: () => h('span', { 'data-cy': 'dot' }) },
    })

    // 3xl: a 1rem box that hangs 0.2rem past the corner, so its center sits
    // 0.3rem inside the avatar's right and bottom edges.
    cy.get('[data-cy="avatar"]').then(($avatar) => {
      const avatar = $avatar[0].getBoundingClientRect()
      cy.get('[data-cy="dot"]')
        .parent()
        .parent()
        .then(($box) => {
          const box = $box[0].getBoundingClientRect()
          expect(box.width).to.eq(16)
          expect(box.right - avatar.right).to.be.closeTo(3.2, 0.1)
          expect(box.bottom - avatar.bottom).to.be.closeTo(3.2, 0.1)
        })
    })
  })

  it('leaves the avatar whole without an indicator', () => {
    cy.mount(Avatar, {
      props: { 'data-cy': 'avatar', label: 'Abc' },
    })

    cy.get('[data-cy="avatar"] > div').should('have.css', 'mask-image', 'none')
  })
})
