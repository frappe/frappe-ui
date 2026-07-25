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
        footer: () => h('div', { 'data-cy': 'footer' }, ['footer']),
        'item-label': () => h('div', { 'data-cy': 'item-label' }, ['label']),
      },
    })

    cy.get('[data-slot="trigger"]').click()

    cy.get('[data-cy="footer"]').should('exist')
    cy.get('[data-cy="item-label"]').should('exist')
  })

  it('emits update:selectedOptions with the original option objects', () => {
    const richOptions = [
      { label: 'Apple', value: 'apple', kind: 'pome' },
      { label: 'Banana', value: 'banana', kind: 'berry' },
    ]

    cy.mount(MultiSelect, {
      props: {
        options: richOptions,
        'onUpdate:selectedOptions': cy.spy().as('onSelectedOptions'),
      },
    })

    cy.get('[data-slot="trigger"]').click()
    cy.get('[role=option]').eq(1).click()

    cy.get('@onSelectedOptions').should('have.been.calledWith', [
      richOptions[1],
    ])
  })

  it('supports numeric option values', () => {
    cy.mount(MultiSelect, {
      props: {
        options: [
          { label: 'One', value: 1 },
          { label: 'Two', value: 2 },
          { label: 'Twenty', value: 20 },
        ],
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })

    cy.get('[data-slot="trigger"]').click()
    // numeric values stay searchable — the filter coerces with String()
    cy.get('[data-slot="input"]').type('2')
    cy.get('[role=option]').should('have.length', 2)

    cy.get('[role=option]').eq(0).click()
    cy.get('@onUpdate').should('have.been.calledWith', [2])
  })

  it('filterable=false renders exactly the given options', () => {
    cy.mount(MultiSelect, {
      props: { options, filterable: false },
    })

    cy.get('[data-slot="trigger"]').click()
    cy.get('[data-slot="input"]').type('zzz')
    cy.get('[role=option]').should('have.length', 3)
  })

  it('emits update:query on search input', () => {
    cy.mount(MultiSelect, {
      props: { options, 'onUpdate:query': cy.spy().as('onQuery') },
    })

    cy.get('[data-slot="trigger"]').click()
    cy.get('[data-slot="input"]').type('app')

    cy.get('@onQuery').should('have.been.calledWith', 'app')
  })

  it('renders search slots with scoped query controls', () => {
    cy.mount(MultiSelect, {
      props: {
        options,
        'onUpdate:query': cy.spy().as('onQuery'),
      },
      slots: {
        'search-prefix': ({ query }) =>
          h('span', { 'data-cy': 'search-prefix' }, query || 'Search'),
        'search-suffix': ({ query, setQuery, focus, disabled }) =>
          h('div', { 'data-cy': 'search-suffix' }, [
            h('span', { 'data-cy': 'search-query' }, query),
            h('span', { 'data-cy': 'search-disabled' }, String(disabled)),
            h(
              'button',
              {
                type: 'button',
                'data-cy': 'set-query',
                onClick: () => setQuery('ba'),
              },
              'Set query',
            ),
            h(
              'button',
              {
                type: 'button',
                'data-cy': 'clear-query',
                onClick: () => {
                  setQuery('')
                  focus()
                },
              },
              'Clear query',
            ),
          ]),
      },
    })

    cy.get('[data-slot="trigger"]')
      .find('[data-cy="search-prefix"]')
      .should('not.exist')
    cy.get('[data-slot="trigger"] [data-slot="chevron"]').should('exist')

    cy.get('[data-slot="trigger"]').click()
    cy.get('[data-slot="search"] [data-cy="search-prefix"]').should(
      'contain.text',
      'Search',
    )
    cy.get('[data-slot="search"] [data-cy="search-suffix"]').should('exist')

    cy.get('[data-cy="set-query"]').click()
    cy.get('[data-slot="input"]').should('have.value', 'ba')
    cy.get('[data-cy="search-query"]').should('have.text', 'ba')
    cy.get('[role=option]').should('have.length', 1).and('contain', 'Banana')
    cy.get('@onQuery').should('have.been.calledWith', 'ba')

    cy.get('[data-cy="clear-query"]').click()
    cy.get('[data-slot="input"]').should('have.value', '')
    cy.get('[role=option]').should('have.length', 3)
    cy.get('@onQuery').should('have.been.calledWith', '')
    cy.get('[data-slot="input"]').should('be.focused')
  })

  it('hides the search slots when hide-search is set', () => {
    cy.mount(MultiSelect, {
      props: { options, hideSearch: true },
      slots: {
        'search-prefix': () => h('span', { 'data-cy': 'search-prefix' }, 'P'),
        'search-suffix': () => h('span', { 'data-cy': 'search-suffix' }, 'S'),
      },
    })

    cy.get('[data-slot="trigger"]').click()
    cy.get('[data-slot="search"]').should('not.exist')
    cy.get('[data-cy="search-prefix"]').should('not.exist')
    cy.get('[data-cy="search-suffix"]').should('not.exist')
  })

  it('accepts a query prop and filters with it', () => {
    cy.mount(MultiSelect, {
      props: { options, query: 'ba', open: true },
    })

    cy.get('[data-slot="input"]').should('have.value', 'ba')
    cy.get('[role=option]').should('have.length', 1).and('contain', 'Banana')
  })

  // A bound `v-model:query` belongs to the consumer — the component must never
  // reset it on its own. Unbound, the query still clears on every open.
  describe('query ownership', () => {
    const BoundQuery = defineComponent({
      setup() {
        const query = ref('ba')
        return { query }
      },
      render() {
        return h('div', [
          h(MultiSelect, {
            options,
            query: this.query,
            'onUpdate:query': (value: string) => {
              this.query = value
            },
          }),
          h('span', { 'data-cy': 'query' }, this.query),
        ])
      },
    })

    it('keeps a seeded v-model:query when the popover opens, and filters with it', () => {
      cy.mount(BoundQuery)

      cy.get('[data-slot="trigger"]').click()

      cy.get('[data-slot="input"]').should('have.value', 'ba')
      cy.get('[data-cy="query"]').should('have.text', 'ba')
      cy.get('[role=option]').should('have.length', 1).and('contain', 'Banana')
    })

    it('keeps a seeded v-model:query across close and reopen', () => {
      cy.mount(BoundQuery)

      cy.get('[data-slot="trigger"]').click()
      cy.get('[data-slot="input"]').type('{esc}')
      cy.get('[data-slot="content"]').should('not.exist')
      cy.get('[data-cy="query"]').should('have.text', 'ba')

      cy.get('[data-slot="trigger"]').click()
      cy.get('[data-slot="input"]').should('have.value', 'ba')
      cy.get('[role=option]').should('have.length', 1).and('contain', 'Banana')
    })

    it('never emits an empty update:query just from opening', () => {
      cy.mount(MultiSelect, {
        props: {
          options,
          query: 'ba',
          'onUpdate:query': cy.spy().as('onQuery'),
        },
      })

      cy.get('[data-slot="trigger"]').click()
      cy.get('[role=option]').should('have.length', 1)
      cy.get('@onQuery').should('not.have.been.called')
    })

    it('still resets the query on open when it is not bound', () => {
      cy.mount(MultiSelect, { props: { options } })

      cy.get('[data-slot="trigger"]').click()
      cy.get('[data-slot="input"]').type('ba')
      cy.get('[role=option]').should('have.length', 1)

      cy.get('[data-slot="input"]').type('{esc}')
      cy.get('[data-slot="content"]').should('not.exist')

      cy.get('[data-slot="trigger"]').click()
      cy.get('[data-slot="input"]').should('have.value', '')
      cy.get('[role=option]').should('have.length', 3)
    })
  })

  it('clear and selectAll via default footer', () => {
    cy.mount(MultiSelect, {
      props: {
        options,
        modelValue: ['apple'],
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

  // `clear()` clears the selection and nothing else — the search query belongs
  // to the user, whether they typed it or bound it.
  it('clear() leaves the search query alone', () => {
    cy.mount(MultiSelect, {
      props: {
        options,
        open: true,
        modelValue: ['apple'],
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })

    cy.get('[data-slot="input"]').type('ba')
    cy.get('[role=option]').should('have.length', 1)

    cy.get('[data-slot="footer"] button').contains('Clear All').click()

    cy.get('@onUpdate').should('have.been.calledWith', [])
    cy.get('[data-slot="input"]').should('have.value', 'ba')
    cy.get('[role=option]').should('have.length', 1).and('contain', 'Banana')
  })

  it('exposes clear and focus on a template ref', () => {
    const Wrapper = defineComponent({
      setup() {
        const picker = ref<{
          clear: () => void
          focus: () => void
        } | null>(null)
        const value = ref(['apple', 'banana'])
        return { picker, value }
      },
      render() {
        return h('div', [
          h(MultiSelect, {
            ref: 'picker',
            options,
            modelValue: this.value,
            'onUpdate:modelValue': (v: Array<string | number>) => {
              this.value = v as string[]
            },
          }),
          h(
            'button',
            {
              'data-cy': 'clear',
              onClick: () => {
                this.picker?.clear()
                this.picker?.focus()
              },
            },
            'clear',
          ),
        ])
      },
    })

    cy.mount(Wrapper)

    cy.get('[data-slot="trigger"]').should('contain.text', '2 selected')
    cy.get('[data-cy="clear"]').click()
    cy.get('[data-slot="trigger"]')
      .should('contain.text', 'Select option')
      .and('be.focused')
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
        options: [
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
