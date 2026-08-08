import { h } from 'vue'
import Switch from './Switch.vue'

describe('Switch', () => {
  it('renders the component', () => {
    cy.mount(Switch)

    cy.get('[role="switch"]').should('exist')
  })

  it('renders the label & description', () => {
    cy.mount(Switch, {
      props: { label: 'abc', description: 'some long sentence' },
    })

    cy.get('label').should('contain.text', 'abc')
    cy.contains('some long sentence').should('exist')
  })

  it('disabled', () => {
    cy.mount(Switch, {
      props: { disabled: true },
    })

    cy.get('[role="switch"]').should('have.attr', 'disabled')
  })

  it('dims the label and description when disabled', () => {
    cy.mount(Switch, {
      props: { label: 'abc', description: 'Helper text.', disabled: true },
    })

    cy.get('label')
      .should('have.class', 'text-ink-gray-4')
      .and('not.have.class', 'text-ink-gray-7')
    cy.get('[data-slot="description"]')
      .should('have.class', 'text-ink-gray-3')
      .and('not.have.class', 'text-ink-gray-5')
  })

  it('v-model', () => {
    cy.mount(Switch, {
      props: {
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })

    cy.get('@onUpdate').should('not.be.called')

    cy.get('[role="switch"]').click()
    cy.get('@onUpdate').should('be.calledWith', true)
    cy.get('[role="switch"]').click()

    cy.get('@onUpdate').should('be.calledWith', false)
  })

  it('toggles with the keyboard', () => {
    cy.mount(Switch, {
      props: {
        label: 'Notifications',
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })

    // Enter is handled by reka's own keydown listener.
    cy.get('[role="switch"]').focus().trigger('keydown', { key: 'Enter' })
    cy.get('@onUpdate').should('have.been.calledWith', true)

    // Space activation is native button behavior, which synthetic events
    // can't drive — assert the control is a real <button> so the browser
    // guarantees it.
    cy.get('[role="switch"]').should('match', 'button')
  })

  it('renders the label and description slots', () => {
    cy.mount(Switch, {
      props: { label: 'prop label', description: 'prop description' },
      slots: {
        label: () => h('span', 'slot label'),
        description: () => h('span', 'slot description'),
      },
    })

    cy.contains('slot label').should('exist')
    cy.contains('slot description').should('exist')
  })

  describe('shared labeling contract', () => {
    it('wires aria-describedby and aria-errormessage', () => {
      cy.mount(Switch, {
        props: { label: 'Notifications', description: 'Receive emails.' },
      })
      cy.get('[role="switch"]').then(($el) => {
        const id = $el.attr('id')!
        expect($el.attr('aria-describedby')).to.equal(`${id}-description`)
      })
    })

    it('renders error state', () => {
      cy.mount(Switch, {
        props: { label: 'Notifications', error: 'Please select one.' },
      })
      cy.get('[role="switch"]').should('have.attr', 'aria-invalid', 'true')
      cy.contains('Please select one.').should('exist')
    })

    it('renders the canonical data-* hooks on the control', () => {
      cy.mount(Switch, {
        props: { label: 'abc', size: 'md', required: true, modelValue: true },
      })
      cy.get('[role="switch"]').should('have.attr', 'data-slot', 'control')
      cy.get('[role="switch"]').should('have.attr', 'data-size', 'md')
      cy.get('[role="switch"]').should('have.attr', 'data-state', 'checked')
      cy.get('[role="switch"]').should('have.attr', 'data-required', 'true')
    })

    it('exposes data-disabled when disabled', () => {
      cy.mount(Switch, { props: { disabled: true } })
      cy.get('[role="switch"]').should('have.attr', 'data-disabled', 'true')
    })
  })

  describe('padded', () => {
    it('clicking the padding area toggles the switch', () => {
      cy.mount(Switch, {
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
      cy.mount(Switch, {
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
      cy.mount(Switch, {
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

    it('pushes the switch to the trailing edge of a label-only row', () => {
      // The row must span its container for `justify-between` to have any
      // width to work with — `w-fit` would silently collapse it to the label.
      cy.mount(Switch, { props: { label: 'abc', padded: true } })
      cy.get('[data-slot="control"]').then(($switch) => {
        cy.get('[data-slot="control"]')
          .parent()
          .parent()
          .then(($row) => {
            const row = $row[0].getBoundingClientRect()
            const control = $switch[0].getBoundingClientRect()
            // Only the row's own inline padding separates them.
            expect(row.right - control.right).to.be.lessThan(16)
            // And the row is genuinely wider than label + switch alone.
            expect(row.width - control.width).to.be.greaterThan(100)
          })
      })
    })

    it('keeps a fixed compact height for a label-only row', () => {
      cy.mount(Switch, { props: { label: 'abc', padded: true } })
      cy.get('[data-slot="control"]')
        .parent()
        .parent()
        .should('have.class', 'h-7')
    })

    it('grows the surface when a description is present', () => {
      cy.mount(Switch, {
        props: { label: 'abc', description: 'helper', padded: true },
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
      cy.mount(Switch, { props: { label: 'abc', size: 'xs' } })
      cy.get('[role="switch"]').should('have.attr', 'data-size', 'xs')
    })
  })

  describe('controlPosition', () => {
    /** Asserts the control sits after (or before) the label on the inline axis. */
    function expectSwitchAfterLabel(after: boolean) {
      cy.get('[data-slot="control"]').then(($switch) => {
        cy.get('[data-slot="label"]').then(($label) => {
          const switchLeft = $switch[0].getBoundingClientRect().left
          const labelLeft = $label[0].getBoundingClientRect().left
          if (after) expect(switchLeft).to.be.greaterThan(labelLeft)
          else expect(switchLeft).to.be.lessThan(labelLeft)
        })
      })
    }

    // The default must not move: existing callers render label-first, and a
    // silent flip would restyle every `<Switch label="…" />` in the wild.
    it('trails the label by default on a label-only row', () => {
      cy.mount(Switch, { props: { label: 'abc' } })
      expectSwitchAfterLabel(true)
    })

    it('trails the label by default when a description is present', () => {
      cy.mount(Switch, { props: { label: 'abc', description: 'helper' } })
      expectSwitchAfterLabel(true)
    })

    it('leads the label when control-position is start', () => {
      cy.mount(Switch, { props: { label: 'abc', controlPosition: 'start' } })
      expectSwitchAfterLabel(false)
    })
  })
})
