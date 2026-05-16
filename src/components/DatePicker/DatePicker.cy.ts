import DatePicker from './DatePicker.vue'

const monthsLabels = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const currentYear = new Date().getFullYear()
const currentMonth = monthsLabels[new Date().getMonth()]

const pad = (n: number) => String(n).padStart(2, '0')
const getTodaysDate = () => {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

describe('DatePicker', () => {
  it('renders', () => {
    cy.mount(DatePicker)

    cy.get('[role=dialog]').should('not.exist')
    cy.get('input').dblclick()
    cy.get('[role=dialog]').should('exist')
  })

  it('action btns', () => {
    cy.mount(DatePicker)
    cy.get('input').dblclick()

    const currMonthIndex = monthsLabels.indexOf(currentMonth)
    const prevMonthIndex = currentMonth == 'Jan' ? 11 : currMonthIndex - 1
    const nextMonthIndex = currentMonth == 'Dec' ? 0 : currMonthIndex + 1
    const prevYear = currentMonth == 'Jan' ? currentYear - 1 : currentYear
    const nextYear = currentMonth == 'Dec' ? currentYear + 1 : currentYear

    cy.get('[aria-label=previous]').click()
    cy.get('[aria-label=cycle-calendar-view]').should(
      'have.text',
      monthsLabels[prevMonthIndex] + ' ' + prevYear,
    )

    cy.get('[aria-label=next]').dblclick()

    cy.get('[aria-label=cycle-calendar-view]').should(
      'have.text',
      monthsLabels[nextMonthIndex] + ' ' + nextYear,
    )
  })

  it('today button selects today and closes popover', () => {
    cy.mount(DatePicker)
    cy.get('input').dblclick()
    cy.get('[role=dialog]').should('exist')
    cy.get('[aria-label="Today"]').click()
    cy.get('[role=dialog]').should('not.exist')
    cy.get('input').should('have.value', getTodaysDate())
  })

  it('clear button removes the value', () => {
    // Pre-seed via modelValue so the Clear footer button is rendered on first open.
    cy.mount(DatePicker, { props: { modelValue: '2025-06-15' } })
    cy.get('input').should('have.value', '2025-06-15')
    cy.get('input').dblclick()
    cy.get('[aria-label="Clear"]').click()
    cy.get('[role=dialog]').should('not.exist')
    cy.get('input').should('have.value', '')
  })

  it('autoclose', () => {
    cy.mount(DatePicker, {
      props: { autoClose: true },
    })

    cy.get('input').dblclick()
    cy.get('[role=dialog]').should('exist')
    cy.get('[aria-label="Today"]').click()
    cy.get('[role=dialog]').should('not.exist')

    cy.mount(DatePicker, {
      props: { autoClose: false },
    })

    cy.get('input').dblclick()
    cy.get('[role=dialog]').should('exist')
    cy.get('[aria-label="Today"]').click()
    cy.get('[role=dialog]').should('exist')
  })

  it('v-model', () => {
    cy.mount(DatePicker, {
      props: {
        onChange: cy.spy().as('onChange'),
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })

    cy.get('input').dblclick()

    cy.get('[aria-label="Today"]').click()
    cy.get('@onUpdate').should('have.been.calledWith', getTodaysDate())
    cy.get('@onChange').should('have.been.calledWith', getTodaysDate())
  })

  it('keepOpen prop', () => {
    cy.mount(DatePicker, { props: { keepOpen: true } })
    cy.get('input').dblclick()
    cy.get('[role=dialog]').should('exist')
    cy.get('[aria-label="Today"]').click()
    cy.get('[role=dialog]').should('exist')
  })

  it('readonly prop', () => {
    cy.mount(DatePicker, { props: { readonly: true } })
    cy.get('input').should('have.attr', 'readonly')
    cy.get('input').click()
    cy.get('[role=dialog]').should('exist')
  })

  it('minDate and maxDate disable out-of-range cells', () => {
    cy.mount(DatePicker, {
      props: {
        modelValue: '2025-06-15',
        minDate: '2025-06-10',
        maxDate: '2025-06-20',
      },
    })
    cy.get('input').dblclick()
    cy.get('[role=dialog]').should('exist')
    cy.get('[aria-label="2025-06-09"]').should('have.attr', 'aria-disabled', 'true')
    cy.get('[aria-label="2025-06-21"]').should('have.attr', 'aria-disabled', 'true')
    cy.get('[aria-label="2025-06-15"]').should('not.have.attr', 'aria-disabled')
  })

  it('isDateUnavailable callback disables matching cells', () => {
    cy.mount(DatePicker, {
      props: {
        modelValue: '2025-06-15',
        // disable weekends in the rendered month
        isDateUnavailable: (d: any) => d.day() === 0 || d.day() === 6,
      },
    })
    cy.get('input').dblclick()
    // 2025-06-14 is a Saturday, 2025-06-15 is a Sunday, 2025-06-16 is a Monday
    cy.get('[aria-label="2025-06-14"]').should('have.attr', 'aria-disabled', 'true')
    cy.get('[aria-label="2025-06-15"]').should('have.attr', 'aria-disabled', 'true')
    cy.get('[aria-label="2025-06-16"]').should('not.have.attr', 'aria-disabled')
  })

  it('exposes open() method', () => {
    cy.mount(DatePicker).then(({ component }) => {
      cy.get('[role=dialog]').should('not.exist')
      cy.then(() => (component as any).open())
      cy.get('[role=dialog]').should('exist')
    })
  })

  it('disabled prop disables the trigger', () => {
    cy.mount(DatePicker, { props: { disabled: true } })
    cy.get('input').should('have.attr', 'disabled')
  })

  it('re-clicking the input keeps the popover open', () => {
    // Regression guard for commit 89668bb8 — clicking the same input that
    // already has the popover open used to toggle it closed.
    cy.mount(DatePicker)
    cy.get('input').click()
    cy.get('[role=dialog]').should('exist')
    cy.get('input').click()
    cy.get('[role=dialog]').should('exist')
  })

  it('typed input commits on Enter', () => {
    cy.mount(DatePicker, {
      props: {
        'onUpdate:modelValue': cy.spy().as('onUpdate'),
      },
    })
    cy.get('input').click()
    cy.get('input').type('2025-06-15{enter}')
    cy.get('input').should('have.value', '2025-06-15')
    cy.get('@onUpdate').should('have.been.calledWith', '2025-06-15')
  })

  it('typed unavailable date is rejected and reverts', () => {
    cy.mount(DatePicker, {
      props: {
        modelValue: '2025-06-15',
        minDate: '2025-06-10',
        maxDate: '2025-06-20',
      },
    })
    cy.get('input').should('have.value', '2025-06-15')
    cy.get('input').click()
    cy.get('input').clear().type('2025-06-25{enter}')
    cy.get('input').should('have.value', '2025-06-15')
  })

  describe('keyboard navigation', () => {
    it('arrow-down on the input opens popover and moves focus into the grid', () => {
      cy.mount(DatePicker, { props: { modelValue: '2025-06-15' } })
      cy.get('input').focus().type('{downArrow}')
      cy.get('[role=dialog]').should('exist')
      cy.focused().should('have.attr', 'data-value', '2025-06-15')
    })

    it('arrow keys move focus by ±1 day and ±1 week', () => {
      cy.mount(DatePicker, { props: { modelValue: '2025-06-15' } })
      cy.get('input').focus().type('{downArrow}')
      cy.focused().trigger('keydown', { key: 'ArrowRight' })
      cy.focused().should('have.attr', 'data-value', '2025-06-16')
      cy.focused().trigger('keydown', { key: 'ArrowDown' })
      cy.focused().should('have.attr', 'data-value', '2025-06-23')
      cy.focused().trigger('keydown', { key: 'ArrowLeft' })
      cy.focused().should('have.attr', 'data-value', '2025-06-22')
      cy.focused().trigger('keydown', { key: 'ArrowUp' })
      cy.focused().should('have.attr', 'data-value', '2025-06-15')
    })

    it('Home/End jump to week edges', () => {
      // 2025-06-15 is a Sunday → Home stays on 06-15, End jumps to 06-21 (Saturday)
      cy.mount(DatePicker, { props: { modelValue: '2025-06-18' } })
      cy.get('input').focus().type('{downArrow}')
      cy.focused().trigger('keydown', { key: 'End' })
      cy.focused().should('have.attr', 'data-value', '2025-06-21')
      cy.focused().trigger('keydown', { key: 'Home' })
      cy.focused().should('have.attr', 'data-value', '2025-06-15')
    })

    it('PageUp/PageDown shift by one month, Shift+PageDown shifts by one year', () => {
      cy.mount(DatePicker, { props: { modelValue: '2025-06-15' } })
      cy.get('input').focus().type('{downArrow}')
      cy.focused().trigger('keydown', { key: 'PageDown' })
      cy.focused().should('have.attr', 'data-value', '2025-07-15')
      cy.focused().trigger('keydown', { key: 'PageUp' })
      cy.focused().should('have.attr', 'data-value', '2025-06-15')
      cy.focused().trigger('keydown', { key: 'PageDown', shiftKey: true })
      cy.focused().should('have.attr', 'data-value', '2026-06-15')
    })

    it('Enter and Space select the focused cell', () => {
      cy.mount(DatePicker, {
        props: {
          modelValue: '2025-06-15',
          'onUpdate:modelValue': cy.spy().as('onUpdate'),
        },
      })
      cy.get('input').focus().type('{downArrow}')
      cy.focused().trigger('keydown', { key: 'ArrowRight' })
      cy.focused().trigger('keydown', { key: 'Enter' })
      cy.get('@onUpdate').should('have.been.calledWith', '2025-06-16')
    })

    it('arrow navigation skips disabled dates', () => {
      cy.mount(DatePicker, {
        props: {
          modelValue: '2025-06-15',
          // Disable 2025-06-16 only — pressing → from 15 should skip to 17.
          isDateUnavailable: (d: any) => d.format('YYYY-MM-DD') === '2025-06-16',
        },
      })
      cy.get('input').focus().type('{downArrow}')
      cy.focused().trigger('keydown', { key: 'ArrowRight' })
      cy.focused().should('have.attr', 'data-value', '2025-06-17')
    })

    it('crossing month boundary advances the view', () => {
      // 2025-06-30 is the last day of June; → should land on 2025-07-01 in July's grid.
      cy.mount(DatePicker, { props: { modelValue: '2025-06-30' } })
      cy.get('input').focus().type('{downArrow}')
      cy.focused().trigger('keydown', { key: 'ArrowRight' })
      cy.focused().should('have.attr', 'data-value', '2025-07-01')
      cy.get('[aria-label=cycle-calendar-view]').should('contain.text', 'Jul 2025')
    })
  })
})
