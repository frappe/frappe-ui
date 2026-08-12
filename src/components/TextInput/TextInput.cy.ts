import TextInput from './TextInput.vue'
import { defineComponent, h, ref } from 'vue'

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
  sm: 'text-base rounded-4 h-7',
  md: 'text-base rounded-4 h-8',
  lg: 'text-lg rounded-5 h-10',
  xl: 'text-2xl rounded-5 h-10',
}

const variantClasses = {
  subtle: ['bg-surface-gray-2'],
  outline: ['bg-surface-base'],
  ghost: ['border-0', 'bg-transparent'],
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

      for (const cls of variantClasses[variant]) {
        cy.get(`input[type=text]`).should('have.class', cls)
      }
    }
  })

  it('sets autocomplete=off by default and allows override via attrs', () => {
    cy.mount(TextInput)
    cy.get('input').should('have.attr', 'autocomplete', 'off')

    cy.mount(TextInput, {
      attrs: { autocomplete: 'email' },
    })
    cy.get('input').should('have.attr', 'autocomplete', 'email')
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

  it('exposes focus() and inputElement', () => {
    const Harness = defineComponent({
      setup() {
        const inputRef = ref<InstanceType<typeof TextInput> | null>(null)

        return () =>
          h('div', [
            h(TextInput, { ref: inputRef }),
            h(
              'button',
              {
                'data-cy': 'focus',
                onClick: () => inputRef.value?.focus({ preventScroll: true }),
              },
              'Focus',
            ),
            h(
              'span',
              { 'data-cy': 'is-input-element' },
              String(inputRef.value?.inputElement instanceof HTMLInputElement),
            ),
          ])
      },
    })

    cy.mount(Harness)

    cy.get('[data-cy="is-input-element"]').should('have.text', 'true')
    // No tabindex override — the native <input> stays in the default Tab order.
    cy.get('input').should('not.have.attr', 'tabindex')
    cy.get('input').should('not.have.focus')
    cy.get('[data-cy="focus"]').click()
    cy.get('input').should('have.focus')
  })

  describe('shared labeling contract', () => {
    it('describes the input from a #description slot alone', () => {
      // The slot renders the same element the prop does. Keying the reference
      // off the prop left the paragraph pointed at by nothing.
      cy.mount(TextInput, {
        props: { label: 'Email' },
        slots: { description: () => h('span', 'We never share your email.') },
      })
      cy.get('input')
        .invoke('attr', 'aria-describedby')
        .then((id) => {
          cy.get(`#${id}`).should('contain.text', 'We never share')
        })
    })

    it('renders label, description, and links them via aria-describedby', () => {
      cy.mount(TextInput, {
        props: {
          label: 'Email',
          description: 'We never share your email.',
        },
      })
      cy.contains('label', 'Email').should('exist')
      cy.contains('label', 'Email')
        .should('have.class', 'text-base')
        .and('have.class', 'text-ink-gray-5')
      cy.get('input').then(($input) => {
        const id = $input.attr('id')!
        const describedBy = $input.attr('aria-describedby')!
        expect(describedBy).to.equal(`${id}-description`)
        cy.get(`#${id}-description`)
          .should('contain.text', 'We never share')
          .and('have.class', 'text-ink-gray-5')
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

    it('does not render its own required indicator when #label slot is used', () => {
      cy.mount(TextInput, {
        props: { required: true },
        slots: {
          label: '<span class="custom">Custom</span>',
        },
      })
      cy.get('label').within(() => {
        cy.get('span[aria-hidden="true"]').should('not.exist')
        cy.get('span.sr-only').should('not.exist')
      })
    })

    it('renders the canonical data-* hooks on the control', () => {
      cy.mount(TextInput, {
        props: {
          label: 'Email',
          size: 'lg',
          variant: 'outline',
          required: true,
        },
      })
      cy.get('input').should('have.attr', 'data-slot', 'control')
      cy.get('input').should('have.attr', 'data-size', 'lg')
      cy.get('input').should('have.attr', 'data-variant', 'outline')
      cy.get('input').should('have.attr', 'data-state', 'valid')
      cy.get('input').should('have.attr', 'data-required', 'true')
    })

    it('flips data-state to invalid when error is set', () => {
      cy.mount(TextInput, {
        props: { label: 'Email', error: 'Required' },
      })
      cy.get('input').should('have.attr', 'data-state', 'invalid')
    })

    it('exposes data-disabled when disabled', () => {
      cy.mount(TextInput, { props: { disabled: true } })
      cy.get('input').should('have.attr', 'data-disabled', 'true')
    })
  })

  it('renders #prefix and #suffix slots', () => {
    cy.mount(TextInput, {
      slots: {
        prefix: '<span data-cy="prefix">$</span>',
        suffix: '<span data-cy="suffix">.00</span>',
      },
    })
    cy.get('[data-cy="prefix"]').should('exist').and('have.text', '$')
    cy.get('[data-cy="suffix"]').should('exist').and('have.text', '.00')
  })
})
