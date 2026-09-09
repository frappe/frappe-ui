import Textarea from './Textarea.vue'
import { defineComponent, h, ref } from 'vue'

describe('Textarea', () => {
  it('exposes focus() and inputElement', () => {
    const Harness = defineComponent({
      setup() {
        const textareaRef = ref<InstanceType<typeof Textarea> | null>(null)

        return () =>
          h('div', [
            h(Textarea, { ref: textareaRef }),
            h(
              'button',
              {
                'data-cy': 'focus',
                onClick: () =>
                  textareaRef.value?.focus({ preventScroll: true }),
              },
              'Focus',
            ),
            h(
              'span',
              { 'data-cy': 'is-textarea-element' },
              String(
                textareaRef.value?.inputElement instanceof HTMLTextAreaElement,
              ),
            ),
          ])
      },
    })

    cy.mount(Harness)

    cy.get('[data-cy="is-textarea-element"]').should('have.text', 'true')
    cy.get('textarea').should('not.have.attr', 'tabindex')
    cy.get('textarea').should('not.have.focus')
    cy.get('[data-cy="focus"]').click()
    cy.get('textarea').should('have.focus')
  })

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
      .and('have.class', 'bg-surface-base')
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

  describe('sizes', () => {
    // `size` moves spacing and the minimum height. The type does not move:
    // Textarea text is a flat 13px at every size.
    const sizes = [
      { size: 'xs', minHClass: 'min-h-8', minHeight: 32 },
      { size: 'sm', minHClass: 'min-h-9', minHeight: 36 },
      { size: 'md', minHClass: 'min-h-10', minHeight: 40 },
      { size: 'lg', minHClass: 'min-h-11', minHeight: 44 },
    ] as const

    sizes.forEach(({ size, minHClass, minHeight }) => {
      it(`size="${size}" applies ${minHClass} and stays at 13px`, () => {
        cy.mount(Textarea, { props: { size } })

        cy.get('textarea')
          .should('have.class', 'text-p-sm')
          .and('have.class', minHClass)
          .and('have.css', 'font-size', '13px')
          .and('have.css', 'line-height', '19.5px')
          .and('have.css', 'min-height', `${minHeight}px`)
      })

      it(`size="${size}" fits one full line inside ${minHClass}`, () => {
        // The min-heights are sized to hold one line of 13px prose plus the
        // size's own padding and border. If a padding row grows past its
        // min-height the empty box gets taller than the token says.
        cy.mount(Textarea, { props: { size, rows: 1 } })
        cy.get('textarea').should(($el) => {
          expect($el[0].getBoundingClientRect().height).to.equal(minHeight)
        })
      })

      it(`size="${size}" keeps 13px across multiline content`, () => {
        cy.mount(Textarea, {
          props: {
            size,
            rows: 4,
            modelValue: 'first line\nsecond line\nthird line',
          },
        })
        cy.get('textarea')
          .should('have.css', 'font-size', '13px')
          .and('have.value', 'first line\nsecond line\nthird line')
        // Four rows of 13px prose must be taller than the one-line minimum.
        cy.get('textarea').should(($el) => {
          expect($el[0].getBoundingClientRect().height).to.be.greaterThan(
            minHeight,
          )
        })
      })
    })

    it('holds the type scale flat across every size', () => {
      const rendered: number[] = []

      sizes.forEach(({ size }) => {
        cy.mount(Textarea, { props: { size } })
        cy.get('textarea').then(($el) => {
          rendered.push(parseFloat(getComputedStyle($el[0]).fontSize))
        })
      })

      cy.then(() => {
        expect(rendered).to.deep.equal([13, 13, 13, 13])
      })
    })

    it('grows the minimum height monotonically across sizes', () => {
      const rendered: number[] = []

      sizes.forEach(({ size }) => {
        cy.mount(Textarea, { props: { size } })
        cy.get('textarea').then(($el) => {
          rendered.push(parseFloat(getComputedStyle($el[0]).minHeight))
        })
      })

      cy.then(() => {
        rendered.slice(1).forEach((px, i) => {
          expect(px).to.be.greaterThan(rendered[i])
        })
      })
    })

    it('falls back to sm geometry for a size outside the union', () => {
      cy.mount(Textarea, { props: { size: 'xl' as never } })
      cy.get('textarea')
        .should('have.class', 'min-h-9')
        .and('have.class', 'text-p-sm')
        .and('have.css', 'min-height', '36px')
    })
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
      cy.get('textarea')
        .should('have.class', 'border-0')
        .and('have.class', 'bg-transparent')
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

    it('renders #label and #description slots', () => {
      cy.mount(Textarea, {
        slots: {
          label: '<span class="custom-label">Custom label</span>',
          description: '<span class="custom-description">Custom help</span>',
        },
      })
      cy.get('.custom-label').should('have.text', 'Custom label')
      cy.get('.custom-description').should('have.text', 'Custom help')
    })
  })
})
