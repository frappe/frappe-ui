import MultiSelect from './MultiSelect.vue'
import { h } from 'vue'

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
})
