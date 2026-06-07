import Select from './Select.vue'
import { defineComponent, h, ref } from 'vue'

const options = ['abc', 'def', 'xyz']

describe('Select', () => {
  it('Renders', () => {
    cy.mount(Select, { props: { options, placeholder: 'pla' } })

    // basic selection
    cy.get('button').should('have.text', 'pla')
    cy.get('[role=combobox]')
      .should('have.attr', 'aria-expanded', 'false')
      .and('have.class', 'text-left')
      .and('have.class', 'focus-visible:focus-ring')
    cy.get('[role=presentation]').should('not.exist')

    cy.get('button').click()

    cy.get('[role=combobox]').should('have.attr', 'aria-expanded', 'true')
    cy.get('[role=presentation]').should('exist')
    cy.get('[role=option]').should('have.length', options.length)

    cy.get('[role=combobox]').should('not.have.text', 'def')
    cy.get('[role=option]').eq(1).click()
    cy.get('[role=combobox]').should('have.text', 'def')
  })

  it('sizes', () => {
    const classes = {
      sm: 'min-h-7',
      md: 'min-h-8',
      lg: 'min-h-10',
      xl: 'min-h-10',
    }

    for (const size in classes) {
      cy.mount(Select, { props: { options, size } })
      cy.get('button').click()
      cy.get('[role=option]').should('have.class', classes[size])
    }
  })

  it('v-model', () => {
    cy.mount(Select, {
      props: {
        options,
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })

    cy.get('button').click()

    cy.get('@onUpdate').should('not.have.been.called')
    cy.get('[role=option]').eq(1).click()
    cy.get('[role=combobox]').should('have.text', 'def')
    cy.get('@onUpdate').should('have.been.calledWith', 'def')
  })

  it('slots', () => {
    cy.mount(Select, {
      props: { options },
      slots: {
        prefix: h('span', { 'data-cy': 'prefix' }, 'prefix'),
        suffix: h('span', { 'data-cy': 'suffix' }, 'suffix'),
        option: h('span', { 'data-cy': 'option' }, 'option'),
        footer: h('span', { 'data-cy': 'footer' }, 'footer'),
      },
    })

    cy.get('[data-cy="prefix"]').should('exist')
    cy.get('[data-cy="suffix"]').should('exist')

    cy.get('button').click()

    cy.get('[data-cy="option"]').should('exist')
    cy.get('[data-slot="footer"]').find('[data-cy="footer"]').should('exist')
  })

  it('normalizes mixed string and object options', () => {
    cy.mount(Select, {
      props: {
        options: ['abc', { label: 'Custom', value: 'custom' }, 'xyz'],
      },
    })

    cy.get('[role=combobox]').click()
    cy.get('[role=option]').should('have.length', 3)
    cy.contains('[role=option]', 'abc').should('exist')
    cy.contains('[role=option]', 'Custom').should('exist')
    cy.contains('[role=option]', 'xyz').should('exist')
  })

  it('supports empty string option values', () => {
    cy.mount(Select, {
      props: {
        options: [
          { label: 'Sort by', value: '', disabled: true },
          { label: 'Newest first', value: 'newest' },
          { label: 'Oldest first', value: 'oldest' },
        ],
        modelValue: '',
      },
    })

    cy.get('[role=combobox]').should('contain.text', 'Sort by')
    cy.get('[role=combobox]').click()
    cy.contains('[role=option]', 'Sort by').should('exist')
  })

  it('preserves real values that share the empty sentinel prefix', () => {
    const sentinelLikeValue = '__frappe_ui_select_empty__real-value'

    cy.mount(Select, {
      props: {
        options: [
          { label: 'Empty', value: '' },
          { label: 'Sentinel-like', value: sentinelLikeValue },
        ],
        modelValue: sentinelLikeValue,
      },
    })

    cy.get('[role=combobox]').should('contain.text', 'Sentinel-like')
  })

  it('sizes the trigger to the widest option by default', () => {
    const WidthHarness = defineComponent({
      setup() {
        return () =>
          h('div', { class: 'flex items-start gap-6' }, [
            h(Select, {
              options: ['Short'],
              modelValue: 'Short',
              'data-cy': 'short-select',
            }),
            h(Select, {
              options: ['Short', 'A much longer option label'],
              modelValue: 'Short',
              'data-cy': 'long-select',
            }),
          ])
      },
    })

    cy.mount(WidthHarness)

    cy.get('[data-cy="short-select"]').then(($short) => {
      const shortWidth = $short[0].getBoundingClientRect().width

      cy.get('[data-cy="long-select"]').should(($long) => {
        const longWidth = $long[0].getBoundingClientRect().width
        expect(longWidth).to.be.greaterThan(shortWidth)
      })
    })
  })

  it('renders full width only when width is explicitly set', () => {
    const WidthHarness = defineComponent({
      setup() {
        return () =>
          h('div', { class: 'w-[320px] space-y-4' }, [
            h(Select, {
              options,
              modelValue: 'abc',
              'data-cy': 'auto-width-select',
            }),
            h(Select, {
              options,
              modelValue: 'abc',
              class: 'w-full',
              'data-cy': 'full-width-select',
            }),
          ])
      },
    })

    cy.mount(WidthHarness)

    cy.get('[data-cy="auto-width-select"]').then(($auto) => {
      const autoWidth = $auto[0].getBoundingClientRect().width

      cy.get('[data-cy="full-width-select"]').should(($full) => {
        const fullWidth = $full[0].getBoundingClientRect().width
        expect(fullWidth).to.be.greaterThan(autoWidth)
        expect(fullWidth).to.be.closeTo(320, 1)
      })
    })
  })

  it('forwards accessibility attrs to the trigger', () => {
    cy.mount(Select, {
      props: { options },
      attrs: {
        'aria-label': 'Project status',
        'data-testid': 'project-status-select',
      },
    })

    cy.get('[role=combobox]')
      .should('have.attr', 'aria-label', 'Project status')
      .and('have.attr', 'data-testid', 'project-status-select')
  })

  it('keeps item-aligned positioning when using a custom trigger slot', () => {
    cy.mount(Select, {
      props: {
        options,
        modelValue: 'def',
      },
      slots: {
        trigger: ({ displayValue }) =>
          h(
            'div',
            { 'data-cy': 'trigger-content' },
            displayValue || 'Pick one',
          ),
      },
    })

    cy.get('[data-cy="trigger-content"]').should('have.text', 'def')
    cy.get('[role=combobox]').click()
    cy.get('[data-slot="content-body"]').should(
      'have.attr',
      'data-motion',
      'animated',
    )
    cy.get('[data-slot="content"]')
      .parent()
      .should('have.attr', 'style')
      .and('include', 'min-width')
  })

  it('skips content animation for keyboard-opened interactions', () => {
    cy.mount(Select, {
      props: { options },
    })

    cy.get('[role=combobox]').focus().trigger('keydown', { key: 'Enter' })
    cy.get('[data-slot="content-body"]').should(
      'have.attr',
      'data-motion',
      'instant',
    )
  })

  it('forwards form attrs to the hidden select element', () => {
    const onSubmit = cy.spy().as('onSubmit')

    const FormHarness = defineComponent({
      setup() {
        const value = ref('def')

        function handleSubmit(event: SubmitEvent) {
          event.preventDefault()
          onSubmit(
            Object.fromEntries(
              new FormData(event.target as HTMLFormElement).entries(),
            ),
          )
        }

        return () =>
          h('form', { onSubmit: handleSubmit }, [
            h(Select, {
              modelValue: value.value,
              'onUpdate:modelValue': (nextValue) => {
                value.value = nextValue
              },
              name: 'status',
              required: true,
              autocomplete: 'organization-title',
              options,
            }),
            h('button', { type: 'submit' }, 'Submit'),
          ])
      },
    })

    cy.mount(FormHarness)

    cy.get('[role=combobox]').click()

    cy.get('select').should('have.attr', 'name', 'status')
    cy.get('select').should('have.attr', 'required')
    cy.get('select').should('have.attr', 'autocomplete', 'organization-title')

    cy.get('[role="combobox"]').type('{esc}', { force: true })
    cy.get('[data-slot="content"]').should('not.exist')
    cy.contains('button', 'Submit').click()

    cy.get('@onSubmit').should('have.been.calledWithMatch', {
      status: 'def',
    })
  })

  it('renders empty state', () => {
    cy.mount(Select, {
      props: { options: [] },
      slots: {
        empty: h('span', { 'data-cy': 'empty' }, 'Nothing to pick'),
      },
    })

    cy.get('[role=combobox]').click()
    cy.get('[data-slot="empty"]').find('[data-cy="empty"]').should('exist')
  })

  it('disabled', () => {
    cy.mount(Select, {
      props: { options, disabled: true },
    })

    cy.get('button').should('have.class', 'cursor-not-allowed')
  })

  // Regression: ItemListRow's `hasRenderableContent` treats any component
  // vnode as renderable, so a fallback `<OptionIcon>` left in the slot
  // tree (even when `icon` is falsy and OptionIcon itself renders nothing)
  // was enough to keep ItemListRow painting an empty prefix container —
  // visible as a stray left gap from the parent's `flex gap-2`.
  describe('item-prefix container', () => {
    it('omits the prefix container when no icon and no #item-prefix slot', () => {
      cy.mount(Select, { props: { options } })

      cy.get('[role=combobox]').click()
      cy.get('[role=option]')
        .first()
        .find('[data-slot="item-prefix"]')
        .should('not.exist')
    })

    it('renders the prefix container when option has an icon', () => {
      cy.mount(Select, {
        props: {
          options: [{ label: 'Apple', value: 'apple', icon: 'lucide-apple' }],
        },
      })

      cy.get('[role=combobox]').click()
      cy.get('[role=option]')
        .first()
        .find('[data-slot="item-prefix"]')
        .should('exist')
      cy.get('[role=option]').first().find('.lucide-apple').should('exist')
    })

    it('renders the prefix container when consumer provides #item-prefix', () => {
      cy.mount(Select, {
        props: { options },
        slots: {
          'item-prefix': () => h('span', { 'data-cy': 'tpl-prefix' }, 'P'),
        },
      })

      cy.get('[role=combobox]').click()
      cy.get('[role=option]')
        .first()
        .find('[data-slot="item-prefix"]')
        .should('exist')
      cy.get('[role=option]')
        .first()
        .find('[data-cy="tpl-prefix"]')
        .should('exist')
    })
  })

  describe('shared labeling contract', () => {
    it('renders label and links it to the trigger via for/id', () => {
      cy.mount(Select, {
        props: { options, label: 'Fruit' },
      })
      cy.get('[data-slot="trigger"]').then(($trigger) => {
        const id = $trigger.attr('id')!
        cy.get(`label[for="${id}"]`).should('contain.text', 'Fruit')
      })
    })

    it('renders description and wires aria-describedby on trigger', () => {
      cy.mount(Select, {
        props: {
          options,
          label: 'Fruit',
          description: 'Pick one fruit.',
        },
      })
      cy.get('[data-slot="trigger"]').then(($trigger) => {
        const id = $trigger.attr('id')!
        const describedBy = $trigger.attr('aria-describedby')!
        expect(describedBy).to.equal(`${id}-description`)
        cy.get(`#${id}-description`).should('contain.text', 'Pick one fruit.')
      })
    })

    it('renders error with aria-invalid + aria-errormessage and suppresses description', () => {
      cy.mount(Select, {
        props: {
          options,
          label: 'Fruit',
          description: 'helper',
          error: 'Required',
        },
      })
      cy.get('[data-slot="trigger"]')
        .should('have.attr', 'aria-invalid', 'true')
        .then(($trigger) => {
          const id = $trigger.attr('id')!
          expect($trigger.attr('aria-errormessage')).to.equal(`${id}-error`)
          cy.get(`#${id}-error`).should('contain.text', 'Required')
          cy.get(`#${id}-description`).should('not.exist')
        })
    })

    it('renders required indicator and forwards aria-required', () => {
      cy.mount(Select, {
        props: { options, label: 'Fruit', required: true },
      })
      cy.get('[data-slot="trigger"]').should(
        'have.attr',
        'aria-required',
        'true',
      )
      cy.contains('label', 'Fruit').within(() => {
        cy.get('span[aria-hidden="true"]').should('contain.text', '*')
      })
    })

    it('honors an explicit id over the generated one', () => {
      cy.mount(Select, {
        props: { options, id: 'my-select-id', label: 'Fruit' },
      })
      cy.get('[data-slot="trigger"]').should('have.attr', 'id', 'my-select-id')
      cy.get('label[for="my-select-id"]').should('exist')
    })

    it('flips data-invalid on the trigger when error is set', () => {
      cy.mount(Select, {
        props: { options, label: 'Fruit', error: 'Required' },
      })
      cy.get('[data-slot="trigger"]').should(
        'have.attr',
        'data-invalid',
        'true',
      )
    })

    it('renders without a labeling wrapper when no labeling props are set', () => {
      cy.mount(Select, { props: { options } })
      cy.get('[data-slot="trigger"]').should('exist')
      cy.get('label').should('not.exist')
    })
  })
})
