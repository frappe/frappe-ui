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

    it('no size prop applies no inline width/height and defaults to 16px via svg attributes', () => {
      cy.mount(Spinner)

      cy.get('[role="status"]').should(($el) => {
        expect($el[0].style.width).to.equal('')
        expect($el[0].style.height).to.equal('')
        expect(getComputedStyle($el[0]).width).to.equal('16px')
        expect(getComputedStyle($el[0]).height).to.equal('16px')
      })
    })

    it('without size prop, width/height classes win over the CSS default', () => {
      cy.mount(Spinner, { attrs: { class: 'h-3 w-3' } })

      cy.get('[role="status"]').should(($el) => {
        expect(getComputedStyle($el[0]).width).to.equal('12px')
        expect(getComputedStyle($el[0]).height).to.equal('12px')
      })
    })
  })

  describe('theme', () => {
    it('theme="gray" applies text-ink-gray-8 class', () => {
      cy.mount(Spinner, { props: { theme: 'gray' } })

      cy.get('[role="status"]').should('have.class', 'text-ink-gray-8')
    })

    it('theme="red" applies text-ink-red-8 class', () => {
      cy.mount(Spinner, { props: { theme: 'red' } })

      cy.get('[role="status"]').should('have.class', 'text-ink-red-8')
    })

    it('no theme prop applies no color class (inherits currentColor)', () => {
      cy.mount(Spinner)

      cy.get('[role="status"]')
        .should('not.have.class', 'text-ink-gray-8')
        .and('not.have.class', 'text-ink-red-8')
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
