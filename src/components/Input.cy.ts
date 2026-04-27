import Input from './Input.vue'
import { _resetWarnDeprecated } from '../utils/warnDeprecated'

describe('Input (legacy)', () => {
  beforeEach(() => {
    _resetWarnDeprecated()
  })

  it('warns that Input is deprecated', () => {
    cy.window().then((win) => {
      cy.spy(win.console, 'warn').as('consoleWarn')
    })
    cy.mount(Input, { props: { label: 'Name' } })
    cy.get('@consoleWarn').should(
      'have.been.calledWithMatch',
      /Input is deprecated.*TextInput/,
    )
  })
})
