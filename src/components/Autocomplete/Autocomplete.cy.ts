import Autocomplete from './Autocomplete.vue'
import { _resetWarnDeprecated } from '../../utils/warnDeprecated'

describe('Autocomplete (legacy)', () => {
  beforeEach(() => {
    _resetWarnDeprecated()
  })

  it('warns that Autocomplete is deprecated', () => {
    cy.window().then((win) => {
      cy.spy(win.console, 'warn').as('consoleWarn')
    })
    cy.mount(Autocomplete, {
      props: {
        options: [
          { label: 'One', value: 1 },
          { label: 'Two', value: 2 },
        ],
      },
    })
    cy.get('@consoleWarn').should(
      'have.been.calledWithMatch',
      /Autocomplete is deprecated.*Combobox or MultiSelect/,
    )
  })
})
