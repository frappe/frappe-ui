import { defineComponent, h, ref } from 'vue'
import Radio from './Radio.vue'
import RadioGroup from './RadioGroup.vue'

/** Mounts a RadioGroup with the given options, forwarding group props. */
function mountGroup(
  groupProps: Record<string, any> = {},
  options: Array<Record<string, any>> = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
  ],
) {
  return cy.mount(RadioGroup, {
    props: groupProps,
    slots: {
      default: () => options.map((o) => h(Radio, o)),
    },
  })
}

describe('Radio', () => {
  it('renders one radio per option', () => {
    mountGroup()

    cy.get('[role="radiogroup"]').should('exist')
    cy.get('[role="radio"]').should('have.length', 2)
    cy.get('[role="radio"]').first().should('contain.text', 'Option A')
  })

  it('throws when used outside a RadioGroup', () => {
    // The guard throws from setup(), so catch it in a parent's errorCaptured
    // rather than letting it escape and fail the test run. Asserting the throw
    // is the point: a group-less option would silently never select.
    const onError = cy.spy().as('onError')
    cy.mount({
      errorCaptured(error: Error) {
        onError(error.message)
        return false
      },
      render: () => h(Radio, { value: 'a', label: 'Option A' }),
    })
    cy.get('@onError').should(
      'have.been.calledWithMatch',
      /must be used inside a <RadioGroup>/,
    )
  })

  it('v-model — selecting fires update:modelValue with the option value', () => {
    mountGroup({
      modelValue: '',
      'onUpdate:modelValue': cy.spy().as('onUpdate'),
    })

    cy.get('@onUpdate').should('not.have.been.called')
    cy.get('[role="radio"]').first().click()
    cy.get('@onUpdate').should('have.been.calledWith', 'a')
  })

  it('reflects the checked state of the matching option', () => {
    mountGroup({ modelValue: 'b' })

    cy.get('[role="radio"]').eq(0).should('have.attr', 'aria-checked', 'false')
    cy.get('[role="radio"]').eq(1).should('have.attr', 'aria-checked', 'true')
  })

  it('draws the selected ring on the checked option only', () => {
    // `data-state` lives on the RadioGroupItem button, so the circle styles it
    // through `group-data-[state=checked]:`. Assert the painted result, not the
    // class, or a wrong selector would still read as passing.
    mountGroup({ modelValue: 'a' })

    cy.get('[role="radio"]')
      .eq(0)
      .find('span')
      .first()
      .should('have.css', 'border-top-width', '4px')
    cy.get('[role="radio"]')
      .eq(1)
      .find('span')
      .first()
      .should('have.css', 'border-top-width', '1px')
  })

  it('selects only one option at a time', () => {
    mountGroup({ modelValue: 'a' })

    cy.get('[role="radio"]').eq(1).click()
    cy.get('[role="radio"][aria-checked="true"]').should('have.length', 1)
    cy.get('[role="radio"]').eq(1).should('have.attr', 'aria-checked', 'true')
  })

  describe('disabled', () => {
    it('disables every option when the group is disabled', () => {
      mountGroup({
        modelValue: '',
        disabled: true,
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      })

      cy.get('[role="radio"]').first().click({ force: true })
      cy.get('@onUpdate').should('not.have.been.called')
    })

    it('looks disabled, not just behaves disabled, when the group is', () => {
      // reka-ui merges the group's `disabled` into the item's behaviour on its
      // own, so a styling-only regression here is invisible to click tests.
      mountGroup({ modelValue: 'a', disabled: true })

      cy.get('[role="radio"]')
        .first()
        .find('[data-slot="label"]')
        .should('have.css', 'color')
        .then((disabledColor) => {
          mountGroup({ modelValue: 'a' })
          cy.get('[role="radio"]')
            .first()
            .find('[data-slot="label"]')
            .should('not.have.css', 'color', disabledColor as unknown as string)
        })
    })

    it('disables a single option without disabling the group', () => {
      mountGroup({ modelValue: '' }, [
        { value: 'a', label: 'Option A', disabled: true },
        { value: 'b', label: 'Option B' },
      ])

      cy.get('[role="radio"]').eq(0).should('be.disabled')
      cy.get('[role="radio"]').eq(1).should('not.be.disabled')
    })
  })

  describe('keyboard', () => {
    it('moves selection with arrow keys', () => {
      mountGroup({ modelValue: 'a' })

      cy.get('[role="radio"]').first().focus()
      cy.focused().trigger('keydown', { key: 'ArrowDown' })
      cy.get('[role="radio"]').eq(1).should('have.attr', 'aria-checked', 'true')
    })

    it('loops from the last option back to the first', () => {
      mountGroup({ modelValue: 'b' })

      cy.get('[role="radio"]').eq(1).focus()
      cy.focused().trigger('keydown', { key: 'ArrowDown' })
      cy.get('[role="radio"]').eq(0).should('have.attr', 'aria-checked', 'true')
    })
  })

  describe('group labeling', () => {
    it('names the group from its label', () => {
      mountGroup({ label: 'Choose a plan' })

      cy.get('[role="radiogroup"]')
        .should('have.attr', 'aria-labelledby')
        .then((id) => {
          cy.get(`#${id}`).should('contain.text', 'Choose a plan')
        })
    })

    it('marks the group required, not each option', () => {
      mountGroup({ label: 'Choose a plan', required: true })

      cy.get('label').should('contain.text', '*')
      cy.get('[role="radio"]').should('not.contain.text', '*')
    })

    it('renders the group error and wires aria-errormessage', () => {
      mountGroup({ label: 'Choose a plan', error: 'Select one.' })

      cy.get('[role="radiogroup"]')
        .should('have.attr', 'aria-invalid', 'true')
        .and('have.attr', 'aria-errormessage')
      cy.contains('Select one.').should('be.visible')
    })

    it('wires aria-describedby from the group description', () => {
      mountGroup({ label: 'Choose a plan', description: 'Pick one option.' })

      cy.get('[role="radiogroup"]')
        .should('have.attr', 'aria-describedby')
        .then((id) => {
          cy.get(`#${id}`).should('contain.text', 'Pick one option.')
        })
    })

    it('describes an option from its own description', () => {
      mountGroup({}, [
        { value: 'a', label: 'Option A', description: 'The first one.' },
      ])

      cy.get('[role="radio"]')
        .should('have.attr', 'aria-describedby')
        .then((id) => {
          cy.get(`#${id}`).should('contain.text', 'The first one.')
        })
    })
  })

  describe('size and padding', () => {
    it('passes the group size down to every option', () => {
      mountGroup({ size: 'xs' })

      cy.get('[role="radio"]').each(($el) => {
        cy.wrap($el).should('have.attr', 'data-size', 'xs')
      })
    })

    it('renders the xs control at 13px', () => {
      mountGroup({ size: 'xs' })

      cy.get('[role="radio"]')
        .first()
        .find('span')
        .first()
        .invoke('outerWidth')
        .should('be.closeTo', 13, 1)
    })

    it('keeps a fixed compact height for padded label-only rows', () => {
      mountGroup({ padded: true })

      cy.get('[role="radio"]').first().invoke('outerHeight').should('eq', 28)
    })

    it('grows a padded row that carries a description', () => {
      mountGroup({ padded: true }, [
        { value: 'a', label: 'Option A', description: 'Some longer detail.' },
      ])

      cy.get('[role="radio"]')
        .first()
        .invoke('outerHeight')
        .should('be.greaterThan', 28)
    })
  })

  describe('alignment', () => {
    /** Asserts the circle's centre sits on the label's first-line centre. */
    function expectCentredOnFirstLine() {
      cy.get('[role="radio"]')
        .first()
        .then(($row) => {
          const circle = $row.find('span')[0].getBoundingClientRect()
          const label = $row.find('[data-slot="label"]')[0]
          const lineHeight = parseFloat(getComputedStyle(label).lineHeight)
          const labelRect = label.getBoundingClientRect()
          expect(circle.top + circle.height / 2).to.be.closeTo(
            labelRect.top + lineHeight / 2,
            0.5,
          )
        })
    }

    for (const size of ['xs', 'sm', 'md'] as const) {
      it(`centres the ${size} control on the label`, () => {
        mountGroup({ size })
        expectCentredOnFirstLine()
      })
    }

    it('keeps the control on the first line when a description follows', () => {
      mountGroup({}, [
        {
          value: 'a',
          label: 'Option A',
          description: 'A description long enough to matter.',
        },
      ])
      expectCentredOnFirstLine()
    })
  })

  describe('shared labeling contract', () => {
    it('tracks a #description slot that toggles', () => {
      // `useSlots()` returns an object Vue mutates in place and does not
      // track, so a `computed` reading it caches. Without an invalidation the
      // reference is wrong in both directions: added, the paragraph renders
      // and nothing points at it; removed, the reference outlives it.
      cy.mount(
        defineComponent({
          setup() {
            return { show: ref(false) }
          },
          render() {
            return [
              h(
                'button',
                {
                  'data-cy': 'toggle',
                  onClick: () => (this.show = !this.show),
                },
                'toggle',
              ),
              h(
                RadioGroup,
                { label: 'Plan', options: [{ value: 'a', label: 'A' }] },
                this.show
                  ? { description: () => h('span', 'Helper text.') }
                  : {},
              ),
            ]
          },
        }),
      )

      cy.get('[role="radiogroup"]').should('not.have.attr', 'aria-describedby')

      cy.get('[data-cy=toggle]').click()
      cy.get('[role="radiogroup"]')
        .invoke('attr', 'aria-describedby')
        .then((id) => {
          expect(id, 'slot added, reference set').to.be.a('string')
          cy.get(`#${id}`).should('contain.text', 'Helper text.')
        })

      cy.get('[data-cy=toggle]').click()
      // The dangling half: a reference kept past its element fails
      // `aria-valid-attr-value`.
      cy.get('[role="radiogroup"]').should('not.have.attr', 'aria-describedby')
    })
  })

  describe('orientation', () => {
    it('lays options out in a row when horizontal', () => {
      mountGroup({ orientation: 'horizontal' })

      cy.get('[role="radiogroup"]').should(
        'have.attr',
        'data-orientation',
        'horizontal',
      )
    })
  })
})
