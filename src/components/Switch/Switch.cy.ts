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
      cy.get('[role="switch"]').click()
      cy.get('@consoleWarn')
        .should('have.been.calledOnce')
        .and('have.been.calledWithMatch', /Switch\.change is deprecated/)
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

    it('renders the canonical data-* hooks on the control', () => {
      cy.mount(Switch, {
        props: { label: 'abc', size: 'md', required: true, modelValue: true },
      })
      cy.get('[role="switch"]').should('have.attr', 'data-slot', 'control')
      cy.get('[role="switch"]').should('have.attr', 'data-size', 'md')
      cy.get('[role="switch"]').should('have.attr', 'data-state', 'checked')
      cy.get('[role="switch"]').should('have.attr', 'data-required', 'true')
    })

    it('exposes data-disabled when disabled', () => {
      cy.mount(Switch, { props: { disabled: true } })
      cy.get('[role="switch"]').should('have.attr', 'data-disabled', 'true')
    })
  })

  describe('padded variant', () => {
    it('clicking the padding area toggles the switch', () => {
      cy.mount(Switch, {
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
      cy.mount(Switch, {
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
      cy.mount(Switch, {
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
      cy.mount(Switch, { props: { label: 'abc', variant: 'padded' } })
      cy.get('[data-slot="control"]').parent().parent().should('have.class', 'h-7')
    })

    it('grows the surface when a description is present', () => {
      cy.mount(Switch, {
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
      cy.mount(Switch, { props: { label: 'abc', size: 'xs' } })
      cy.get('[role="switch"]').should('have.attr', 'data-size', 'xs')
    })
  })

  describe('switchPosition', () => {
    it('leads with the switch by default (start)', () => {
      cy.mount(Switch, { props: { label: 'abc' } })
      cy.get('[data-slot="control"]').then(($switch) => {
        cy.get('[data-slot="label"]').then(($label) => {
          expect($switch[0].getBoundingClientRect().left).to.be.lessThan(
            $label[0].getBoundingClientRect().left,
          )
        })
      })
    })

    it('trails the label when switch-position is end', () => {
      cy.mount(Switch, { props: { label: 'abc', switchPosition: 'end' } })
      cy.get('[data-slot="control"]').then(($switch) => {
        cy.get('[data-slot="label"]').then(($label) => {
          expect($switch[0].getBoundingClientRect().left).to.be.greaterThan(
            $label[0].getBoundingClientRect().left,
          )
        })
      })
    })
  })
})
