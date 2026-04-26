import TextInput from './TextInput.vue'
import { h } from 'vue'

const inputTypes = [
  'text',
  'number',
  'email',
  'date',
  'datetime-local',
  'password',
  'search',
  'tel',
  'time',
  'url',
]

const sizeCLass = {
  sm: 'text-base rounded h-7',
  md: 'text-base rounded h-8',
  lg: 'text-lg rounded-md h-10',
  xl: 'text-xl rounded-md h-10',
}

const variantClasses = {
  subtle: 'bg-surface-gray-2',
  outline: 'bg-surface-white',
  ghost: 'border-0',
}

describe('Textinput', () => {
  it('input types', () => {
    inputTypes.forEach((x) => {
      cy.mount(TextInput, {
        props: {
          type: x,
          placeholder: 'Enter input',
        },
      })

      cy.get(`input[type=${x}]`).should('exist')
    })
  })

  it('size', () => {
    for (const size in sizeCLass) {
      cy.mount(TextInput, {
        props: {
          type: 'text',
          size: size,
          placeholder: 'Enter input',
        },
      })

      cy.get(`input[type=text]`).should('have.class', sizeCLass[size])
    }
  })

  it('disabled and required', () => {
    cy.mount(TextInput, {
      props: { type: 'text', disabled: true },
    })

    cy.get(`input[type=text]`).should('have.class', 'text-ink-gray-5')
  })

  it('variants', () => {
    for (const variant in variantClasses) {
      cy.mount(TextInput, {
        props: { variant: variant },
      })

      cy.get(`input[type=text]`).should('have.class', variantClasses[variant])
    }
  })

  it('v-model', () => {
    cy.mount(TextInput, {
      props: {
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })

    cy.get('@onUpdate').should('not.have.been.called')
    cy.get(`input[type=text]`).type('abc')
    cy.get('@onUpdate').should('have.been.calledWith', 'abc')
  })

  describe('shared labeling contract', () => {
    it('renders label, description, and links them via aria-describedby', () => {
      cy.mount(TextInput, {
        props: {
          label: 'Email',
          description: 'We never share your email.',
        },
      })
      cy.contains('label', 'Email').should('exist')
      cy.get('input').then(($input) => {
        const id = $input.attr('id')!
        const describedBy = $input.attr('aria-describedby')!
        expect(describedBy).to.equal(`${id}-description`)
        cy.get(`#${id}-description`).should('contain.text', 'We never share')
        cy.get(`label[for="${id}"]`).should('exist')
      })
    })

    it('renders error state with aria-invalid and aria-errormessage, suppresses description', () => {
      cy.mount(TextInput, {
        props: {
          label: 'Email',
          description: 'helper',
          error: 'Required',
        },
      })
      cy.get('input')
        .should('have.attr', 'aria-invalid', 'true')
        .then(($input) => {
          const id = $input.attr('id')!
          expect($input.attr('aria-errormessage')).to.equal(`${id}-error`)
          cy.get(`#${id}-error`).should('contain.text', 'Required')
          cy.get(`#${id}-description`).should('not.exist')
        })
    })

    it('renders required indicator and forwards aria-required', () => {
      cy.mount(TextInput, {
        props: { label: 'Name', required: true },
      })
      cy.get('input').should('have.attr', 'aria-required', 'true')
      cy.contains('label', 'Name').within(() => {
        cy.get('span[aria-hidden="true"]').should('contain.text', '*')
        cy.get('span.sr-only').should('contain.text', '(required)')
      })
    })

    it('honors an explicit id over the generated one', () => {
      cy.mount(TextInput, {
        props: { id: 'my-explicit-id', label: 'Email' },
      })
      cy.get('input').should('have.attr', 'id', 'my-explicit-id')
      cy.get('label[for="my-explicit-id"]').should('exist')
    })
  })
})
