import Skeleton from './Skeleton.vue'

describe('Skeleton', () => {
  it('renders an animated placeholder', () => {
    cy.mount(Skeleton)

    cy.get('.fui-skeleton')
      .should('exist')
      .and('have.class', 'animate-pulse')
      .and('have.attr', 'aria-hidden', 'true')
  })

  it('is sized by the classes passed to it', () => {
    cy.mount(Skeleton, { attrs: { class: 'h-5 w-48' } })

    cy.get('.fui-skeleton').should(($el) => {
      expect($el[0].clientHeight).to.equal(20)
      expect($el[0].clientWidth).to.equal(192)
    })
  })
})
