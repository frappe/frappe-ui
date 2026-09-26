import DateCalendar from './DateCalendar.vue'

const pad = (n: number) => String(n).padStart(2, '0')
const getTodaysDate = () => {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

describe('DateCalendar', () => {
  it('renders the grid inline, with no popover', () => {
    cy.mount(DateCalendar)

    cy.get('[role=dialog]').should('not.exist')
    cy.get('[role=grid]').should('exist')
    cy.get(`[aria-label^="${getTodaysDate()}"]`).should('exist')
  })

  it('opens on the month of its value', () => {
    cy.mount(DateCalendar, { props: { modelValue: '2025-06-15' } })
    cy.get('[aria-label=cycle-calendar-view]').should('have.text', 'Jun 2025')
  })

  it('selecting a date emits update:modelValue and select', () => {
    cy.mount(DateCalendar, {
      props: {
        modelValue: '2025-06-15',
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
        onSelect: cy.spy().as('onSelect'),
      },
    })
    cy.get('[aria-label="2025-06-16"]').click()
    cy.get('@onUpdate').should('have.been.calledWith', '2025-06-16')
    cy.get('@onSelect').should('have.been.calledWith', '2025-06-16')
  })

  it('re-selecting the current value still emits select', () => {
    cy.mount(DateCalendar, {
      props: {
        modelValue: '2025-06-15',
        onSelect: cy.spy().as('onSelect'),
      },
    })
    cy.get('[aria-label="2025-06-15"]').click()
    cy.get('@onSelect').should('have.been.calledOnceWith', '2025-06-15')
  })

  it('clicking an out-of-month cell keeps the view put', () => {
    cy.mount(DateCalendar, {
      props: {
        modelValue: '2025-06-15',
        onSelect: cy.spy().as('onSelect'),
      },
    })
    cy.get('[aria-label="2025-07-01"]').click()
    cy.get('@onSelect').should('have.been.calledWith', '2025-07-01')
    cy.get('[aria-label=cycle-calendar-view]').should('have.text', 'Jun 2025')
  })

  it('a value set from outside pulls the view to its month', () => {
    cy.mount(DateCalendar, { props: { modelValue: '2025-06-15' } }).then(
      ({ wrapper }) => wrapper.setProps({ modelValue: '2025-09-03' }),
    )
    cy.get('[aria-label=cycle-calendar-view]').should('have.text', 'Sep 2025')
  })

  it('today button selects today and emits today', () => {
    cy.mount(DateCalendar, {
      props: {
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
        onToday: cy.spy().as('onToday'),
      },
    })
    cy.get('[aria-label="Today"]').click()
    cy.get('@onUpdate').should('have.been.calledWith', getTodaysDate())
    cy.get('@onToday').should('have.been.calledOnceWith', getTodaysDate())
  })

  it('today button emits today even when today is already selected', () => {
    cy.mount(DateCalendar, {
      props: {
        modelValue: getTodaysDate(),
        onToday: cy.spy().as('onToday'),
      },
    })
    cy.get('[aria-label="Today"]').click()
    cy.get('@onToday').should('have.been.calledOnceWith', getTodaysDate())
  })

  it('empty todayLabel hides the button', () => {
    cy.mount(DateCalendar, { props: { todayLabel: '' } })
    cy.get('[aria-label="Today"]').should('not.exist')
  })

  it('min disables earlier cells and blocks selecting them', () => {
    cy.mount(DateCalendar, {
      props: {
        modelValue: '2025-06-15',
        min: '2025-06-10',
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })
    cy.get('[aria-label="2025-06-09"]').should(
      'have.attr',
      'aria-disabled',
      'true',
    )
    cy.get('[aria-label="2025-06-10"]').should('not.have.attr', 'aria-disabled')
    cy.get('[aria-label="2025-06-09"]').click({ force: true })
    cy.get('@onUpdate').should('not.have.been.called')
  })

  describe('keyboard navigation', () => {
    it('arrow-right moves focus one day', () => {
      cy.mount(DateCalendar, { props: { modelValue: '2025-06-15' } })
      cy.get('[aria-label="2025-06-15"]').focus()
      cy.focused().trigger('keydown', { key: 'ArrowRight' })
      cy.focused().should('have.attr', 'data-value', '2025-06-16')
    })

    it('arrowing past the end of the month steps the view', () => {
      cy.mount(DateCalendar, { props: { modelValue: '2025-06-30' } })
      cy.get('[aria-label="2025-06-30"]').focus()
      cy.focused().trigger('keydown', { key: 'ArrowRight' })
      cy.focused().should('have.attr', 'data-value', '2025-07-01')
      cy.get('[aria-label=cycle-calendar-view]').should('have.text', 'Jul 2025')
    })

    it('Enter selects the focused cell', () => {
      cy.mount(DateCalendar, {
        props: {
          modelValue: '2025-06-15',
          'onUpdate:modelValue': cy.spy().as('onUpdate'),
        },
      })
      cy.get('[aria-label="2025-06-15"]').focus()
      cy.focused().trigger('keydown', { key: 'ArrowRight' })
      cy.focused().trigger('keydown', { key: 'Enter' })
      cy.get('@onUpdate').should('have.been.calledWith', '2025-06-16')
    })

    it('a value set from outside takes the tabindex in its own month', () => {
      cy.mount(DateCalendar, { props: { modelValue: '2025-06-15' } }).then(
        ({ wrapper }) => wrapper.setProps({ modelValue: '2025-09-03' }),
      )
      cy.get('[aria-label=cycle-calendar-view]').should('have.text', 'Sep 2025')
      cy.get('[aria-label="2025-09-03"]').should('have.attr', 'tabindex', '0')
    })
  })
})
