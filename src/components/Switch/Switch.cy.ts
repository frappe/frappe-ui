import Switch from './Switch.vue'
import { _resetWarnDeprecated } from '../../utils/warnDeprecated'

describe('Switch', () => {
  beforeEach(() => {
    _resetWarnDeprecated()
  })

  it('renders the component', () => {
    cy.mount(Switch)

    cy.get('[role="switch"]').should('exist')
  })

  it('renders the label & description', () => {
    cy.mount(Switch, {
      props: { label: 'abc', description: 'some long sentence' },
    })

    cy.get('label').should('contain.text', 'abc')
    cy.contains('some long sentence').should('exist')
  })

  it('disabled', () => {
    cy.mount(Switch, {
      props: { disabled: true },
    })

    cy.get('[role="switch"]').should('have.attr', 'disabled')
  })

  it('v-model', () => {
    cy.mount(Switch, {
      props: {
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
        onChange: cy.spy().as('onChange'),
      },
    })

    cy.get('@onUpdate').should('not.be.called')
    cy.get('@onChange').should('not.be.called')

    cy.get('[role="switch"]').click()
    cy.get('@onUpdate').should('be.calledWith', true)
    cy.get('@onChange').should('be.calledWith', true)
    cy.get('[role="switch"]').click()

    cy.get('@onUpdate').should('be.calledWith', false)
    cy.get('@onChange').should('be.calledWith', false)
  })

  describe('shared labeling contract', () => {
    it('wires aria-describedby and aria-errormessage', () => {
      cy.mount(Switch, {
        props: { label: 'Notifications', description: 'Receive emails.' },
      })
      cy.get('[role="switch"]').then(($el) => {
        const id = $el.attr('id')!
        expect($el.attr('aria-describedby')).to.equal(`${id}-description`)
      })
    })

    it('renders error state', () => {
      cy.mount(Switch, {
        props: { label: 'Notifications', error: 'Please select one.' },
      })
      cy.get('[role="switch"]').should('have.attr', 'aria-invalid', 'true')
      cy.contains('Please select one.').should('exist')
    })

    it('warns once when @change is bound', () => {
      cy.window().then((win) => {
        cy.spy(win.console, 'warn').as('consoleWarn')
      })
      cy.mount(Switch, { attrs: { onChange: cy.spy().as('onChange') } })
      cy.get('[role="switch"]').click()
      cy.get('@consoleWarn').should(
        'have.been.calledWithMatch',
        /Switch\.change is deprecated/,
      )
    })

    it('warns once when labelClasses is set', () => {
      cy.window().then((win) => {
        cy.spy(win.console, 'warn').as('consoleWarn')
      })
      cy.mount(Switch, {
        props: { label: 'abc', labelClasses: 'text-blue-500' },
      })
      cy.get('@consoleWarn').should(
        'have.been.calledWithMatch',
        /Switch\.labelClasses is deprecated/,
      )
    })
  })
})
