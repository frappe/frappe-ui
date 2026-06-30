import { defineComponent, h, ref } from 'vue'
import MultiEmailInput from './MultiEmailInput.vue'
import type { MultiEmailOption } from './types'

const members: MultiEmailOption[] = [
  { label: 'Ada Lovelace', value: 'ada@example.com' },
  { label: 'Grace Hopper', value: 'grace@example.com' },
]

// A controlled host that surfaces the bound model + the last invalid email as
// text, so v-model sync and the `invalid` event are observable.
function host(
  options: {
    initial?: string[]
    suggestions?: MultiEmailOption[]
    label?: string
    required?: boolean
    error?: string
    disabled?: boolean
  } = {},
) {
  return defineComponent({
    setup() {
      const model = ref<string[]>(options.initial ?? [])
      const invalid = ref('')
      // Mutate the model the way a parent would (not via the component's UI),
      // to prove a programmatic write syncs without surprising the host.
      const setProgrammatically = () => (model.value = ['grace@example.com'])
      return { model, invalid, setProgrammatically }
    },
    render() {
      return [
        h('span', { 'data-cy': 'model' }, this.model.join(',')),
        h('span', { 'data-cy': 'invalid' }, this.invalid),
        h(
          'button',
          { 'data-cy': 'set-prog', onClick: this.setProgrammatically },
          'set',
        ),
        h(MultiEmailInput, {
          modelValue: this.model,
          'onUpdate:modelValue': (v: string[]) => (this.model = v),
          onInvalid: (v: string) => (this.invalid = v),
          options: options.suggestions ?? members,
          label: options.label,
          required: options.required,
          error: options.error,
          disabled: options.disabled,
          placeholder: 'Add email…',
        }),
      ]
    },
  })
}

describe('MultiEmailInput', () => {
  it('renders the control and placeholder', () => {
    cy.mount(host())
    cy.get('[data-slot="control"]').should('exist')
    cy.get('[data-slot="input"]')
      .should('exist')
      .and('have.attr', 'placeholder', 'Add email…')
  })

  it('forwards `id` and associates the label', () => {
    cy.mount(host({ label: 'Invite by email', required: true }))
    cy.get('label').should('contain.text', 'Invite by email')
    cy.get('[data-slot="input"]')
      .invoke('attr', 'id')
      .then((id) => {
        cy.get('label').should('have.attr', 'for', id)
      })
  })

  it('picks a suggestion into a chip and syncs v-model', () => {
    cy.mount(host())
    cy.get('[data-slot="input"]').focus()
    cy.get('[data-slot="item"]').contains('Ada Lovelace').click()
    cy.get('[data-slot="tag"]').should('have.length', 1)
    cy.get('[data-cy="model"]').should('have.text', 'ada@example.com')
  })

  it('commits a typed new address on Enter via the create row', () => {
    cy.mount(host({ suggestions: [] }))
    cy.get('[data-slot="input"]').type('new@person.com')
    cy.get('[data-create="true"]').should('contain.text', 'new@person.com')
    cy.get('[data-slot="input"]').type('{enter}')
    cy.get('[data-cy="model"]').should('have.text', 'new@person.com')
    cy.get('[data-slot="tag"]').should('have.length', 1)
  })

  it('commits the typed address on Enter even while suggestions are showing', () => {
    // A valid, new address typed while the suggestion list is non-empty: Enter
    // must add what was typed (create row is highlighted), not a suggestion.
    cy.mount(host())
    cy.get('[data-slot="input"]').type('new@person.com')
    cy.get('[data-slot="item"]').should('have.length.greaterThan', 1)
    cy.get('[data-slot="input"]').type('{enter}')
    cy.get('[data-cy="model"]').should('have.text', 'new@person.com')
  })

  it('syncs a programmatic model change into chips', () => {
    cy.mount(host())
    cy.get('[data-cy="set-prog"]').click()
    cy.get('[data-cy="model"]').should('have.text', 'grace@example.com')
    cy.get('[data-slot="tag"]').should('have.length', 1)
  })

  it('applies a host class to the control when there is no labeling', () => {
    cy.mount({
      render: () => h(MultiEmailInput, { modelValue: [], class: 'w-full' }),
    })
    cy.get('[data-slot="control"]').should('have.class', 'w-full')
  })

  it('rejects an invalid typed address and adds no chip', () => {
    cy.mount(host({ suggestions: [] }))
    cy.get('[data-slot="input"]').type('not-an-email{enter}')
    cy.get('[data-cy="invalid"]').should('have.text', 'not-an-email')
    cy.get('[data-slot="tag"]').should('not.exist')
    cy.get('[data-cy="model"]').should('have.text', '')
  })

  it('removes a chip via its delete button', () => {
    cy.mount(host({ initial: ['ada@example.com'] }))
    cy.get('[data-slot="tag"]').should('have.length', 1)
    cy.get('[aria-label="Remove ada@example.com"]').click()
    cy.get('[data-slot="tag"]').should('not.exist')
    cy.get('[data-cy="model"]').should('have.text', '')
  })

  it('removes the last chip on Backspace from an empty input', () => {
    cy.mount(host({ initial: ['ada@example.com', 'grace@example.com'] }))
    cy.get('[data-slot="input"]').focus().type('{backspace}{backspace}')
    cy.get('[data-cy="model"]').should('have.text', 'ada@example.com')
  })

  it('excludes already-selected emails from the suggestions', () => {
    cy.mount(host({ initial: ['ada@example.com'] }))
    cy.get('[data-slot="input"]').focus()
    cy.get('[data-slot="item"]').should('have.length', 1)
    cy.get('[data-slot="item"]').should('contain.text', 'Grace Hopper')
  })

  it('renders the error region and marks the input invalid', () => {
    cy.mount(host({ error: 'Something went wrong' }))
    cy.get('[data-slot="error"]').should('contain.text', 'Something went wrong')
    cy.get('[data-slot="input"]').should('have.attr', 'aria-invalid', 'true')
  })

  it('does not open or accept input when disabled', () => {
    cy.mount(host({ disabled: true }))
    cy.get('[data-slot="input"]').should('have.attr', 'disabled')
  })
})
