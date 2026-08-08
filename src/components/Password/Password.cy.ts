import Password from './Password.vue'
import { defineComponent, h, ref } from 'vue'

describe('Password', () => {
  it('Renders & password toggle ', () => {
    cy.mount(Password)
    cy.get('input[type=password]').should('exist')

    cy.get('[data-grace-area-trigger]').click()
    cy.get('input[type=password]').should('not.exist')
    cy.get('input[type=text]').should('exist')
  })

  it('v-model with modelValue', () => {
    cy.mount(Password, {
      props: {
        modelValue: '123456',
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })

    cy.get('input').type('a')
    cy.get('@onUpdate').should('have.been.calledWith', '123456a')
  })

  it('typing updates v-model from empty', () => {
    cy.mount(Password, {
      props: {
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })

    cy.get('input').type('abc')
    cy.get('@onUpdate').should('have.been.calledWith', 'abc')
  })

  it('shared labeling contract', () => {
    cy.mount(Password, {
      props: { label: 'Password', description: 'min 8 chars', required: true },
    })
    cy.contains('label', 'Password').should('exist')
    cy.get('input').then(($input) => {
      const id = $input.attr('id')!
      expect($input.attr('aria-describedby')).to.equal(`${id}-description`)
      expect($input.attr('aria-required')).to.equal('true')
    })
  })

  it('disables the input', () => {
    cy.mount(Password, { props: { disabled: true } })
    cy.get('input')
      .should('be.disabled')
      .and('have.attr', 'data-disabled', 'true')
  })

  it('exposes focus() and inputElement', () => {
    const Harness = defineComponent({
      setup() {
        const passwordRef = ref<InstanceType<typeof Password> | null>(null)

        return () =>
          h('div', [
            h(Password, { ref: passwordRef }),
            h(
              'button',
              {
                'data-cy': 'focus',
                onClick: () =>
                  passwordRef.value?.focus({ preventScroll: true }),
              },
              'Focus',
            ),
            h(
              'span',
              { 'data-cy': 'is-input-element' },
              String(
                passwordRef.value?.inputElement instanceof HTMLInputElement,
              ),
            ),
          ])
      },
    })

    cy.mount(Harness)

    cy.get('[data-cy="is-input-element"]').should('have.text', 'true')
    cy.get('input').should('not.have.attr', 'tabindex')
    cy.get('input').should('not.have.focus')
    cy.get('[data-cy="focus"]').click()
    cy.get('input').should('have.focus')
  })

  it('Prefix slot', () => {
    cy.mount(Password, {
      slots: {
        prefix: h('div', { 'data-cy': 'prefix-icon' }, ['abc']),
      },
    })

    cy.get("[data-cy='prefix-icon']").should('exist')
  })

  it('renders #label and #description slots', () => {
    cy.mount(Password, {
      slots: {
        label: '<span class="custom-label">Custom label</span>',
        description: '<span class="custom-description">Custom help</span>',
      },
    })
    cy.get('.custom-label').should('have.text', 'Custom label')
    cy.get('.custom-description').should('have.text', 'Custom help')
  })

  it('toggles visibility with Ctrl+I', () => {
    cy.mount(Password)
    cy.get('input[type=password]').should('exist')

    cy.get('input').type('{ctrl}i')
    cy.get('input[type=text]').should('exist')
    cy.get('input[type=password]').should('not.exist')

    cy.get('input').type('{ctrl}i')
    cy.get('input[type=password]').should('exist')
  })
})
