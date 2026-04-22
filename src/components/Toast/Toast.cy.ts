import { h } from 'vue'
import { ToastProvider, ToastViewport } from 'reka-ui'
import Toast from './Toast.vue'

function mountToast(props: Record<string, unknown>) {
  cy.mount({
    render() {
      return h(ToastProvider, { swipeDirection: 'down' }, () => [
        h(Toast, props),
        h(ToastViewport, {
          class:
            'fixed bottom-0 right-0 flex max-w-full flex-col items-end gap-[10px] p-5 outline-none pointer-events-none',
        }),
      ])
    },
  })
}

describe('Toast', () => {
  it('renders the message', () => {
    mountToast({
      open: true,
      message: 'Saved successfully',
    })

    cy.contains('Saved successfully').should('exist')
  })

  it('emits action and runs handler', () => {
    const onClick = cy.stub().as('actionHandler')
    const onAction = cy.stub().as('actionEvent')

    mountToast({
      open: true,
      message: 'Post archived',
      action: {
        label: 'Undo',
        onClick,
      },
      onAction,
    })

    cy.contains('button', 'Undo').click({ force: true })

    cy.get('@actionHandler').should('have.been.calledOnce')
    cy.get('@actionEvent').should('have.been.calledOnce')
  })

  it('does not render close button when closable is false', () => {
    mountToast({
      open: true,
      message: 'Persistent message',
      closable: false,
    })

    cy.get('[aria-label="Close"]').should('not.exist')
  })
})
