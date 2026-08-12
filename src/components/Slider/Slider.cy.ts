import { h } from 'vue'
import Slider from './Slider.vue'

describe('Slider', () => {
  it('moves the value with arrow keys and emits the update', () => {
    cy.mount(Slider, {
      props: {
        modelValue: [50],
        step: 10,
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })

    cy.get('[role="slider"]').focus().trigger('keydown', { key: 'ArrowRight' })
    cy.get('@onUpdate').should('have.been.calledWith', [60])
    cy.get('[role="slider"]').trigger('keydown', { key: 'Home' })
    cy.get('@onUpdate').should('have.been.calledWith', [0])
  })

  it('renders the label and description slots', () => {
    cy.mount(Slider, {
      props: { label: 'prop label', description: 'prop description' },
      slots: {
        label: () => h('span', 'slot label'),
        description: () => h('span', 'slot description'),
      },
    })

    cy.contains('slot label').should('exist')
    cy.contains('slot description').should('exist')
  })

  it('renders one thumb for a single value', () => {
    cy.mount(Slider, {
      props: {
        modelValue: [25],
      },
    })

    cy.get('[role="slider"]').should('have.length', 1)
  })

  it('renders two thumbs for a range value', () => {
    cy.mount(Slider, {
      props: {
        modelValue: [20, 80],
      },
    })

    cy.get('[role="slider"]').should('have.length', 2)
  })

  it('renders one thumb at the default minimum value when uncontrolled', () => {
    cy.mount(Slider)

    cy.get('[role="slider"]')
      .should('have.length', 1)
      .first()
      .should('have.attr', 'aria-valuenow', '0')
  })

  it('renders one thumb at the provided minimum value when uncontrolled', () => {
    cy.mount(Slider, {
      props: {
        min: 10,
      },
    })

    cy.get('[role="slider"]')
      .should('have.length', 1)
      .first()
      .should('have.attr', 'aria-valuenow', '10')
  })

  it('does not bake in a hardcoded aria-label', () => {
    cy.mount(Slider, { props: { modelValue: [25] } })
    cy.get('[role="slider"]').should('not.have.attr', 'aria-label')
  })

  it('routes a caller aria-label to the thumb, not the root', () => {
    cy.mount(Slider, {
      props: { id: 'sl-aria-label', modelValue: [25] },
      attrs: { 'aria-label': 'Volume' },
    })
    cy.get('[role="slider"]').should('have.attr', 'aria-label', 'Volume')
    cy.get('#sl-aria-label').should('not.have.attr', 'aria-label')
  })

  it('routes a caller aria-labelledby to the thumb, not the root', () => {
    cy.mount({
      render: () =>
        h('div', [
          h('span', { id: 'ext-label' }, 'Volume'),
          h(Slider, {
            id: 'sl-aria-labelledby',
            modelValue: [25],
            'aria-labelledby': 'ext-label',
          }),
        ]),
    })
    cy.get('[role="slider"]').should(
      'have.attr',
      'aria-labelledby',
      'ext-label',
    )
    cy.get('#sl-aria-labelledby').should('not.have.attr', 'aria-labelledby')
  })

  it('merges a caller aria-describedby with the generated ids on the thumb', () => {
    cy.mount({
      render: () =>
        h('div', [
          h('span', { id: 'ext-hint' }, 'External hint'),
          h(Slider, {
            id: 'sl-aria-describedby',
            label: 'Volume',
            description: 'Adjust volume.',
            modelValue: [25],
            'aria-describedby': 'ext-hint',
          }),
        ]),
    })
    // The caller's id must not replace the generated description id.
    cy.get('[role="slider"]').then(($thumb) => {
      const describedBy = $thumb.attr('aria-describedby')!
      expect(describedBy).to.contain('ext-hint')
      const generated = describedBy.split(' ').filter((id) => id !== 'ext-hint')
      expect(generated).to.have.length(1)
      cy.get(`#${generated[0]}`).should('contain.text', 'Adjust volume.')
    })
  })

  // Reads the accessible name the way assistive technology does: follow
  // `aria-labelledby` if present, otherwise take `aria-label`.
  function accessibleName($el: JQuery<HTMLElement>): string {
    const ids = $el.attr('aria-labelledby')
    if (!ids) return $el.attr('aria-label') ?? ''
    return ids
      .split(' ')
      .map((id) => Cypress.$(`#${id}`).text().trim())
      .join(' ')
  }

  it('names each thumb of a range distinctly, from the label prop', () => {
    cy.mount(Slider, { props: { label: 'Price', modelValue: [20, 80] } })
    cy.get('[role="slider"]').should('have.length', 2)
    cy.get('[role="slider"]')
      .first()
      .then(($t) => expect(accessibleName($t)).to.equal('Price minimum'))
    cy.get('[role="slider"]')
      .last()
      .then(($t) => expect(accessibleName($t)).to.equal('Price maximum'))
  })

  it('keeps a referenced label on both thumbs of a range', () => {
    // The regression this guards: qualifying with `aria-label` silently drops
    // the caller's reference, because `aria-labelledby` wins.
    cy.mount({
      render: () =>
        h('div', [
          h('span', { id: 'ext-range-label' }, 'Budget'),
          h(Slider, {
            modelValue: [20, 80],
            'aria-labelledby': 'ext-range-label',
          }),
        ]),
    })
    cy.get('[role="slider"]')
      .first()
      .then(($t) => expect(accessibleName($t)).to.equal('Budget minimum'))
    cy.get('[role="slider"]')
      .last()
      .then(($t) => expect(accessibleName($t)).to.equal('Budget maximum'))
  })

  it('qualifies a caller aria-label on a range', () => {
    cy.mount(Slider, {
      props: { modelValue: [20, 80] },
      attrs: { 'aria-label': 'Budget' },
    })
    cy.get('[role="slider"]')
      .first()
      .should('have.attr', 'aria-label', 'Budget minimum')
    cy.get('[role="slider"]')
      .last()
      .should('have.attr', 'aria-label', 'Budget maximum')
  })

  it('leaves an unnamed range to reka own qualifiers', () => {
    cy.mount(Slider, { props: { modelValue: [20, 80] } })
    cy.get('[role="slider"]').should('have.length', 2)
    cy.get('[role="slider"]')
      .first()
      .should('have.attr', 'aria-label', 'Minimum')
      .and('not.have.attr', 'aria-labelledby')
    cy.get('[role="slider"]')
      .last()
      .should('have.attr', 'aria-label', 'Maximum')
  })

  it('names each thumb past two by position', () => {
    cy.mount(Slider, { props: { label: 'Stops', modelValue: [10, 50, 90] } })
    cy.get('[role="slider"]').should('have.length', 3)
    cy.get('[role="slider"]')
      .eq(2)
      .then(($t) => expect(accessibleName($t)).to.equal('Stops value 3 of 3'))
  })

  it('keeps the plain name on a single thumb', () => {
    cy.mount(Slider, { props: { label: 'Volume', modelValue: [25] } })
    // Two chains, not one: `not.have.attr` yields `undefined`, so anything
    // chained after it asserts on nothing.
    cy.get('[role="slider"]').should('not.have.attr', 'aria-label')
    cy.get('[role="slider"]').should('have.attr', 'aria-labelledby')
  })

  it('routes any other caller aria-* to the thumb', () => {
    cy.mount(Slider, {
      props: { id: 'sl-valuetext', modelValue: [25] },
      attrs: { 'aria-valuetext': '25 percent' },
    })
    cy.get('[role="slider"]').should(
      'have.attr',
      'aria-valuetext',
      '25 percent',
    )
    cy.get('#sl-valuetext').should('not.have.attr', 'aria-valuetext')
  })

  it('forwards class and style to the rendered root', () => {
    // With a label the wrapper is the root; without one the control is.
    cy.mount(Slider, {
      props: { label: 'Volume', modelValue: [25] },
      attrs: { class: 'my-slider' },
    })
    cy.get('.my-slider').should('exist')

    cy.mount(Slider, {
      props: { id: 'sl-bare', modelValue: [25] },
      attrs: { class: 'my-bare-slider' },
    })
    cy.get('#sl-bare').should('have.class', 'my-bare-slider')
  })

  it('drops its own w-full when the caller sets a width', () => {
    // Two width utilities in one list are decided by stylesheet order, so the
    // caller only wins if ours is not there at all. Both branches place the
    // caller's class on a different element, so both need the guard.
    cy.mount(Slider, {
      props: { label: 'Volume', modelValue: [25] },
      attrs: { class: 'w-64' },
    })
    cy.get('.w-64').should('not.have.class', 'w-full')

    cy.mount(Slider, {
      props: { id: 'sl-bare-w', modelValue: [25] },
      attrs: { class: 'w-64' },
    })
    cy.get('#sl-bare-w').should('not.have.class', 'w-full')

    cy.mount(Slider, {
      props: { id: 'sl-variant-w', modelValue: [25] },
      attrs: { class: 'sm:w-64' },
    })
    cy.get('#sl-variant-w').should('not.have.class', 'w-full')
  })

  it('keeps its own w-full when the caller class has no width', () => {
    cy.mount(Slider, {
      props: { label: 'Volume', modelValue: [25] },
      attrs: { class: 'mt-4' },
    })
    cy.get('.mt-4').should('have.class', 'w-full')

    cy.mount(Slider, {
      props: { id: 'sl-bare-mt', modelValue: [25] },
      attrs: { class: 'mt-4' },
    })
    cy.get('#sl-bare-mt').should('have.class', 'w-full')
  })

  it('keeps a caller aria-invalid and aria-errormessage when there is no error', () => {
    cy.mount({
      render: () =>
        h('div', [
          h('span', { id: 'ext-err' }, 'Out of range'),
          h(Slider, {
            modelValue: [25],
            'aria-invalid': 'true',
            'aria-errormessage': 'ext-err',
          }),
        ]),
    })
    cy.get('[role="slider"]').should('have.attr', 'aria-invalid', 'true')
    cy.get('[role="slider"]').should(
      'have.attr',
      'aria-errormessage',
      'ext-err',
    )
  })

  it('forwards disabled to aria-disabled and SliderRoot', () => {
    cy.mount(Slider, {
      props: { id: 'sl-disabled', modelValue: [25], disabled: true },
    })
    cy.get('#sl-disabled').should('have.attr', 'aria-disabled', 'true')
    cy.get('#sl-disabled').should('have.attr', 'data-disabled', '')
  })

  describe('shared labeling contract', () => {
    it('wires aria-labelledby and aria-describedby', () => {
      cy.mount(Slider, {
        props: { label: 'Volume', description: 'Adjust volume.' },
      })
      cy.get('[role="slider"]')
        .first()
        .then(($thumb) => {
          const labelledBy = $thumb.attr('aria-labelledby')!
          cy.get(`#${labelledBy}`).should('contain.text', 'Volume')
        })
      // Both halves of the contract sit on the thumb: it is the element that
      // carries role="slider", so the root is never reported as the control.
      cy.get('[role="slider"]')
        .first()
        .then(($thumb) => {
          const describedBy = $thumb.attr('aria-describedby')!
          cy.get(`#${describedBy}`).should('contain.text', 'Adjust volume.')
        })
      cy.get('[role="slider"]')
        .first()
        .parents('[aria-describedby]')
        .should('not.exist')
    })

    it('renders error state', () => {
      cy.mount(Slider, {
        props: { label: 'Volume', error: 'Required' },
      })
      cy.contains('Required').should('exist')
    })

    it('renders the canonical data-* hooks on the control', () => {
      cy.mount(Slider, {
        props: {
          id: 'sl-data',
          label: 'Volume',
          size: 'md',
          required: true,
          modelValue: [25],
        },
      })
      cy.get('#sl-data').should('have.attr', 'data-slot', 'control')
      cy.get('#sl-data').should('have.attr', 'data-size', 'md')
      cy.get('#sl-data').should('have.attr', 'data-state', 'valid')
      cy.get('#sl-data').should('have.attr', 'data-required', 'true')
    })

    it('flips data-state to invalid when error is set', () => {
      cy.mount(Slider, {
        props: { id: 'sl-err', label: 'Volume', error: 'Required' },
      })
      cy.get('#sl-err').should('have.attr', 'data-state', 'invalid')
    })
  })

  describe('bidirectional fill', () => {
    // Targets the range element: the only absolutely-positioned element inside the control.
    const range = () => cy.get('[data-slot="control"] .absolute')

    it('fills from zero-crossing to a positive value', () => {
      cy.mount(Slider, { props: { modelValue: [50], min: -100, max: 100 } })
      range()
        .should('have.attr', 'style')
        .and('include', 'left: 50%')
        .and('include', 'right: 25%')
    })

    it('fills from a negative value to the zero-crossing', () => {
      cy.mount(Slider, { props: { modelValue: [-50], min: -100, max: 100 } })
      range()
        .should('have.attr', 'style')
        .and('include', 'left: 25%')
        .and('include', 'right: 50%')
    })

    it('renders zero-width fill when value is at zero', () => {
      cy.mount(Slider, { props: { modelValue: [0], min: -100, max: 100 } })
      range()
        .should('have.attr', 'style')
        .and('include', 'left: 50%')
        .and('include', 'right: 50%')
    })
  })
})
