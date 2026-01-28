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
})
