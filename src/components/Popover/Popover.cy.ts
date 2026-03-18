import { h } from 'vue'
import Popover from './Popover.vue'
import Button from '../Button/Button.vue'

const PopoverSlots = {
  target: ({ togglePopover }) =>
    h(Button, { 'data-cy': 'trigger', onClick: togglePopover }, 'Click me'),
  'body-main': h('div', { 'data-cy': 'popover-content' }, 'Popover content'),
}

describe('Popover', () => {
  it('trigger click', () => {
    cy.mount(Popover, { slots: PopoverSlots })

    cy.get('.PopoverContent').should('not.exist')
    cy.get('button').click()
    cy.get('.PopoverContent').should('exist')
  })

  it('trigger hover', () => {
    cy.mount(Popover, {
      slots: PopoverSlots,
      props: { trigger: 'hover', hoverDelay: 0 },
    })

    cy.get('.PopoverContent').should('not.exist')
    cy.get('button').trigger('mouseover')
    cy.get('.PopoverContent').should('exist')
  })

  it('emit events', () => {
    const onClose = cy.spy().as('onClose')
    const onUpdateShow = cy.spy().as('onUpdateShow')

    cy.mount(Popover, {
      slots: PopoverSlots,
      props: {
        'onUpdate:show': onUpdateShow,
        onClose: onClose,
      },
    })

    cy.get('@onClose').should('not.have.been.called')
    cy.get('@onUpdateShow').should('not.have.been.called')

    cy.get('button').click()
    cy.get('@onClose').should('not.have.been.calledWith', true)

    cy.root().click(0, 0, { force: true })
    cy.get('@onClose').should('have.been.called')
    cy.get('@onUpdateShow').should('have.been.calledWith', false)
  })

  it('slots', () => {
    cy.mount(Popover, { slots: PopoverSlots })

    cy.get('[data-cy="trigger"]').should('exist')
    cy.get('[data-cy="popover-content"]').should('not.exist')
    cy.get('[data-cy="trigger"]').click()
    cy.get('[data-cy="popover-content"]').should('exist')
  })
})
