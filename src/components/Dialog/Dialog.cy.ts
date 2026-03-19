import { ref, h } from 'vue'
import Dialog from './Dialog.vue'
import Button from '../Button/Button.vue'

describe('Dialog', () => {
  it('test modal', () => {
    const onUpdate = cy.spy().as('onUpdate')
    const onClose = cy.spy().as('onClose')
    const onAfterLeave = cy.spy().as('onAfterLeave')

    const Modal = {
      setup() {
        return { open: ref(false) }
      },
      render() {
        return [
          h('main', [
            h(
              Button,
              { onClick: () => (this.open = true) },
              () => 'Show Modal Dialog',
            ),

            h(Dialog, {
              onClose,
              onAfterLeave,
              modelValue: this.open,
              'onUpdate:modelValue': (value) => {
                this.open = value
                onUpdate(value)
              },
              disableOutsideClickToClose: false,

              options: {
                title: 'Modal Dialog',
                message: 'This dialog cannot be closed by clicking outside.',
                actions: [{ label: 'Close', variant: 'solid' }],
              },
            }),
          ]),
        ]
      },
    }

    cy.mount(Modal)

    // cy.get('@onUpdate').should('not.have.been.called')
    cy.get('[role=dialog]').should('not.exist')

    cy.get('button').click()
    cy.get('[role=dialog]').should('exist')

    cy.get('[role=dialog] h3').should('have.text', 'Modal Dialog')
    cy.get('[role=dialog] p').should(
      'have.text',
      'This dialog cannot be closed by clicking outside.',
    )

    cy.get('[role=dialog] button').eq(0).click()
    cy.get('@onClose').should('have.been.called')
    cy.get('@onUpdate').should('have.been.called')
  })

  it('slots', () => {
    cy.mount(Dialog, {
      props: {
        modelValue: true,
      },
      slots: {
        'body-header': h(
          'div',
          { 'data-cy': 'body-header' },
          'some body header',
        ),

        'body-content': h(
          'div',
          { 'data-cy': 'body-content' },
          'some body content',
        ),

        actions: h('div', { 'data-cy': 'actions' }, 'some actions'),
      },
    })

    cy.get('[data-cy=body-header]').should('have.text', 'some body header')
    cy.get('[data-cy=body-content]').should('have.text', 'some body content')
    cy.get('[data-cy=actions]').should('have.text', 'some actions')
  })
})
