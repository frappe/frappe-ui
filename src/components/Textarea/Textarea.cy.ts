import Textarea from './Textarea.vue'

describe('Textarea', () => {
  it('renders label, placeholder, and rows', () => {
    cy.mount(Textarea, {
      props: {
        label: 'Description',
        placeholder: 'Write something',
        rows: 5,
      },
    })

    cy.contains('label', 'Description').should('exist')
    cy.get('textarea')
      .should('have.attr', 'placeholder', 'Write something')
      .and('have.attr', 'rows', '5')
  })

  it('emits update:modelValue on input', () => {
    cy.mount(Textarea, {
      props: {
        modelValue: '',
        'onUpdate:modelValue': cy.stub().as('updateModelValue'),
      },
    })

    cy.get('textarea').type('Hello world')
    cy.get('@updateModelValue').should('have.been.called')
  })

  it('applies outline variant classes', () => {
    cy.mount(Textarea, {
      props: {
        variant: 'outline',
      },
    })

    cy.get('textarea')
      .should('have.class', 'border-outline-gray-2')
      .and('have.class', 'bg-surface-white')
  })

  it('renders disabled state', () => {
    cy.mount(Textarea, {
      props: {
        disabled: true,
      },
    })

    cy.get('textarea')
      .should('be.disabled')
      .and('have.class', 'bg-surface-gray-1')
  })

  it('debounces model updates', () => {
    cy.clock()
    cy.mount(Textarea, {
      props: {
        debounce: 300,
        'onUpdate:modelValue': cy.stub().as('updateModelValue'),
      },
    })

    cy.get('textarea').type('Delayed update')
    cy.get('@updateModelValue').should('not.have.been.called')

    cy.tick(300)
    cy.get('@updateModelValue')
      .should('have.been.calledOnce')
      .and('have.been.calledWith', 'Delayed update')
  })

  describe('shared labeling contract', () => {
    it('wires aria-describedby to the description region', () => {
      cy.mount(Textarea, {
        props: { label: 'Notes', description: 'Optional notes' },
      })
      cy.get('textarea').then(($el) => {
        const id = $el.attr('id')!
        expect($el.attr('aria-describedby')).to.equal(`${id}-description`)
      })
    })

    it('renders error state and suppresses description', () => {
      cy.mount(Textarea, {
        props: { description: 'helper', error: 'Cannot be empty' },
      })
      cy.get('textarea').should('have.attr', 'aria-invalid', 'true')
      cy.contains('Cannot be empty').should('exist')
    })

    it('renders required indicator and forwards required + aria-required', () => {
      cy.mount(Textarea, {
        props: { label: 'Bio', required: true },
      })
      cy.get('textarea').should('have.attr', 'required')
      cy.get('textarea').should('have.attr', 'aria-required', 'true')
      cy.contains('label', 'Bio').within(() => {
        cy.get('span[aria-hidden="true"]').should('contain.text', '*')
      })
    })

    it('renders ghost variant', () => {
      cy.mount(Textarea, { props: { variant: 'ghost' } })
      cy.get('textarea').should('have.class', 'border-0')
    })

    it('renders the canonical data-* hooks on the control', () => {
      cy.mount(Textarea, {
        props: {
          label: 'Notes',
          size: 'md',
          variant: 'outline',
          required: true,
        },
      })
      cy.get('textarea').should('have.attr', 'data-slot', 'control')
      cy.get('textarea').should('have.attr', 'data-size', 'md')
      cy.get('textarea').should('have.attr', 'data-variant', 'outline')
      cy.get('textarea').should('have.attr', 'data-state', 'valid')
      cy.get('textarea').should('have.attr', 'data-required', 'true')
    })

    it('flips data-state to invalid when error is set', () => {
      cy.mount(Textarea, { props: { error: 'Cannot be empty' } })
      cy.get('textarea').should('have.attr', 'data-state', 'invalid')
    })

    it('exposes data-disabled when disabled', () => {
      cy.mount(Textarea, { props: { disabled: true } })
      cy.get('textarea').should('have.attr', 'data-disabled', 'true')
    })
  })
})
