import MultiSelect from './MultiSelect.vue'
import Dialog from '../Dialog/Dialog.vue'
import { defineComponent, h, ref } from 'vue'

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Orange', value: 'orange' },
]

describe('MultiSelect', () => {
  it('renders', () => {
    cy.mount(MultiSelect, { props: { options } })

    cy.get('[data-slot="content"]').should('not.exist')
    cy.get('[data-slot="trigger"]').click()
    cy.get('[data-slot="content"]').should('exist')

    cy.get('[role=option]').should('have.length', 3)
  })

  it('option click', () => {
    cy.mount(MultiSelect, { props: { options } })

    cy.get('[data-slot="trigger"]').click()

    cy.get('[role=option]').eq(0).click()
    cy.get('[data-slot="trigger"]').should('contain.text', options[0].label)

    cy.get('[role=option]').eq(1).click()
    cy.get('[data-slot="trigger"]').should('contain.text', '2 selected')
  })

  it('filters on search input', () => {
    cy.mount(MultiSelect, { props: { options } })

    cy.get('[data-slot="trigger"]').click()
    cy.get('[data-slot="input"]').type(options[1].label.slice(0, 2))

    cy.get('[role=option]').should('have.text', options[1].label)
  })

  it('v-model updates selection', () => {
    cy.mount(MultiSelect, {
      props: { options, 'onUpdate:modelValue': cy.spy().as('onUpdate') },
    })

    cy.get('[data-slot="trigger"]').click()
    cy.get('[role=option]').click({ multiple: true })

    const expectedVal = options.map((option) => option.value)
    cy.get('@onUpdate').should('have.been.calledWith', expectedVal)
  })

  it('renders footer and item-label slot content', () => {
    cy.mount(MultiSelect, {
      props: { options },
      slots: {
        'footer': () => h('div', { 'data-cy': 'footer' }, ['footer']),
        'item-label': () => h('div', { 'data-cy': 'item-label' }, ['label']),
      },
    })

    cy.get('[data-slot="trigger"]').click()

    cy.get('[data-cy="footer"]').should('exist')
    cy.get('[data-cy="item-label"]').should('exist')
  })

  it('supports legacy #option slot', () => {
    cy.mount(MultiSelect, {
      props: { options },
      slots: {
        option: () => h('div', { 'data-cy': 'option' }, ['custom']),
      },
    })

    cy.get('[data-slot="trigger"]').click()
    cy.get('[data-cy="option"]').should('have.length', 3)
  })

  it('emits update:query on search input', () => {
    cy.mount(MultiSelect, {
      props: { options, 'onUpdate:query': cy.spy().as('onQuery') },
    })

    cy.get('[data-slot="trigger"]').click()
    cy.get('[data-slot="input"]').type('app')

    cy.get('@onQuery').should('have.been.calledWith', 'app')
  })

  it('clearAll and selectAll via default footer', () => {
    cy.mount(MultiSelect, {
      props: {
        options,
        'modelValue': ['apple'],
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })

    cy.get('[data-slot="trigger"]').click()
    cy.get('[data-slot="footer"] button').contains('Select All').click()
    cy.get('@onUpdate').should('have.been.calledWith', [
      'apple',
      'banana',
      'orange',
    ])

    cy.get('[data-slot="footer"] button').contains('Clear All').click()
    cy.get('@onUpdate').should('have.been.calledWith', [])
  })

  it('renders grouped options with labels', () => {
    cy.mount(MultiSelect, {
      props: {
        options: [
          {
            group: 'Fruits',
            options: [
              { label: 'Apple', value: 'apple' },
              { label: 'Banana', value: 'banana' },
            ],
          },
          {
            group: 'Citrus',
            options: [{ label: 'Orange', value: 'orange' }],
          },
        ],
      },
    })

    cy.get('[data-slot="trigger"]').click()
    cy.get('[data-slot="group-label"]').should('have.length', 2)
    cy.get('[data-slot="group-label"]').eq(0).should('have.text', 'Fruits')
  })

  it('disabled option cannot be selected', () => {
    cy.mount(MultiSelect, {
      props: {
        'options': [
          { label: 'Apple', value: 'apple', disabled: true },
          { label: 'Banana', value: 'banana' },
        ],
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })

    cy.get('[data-slot="trigger"]').click()
    cy.get('[role=option]').eq(0).click({ force: true })
    cy.get('@onUpdate').should('not.have.been.called')
  })

  // Regression: prevent a future change from re-introducing the
  // phantom prefix container described in Select's matching block.
  describe('item-prefix container', () => {
    // MultiSelect always renders a checkbox in the prefix area, so the
    // container is always present — even when there is no icon and no
    // consumer-provided #item-prefix slot.
    it('renders the prefix container with only the checkbox when no icon and no #item-prefix slot', () => {
      cy.mount(MultiSelect, { props: { options } })

      cy.get('[data-slot="trigger"]').click()
      cy.get('[role=option]')
        .first()
        .find('[data-slot="item-prefix"]')
        .should('exist')
      cy.get('[role=option]')
        .first()
        .find('[data-slot="item-prefix"] input[type="checkbox"]')
        .should('exist')
    })

    it('renders the prefix container when option has an icon', () => {
      cy.mount(MultiSelect, {
        props: {
          options: [{ label: 'Apple', value: 'apple', icon: 'lucide-apple' }],
        },
      })

      cy.get('[data-slot="trigger"]').click()
      cy.get('[role=option]')
        .first()
        .find('[data-slot="item-prefix"]')
        .should('exist')
      cy.get('[role=option]').first().find('.lucide-apple').should('exist')
    })

    it('renders the prefix container when consumer provides #item-prefix', () => {
      cy.mount(MultiSelect, {
        props: { options },
        slots: {
          'item-prefix': () => h('span', { 'data-cy': 'tpl-prefix' }, 'P'),
        },
      })

      cy.get('[data-slot="trigger"]').click()
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

  // Regression: a Dialog's trapped FocusScope used to steal focus from the
  // portaled popover, so the search input couldn't be focused or typed into.
  // The fix wraps the popover body in its own FocusScope so it pushes onto
  // reka's focus-scope stack and pauses the dialog's trap.
  describe('inside a Dialog', () => {
    it('focuses and accepts typing in the popover search input', () => {
      const Wrapper = defineComponent({
        setup() {
          return { open: ref(true) }
        },
        render() {
          return h(
            Dialog,
            { open: this.open, title: 'Pick fruits' },
            { default: () => h(MultiSelect, { options }) },
          )
        },
      })

      cy.mount(Wrapper)

      cy.get('[role=dialog]').should('exist')
      cy.get('[data-slot="trigger"]').click()
      cy.get('[data-slot="content"]').should('exist')

      cy.get('[data-slot="search"] [data-slot="input"]')
        .should('be.focused')
        .type(options[1].label.slice(0, 2))

      cy.get('[role=option]')
        .should('have.length', 1)
        .and('contain.text', options[1].label)
    })
  })

  describe('shared labeling contract', () => {
    it('renders label and links it to the trigger via for/id', () => {
      cy.mount(MultiSelect, {
        props: { options, label: 'Fruits' },
      })
      cy.get('[data-slot="trigger"]').then(($trigger) => {
        const id = $trigger.attr('id')!
        cy.get(`label[for="${id}"]`).should('contain.text', 'Fruits')
      })
    })

    it('renders description and wires aria-describedby on trigger', () => {
      cy.mount(MultiSelect, {
        props: {
          options,
          label: 'Fruits',
          description: 'Pick as many as you like.',
        },
      })
      cy.get('[data-slot="trigger"]').then(($trigger) => {
        const id = $trigger.attr('id')!
        const describedBy = $trigger.attr('aria-describedby')!
        expect(describedBy).to.equal(`${id}-description`)
        cy.get(`#${id}-description`).should(
          'contain.text',
          'Pick as many as you like.',
        )
      })
    })

    it('renders error with aria-invalid + aria-errormessage and suppresses description', () => {
      cy.mount(MultiSelect, {
        props: {
          options,
          label: 'Fruits',
          description: 'helper',
          error: 'Pick at least one.',
        },
      })
      cy.get('[data-slot="trigger"]')
        .should('have.attr', 'aria-invalid', 'true')
        .then(($trigger) => {
          const id = $trigger.attr('id')!
          expect($trigger.attr('aria-errormessage')).to.equal(`${id}-error`)
          cy.get(`#${id}-error`).should('contain.text', 'Pick at least one.')
          cy.get(`#${id}-description`).should('not.exist')
        })
    })

    it('renders required indicator and forwards aria-required', () => {
      cy.mount(MultiSelect, {
        props: { options, label: 'Fruits', required: true },
      })
      cy.get('[data-slot="trigger"]').should(
        'have.attr',
        'aria-required',
        'true',
      )
      cy.contains('label', 'Fruits').within(() => {
        cy.get('span[aria-hidden="true"]').should('contain.text', '*')
      })
    })

    it('flips data-invalid on the trigger when error is set', () => {
      cy.mount(MultiSelect, {
        props: { options, label: 'Fruits', error: 'Required' },
      })
      cy.get('[data-slot="trigger"]').should(
        'have.attr',
        'data-invalid',
        'true',
      )
    })
  })
})
