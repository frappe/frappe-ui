import Radio from './Radio.vue'

describe('Radio', () => {
  it('renders', () => {
    cy.mount(Radio, { props: { label: 'Option A', value: 'a' } })

    cy.get('input[type="radio"]').should('exist')
    cy.get('label').should('contain.text', 'Option A')
  })

  it('disabled', () => {
    cy.mount(Radio, {
      props: { label: 'Option A', value: 'a', disabled: true },
    })

    cy.get('input[type="radio"]').should('be.disabled')
    cy.get('label').should('have.class', 'cursor-not-allowed')
  })

  it('v-model — selecting fires update:modelValue with the radio value', () => {
    cy.mount(Radio, {
      props: {
        value: 'a',
        modelValue: '',
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })

    cy.get('@onUpdate').should('not.have.been.called')
    cy.get('input[type="radio"]').click()
    cy.get('@onUpdate').should('have.been.calledWith', 'a')
  })

  it('reflects checked state when modelValue matches value', () => {
    cy.mount(Radio, {
      props: { value: 'a', modelValue: 'a' },
    })

    cy.get('input[type="radio"]').should('be.checked')
  })

  it('does not fire when disabled', () => {
    cy.mount(Radio, {
      props: {
        value: 'a',
        modelValue: '',
        disabled: true,
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })

    cy.get('input[type="radio"]').click({ force: true })
    cy.get('@onUpdate').should('not.have.been.called')
  })

  describe('shared labeling contract', () => {
    it('wires aria-describedby', () => {
      cy.mount(Radio, {
        props: { label: 'Option A', value: 'a', description: 'Billed annually.' },
      })
      cy.get('input').then(($el) => {
        const id = $el.attr('id')!
        expect($el.attr('aria-describedby')).to.equal(`${id}-description`)
      })
    })

    it('renders error state', () => {
      cy.mount(Radio, {
        props: { label: 'Option A', value: 'a', error: 'Select one.' },
      })
      cy.get('input').should('have.attr', 'aria-invalid', 'true')
      cy.contains('Select one.').should('exist')
    })

    it('renders the canonical data-* hooks on the control', () => {
      cy.mount(Radio, {
        props: { label: 'Option A', value: 'a', modelValue: 'a', size: 'md' },
      })
      cy.get('input').should('have.attr', 'data-slot', 'control')
      cy.get('input').should('have.attr', 'data-size', 'md')
      cy.get('input').should('have.attr', 'data-state', 'checked')
    })

    it('exposes data-disabled when disabled', () => {
      cy.mount(Radio, {
        props: { label: 'Option A', value: 'a', disabled: true },
      })
      cy.get('input').should('have.attr', 'data-disabled', 'true')
    })
  })

  describe('padded variant', () => {
    it('clicking the padding area selects the radio', () => {
      cy.mount(Radio, {
        props: {
          label: 'Option A',
          value: 'a',
          variant: 'padded',
          'onUpdate:modelValue': cy.spy().as('onUpdate'),
        },
      })

      // Click the outer container — not the control or label directly.
      cy.get('[data-slot="control"]').parent().click('left')
      cy.get('@onUpdate').should('have.been.calledWith', 'a')
    })

    it('does not double-select when the label is clicked', () => {
      cy.mount(Radio, {
        props: {
          label: 'Option A',
          value: 'a',
          variant: 'padded',
          'onUpdate:modelValue': cy.spy().as('onUpdate'),
        },
      })

      cy.get('[data-slot="label"]').click()
      cy.get('@onUpdate').should('have.been.calledOnce')
    })

    it('does not select when disabled', () => {
      cy.mount(Radio, {
        props: {
          label: 'Option A',
          value: 'a',
          variant: 'padded',
          disabled: true,
          'onUpdate:modelValue': cy.spy().as('onUpdate'),
        },
      })

      cy.get('[data-slot="control"]').parent().click('left')
      cy.get('@onUpdate').should('not.have.been.called')
    })

    it('keeps a fixed compact height for a label-only row', () => {
      cy.mount(Radio, {
        props: { label: 'Option A', value: 'a', variant: 'padded' },
      })
      cy.get('[data-slot="control"]').parent().parent().should('have.class', 'h-7')
    })

    it('grows the surface when a description is present', () => {
      cy.mount(Radio, {
        props: {
          label: 'Option A',
          value: 'a',
          description: 'Billed annually.',
          variant: 'padded',
        },
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
      cy.mount(Radio, { props: { label: 'Option A', value: 'a', size: 'xs' } })
      cy.get('input').should('have.attr', 'data-size', 'xs')
    })

    it('renders the xs control at 13px', () => {
      cy.mount(Radio, { props: { label: 'Option A', value: 'a', size: 'xs' } })
      cy.get('input').invoke('outerWidth').should('be.closeTo', 13, 1)
    })
  })
})
