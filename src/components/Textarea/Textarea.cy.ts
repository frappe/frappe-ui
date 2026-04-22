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
})
