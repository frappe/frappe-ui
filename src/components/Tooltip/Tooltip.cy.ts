import { h } from 'vue'

import Button from '../Button/Button.vue'
import Tooltip from './Tooltip.vue'

const Comp = () =>
  h(Tooltip, { text: 'some tooltip', hoverDelay: 0, placement: 'top' }, [h(Button, {}, 'k')])

describe('Tooltip', () => {
  it('Renders', () => {
    cy.mount(Comp)

    cy.get('[data-reka-popper-content-wrapper]').should('not.exist')
    cy.get('button').should('have.attr', 'data-state', 'closed')

    cy.get('[role=tooltip]').should('not.exist')
    cy.get('button').trigger('focus')
    cy.get('[role=tooltip]').should('exist')

    cy.get('[role=tooltip]').should('have.text', 'some tooltip')
  })

  it('disabled prop', () => {
    cy.mount(h(Tooltip, { text: 'abc', disabled: true }, [h(Button, {}, 'k')]), { disabled: true })

    cy.get('button').trigger('focus')
    cy.get('[role=tooltip]').should('not.exist')
  })

  it('slots', () => {
    cy.mount(h(Tooltip, { text: 'abc', hoverDelay: 0 }), {
      slots: {
        default: h(Button, {}, 'k'),
        body: h('div', { 'data-cy': 'body' }, ['body']),
      },
    })

    cy.get('button').trigger('focus')
    cy.get('[data-cy=body]').should('exist')

    cy.mount(h(Tooltip, { text: 'abc', hoverDelay: 0 }), {
      slots: {
        default: h(Button, {}, 'k'),
        content: h('div', { 'data-cy': 'content' }, ['content']),
      },
    })

    cy.get('button').trigger('focus')
    cy.get('[data-cy=content]').should('exist')
  })

  it('arrowClass prop', () => {
    cy.mount(
      h(Tooltip, { text: 'abc', hoverDelay: 0, arrowClass: 'fill-red-500' }, [h(Button, {}, 'k')]),
    )

    cy.get('button').trigger('focus')
    cy.get('svg').should('has.class', 'fill-red-500')
  })
})
