import PopoverClick from './stories/Click.vue'
import PopoverHover from './stories/Hover.vue'

describe('Popover', () => {
  it('trigger click', () => {
    cy.mount(PopoverClick)

    cy.get('.PopoverContent').should('not.exist')
    cy.get('button').click()
    cy.get('.PopoverContent').should('exist')
  })

  it('trigger hover', () => {
    cy.mount(PopoverHover)

    cy.get('.PopoverContent').should('not.exist')
    cy.get('button').trigger('mouseover')
    cy.get('.PopoverContent').should('exist')
  })

  it('emit events', () => {
    const onOpen = cy.spy().as('onOpen')
    const onClose = cy.spy().as('onClose')
    const onUpdateShow = cy.spy().as('onUpdateShow')

    cy.mount(PopoverClick, {
      props: {
        'onUpdate:show': onUpdateShow,
        onOpen: onOpen,
        onClose: onClose,
      },
    })

    cy.get('@onOpen').should('not.have.been.called')
    cy.get('@onClose').should('not.have.been.called')
    cy.get('@onUpdateShow').should('not.have.been.called')

    cy.get('button').click()
    cy.get('@onOpen').should('have.been.called')
    cy.get('@onClose').should('not.have.been.calledWith', true)

    cy.root().click(0, 0, { force: true })
    cy.get('@onClose').should('have.been.called')
    cy.get('@onUpdateShow').should('have.been.calledWith', false)
  })
})
