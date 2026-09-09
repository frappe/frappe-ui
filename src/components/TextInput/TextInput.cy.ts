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
  xs: 'text-xs rounded-3 h-6',
  sm: 'text-base rounded-4 h-7',
  md: 'text-base rounded-4 h-8',
  lg: 'text-lg rounded-5 h-10',
}

/** The accepted single-line control heights, in px. */
const sizeHeights = { xs: 24, sm: 28, md: 32, lg: 40 } as const

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
        .should('have.class', 'text-sm')
        .and('have.class', 'text-ink-gray-6')
      cy.get('input').then(($input) => {
        const id = $input.attr('id')!
        const describedBy = $input.attr('aria-describedby')!
        expect(describedBy).to.equal(`${id}-description`)
        cy.get(`#${id}-description`)
          .should('contain.text', 'We never share')
          .and('have.class', 'text-ink-gray-6')
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

  it('reserves room for #prefix and #suffix', () => {
    cy.mount(TextInput, {
      slots: { prefix: '<span>$</span>', suffix: '<span>.00</span>' },
    })
    cy.get('input').should('have.class', 'ps-8').and('have.class', 'pe-8')

    cy.mount(TextInput)
    cy.get('input').should('have.class', 'ps-2').and('have.class', 'pe-2')
  })

  // The docs playground toggles both slots at runtime. The padding is read
  // from `useSlots()`, which is not reactive, so a cached value used to leave
  // the input at `ps-2` and the prefix painted over the text.
  it('repads when a slot appears or disappears after mount', () => {
    const Harness = defineComponent({
      setup() {
        const show = ref(false)

        return () =>
          h('div', [
            h(
              'button',
              {
                'data-cy': 'toggle',
                onClick: () => (show.value = !show.value),
              },
              'Toggle',
            ),
            h(
              TextInput,
              null,
              show.value
                ? {
                    prefix: () => h('span', '$'),
                    suffix: () => h('span', '.00'),
                  }
                : {},
            ),
          ])
      },
    })

    cy.mount(Harness)
    cy.get('input').should('have.class', 'ps-2').and('have.class', 'pe-2')

    cy.get('[data-cy="toggle"]').click()
    cy.get('input').should('have.class', 'ps-8').and('have.class', 'pe-8')

    cy.get('[data-cy="toggle"]').click()
    cy.get('input').should('have.class', 'ps-2').and('have.class', 'pe-2')
  })
  describe('computed geometry', () => {
    // Class strings can stay right while the rendered box drifts — a stale
    // `h-*` scale, a padding change that overflows a fixed height, a prefix
    // that stretches the row. These assert the box, not the classes.
    for (const [size, height] of Object.entries(sizeHeights)) {
      it(`size="${size}" renders a ${height}px control`, () => {
        cy.mount(TextInput, { props: { size, placeholder: 'Enter input' } })
        cy.get('input').should('have.css', 'height', `${height}px`)
      })

      it(`size="${size}" holds ${height}px with a prefix and a suffix`, () => {
        cy.mount(TextInput, {
          props: { size, placeholder: 'Enter input' },
          slots: {
            prefix: '<span data-cy="prefix" class="lucide-search size-4" />',
            suffix: '<span data-cy="suffix" class="lucide-x size-4" />',
          },
        })
        cy.get('input').should('have.css', 'height', `${height}px`)
        // The prefix/suffix rows are absolutely positioned inside the same
        // relative row, so the row must not grow past the control either.
        cy.get('input')
          .parent()
          .should(($row) => {
            expect($row[0].getBoundingClientRect().height).to.equal(height)
          })
      })

      it(`size="${size}" keeps its label and description at 13px`, () => {
        cy.mount(TextInput, {
          props: { size, label: 'Email', description: 'We never share it.' },
        })
        cy.get('label').should('have.css', 'font-size', '13px')
        cy.get('[data-slot="description"]').should(
          'have.css',
          'font-size',
          '13px',
        )
      })
    }

    it('falls back to sm geometry for a size outside the union', () => {
      // JS call sites and bound values (`:size="config.size"`) are invisible
      // to TypeScript. Before `resolvePropValue` a stale `xl` indexed to
      // `undefined` and the input shipped with no height, font, radius or
      // padding class at all.
      cy.mount(TextInput, {
        props: { size: 'xl' as never, placeholder: 'Enter input' },
      })
      cy.get('input')
        .should('have.class', 'h-7')
        .and('have.class', 'text-base')
        .and('have.class', 'rounded-4')
        .and('have.css', 'height', '28px')
    })
  })

  describe('labeling typography', () => {
    it('renders the label at 13px in ink-gray-6', () => {
      cy.mount(TextInput, { props: { label: 'Email' } })
      cy.get('label')
        .should('have.class', 'text-sm')
        .and('have.class', 'text-ink-gray-6')
        .and('have.css', 'font-size', '13px')
    })

    it('renders the description at 13px in ink-gray-6', () => {
      cy.mount(TextInput, {
        props: { label: 'Email', description: 'We never share it.' },
      })
      cy.get('[data-slot="description"]')
        .should('have.class', 'text-ink-gray-6')
        .and('have.css', 'font-size', '13px')
    })

    it('dims the label and description when disabled', () => {
      cy.mount(TextInput, {
        props: {
          label: 'Email',
          description: 'We never share it.',
          disabled: true,
        },
      })
      cy.get('input').should('have.attr', 'data-disabled', 'true')
      cy.get('input').should('be.disabled')
      // The disabled label and description still read at 13px — only the
      // colour changes.
      cy.get('label').should('have.css', 'font-size', '13px')
      cy.get('[data-slot="description"]').should('have.css', 'font-size', '13px')
    })

    it('keeps the required indicator on the 13px label', () => {
      cy.mount(TextInput, { props: { label: 'Name', required: true } })
      cy.contains('label', 'Name')
        .should('have.css', 'font-size', '13px')
        .within(() => {
          cy.get('span[aria-hidden="true"]').should('contain.text', '*')
          cy.get('span.sr-only').should('contain.text', '(required)')
        })
    })
  })
})
