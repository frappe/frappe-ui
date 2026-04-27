import Checkbox from './Checkbox.vue'
import { _resetWarnDeprecated } from '../../utils/warnDeprecated'

describe('Checkbox', () => {
  beforeEach(() => {
    _resetWarnDeprecated()
  })

  it('renders', () => {
    cy.mount(Checkbox, { props: { label: 'abc' } })

    cy.get('input[type="checkbox"]').should('exist')
    cy.get('label').should('contain.text', 'abc')
  })

  it('disabled', () => {
    cy.mount(Checkbox, {
      props: { label: 'abc', disabled: true },
    })

    cy.get('input[type="checkbox"]').should('be.disabled')
    cy.get('label').should('have.class', 'text-ink-gray-4')
  })

  it('test v-model', () => {
    cy.mount(Checkbox, {
      props: {
        'onUpdate:model-value': cy.spy().as('onUpdate'),
      },
    })

    cy.get('@onUpdate').should('not.have.been.called')
    cy.get('input[type="checkbox"]').click()
    cy.get('@onUpdate').should('have.been.calledWith', true)
  })

  describe('shared labeling contract', () => {
    it('wires aria-describedby and aria-errormessage', () => {
      cy.mount(Checkbox, {
        props: { label: 'Accept', description: 'Required to continue.' },
      })
      cy.get('input').then(($el) => {
        const id = $el.attr('id')!
        expect($el.attr('aria-describedby')).to.equal(`${id}-description`)
      })
    })

    it('renders error state and suppresses description', () => {
      cy.mount(Checkbox, {
        props: {
          label: 'Accept',
          description: 'helper',
          error: 'Required',
        },
      })
      cy.get('input').should('have.attr', 'aria-invalid', 'true')
      cy.contains('Required').should('exist')
    })

    it('renders the canonical data-* hooks on the control', () => {
      cy.mount(Checkbox, {
        props: { label: 'Accept', size: 'md', required: true, modelValue: true },
      })
      cy.get('input').should('have.attr', 'data-slot', 'control')
      cy.get('input').should('have.attr', 'data-size', 'md')
      cy.get('input').should('have.attr', 'data-state', 'checked')
      cy.get('input').should('have.attr', 'data-required', 'true')
    })

    it('flips data-state to invalid when error is set', () => {
      cy.mount(Checkbox, {
        props: { label: 'Accept', error: 'Required' },
      })
      cy.get('input').should('have.attr', 'data-state', 'invalid')
    })

    it('exposes data-disabled when disabled', () => {
      cy.mount(Checkbox, {
        props: { label: 'Accept', disabled: true },
      })
      cy.get('input').should('have.attr', 'data-disabled', 'true')
    })

    it('warns once when the deprecated `padding` prop is used', () => {
      cy.window().then((win) => {
        cy.spy(win.console, 'warn').as('consoleWarn')
      })
      cy.mount(Checkbox, { props: { label: 'abc', padding: true } })
      cy.get('@consoleWarn').should(
        'have.been.calledWithMatch',
        /Checkbox\.padding is deprecated/,
      )
    })
  })
})
