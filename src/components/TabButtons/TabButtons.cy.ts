import { h } from 'vue'
import TabButtons from './TabButtons.vue'

describe('<TabButtons />', () => {
  it('updates the selected value', () => {
    cy.mount(TabButtons, {
      props: {
        buttons: [
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
        buttons: [{ label: 'Month', value: 'month', onClick }],
        modelValue: 'month',
      },
    })

    cy.contains('button', 'Month').click()

    cy.get('@onClick').should('have.been.calledOnce')
  })

  it('syncs the model with the active fallback', () => {
    cy.mount(TabButtons, {
      props: {
        buttons: [
          { label: 'Day', value: 'day' },
          { label: 'Week', value: 'week', active: true },
        ],
        modelValue: 'month',
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })

    cy.get('@onUpdate').should('have.been.calledWith', 'week')
    cy.contains('button', 'Week').should('have.attr', 'data-state', 'checked')
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
        buttons: [
          {
            label: 'Calendar',
            value: 'calendar',
            icon: CalendarIcon,
            hideLabel: true,
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
})
