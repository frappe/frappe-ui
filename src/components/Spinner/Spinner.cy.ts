import Spinner from './Spinner.vue'

describe('Spinner', () => {
  it('renders with role="status" and default aria-label', () => {
    cy.mount(Spinner)

    cy.get('[role="status"]')
      .should('exist')
      .and('have.attr', 'aria-label', 'Loading')
  })

  describe('sizes', () => {
    const sizes = [
      { size: 'xs', px: 12 },
      { size: 'sm', px: 14 },
      { size: 'md', px: 16 },
      { size: 'lg', px: 20 },
    ] as const

    sizes.forEach(({ size, px }) => {
      it(`size="${size}" sets ${px}px width and height`, () => {
        cy.mount(Spinner, { props: { size } })

        cy.get('[role="status"]').should(($el) => {
          expect($el[0].style.width).to.equal(`${px}px`)
          expect($el[0].style.height).to.equal(`${px}px`)
        })
      })
    })

    it('size=null applies no inline width/height', () => {
      cy.mount(Spinner, { props: { size: null } })

      cy.get('[role="status"]').should(($el) => {
        expect($el[0].style.width).to.equal('')
        expect($el[0].style.height).to.equal('')
      })
    })
  })

  describe('theme', () => {
    it('theme="gray" applies text-ink-gray-8 class', () => {
      cy.mount(Spinner, { props: { theme: 'gray' } })

      cy.get('[role="status"]').should('have.class', 'text-ink-gray-8')
    })

    it('theme="red" applies text-ink-red-4 class', () => {
      cy.mount(Spinner, { props: { theme: 'red' } })

      cy.get('[role="status"]').should('have.class', 'text-ink-red-4')
    })

    it('theme=null applies no color class (inherits currentColor)', () => {
      cy.mount(Spinner, { props: { theme: null } })

      cy.get('[role="status"]')
        .should('not.have.class', 'text-ink-gray-8')
        .and('not.have.class', 'text-ink-red-4')
    })
  })

  describe('track', () => {
    it('track=false (default) does not apply track class', () => {
      cy.mount(Spinner)

      cy.get('[role="status"]').should('not.have.class', 'fui-spinner--track')
    })

    it('track=true applies fui-spinner--track class', () => {
      cy.mount(Spinner, { props: { track: true } })

      cy.get('[role="status"]').should('have.class', 'fui-spinner--track')
    })
  })
})
