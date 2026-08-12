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
