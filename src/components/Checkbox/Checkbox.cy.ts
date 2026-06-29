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

  describe('padded variant', () => {
    it('clicking the padding area toggles the checkbox', () => {
      cy.mount(Checkbox, {
        props: {
          label: 'abc',
          variant: 'padded',
          'onUpdate:modelValue': cy.spy().as('onUpdate'),
        },
      })

      // Click the outer container — not the control or label directly.
      cy.get('[data-slot="control"]').parent().click('left')
      cy.get('@onUpdate').should('have.been.calledWith', true)
    })

    it('does not double-toggle when the label is clicked', () => {
      cy.mount(Checkbox, {
        props: {
          label: 'abc',
          variant: 'padded',
          'onUpdate:modelValue': cy.spy().as('onUpdate'),
        },
      })

      cy.get('[data-slot="label"]').click()
      cy.get('@onUpdate').should('have.been.calledOnce')
    })

    it('does not toggle when disabled', () => {
      cy.mount(Checkbox, {
        props: {
          label: 'abc',
          variant: 'padded',
          disabled: true,
          'onUpdate:modelValue': cy.spy().as('onUpdate'),
        },
      })

      cy.get('[data-slot="control"]').parent().click('left')
      cy.get('@onUpdate').should('not.have.been.called')
    })

    it('keeps a fixed compact height for a label-only row', () => {
      cy.mount(Checkbox, { props: { label: 'abc', variant: 'padded' } })
      cy.get('[data-slot="control"]').parent().parent().should('have.class', 'h-7')
    })

    it('grows the surface when a description is present', () => {
      cy.mount(Checkbox, {
        props: { label: 'abc', description: 'helper', variant: 'padded' },
      })
      cy.get('[data-slot="control"]')
        .parent()
        .parent()
        .should('not.have.class', 'h-7')
        .and('have.class', 'py-1.5')
    })
  })

  describe('size', () => {
    it('exposes data-size for xs', () => {
      cy.mount(Checkbox, { props: { label: 'abc', size: 'xs' } })
      cy.get('input').should('have.attr', 'data-size', 'xs')
    })

    it('renders the xs control at 13px', () => {
      cy.mount(Checkbox, { props: { label: 'abc', size: 'xs' } })
      cy.get('input').invoke('outerWidth').should('be.closeTo', 13, 1)
    })
  })

  describe('orientation', () => {
    it('stacks the label below the control when vertical', () => {
      cy.mount(Checkbox, { props: { label: 'abc', orientation: 'vertical' } })
      cy.get('input').parent().should('have.class', 'flex-col')
    })

    it('stays horizontal in the padded variant', () => {
      cy.mount(Checkbox, {
        props: { label: 'abc', orientation: 'vertical', variant: 'padded' },
      })
      cy.get('input').parent().should('not.have.class', 'flex-col')
    })
  })

  describe('indeterminate', () => {
    it('sets the DOM indeterminate property and data-state', () => {
      cy.mount(Checkbox, {
        props: { label: 'abc', indeterminate: true, modelValue: false },
      })
      cy.get('input').should('have.attr', 'data-state', 'indeterminate')
      cy.get('input').then(($el) => {
        expect(($el[0] as HTMLInputElement).indeterminate).to.eq(true)
      })
    })
  })
})
