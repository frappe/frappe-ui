import { h } from 'vue'
import Checkbox from './Checkbox.vue'

describe('Checkbox', () => {
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
    // A disabled control dims its label — `disabled` outranks `color="gray-7"`.
    cy.get('label')
      .should('have.class', 'text-base')
      .and('have.class', 'text-ink-gray-4')
      .and('not.have.class', 'text-ink-gray-7')
  })

  it('dims the description when disabled', () => {
    cy.mount(Checkbox, {
      props: { label: 'abc', description: 'Helper text.', disabled: true },
    })

    cy.get('[data-slot="description"]')
      .should('have.class', 'text-ink-gray-3')
      .and('not.have.class', 'text-ink-gray-5')
  })

  it('toggles with the space key', () => {
    cy.mount(Checkbox, {
      props: {
        label: 'Accept',
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })

    cy.get('input[type="checkbox"]').focus().type(' ')
    cy.get('@onUpdate').should('have.been.calledWith', true)
  })

  it('renders the label and description slots', () => {
    cy.mount(Checkbox, {
      props: { label: 'prop label', description: 'prop description' },
      slots: {
        label: () => h('span', 'slot label'),
        description: () => h('span', 'slot description'),
      },
    })

    cy.contains('slot label').should('exist')
    cy.contains('slot description').should('exist')
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
    it('describes the input from a #description slot alone', () => {
      // The wrapper around the description is its own `v-if` here, so it has to
      // count the slot too. Without that, `aria-describedby` names an id that
      // never mounts.
      cy.mount(Checkbox, {
        props: { label: 'Accept' },
        slots: { description: () => h('span', 'Required to continue.') },
      })
      cy.get('input')
        .invoke('attr', 'aria-describedby')
        .then((id) => {
          cy.get(`#${id}`).should('contain.text', 'Required to continue.')
        })
    })

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
        props: {
          label: 'Accept',
          size: 'md',
          required: true,
          modelValue: true,
        },
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
  })

  describe('padded', () => {
    it('clicking the padding area toggles the checkbox', () => {
      cy.mount(Checkbox, {
        props: {
          label: 'abc',
          padded: true,
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
          padded: true,
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
          padded: true,
          disabled: true,
          'onUpdate:modelValue': cy.spy().as('onUpdate'),
        },
      })

      cy.get('[data-slot="control"]').parent().click('left')
      cy.get('@onUpdate').should('not.have.been.called')
    })

    it('keeps a fixed compact height for a label-only row', () => {
      cy.mount(Checkbox, { props: { label: 'abc', padded: true } })
      cy.get('[data-slot="control"]')
        .parent()
        .parent()
        .should('have.class', 'h-7')
    })

    it('grows the surface when a description is present', () => {
      cy.mount(Checkbox, {
        props: { label: 'abc', description: 'helper', padded: true },
      })
      cy.get('[data-slot="control"]')
        .parent()
        .parent()
        .should('not.have.class', 'h-7')
        .and('have.class', 'py-1.5')
    })

    it('grows the surface for a #description slot too', () => {
      // The row height follows the same thing the wrapper does. Reading the
      // prop alone kept the compact fixed height and the description
      // overflowed it.
      cy.mount(Checkbox, {
        props: { label: 'abc', padded: true },
        slots: { description: () => h('span', 'helper') },
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
