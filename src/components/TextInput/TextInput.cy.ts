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
})
