import { defineComponent, h } from 'vue'
import TabButtons from './TabButtons.vue'

describe('<TabButtons />', () => {
  it('updates the selected value', () => {
    cy.mount(TabButtons, {
      props: {
        options: [
          { label: 'Day', value: 'day' },
          { label: 'Week', value: 'week' },
        ],
        modelValue: 'day',
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })

    cy.contains('button', 'Week').click()

    cy.get('@onUpdate').should('have.been.calledWith', 'week')
  })

  it('does not double-call button click handlers', () => {
    const onClick = cy.spy().as('onClick')

    cy.mount(TabButtons, {
      props: {
        options: [{ label: 'Month', value: 'month', onClick }],
        modelValue: 'month',
      },
    })

    cy.contains('button', 'Month').click()

    cy.get('@onClick').should('have.been.calledOnce')
  })

  it('leaves selection empty for a stale model', () => {
    cy.mount(TabButtons, {
      props: {
        options: [
          { label: 'Day', value: 'day' },
          { label: 'Week', value: 'week' },
        ],
        modelValue: 'month',
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })

    cy.get('@onUpdate').should('not.have.been.called')
    cy.get('button[data-state=checked]').should('not.exist')
  })

  it('keeps hidden labels accessible for icon-only buttons', () => {
    const CalendarIcon = {
      name: 'calendar-icon',
      render() {
        return h('svg', { 'data-cy': 'calendar-icon' })
      },
    }

    cy.mount(TabButtons, {
      props: {
        options: [
          {
            label: 'Calendar',
            value: 'calendar',
            icon: CalendarIcon,
          },
        ],
        modelValue: 'calendar',
      },
    })

    cy.get('button')
      .should('have.attr', 'aria-label', 'Calendar')
      .and('have.attr', 'title', 'Calendar')
    cy.get('[data-cy="calendar-icon"]').should('exist')
  })

  it('rounds the focusable tab element to match the pill', () => {
    cy.mount(TabButtons, {
      props: {
        options: [
          { label: 'Day', value: 'day' },
          { label: 'Week', value: 'week' },
        ],
        modelValue: 'day',
      },
    })

    cy.contains('button', 'Day').should('have.class', 'rounded-[7px]')
  })

  it('stretches buttons to equal widths across the container when fluid', () => {
    const Harness = defineComponent({
      render: () =>
        h('div', { style: 'width: 300px' }, [
          h(TabButtons, {
            fluid: true,
            modelValue: 'day',
            options: [
              { label: 'Day', value: 'day' },
              { label: 'Week', value: 'week' },
              { label: 'Month', value: 'month' },
            ],
          }),
        ]),
    })

    cy.mount(Harness)

    cy.get('button').should('have.length', 3)
    cy.get('button').then(($buttons) => {
      const widths = [...$buttons].map((el) => el.getBoundingClientRect().width)
      const [first, ...rest] = widths
      for (const width of rest) {
        expect(width).to.be.closeTo(first, 1)
      }
      // Three equal buttons fill the 300px container (minus track padding
      // and the gaps between them).
      expect(first).to.be.greaterThan(90)
    })
  })

  it('drives the track visuals through the variant prop', () => {
    const options = [
      { label: 'Day', value: 'day' },
      { label: 'Week', value: 'week' },
    ]

    cy.mount(TabButtons, {
      props: { options, modelValue: 'day' },
    })

    // Default variant is `subtle`: a gray pill track.
    cy.get('.bg-surface-gray-2').should('exist')

    cy.mount(TabButtons, {
      props: { options, modelValue: 'day', variant: 'underline' },
    })

    // `underline` draws a bottom rail instead of the pill track.
    cy.get('.bg-surface-gray-2').should('not.exist')
    cy.get('.border-b').should('exist')
  })
})
